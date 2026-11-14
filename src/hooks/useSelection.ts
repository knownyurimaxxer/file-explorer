import { useCallback, useState } from "react";
import type { OpItem } from "../storage/operations";

type Pickable = { uri: string; name: string; isDirectory: boolean };

const asItem = (e: Pickable): OpItem => ({
	uri: e.uri,
	name: e.name,
	isDirectory: e.isDirectory,
});

/**
 * The files and folders ticked in the list. Selecting starts with the first
 * one (a long press) and ends when none is left ticked.
 */
export function useSelection() {
	const [items, setItems] = useState<ReadonlyMap<string, OpItem>>(new Map());

	const toggle = useCallback((entry: Pickable) => {
		setItems((prev) => {
			const next = new Map(prev);
			if (next.has(entry.uri)) next.delete(entry.uri);
			else next.set(entry.uri, asItem(entry));
			return next;
		});
	}, []);

	const setAll = useCallback((entries: Pickable[]) => {
		setItems(new Map(entries.map((e) => [e.uri, asItem(e)])));
	}, []);

	const clear = useCallback(() => {
		setItems((prev) => (prev.size === 0 ? prev : new Map()));
	}, []);

	return {
		items,
		count: items.size,
		selecting: items.size > 0,
		toggle,
		setAll,
		clear,
	};
}
