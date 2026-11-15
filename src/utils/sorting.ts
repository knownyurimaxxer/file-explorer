/**
 * How the Files tab orders a folder: by name, date or size, either way round.
 * Folders always stay on top. Plain TypeScript, so it can be tested on its own.
 */

export const SORT_BYS = ["name", "date", "size"] as const;
export type SortBy = (typeof SORT_BYS)[number];

export type SortOrder = { by: SortBy; desc: boolean };

export const DEFAULT_SORT: SortOrder = { by: "name", desc: false };

export const isSortBy = (value: unknown): value is SortBy =>
	typeof value === "string" && (SORT_BYS as readonly string[]).includes(value);

/** The direction you most likely want when you pick a way to sort: newest and largest first, A to Z. */
export const NATURAL_DESC: Record<SortBy, boolean> = {
	name: false,
	date: true,
	size: true,
};

type Sortable = { name: string; isDirectory: boolean };

export type SortMeta = { size: number | null; modifiedAt: number | null };

const byName = (a: Sortable, b: Sortable): number =>
	a.name.localeCompare(b.name, undefined, {
		numeric: true, // "file2" before "file10"
		sensitivity: "base", // accents and capitals ignored
	});

/**
 * A sorted copy of `entries`. `metaOf` is only asked for files, and only when
 * sorting by date or size (it is a call to the phone for each one).
 *
 * - Folders come first. Among themselves they go by name (the direction
 *   follows the switch only when sorting by name).
 * - Files with no known size or date go last, whichever way round.
 * - Equal sizes or dates fall back to the name, A to Z.
 */
export function sortEntries<T extends Sortable>(
	entries: readonly T[],
	order: SortOrder,
	metaOf: (entry: T) => SortMeta,
): T[] {
	const dir = order.desc ? -1 : 1;
	const keyed = entries.map((entry) => {
		let value: number | null = null;
		if (order.by !== "name" && !entry.isDirectory) {
			const meta = metaOf(entry);
			value = order.by === "size" ? meta.size : meta.modifiedAt;
		}
		return { entry, value };
	});

	keyed.sort((x, y) => {
		const a = x.entry;
		const b = y.entry;
		if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
		if (order.by === "name") return dir * byName(a, b);
		if (a.isDirectory) return byName(a, b);
		if (x.value === null || y.value === null) {
			if (x.value === y.value) return byName(a, b);
			return x.value === null ? 1 : -1;
		}
		if (x.value !== y.value) return dir * (x.value - y.value);
		return byName(a, b);
	});
	return keyed.map((k) => k.entry);
}
