import type { Theme } from "../types";

/** Black or white, whichever is readable on top of `hex`. */
export function readableOn(hex: string): "#000000" | "#FFFFFF" {
	const h = hex.replace("#", "");
	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6
		? "#000000"
		: "#FFFFFF";
}

/** WCAG relative luminance of a #RRGGBB color (0 = black, 1 = white). */
function luminance(hex: string): number {
	const h = hex.replace("#", "");
	const [r, g, b] = [0, 2, 4].map((i) => {
		const c = parseInt(h.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #RRGGBB colors (1 = identical, 21 = black on white). */
export function contrastRatio(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/**
 * Color for links on a card: the accent, unless the accent is too faint on
 * the card (light blue on white, say), then the text color. Links are always underlined.
 */
export function linkColor(t: Theme): string {
	return contrastRatio(t.accent, t.card) >= 3 ? t.accent : t.text;
}

/**
 * A size for people: "0 B", "512 B", "1.5 KB", "23 MB", "1.2 GB". Units of
 * 1000, the way Android's own storage screen counts. `locale` picks the
 * decimal separator ("1,5 KB" in Spanish).
 */
export function formatBytes(bytes: number, locale?: string): string {
	const n = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
	const units = ["B", "KB", "MB", "GB", "TB"];
	// One decimal while the number is small (1.5 KB), none from 10 up (23 MB).
	const digitsFor = (unit: number, v: number) =>
		unit === 0 || v >= 10 ? 0 : 1;
	let i = 0;
	let value = n;
	while (value >= 1000 && i < units.length - 1) {
		value /= 1000;
		i++;
	}
	// 999.96 KB rounds to "1000 KB": call it 1 MB instead.
	const rounded = Number(value.toFixed(digitsFor(i, value)));
	if (rounded >= 1000 && i < units.length - 1) {
		value = rounded / 1000;
		i++;
	}
	const text = value.toLocaleString(locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits: digitsFor(i, value),
	});
	return `${text} ${units[i]}`;
}

/** "28 Oct 2026", in the language's own style. */
export function formatDate(ms: number, locale?: string): string {
	return new Date(ms).toLocaleDateString(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/** A whole number with the language's thousands separator ("12,345"). */
export function formatCount(n: number, locale?: string): string {
	return Math.round(n).toLocaleString(locale);
}

/** "12%" (never "0%" for something that exists: "<1%"). */
export function formatPercent(part: number, whole: number): string {
	if (whole <= 0 || part <= 0) return "0%";
	const p = (part / whole) * 100;
	return p < 1 ? "<1%" : `${Math.round(p)}%`;
}
