/**
 * Walks a folder tree breadth-first (shallow things first) without freezing
 * the app: listing folders is synchronous, so the walk hands the thread back
 * every few milliseconds. It knows nothing about the phone's file system: the
 * caller says how to list a folder, which keeps it testable.
 */
import { WALK } from "../constants";

export type WalkItem = {
	name: string;
	uri: string;
	isDirectory: boolean;
	/** Size in bytes, when the lister was asked for it (files only). */
	size?: number;
};

export type WalkOptions = {
	/** The entries of a folder. May throw (the folder is then counted as unreadable). */
	list: (uri: string) => WalkItem[];
	/** Called for every entry found. `depth` is 0 for the entries of the start folder. */
	onItem: (item: WalkItem, parentUri: string, depth: number) => void;
	isCancelled: () => boolean;
	/** Called with the address of every folder that couldn't be listed. */
	onUnreadable?: (uri: string) => void;
	sliceMs?: number;
	maxDepth?: number;
	/** Gives the thread back. Replaced in tests. */
	yieldNow?: () => Promise<void>;
	now?: () => number;
};

const defaultYield = () => new Promise<void>((r) => setTimeout(r, 0));

/** Resolves true when everything was visited, false when it was cancelled first. */
export async function walkTree(
	startUri: string,
	o: WalkOptions,
): Promise<boolean> {
	const sliceMs = o.sliceMs ?? WALK.sliceMs;
	const maxDepth = o.maxDepth ?? WALK.maxDepth;
	const yieldNow = o.yieldNow ?? defaultYield;
	const now = o.now ?? Date.now;

	const queue: { uri: string; depth: number }[] = [{ uri: startUri, depth: 0 }];
	let sliceStart = now();

	// Hands the thread back when this stretch of work has gone on long enough.
	const breathe = async () => {
		if (now() - sliceStart >= sliceMs) {
			await yieldNow();
			sliceStart = now();
		}
	};

	for (let head = 0; head < queue.length; head++) {
		if (o.isCancelled()) return false;
		const { uri, depth } = queue[head];
		queue[head].uri = ""; // let the address go; the queue itself can get long

		let items: WalkItem[];
		try {
			items = o.list(uri);
		} catch {
			o.onUnreadable?.(uri);
			await breathe();
			continue;
		}

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			o.onItem(item, uri, depth);
			if (item.isDirectory && depth + 1 < maxDepth)
				queue.push({ uri: item.uri, depth: depth + 1 });
			if ((i & 63) === 63) {
				if (o.isCancelled()) return false;
				await breathe();
			}
		}
		await breathe();
	}
	return !o.isCancelled();
}
