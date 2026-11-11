/**
 * Adding up what the Storage tab shows: sizes by type and by top-level
 * folder. Pure functions; the walk that feeds them is in hooks/useStorageScan.
 */
import type { FileKind, StatCategory } from "../types";
import { statCategory } from "./fileTypes";

export const STAT_CATEGORIES: StatCategory[] = [
	"image",
	"video",
	"audio",
	"document",
	"archive",
	"apk",
	"other",
];

export type FolderUsage = {
	name: string;
	uri: string;
	bytes: number;
	files: number;
};

export type Totals = {
	files: number;
	bytes: number;
	byCategory: Record<StatCategory, number>;
};

export function emptyTotals(): Totals {
	return {
		files: 0,
		bytes: 0,
		byCategory: Object.fromEntries(
			STAT_CATEGORIES.map((c) => [c, 0]),
		) as Record<StatCategory, number>,
	};
}

/** Counts one file (a size that isn't a usable number counts as 0). */
export function addFile(totals: Totals, kind: FileKind, size: number | undefined) {
	const bytes = typeof size === "number" && size > 0 ? size : 0;
	totals.files += 1;
	totals.bytes += bytes;
	totals.byCategory[statCategory(kind)] += bytes;
}

/** Folders that hold something, biggest first. */
export function rankFolders(folders: FolderUsage[], limit = 12): FolderUsage[] {
	return folders
		.filter((f) => f.bytes > 0)
		.sort((a, b) => b.bytes - a.bytes)
		.slice(0, limit);
}

/** Share of `part` in `whole`, 0..1 (0 when there is nothing to divide by). */
export function fraction(part: number, whole: number): number {
	return whole > 0 ? Math.min(1, Math.max(0, part / whole)) : 0;
}
