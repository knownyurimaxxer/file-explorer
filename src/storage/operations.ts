/**
 * Copy, move and delete. The only place where the app changes anything on the
 * phone; everything else only reads.
 *
 * A destination is reached one of two ways: directly (internal storage, and
 * every volume on Android 11+), or, on Android 10 and older for an SD card,
 * through the folder the person granted (see saf.ts). Reading always goes
 * straight to the file. Nothing is ever overwritten: a name that is taken gets
 * "(1)" and so on. A folder is copied item by item, so one file that fails
 * doesn't stop the rest, and when a move has any failure the original is kept.
 */
import { Directory, File, FileMode } from "expo-file-system";
import { Platform } from "react-native";
import { mimeOf } from "../utils/fileTypes";
import { uniqueName } from "../utils/names";
import { isInside, parentUri, sameUri } from "../utils/paths";
import { needsSafFor, volumeOf } from "../utils/volumes";
import { loadSdTrees, OpError, safDirectoryFor, safUriFor } from "./saf";
import type { OpErrorCode } from "./saf";

export type OpMode = "copy" | "move" | "delete";

/** What an operation works on: one file or folder, by its file:// address. */
export type OpItem = { uri: string; name: string; isDirectory: boolean };

export type OpProgress = { done: number; total: number; current: string };

export type OpFailure = { name: string; code: OpErrorCode; detail: string };

export type OpResult = {
	/** Items finished completely. */
	done: number;
	failures: OpFailure[];
	/** The person pressed Stop before the end. */
	stopped: boolean;
};

const CHUNK = 1024 * 1024;

const apiLevel = () => Number(Platform.Version);

/** The cards whose granted folder this operation needs (empty on internal storage and Android 11+). */
export function sdVolumesNeeded(
	mode: OpMode,
	items: OpItem[],
	destUri: string | null,
): string[] {
	const api = apiLevel();
	const ids = new Set<string>();
	const add = (uri: string) => {
		const volume = volumeOf(uri);
		if (volume && needsSafFor(uri, api)) ids.add(volume.id);
	};
	if (mode !== "delete" && destUri) add(destUri);
	if (mode !== "copy") for (const item of items) add(item.uri);
	return [...ids];
}

type Target = { kind: "file"; uri: string } | { kind: "saf"; dir: Directory };

type Ctx = {
	api: number;
	stop: () => boolean;
	progress: (name: string) => void;
	failures: OpFailure[];
};

const failureOf = (name: string, e: unknown): OpFailure =>
	e instanceof OpError
		? { name, code: e.code, detail: "" }
		: {
				name,
				code: "other",
				detail: String(e instanceof Error ? e.message : e).slice(0, 200),
			};

const yieldToUi = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function targetFor(destUri: string, api: number): Target {
	return needsSafFor(destUri, api)
		? { kind: "saf", dir: safDirectoryFor(destUri) }
		: { kind: "file", uri: destUri };
}

/** The names already in a destination, in lower case. */
function namesIn(target: Target): Set<string> {
	const list =
		target.kind === "file"
			? new Directory(target.uri).list()
			: target.dir.list();
	return new Set(list.map((e) => e.name.toLowerCase()));
}

function makeChild(target: Target, name: string): Target {
	if (target.kind === "file") {
		const dir = new Directory(target.uri, name);
		dir.create();
		return { kind: "file", uri: dir.uri };
	}
	return { kind: "saf", dir: target.dir.createDirectory(name) };
}

/** A file's contents, chunk by chunk, into a new file made on the granted folder. */
async function streamCopy(srcUri: string, out: File): Promise<void> {
	const src = new File(srcUri).open(FileMode.ReadOnly);
	let dst: ReturnType<File["open"]> | null = null;
	try {
		dst = out.open(FileMode.Truncate);
		for (;;) {
			const bytes = src.readBytes(CHUNK);
			if (bytes.length === 0) break;
			dst.writeBytes(bytes);
			await yieldToUi(); // the screen stays alive while a big file goes over
		}
	} finally {
		src.close();
		dst?.close();
	}
}

async function copyFile(
	srcUri: string,
	name: string,
	target: Target,
): Promise<void> {
	if (target.kind === "file") {
		await new File(srcUri).copy(new File(target.uri, name));
		return;
	}
	const mime = mimeOf(name);
	const out = target.dir.createFile(
		name,
		mime === "*/*" ? "application/octet-stream" : mime,
	);
	try {
		await streamCopy(srcUri, out);
	} catch (e) {
		try {
			out.delete(); // no half-written file left behind
		} catch {
			/* nothing more to do */
		}
		throw e;
	}
}

/**
 * Copies one item into `target` under `name`. Returns how many things inside
 * it could not be copied (0 = all of it); each one is also in `ctx.failures`.
 */
async function copyInto(
	item: OpItem,
	target: Target,
	name: string,
	ctx: Ctx,
): Promise<number> {
	ctx.progress(name);
	if (!item.isDirectory) {
		await copyFile(item.uri, name, target);
		return 0;
	}
	const child = makeChild(target, name);
	let failed = 0;
	for (const entry of new Directory(item.uri).list()) {
		if (ctx.stop()) return failed + 1; // not all of it was copied
		const sub: OpItem = {
			uri: entry.uri,
			name: entry.name,
			isDirectory: entry instanceof Directory,
		};
		try {
			failed += await copyInto(sub, child, sub.name, ctx);
		} catch (e) {
			failed++;
			ctx.failures.push(failureOf(sub.name, e));
		}
	}
	return failed;
}

function deleteItem(item: OpItem, api: number): void {
	const uri = needsSafFor(item.uri, api) ? safUriFor(item.uri) : item.uri;
	if (item.isDirectory) new Directory(uri).delete();
	else new File(uri).delete();
}

/** One item. False when part of it failed (the failures are already noted). */
async function runOne(
	mode: OpMode,
	item: OpItem,
	destUri: string | null,
	target: Target | null,
	taken: Set<string>,
	ctx: Ctx,
): Promise<boolean> {
	if (mode === "delete") {
		deleteItem(item, ctx.api);
		return true;
	}
	if (!target || !destUri) throw new OpError("other", "No destination");
	if (item.isDirectory && isInside(destUri, item.uri)) {
		throw new OpError("itself");
	}
	// Already where it is going: nothing to move.
	if (mode === "move" && sameUri(parentUri(item.uri), destUri)) return true;

	const name = uniqueName(item.name, item.isDirectory, taken);

	// Same volume, directly reachable: a real move (instant, whatever the size).
	if (
		mode === "move" &&
		target.kind === "file" &&
		volumeOf(item.uri)?.id === volumeOf(destUri)?.id
	) {
		if (!item.isDirectory) {
			await new File(item.uri).move(new File(destUri, name));
			taken.add(name.toLowerCase());
			return true;
		}
		if (name === item.name) {
			await new Directory(item.uri).move(new Directory(destUri));
			taken.add(name.toLowerCase());
			return true;
		}
	}

	const failed = await copyInto(item, target, name, ctx);
	if (failed > 0) return false;
	taken.add(name.toLowerCase());
	if (mode === "move") deleteItem(item, ctx.api);
	return true;
}

/**
 * Does the work. `destUri` is the folder to copy or move into (null for
 * delete). `shouldStop` is asked between items; the item being worked on
 * finishes first.
 */
export async function runOperation(
	mode: OpMode,
	items: OpItem[],
	destUri: string | null,
	onProgress: (p: OpProgress) => void,
	shouldStop: () => boolean,
): Promise<OpResult> {
	const api = apiLevel();
	const failures: OpFailure[] = [];
	let done = 0;
	let current = "";
	const report = () => onProgress({ done, total: items.length, current });
	const ctx: Ctx = {
		api,
		stop: shouldStop,
		progress: (name) => {
			current = name;
			report();
		},
		failures,
	};

	let target: Target | null = null;
	let taken = new Set<string>();
	try {
		await loadSdTrees();
		if (mode !== "delete" && destUri) {
			target = targetFor(destUri, api);
			taken = namesIn(target);
		}
	} catch (e) {
		// Can't even reach the destination: nothing can be done.
		return {
			done: 0,
			failures: items.map((i) => failureOf(i.name, e)),
			stopped: false,
		};
	}

	let stopped = false;
	for (const item of items) {
		if (shouldStop()) {
			stopped = true;
			break;
		}
		ctx.progress(item.name);
		try {
			if (await runOne(mode, item, destUri, target, taken, ctx)) done++;
		} catch (e) {
			failures.push(failureOf(item.name, e));
		}
		report();
	}
	return { done, failures, stopped };
}
