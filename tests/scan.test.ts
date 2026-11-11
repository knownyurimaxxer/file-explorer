import { describe, expect, it } from "vitest";
import { addFile, emptyTotals, fraction, rankFolders } from "../src/utils/scan";

describe("addFile", () => {
	it("adds sizes up by type, counting code as documents", () => {
		const t = emptyTotals();
		addFile(t, "image", 1000);
		addFile(t, "image", 500);
		addFile(t, "code", 200);
		addFile(t, "other", 50);
		expect(t.files).toBe(4);
		expect(t.bytes).toBe(1750);
		expect(t.byCategory.image).toBe(1500);
		expect(t.byCategory.document).toBe(200);
		expect(t.byCategory.other).toBe(50);
	});

	it("counts a file whose size is unknown as empty, but still counts the file", () => {
		const t = emptyTotals();
		addFile(t, "video", undefined);
		addFile(t, "video", NaN);
		expect(t.files).toBe(2);
		expect(t.bytes).toBe(0);
	});
});

describe("rankFolders", () => {
	const f = (name: string, bytes: number) => ({ name, uri: `/${name}`, bytes, files: 1 });

	it("puts the biggest first, drops empty ones and caps the list", () => {
		const ranked = rankFolders([f("a", 5), f("b", 50), f("c", 0), f("d", 20)], 2);
		expect(ranked.map((x) => x.name)).toEqual(["b", "d"]);
	});
});

describe("fraction", () => {
	it("is part over whole, kept between 0 and 1", () => {
		expect(fraction(1, 4)).toBe(0.25);
		expect(fraction(5, 4)).toBe(1);
		expect(fraction(-1, 4)).toBe(0);
		expect(fraction(1, 0)).toBe(0);
	});
});
