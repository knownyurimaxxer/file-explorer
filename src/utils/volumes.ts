/**
 * Storage volumes and the Android "Storage Access Framework" (SAF) addresses
 * that go with them. Plain TypeScript, so it can be tested on its own.
 *
 * Why this exists: on Android 10 and older an app can't write to an SD card
 * with normal file calls, only through a folder the person has granted (the
 * system folder picker). Internal storage, and every volume on Android 11+
 * (with "All files access"), can be written to directly.
 */
import { safeDecode, trimSlash } from "./paths";

const SCHEME = "file://";
const STORAGE = "/storage/";

/** The Android version (API level) from which "All files access" replaces SAF for SD cards. */
export const DIRECT_WRITE_API = 30;

export type Volume = {
	/** "primary" for the phone's internal storage, otherwise the card's id ("1A2B-3C4D"). */
	id: string;
	/** Internal storage: can be written to directly. */
	primary: boolean;
	/** The path inside the volume, without slashes at the ends ("" for the top). */
	rel: string;
};

/** The path of a file:// address, readable ("file:///a/My%20Files" -> "/a/My Files"). */
export function fsPath(uri: string): string {
	return safeDecode(trimSlash(uri).slice(SCHEME.length));
}

/** Which volume a file:// address is on, or null if it isn't inside one. */
export function volumeOf(uri: string): Volume | null {
	const path = fsPath(uri);
	if (!path.startsWith(STORAGE)) return null;
	const parts = path.slice(STORAGE.length).split("/");
	if (parts[0] === "emulated") {
		if (!parts[1]) return null;
		return {
			id: parts[1] === "0" ? "primary" : `emulated-${parts[1]}`,
			primary: true,
			rel: parts.slice(2).join("/"),
		};
	}
	if (!parts[0] || parts[0] === "self") return null;
	return { id: parts[0], primary: false, rel: parts.slice(1).join("/") };
}

/** True when changing files at this address needs the SD card's granted folder. */
export function needsSafFor(uri: string, api: number): boolean {
	if (!(api < DIRECT_WRITE_API)) return false;
	const volume = volumeOf(uri);
	return volume !== null && !volume.primary;
}

/* ---- SAF addresses (content://) ---- */

const SAF_AUTHORITY = "content://com.android.externalstorage.documents";

/** Where the system folder picker should open: the top of the card. */
export const safInitialUri = (volumeId: string): string =>
	`${SAF_AUTHORITY}/document/${encodeURIComponent(`${volumeId}:`)}`;

/** The address the picker returns, cut down to the part that names the folder (".../tree/<id>"). */
export function normalizeTree(uri: string): string | null {
	const m = /^(content:\/\/[^/]+)\/tree\/([^/]+)/.exec(uri);
	return m ? `${m[1]}/tree/${m[2]}` : null;
}

/** Which volume a granted folder is on, and where inside it ("" = the top of the card). */
export function treeTarget(
	treeUri: string,
): { volume: string; path: string } | null {
	const m = /\/tree\/([^/]+)/.exec(treeUri);
	if (!m) return null;
	const docId = safeDecode(m[1]);
	const i = docId.indexOf(":");
	return i < 0 ? null : { volume: docId.slice(0, i), path: docId.slice(i + 1) };
}

/** True when the granted folder is the very top of that card. */
export function isVolumeRoot(treeUri: string, volumeId: string): boolean {
	const target = treeTarget(treeUri);
	return target !== null && target.volume === volumeId && target.path === "";
}

/**
 * The content:// address of a file or folder on a card whose top folder has
 * been granted as `treeUri`.
 */
export function safDocUri(
	treeUri: string,
	volumeId: string,
	rel: string,
): string {
	if (rel === "") return treeUri;
	const tree = treeUri.replace(/\/document\/.*$/, "");
	return `${tree}/document/${encodeURIComponent(`${volumeId}:${rel}`)}`;
}
