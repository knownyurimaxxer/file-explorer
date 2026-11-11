import { useCallback, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { INTERNAL_ROOT } from "../constants";
import { clearMetaCache, findPlaces, listFolder } from "../storage/fs";
import type { Entry, Place } from "../types";
import { isInside, parentUri, sameUri, trimSlash } from "../utils/paths";

type Listing = {
	entries: Entry[];
	/** The folder couldn't be read (no permission, or it is gone). */
	error: boolean;
	/** The first listing has been made. */
	loaded: boolean;
};

/**
 * Which folder the Files tab is showing, and what is in it. The listing is
 * read again when the app comes back to the foreground (the person may have
 * just allowed access, or added files from another app) and on request.
 */
export function useBrowser() {
	const [uri, setUri] = useState(INTERNAL_ROOT);
	const [listing, setListing] = useState<Listing>({
		entries: [],
		error: false,
		loaded: false,
	});
	const [tick, setTick] = useState(0);
	const [placesTick, setPlacesTick] = useState(0);

	// Places can change (an SD card goes in): look again on refresh.
	const places = useMemo<Place[]>(() => findPlaces(), [placesTick]);

	useEffect(() => {
		clearMetaCache();
		try {
			setListing({ entries: listFolder(uri), error: false, loaded: true });
		} catch {
			setListing({ entries: [], error: true, loaded: true });
		}
	}, [uri, tick]);

	useEffect(() => {
		const sub = AppState.addEventListener("change", (state) => {
			if (state === "active") {
				setTick((n) => n + 1);
				setPlacesTick((n) => n + 1);
			}
		});
		return () => sub.remove();
	}, []);

	// The top of the place we are in: internal storage, or the SD card.
	const root = useMemo(() => {
		const volume = places.find(
			(p) => p.id.startsWith("volume:") && isInside(uri, p.uri),
		);
		return volume ? trimSlash(volume.uri) : INTERNAL_ROOT;
	}, [places, uri]);

	const open = useCallback((target: string) => setUri(trimSlash(target)), []);
	const canGoUp = !sameUri(uri, root);
	const up = useCallback(() => {
		if (!sameUri(uri, root)) setUri(parentUri(uri));
	}, [uri, root]);
	const refresh = useCallback(() => {
		setTick((n) => n + 1);
		setPlacesTick((n) => n + 1);
	}, []);

	return { uri, root, places, ...listing, canGoUp, open, up, refresh };
}
