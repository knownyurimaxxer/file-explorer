import { describe, expect, it } from "vitest";
import { walkTree, WalkItem } from "../src/utils/walk";

/** A fake disk: folder address -> its entries. */
const TREE: Record<string, WalkItem[]> = {
	"/": [
		{ name: "a", uri: "/a", isDirectory: true },
		{ name: "b", uri: "/b", isDirectory: true },
		{ name: "root.txt", uri: "/root.txt", isDirectory: false },
	],
	"/a": [
		{ name: "deep", uri: "/a/deep", isDirectory: true },
		{ name: "a1.txt", uri: "/a/a1.txt", isDirectory: false },
	],
	"/b": [{ name: "b1.txt", uri: "/b/b1.txt", isDirectory: false }],
	"/a/deep": [{ name: "d.txt", uri: "/a/deep/d.txt", isDirectory: false }],
};
const list = (uri: string) => {
	if (!(uri in TREE)) throw new Error("unreadable");
	return TREE[uri];
};
const noYield = async () => {};

describe("walkTree", () => {
	it("visits everything, shallow entries first, with their depth", async () => {
		const seen: string[] = [];
		const done = await walkTree("/", {
			list,
			isCancelled: () => false,
			onItem: (item, parent, depth) => seen.push(`${depth}:${parent}:${item.name}`),
			yieldNow: noYield,
		});
		expect(done).toBe(true);
		expect(seen).toEqual([
			"0:/:a",
			"0:/:b",
			"0:/:root.txt",
			"1:/a:deep",
			"1:/a:a1.txt",
			"1:/b:b1.txt",
			"2:/a/deep:d.txt",
		]);
	});

	it("reports folders it can't list and carries on", async () => {
		const bad: string[] = [];
		let files = 0;
		await walkTree("/", {
			list: (uri) => (uri === "/a" ? list("/nope") : list(uri)),
			isCancelled: () => false,
			onItem: (item) => {
				if (!item.isDirectory) files++;
			},
			onUnreadable: (uri) => bad.push(uri),
			yieldNow: noYield,
		});
		expect(bad).toEqual(["/a"]);
		expect(files).toBe(2); // root.txt and b1.txt; everything under /a is skipped
	});

	it("stops when cancelled and says so", async () => {
		let n = 0;
		const done = await walkTree("/", {
			list,
			isCancelled: () => n >= 3,
			onItem: () => n++,
			yieldNow: noYield,
		});
		expect(done).toBe(false);
		expect(n).toBe(3);
	});

	it("does not go deeper than maxDepth", async () => {
		const names: string[] = [];
		await walkTree("/", {
			list,
			isCancelled: () => false,
			onItem: (item) => names.push(item.name),
			maxDepth: 2,
			yieldNow: noYield,
		});
		expect(names).toContain("deep");
		expect(names).not.toContain("d.txt");
	});

	it("hands the thread back when its slice of time is used up", async () => {
		let clock = 0;
		let yields = 0;
		await walkTree("/", {
			list,
			isCancelled: () => false,
			onItem: () => {},
			sliceMs: 10,
			now: () => (clock += 6), // every look at the clock costs 6 ms
			yieldNow: async () => {
				yields++;
			},
		});
		expect(yields).toBeGreaterThan(0);
	});
});
