import { extensionOf } from "./paths";

/**
 * A name that is free in a folder. `taken` holds the names already there, in
 * lower case (Android's storage doesn't tell "A.txt" and "a.txt" apart).
 * "photo.jpg" becomes "photo (1).jpg", "Books" becomes "Books (1)".
 */
export function uniqueName(
	name: string,
	isDirectory: boolean,
	taken: ReadonlySet<string>,
): string {
	if (!taken.has(name.toLowerCase())) return name;
	const ext = isDirectory ? "" : extensionOf(name);
	const dot = ext ? name.length - ext.length - 1 : name.length;
	const base = name.slice(0, dot);
	const tail = name.slice(dot); // ".jpg" with its own capitals, or ""
	for (let n = 1; ; n++) {
		const candidate = `${base} (${n})${tail}`;
		if (!taken.has(candidate.toLowerCase())) return candidate;
	}
}
