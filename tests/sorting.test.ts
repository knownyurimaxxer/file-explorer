import { describe, expect, it } from "vitest";
import {
	DEFAULT_SORT,
	isSortBy,
	NATURAL_DESC,
	sortEntries,
	type SortMeta,
} from "../src/utils/sorting";

type E = { name: string; isDirectory: boolean };
const file = (name: string): E => ({ name, isDirectory: false });
const folder = (name: string): E => ({ name, isDirectory: true });

const META: Record<string, SortMeta> = {
	"a.txt": { size: 300, modifiedAt: 1000 },
	"b.txt": { size: 100, modifiedAt: 3000 },
	"c.txt": { size: 200, modifiedAt: 2000 },
	"d.txt": { size: 200, modifiedAt: 2000 },
	"unknown.txt": { size: null, modifiedAt: null },
};
const metaOf = (e: E): SortMeta => META[e.name] ?? { size: null, modifiedAt: null };
const names = (list: E[]) => list.map((e) => e.name);

const sample = [
	file("c.txt"),
	folder("Zeta"),
	file("a.txt"),
	file("unknown.txt"),
	folder("alpha"),
	file("b.txt"),
	file("d.txt"),
];

describe("sortEntries by name", () => {
	it("is folders first, then A to Z by default", () => {
		expect(names(sortEntries(sample, DEFAULT_SORT, metaOf))).toEqual([
			"alpha",
			"Zeta",
			"a.txt",
			"b.txt",
			"c.txt",
			"d.txt",
			"unknown.txt",
		]);
	});

	it("goes Z to A, folders still first", () => {
		expect(
			names(sortEntries(sample, { by: "name", desc: true }, metaOf)),
		).toEqual([
			"Zeta",
			"alpha",
			"unknown.txt",
			"d.txt",
			"c.txt",
			"b.txt",
			"a.txt",
		]);
	});

	it("counts numbers as numbers", () => {
		const list = [file("file10"), file("file2"), file("file1")];
		expect(
			names(sortEntries(list, DEFAULT_SORT, () => ({ size: 0, modifiedAt: 0 }))),
		).toEqual(["file1", "file2", "file10"]);
	});

	it("doesn't ask for the details of anything", () => {
		let asked = 0;
		sortEntries(sample, DEFAULT_SORT, () => {
			asked++;
			return { size: null, modifiedAt: null };
		});
		expect(asked).toBe(0);
	});
});

describe("sortEntries by size", () => {
	it("puts the largest first, folders on top by name, unknown last", () => {
		expect(
			names(sortEntries(sample, { by: "size", desc: true }, metaOf)),
		).toEqual([
			"alpha",
			"Zeta",
			"a.txt",
			"c.txt", // 200 and 200: by name
			"d.txt",
			"b.txt",
			"unknown.txt",
		]);
	});

	it("puts the smallest first, unknown still last", () => {
		expect(
			names(sortEntries(sample, { by: "size", desc: false }, metaOf)),
		).toEqual([
			"alpha",
			"Zeta",
			"b.txt",
			"c.txt",
			"d.txt",
			"a.txt",
			"unknown.txt",
		]);
	});

	it("only asks for the details of files", () => {
		const asked: string[] = [];
		sortEntries(sample, { by: "size", desc: true }, (e) => {
			asked.push(e.name);
			return metaOf(e);
		});
		expect(asked.sort()).toEqual(
			["a.txt", "b.txt", "c.txt", "d.txt", "unknown.txt"].sort(),
		);
	});
});

describe("sortEntries by date", () => {
	it("puts the newest first", () => {
		expect(
			names(sortEntries(sample, { by: "date", desc: true }, metaOf)),
		).toEqual(["alpha", "Zeta", "b.txt", "c.txt", "d.txt", "a.txt", "unknown.txt"]);
	});

	it("puts the oldest first", () => {
		expect(
			names(sortEntries(sample, { by: "date", desc: false }, metaOf)),
		).toEqual(["alpha", "Zeta", "a.txt", "c.txt", "d.txt", "b.txt", "unknown.txt"]);
	});
});

describe("sortEntries in general", () => {
	it("doesn't change the list it was given", () => {
		const copy = [...sample];
		sortEntries(sample, { by: "size", desc: true }, metaOf);
		expect(sample).toEqual(copy);
	});

	it("copes with an empty folder", () => {
		expect(sortEntries([], DEFAULT_SORT, metaOf)).toEqual([]);
	});
});

describe("isSortBy and NATURAL_DESC", () => {
	it("knows the three ways", () => {
		expect(isSortBy("name") && isSortBy("date") && isSortBy("size")).toBe(true);
		expect(isSortBy("color")).toBe(false);
		expect(isSortBy(undefined)).toBe(false);
	});

	it("starts newest and largest first, names A to Z", () => {
		expect(NATURAL_DESC).toEqual({ name: false, date: true, size: true });
	});
});
