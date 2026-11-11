import { describe, expect, it } from "vitest";
import { PRESETS } from "../src/constants";
import {
	formatBytes,
	formatCount,
	formatDate,
	formatPercent,
	readableOn,
} from "../src/utils/format";

describe("readableOn", () => {
	it("picks white on dark colors and black on light ones", () => {
		expect(readableOn("#000000")).toBe("#FFFFFF");
		expect(readableOn("#001935")).toBe("#FFFFFF");
		expect(readableOn("#FFFFFF")).toBe("#000000");
		expect(readableOn("#F2EFE9")).toBe("#000000");
	});

	it("keeps the text of every preset readable on its card", () => {
		for (const t of Object.values(PRESETS)) {
			const cardIsLight = readableOn(t.card) === "#000000";
			const textIsLight = readableOn(t.text) === "#000000";
			expect(textIsLight).toBe(!cardIsLight);
		}
	});
});

describe("formatBytes", () => {
	it("counts in units of 1000, like Android's storage screen", () => {
		expect(formatBytes(0, "en")).toBe("0 B");
		expect(formatBytes(512, "en")).toBe("512 B");
		expect(formatBytes(1500, "en")).toBe("1.5 KB");
		expect(formatBytes(23_000_000, "en")).toBe("23 MB");
		expect(formatBytes(1_230_000_000, "en")).toBe("1.2 GB");
		expect(formatBytes(2_000_000_000_000, "en")).toBe("2 TB");
	});

	it("moves up a unit instead of showing 1000 KB", () => {
		expect(formatBytes(999_960, "en")).toBe("1 MB");
	});

	it("uses the language's decimal separator", () => {
		expect(formatBytes(1500, "es")).toBe("1,5 KB");
	});

	it("copes with nonsense", () => {
		expect(formatBytes(-5, "en")).toBe("0 B");
		expect(formatBytes(NaN, "en")).toBe("0 B");
	});
});

describe("formatDate, formatCount, formatPercent", () => {
	it("format the date for the locale", () => {
		const ms = Date.UTC(2026, 9, 28, 12);
		expect(formatDate(ms, "en")).toBe("Oct 28, 2026");
	});

	it("groups thousands", () => {
		expect(formatCount(12345, "en")).toBe("12,345");
	});

	it("rounds percentages and never shows 0% for something that exists", () => {
		expect(formatPercent(1, 4)).toBe("25%");
		expect(formatPercent(1, 1000)).toBe("<1%");
		expect(formatPercent(0, 100)).toBe("0%");
		expect(formatPercent(5, 0)).toBe("0%");
	});
});
