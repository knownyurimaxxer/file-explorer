/**
 * Matching file names against what was typed in the search box: not case
 * sensitive, accents ignored ("cafe" finds "Café"), and every word typed has to
 * appear in the name, in any order ("trip 2026" finds "2026 summer trip.jpg").
 */

export function foldText(text: string): string {
	const base = typeof text.normalize === "function" ? text.normalize("NFD") : text;
	return base.replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** The words to look for: folded, split on spaces, none empty. */
export function parseQuery(query: string): string[] {
	return foldText(query).split(/\s+/).filter(Boolean);
}

export function matchesTokens(name: string, tokens: string[]): boolean {
	if (tokens.length === 0) return false;
	const folded = foldText(name);
	return tokens.every((t) => folded.includes(t));
}

/** Folders first, then by name ("file2" before "file10", accents and capitals ignored). */
export function compareEntries(
	a: { name: string; isDirectory: boolean },
	b: { name: string; isDirectory: boolean },
): number {
	if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
	return a.name.localeCompare(b.name, undefined, {
		numeric: true,
		sensitivity: "base",
	});
}
