/**
 * Android 10 and older: changing files on an SD card goes through a folder the
 * person has granted with the system folder picker (the Storage Access
 * Framework). This file asks for that grant, remembers it, and turns the
 * file:// addresses the app uses into the content:// ones the grant covers.
 */
import { Directory } from "expo-file-system";
import {
	isVolumeRoot,
	normalizeTree,
	safDocUri,
	safInitialUri,
	volumeOf,
} from "../utils/volumes";
import { getSdTrees, setSdTree } from "./db";

/** Why something couldn't be done, in a way the screen can word for the person. */
export type OpErrorCode = "itself" | "sd" | "other";

export class OpError extends Error {
	code: OpErrorCode;
	constructor(code: OpErrorCode, message: string = code) {
		super(message);
		this.name = "OpError";
		this.code = code;
	}
}

/** The granted folders, by card id. Kept here so address lookups can be synchronous. */
const trees = new Map<string, string>();

/** Reads the saved grants. Call before using the functions below. */
export async function loadSdTrees(): Promise<void> {
	const saved = await getSdTrees();
	trees.clear();
	for (const [volume, tree] of Object.entries(saved)) trees.set(volume, tree);
}

/** True when this card's top folder has been granted and is still reachable. */
export async function hasSdAccess(volumeId: string): Promise<boolean> {
	await loadSdTrees();
	const tree = trees.get(volumeId);
	if (!tree) return false;
	try {
		return new Directory(tree).exists;
	} catch {
		return false;
	}
}

export type PickResult = "ok" | "wrong" | "cancelled";

/**
 * Opens the system folder picker for the person to choose the card's top
 * folder. "wrong" when they chose something else (a subfolder, or another card).
 */
export async function pickSdRoot(volumeId: string): Promise<PickResult> {
	let picked: Directory;
	try {
		picked = await Directory.pickDirectoryAsync(safInitialUri(volumeId));
	} catch {
		return "cancelled"; // closed the picker without choosing
	}
	const tree = normalizeTree(picked.uri);
	if (!tree || !isVolumeRoot(tree, volumeId)) return "wrong";
	await setSdTree(volumeId, tree);
	trees.set(volumeId, tree);
	return "ok";
}

/** The content:// address, on the granted folder, of a file or folder at this file:// address. */
export function safUriFor(fileUri: string): string {
	const volume = volumeOf(fileUri);
	const tree = volume && trees.get(volume.id);
	if (!volume || !tree) throw new OpError("sd");
	return safDocUri(tree, volume.id, volume.rel);
}

/** The folder at this file:// address, reached through the granted folder. */
export function safDirectoryFor(fileUri: string): Directory {
	return new Directory(safUriFor(fileUri));
}
