import { useEffect, useState } from "react";
import { SEARCH } from "../constants";
import { listRaw } from "../storage/fs";
import type { SearchHit } from "../types";
import { kindOf } from "../utils/fileTypes";
import { visibleOnly } from "../utils/hidden";
import { compareEntries, matchesTokens, parseQuery } from "../utils/search";
import { walkTree } from "../utils/walk";

export type SearchState = {
	/** There is something typed: the list shows results instead of the folder. */
	active: boolean;
	/** Still looking through folders. */
	searching: boolean;
	results: SearchHit[];
	/** Stopped at the limit, there could be more. */
	truncated: boolean;
};

const IDLE: SearchState = {
	active: false,
	searching: false,
	results: [],
	truncated: false,
};

const byDepthThenName = (a: SearchHit, b: SearchHit) =>
	a.depth - b.depth || compareEntries(a, b);

/**
 * Looks for names matching `query` in `rootUri` and every folder below it.
 * Results appear as they are found; a new query (or leaving the folder)
 * cancels the walk that was running. Hidden (dotted) files and folders are
 * skipped, and not searched inside, unless `showHidden` is on.
 */
export function useFileSearch(
	rootUri: string,
	query: string,
	showHidden: boolean,
): SearchState {
	const [state, setState] = useState<SearchState>(IDLE);

	useEffect(() => {
		const tokens = parseQuery(query);
		if (tokens.length === 0) {
			setState(IDLE);
			return;
		}

		let cancelled = false;
		let full = false;
		setState({ active: true, searching: true, results: [], truncated: false });

		const timer = setTimeout(async () => {
			const found: SearchHit[] = [];
			let lastFlush = Date.now();
			const flush = (searching: boolean) =>
				setState({
					active: true,
					searching,
					results: found.slice(),
					truncated: full,
				});

			await walkTree(rootUri, {
				list: (uri) => visibleOnly(listRaw(uri), showHidden),
				isCancelled: () => cancelled || full,
				onItem: (item, parentUri, depth) => {
					if (!matchesTokens(item.name, tokens)) return;
					found.push({
						name: item.name,
						uri: item.uri,
						isDirectory: item.isDirectory,
						kind: kindOf(item.name, item.isDirectory),
						parentUri,
						depth,
					});
					if (found.length >= SEARCH.maxResults) full = true;
					if (Date.now() - lastFlush > 200) {
						lastFlush = Date.now();
						if (!cancelled) flush(true);
					}
				},
			});

			if (cancelled) return;
			found.sort(byDepthThenName);
			flush(false);
		}, SEARCH.debounceMs);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [rootUri, query, showHidden]);

	return state;
}
