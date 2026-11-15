import { useCallback, useEffect, useRef, useState } from "react";
import { INTERNAL_ROOT, SCAN_PACE, SCAN_REFRESH_MS } from "../constants";
import { listForScan } from "../storage/fs";
import { kindOf } from "../utils/fileTypes";
import {
	addFile,
	emptyTotals,
	FolderUsage,
	rankFolders,
	Totals,
} from "../utils/scan";
import { walkTree, WalkItem } from "../utils/walk";

export type ScanState = {
	status: "idle" | "scanning" | "done" | "stopped";
	/** Everything counted so far (final once the status is "done"). */
	totals: Totals;
	/** Top-level folders of the storage with their sizes, biggest first. */
	folders: FolderUsage[];
	/** Files lying directly in the top level. */
	loose: { files: number; bytes: number };
	/** How many folders couldn't be read. */
	unreadable: number;
};

/** A rest between bursts of work, so the screen and the rest of the phone get a turn. */
const pause = () =>
	new Promise<void>((resolve) => setTimeout(resolve, SCAN_PACE.pauseMs));

/** A file's size: already known, or read now (that is the slow part, so it's done here, in the paced loop). */
const sizeOf = (item: WalkItem): number | undefined =>
	item.readSize ? item.readSize() : item.size;

const EMPTY: ScanState = {
	status: "idle",
	totals: emptyTotals(),
	folders: [],
	loose: { files: 0, bytes: 0 },
	unreadable: 0,
};

/**
 * Adds up every file of the internal storage, grouped by type and by
 * top-level folder. Starts only when asked (it can take a while on a full
 * phone), can be stopped, and keeps its result while the app is open.
 */
export function useStorageScan() {
	const [state, setState] = useState<ScanState>(EMPTY);
	const cancel = useRef<{ stop: boolean } | null>(null);

	// Leaving the app screen stops a scan that is still running.
	useEffect(
		() => () => {
			if (cancel.current) cancel.current.stop = true;
		},
		[],
	);

	const stop = useCallback(() => {
		if (cancel.current) cancel.current.stop = true;
	}, []);

	const start = useCallback(async () => {
		if (cancel.current) cancel.current.stop = true;
		const token = { stop: false };
		cancel.current = token;

		const totals = emptyTotals();
		const folders: FolderUsage[] = [];
		const loose = { files: 0, bytes: 0 };
		let unreadable = 0;
		let lastFlush = 0;

		const snapshot = (status: ScanState["status"]): ScanState => ({
			status,
			totals: {
				files: totals.files,
				bytes: totals.bytes,
				byCategory: { ...totals.byCategory },
			},
			folders: rankFolders(folders),
			loose: { ...loose },
			unreadable,
		});
		const flush = (force = false) => {
			const now = Date.now();
			if (!force && now - lastFlush < SCAN_REFRESH_MS) return;
			lastFlush = now;
			if (!token.stop) setState(snapshot("scanning"));
		};

		setState({ ...EMPTY, status: "scanning" });

		let top: WalkItem[];
		try {
			top = listForScan(INTERNAL_ROOT);
		} catch {
			setState({ ...EMPTY, status: "done", unreadable: 1 });
			return;
		}

		for (const entry of top) {
			if (token.stop) break;
			if (!entry.isDirectory) {
				const size = sizeOf(entry);
				addFile(totals, kindOf(entry.name, false), size);
				loose.files += 1;
				loose.bytes += size ?? 0;
				continue;
			}
			const usage: FolderUsage = {
				name: entry.name,
				uri: entry.uri,
				bytes: 0,
				files: 0,
			};
			folders.push(usage);
			await walkTree(entry.uri, {
				list: listForScan,
				isCancelled: () => token.stop,
				sliceMs: SCAN_PACE.sliceMs,
				checkEvery: SCAN_PACE.checkEvery,
				yieldNow: pause,
				onUnreadable: () => {
					unreadable += 1;
				},
				onItem: (item) => {
					if (item.isDirectory) return;
					const size = sizeOf(item);
					addFile(totals, kindOf(item.name, false), size);
					usage.files += 1;
					usage.bytes += size ?? 0;
					flush();
				},
			});
		}

		if (cancel.current !== token) return; // a newer scan took over
		cancel.current = null;
		setState(snapshot(token.stop ? "stopped" : "done"));
	}, []);

	return { scan: state, start, stop };
}
