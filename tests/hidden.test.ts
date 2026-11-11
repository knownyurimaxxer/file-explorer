import { describe, expect, it } from "vitest";
import { isHiddenName, visibleOnly } from "../src/utils/hidden";

describe("isHiddenName", () => {
	it("is true for names that start with a dot", () => {
		expect(isHiddenName(".thumbnails")).toBe(true);
		expect(isHiddenName(".nomedia")).toBe(true);
		expect(isHiddenName("..weird")).toBe(true);
	});

	it("is false for everything else, including dots further in", () => {
		expect(isHiddenName("photo.jpg")).toBe(false);
		expect(isHiddenName("archive.tar.gz")).toBe(false);
		expect(isHiddenName("Download")).toBe(false);
		expect(isHiddenName("")).toBe(false);
	});
});

describe("visibleOnly", () => {
	const items = [{ name: ".cache" }, { name: "a.txt" }, { name: ".nomedia" }];

	it("drops hidden entries while hidden files are off", () => {
		expect(visibleOnly(items, false).map((i) => i.name)).toEqual(["a.txt"]);
	});

	it("keeps everything while hidden files are on", () => {
		expect(visibleOnly(items, true)).toEqual(items);
	});

	it("does not change the list it was given", () => {
		visibleOnly(items, false);
		expect(items).toHaveLength(3);
	});
});
