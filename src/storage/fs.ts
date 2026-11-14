/**
 * The phone's file system, seen through expo-file-system. Everything here is
 * read-only: the app lists, measures and opens files, it never changes them.
 * Listing is synchronous, so callers that go through many folders do it
 * through utils/walk, which keeps the screen responsive.
 */
import { Directory, File, Paths } from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, PermissionsAndroid, Platform } from "react-native";
import {
	APP_ID,
	INTERNAL_ROOT,
	NOT_VOLUMES,
	PLACE_FOLDERS,
	VOLUMES_DIR,
} from "../constants";
import type { Entry, Place } from "../types";
import { kindOf, mimeOf } from "../utils/fileTypes";
import { visibleOnly } from "../utils/hidden";
import { providerUriFor } from "../utils/openUri";
import { compareEntries } from "../utils/search";
import type { WalkItem } from "../utils/walk";

/** What one entry of a folder looks like straight off the disk. */
export function listRaw(uri: string, withSizes = false): WalkItem[] {
	const dir = new Directory(uri);
	return dir.list().map((entry): WalkItem => {
		const isDirectory = entry instanceof Directory;
		let size: number | undefined;
		if (withSizes && !isDirectory) {
			try {
				size = ((entry as File).info() as { size?: number }).size ?? 0;
			} catch {
				size = 0;
			}
		}
		return { name: entry.name, uri: entry.uri, isDirectory, size };
	});
}

/**
 * A folder's entries for the Files tab: folders first, then by name. Hidden
 * (dotted) names are left out unless `showHidden` is on. Throws if it can't be read.
 */
export function listFolder(uri: string, showHidden = false): Entry[] {
	return visibleOnly(listRaw(uri), showHidden)
		.map((e): Entry => ({
			name: e.name,
			uri: e.uri,
			isDirectory: e.isDirectory,
			kind: kindOf(e.name, e.isDirectory),
		}))
		.sort(compareEntries);
}

export type FileMeta = { size: number | null; modifiedAt: number | null };

const toMs = (t: number) => (t < 1e12 ? t * 1000 : t); // tolerate seconds vs ms
const metaCache = new Map<string, FileMeta>();

/** Size and last-change time of a file (remembered, so scrolling back is free). */
export function readMeta(uri: string): FileMeta {
	const cached = metaCache.get(uri);
	if (cached) return cached;
	let meta: FileMeta = { size: null, modifiedAt: null };
	try {
		const info = new File(uri).info() as {
			size?: number;
			modificationTime?: number;
		};
		meta = {
			size: typeof info.size === "number" ? info.size : null,
			modifiedAt: info.modificationTime ? toMs(info.modificationTime) : null,
		};
	} catch {
		/* no details for this one */
	}
	if (metaCache.size > 2000) metaCache.clear();
	metaCache.set(uri, meta);
	return meta;
}

/** Forgets the remembered details (after a refresh, files may have changed). */
export const clearMetaCache = () => metaCache.clear();

const folderExists = (uri: string): boolean => {
	try {
		return new Directory(uri).exists;
	} catch {
		return false;
	}
};

/**
 * The quick places: the internal storage, any SD card or USB drive, and the
 * usual folders of the internal storage that exist on this phone.
 */
export function findPlaces(): Place[] {
	const places: Place[] = [
		{ id: "internal", labelKey: "place.internal", uri: INTERNAL_ROOT },
	];
	try {
		for (const entry of new Directory(VOLUMES_DIR).list()) {
			if (entry instanceof Directory && !NOT_VOLUMES.includes(entry.name))
				places.push({
					id: `volume:${entry.name}`,
					labelKey: "place.sd",
					uri: entry.uri,
				});
		}
	} catch {
		/* the list of volumes isn't readable: internal storage only */
	}
	for (const p of PLACE_FOLDERS) {
		const uri = `${INTERNAL_ROOT}/${p.folder}`;
		if (folderExists(uri)) places.push({ id: p.id, labelKey: p.label, uri });
	}
	return places;
}

/** Total and free space of the phone's storage, in bytes. */
export function readDiskSpace(): { total: number; free: number } | null {
	try {
		const total = Paths.totalDiskSpace;
		const free = Paths.availableDiskSpace;
		if (typeof total !== "number" || !(total > 0)) return null;
		return { total, free: typeof free === "number" ? free : 0 };
	} catch {
		return null;
	}
}

/* ---- opening files ---- */

export type OpenResult =
	| { status: "ok" }
	| { status: "noApp" }
	/** `detail` is the technical reason, shown so a failure can be tracked down. */
	| { status: "error"; detail: string };

/**
 * Opens a file in whichever app the system picks for its type (it asks, if there
 * are several). The other app gets a content:// address from the app's own file
 * provider (plugins/withOpenFileProvider.js); Expo's address is the second try.
 */
export async function openFile(uri: string, name: string): Promise<OpenResult> {
	if (Platform.OS !== "android") {
		return { status: "error", detail: "Android only" };
	}
	const type = mimeOf(name);
	const candidates: string[] = [];
	const own = providerUriFor(uri, APP_ID);
	if (own) candidates.push(own);
	try {
		const expoUri = (new File(uri) as unknown as { contentUri?: string })
			.contentUri;
		if (expoUri) candidates.push(expoUri);
	} catch {
		/* no Expo address for it */
	}
	const problems: string[] = [];
	for (const data of candidates) {
		try {
			await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
				data,
				type,
				flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
			});
			return { status: "ok" };
		} catch (e) {
			const message = String(e instanceof Error ? e.message : e);
			if (/ActivityNotFound|No Activity found/i.test(message)) {
				return { status: "noApp" };
			}
			problems.push(message);
		}
	}
	const detail = problems.length
		? problems.join("\n")
		: "No address for the file";
	return { status: "error", detail: detail.slice(0, 300) };
}

/* ---- permission to read the whole storage ---- */

/** Android 11 (API 30) and up need the special "All files access" permission. */
export const needsAllFilesAccess = () =>
	Platform.OS === "android" && Number(Platform.Version) >= 30;

/** Opens the system page where "All files access" is switched on for this app. */
export async function openAllFilesAccessSettings(): Promise<void> {
	if (Platform.OS !== "android") return;
	try {
		await IntentLauncher.startActivityAsync(
			"android.settings.MANAGE_APP_ALL_FILES_ACCESS_PERMISSION",
			{ data: `package:${APP_ID}` },
		);
		return;
	} catch {
		/* this phone doesn't have that page: try the general list */
	}
	try {
		await IntentLauncher.startActivityAsync(
			"android.settings.MANAGE_ALL_FILES_ACCESS_PERMISSION",
		);
		return;
	} catch {
		/* and then the app's own settings page */
	}
	Linking.openSettings().catch((e) =>
		console.warn("Could not open the settings", e),
	);
}

/**
 * Android 10 and older: the ordinary "write storage" permission, needed to copy,
 * move and delete. True when granted (and on Android 11+, where "All files
 * access" covers it).
 */
export async function requestLegacyWriteAccess(): Promise<boolean> {
	if (Platform.OS !== "android" || Number(Platform.Version) >= 30) return true;
	try {
		const result = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
		);
		return result === PermissionsAndroid.RESULTS.GRANTED;
	} catch {
		return false;
	}
}

/** Android 10 and older: the ordinary "read storage" permission. True when granted. */
export async function requestLegacyReadAccess(): Promise<boolean> {
	if (Platform.OS !== "android" || Number(Platform.Version) >= 30) return true;
	try {
		const result = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
		);
		return result === PermissionsAndroid.RESULTS.GRANTED;
	} catch {
		return false;
	}
}
