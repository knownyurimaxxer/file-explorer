import { describe, expect, it } from "vitest";
import {
	compareEntries,
	foldText,
	matchesTokens,
	parseQuery,
} from "../src/utils/search";

describe("foldText and parseQuery", () => {
	it("ignores capitals and accents", () => {
		expect(foldText("Café Ñandú")).toBe("cafe nandu");
	});

	it("splits into words and drops empty ones", () => {
		expect(parseQuery("  Trip   2026 ")).toEqual(["trip", "2026"]);
		expect(parseQuery("   ")).toEqual([]);
	});
});

describe("matchesTokens", () => {
	it("needs every word, in any order", () => {
		const tokens = parseQuery("trip 2026");
		expect(matchesTokens("2026 summer trip.jpg", tokens)).toBe(true);
		expect(matchesTokens("summer trip.jpg", tokens)).toBe(false);
	});

	it("finds accented names with plain letters and the other way round", () => {
		expect(matchesTokens("Café menu.pdf", parseQuery("cafe"))).toBe(true);
		expect(matchesTokens("cafe menu.pdf", parseQuery("CAFÉ"))).toBe(true);
	});

	it("matches nothing when there is nothing to look for", () => {
		expect(matchesTokens("anything", [])).toBe(false);
	});
});

describe("compareEntries", () => {
	const e = (name: string, isDirectory = false) => ({ name, isDirectory });

	it("puts folders first, then sorts by name with numbers in order", () => {
		const list = [e("file10.txt"), e("zeta", true), e("file2.txt"), e("Alpha", true)];
		expect(list.sort(compareEntries).map((x) => x.name)).toEqual([
			"Alpha",
			"zeta",
			"file2.txt",
			"file10.txt",
		]);
	});
});
