/**
 * Helpers for the file:// addresses the app moves around. Plain TypeScript
 * (no React, no Expo), so it can be tested on its own.
 */

const SCHEME = "file://";

/** The address without trailing slashes ("file:///a/b/" -> "file:///a/b"). */
export function trimSlash(uri: string): string {
	const t = uri.replace(/\/+$/, "");
	return t.startsWith(SCHEME) && t.length > SCHEME.length ? t : SCHEME + "/";
}

export function sameUri(a: string, b: string): boolean {
	return trimSlash(a) === trimSlash(b);
}

/** True when `uri` is `root` itself or something inside it. */
export function isInside(uri: string, root: string): boolean {
	const u = trimSlash(uri);
	const r = trimSlash(root);
	return u === r || u.startsWith(r + "/");
}

/** The folder that holds `uri`. The top of the file system is its own parent. */
export function parentUri(uri: string): string {
	const t = trimSlash(uri);
	const i = t.lastIndexOf("/");
	return i <= SCHEME.length ? SCHEME + "/" : t.slice(0, i);
}

export function safeDecode(text: string): string {
	try {
		return decodeURIComponent(text);
	} catch {
		return text;
	}
}

/** The last part of an address, readable ("My%20Files" -> "My Files"). */
export function baseName(uri: string): string {
	const t = trimSlash(uri);
	return safeDecode(t.slice(t.lastIndexOf("/") + 1));
}

export type Crumb = { name: string; uri: string };

/**
 * The folders from just below `root` down to `uri`, each with its own address,
 * for the path bar. Empty when `uri` is the root (or isn't inside it).
 */
export function crumbsBelow(uri: string, root: string): Crumb[] {
	if (!isInside(uri, root) || sameUri(uri, root)) return [];
	const rootTrim = trimSlash(root);
	const rest = trimSlash(uri).slice(rootTrim.length + 1);
	const crumbs: Crumb[] = [];
	let current = rootTrim;
	for (const part of rest.split("/").filter(Boolean)) {
		current = current + "/" + part;
		crumbs.push({ name: safeDecode(part), uri: current });
	}
	return crumbs;
}

/** "Download/Books" for a folder inside `root`; "" for the root itself. */
export function relativePath(uri: string, root: string): string {
	return crumbsBelow(uri, root)
		.map((c) => c.name)
		.join("/");
}

/** Lower-case extension without the dot ("Photo.JPG" -> "jpg"); "" if there is none. ".bashrc" has none. */
export function extensionOf(name: string): string {
	const i = name.lastIndexOf(".");
	return i > 0 && i < name.length - 1 ? name.slice(i + 1).toLowerCase() : "";
}
