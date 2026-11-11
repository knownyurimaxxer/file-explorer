import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, HAPTIC_STRENGTH } from "../constants";
import { getAllSettings, resetDb, setSetting } from "../storage/db";
import { Settings, UpdateSetting } from "../types";
import { clampLimit } from "../utils/limits";

export function useSettings() {
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
	const [ready, setReady] = useState(false);
	// The latest settings, for reset() (which is created once).
	const latest = useRef(settings);
	latest.current = settings;

	useEffect(() => {
		(async () => {
			const saved = await getAllSettings();
			const get = <T>(key: string, fallback: T): T =>
				key in saved ? (saved[key] as T) : fallback;
			const theme = get("theme", DEFAULT_SETTINGS.theme);
			const language = get("language", DEFAULT_SETTINGS.language);
			const showHidden = get("showHidden", DEFAULT_SETTINGS.showHidden);
			const hapticsEnabled = get(
				"hapticsEnabled",
				DEFAULT_SETTINGS.hapticsEnabled,
			);
			const savedHaptics = get<unknown>("haptics", null);
			const hapticLevel = get<unknown>(
				"hapticLevel",
				DEFAULT_SETTINGS.hapticLevel,
			);
			const accessAsked = get("accessAsked", DEFAULT_SETTINGS.accessAsked);
			setSettings({
				theme: { ...DEFAULT_SETTINGS.theme, ...theme },
				language,
				showHidden,
				hapticsEnabled,
				// A trigger added in a later version starts on, like the others.
				haptics: {
					...DEFAULT_SETTINGS.haptics,
					...(savedHaptics && typeof savedHaptics === "object"
						? savedHaptics
						: {}),
				},
				hapticLevel: clampLimit(
					hapticLevel,
					HAPTIC_STRENGTH.min,
					HAPTIC_STRENGTH.max,
					HAPTIC_STRENGTH.default,
				),
				accessAsked,
			});
			setReady(true);
		})();
	}, []);

	const update: UpdateSetting = useCallback((key, value) => {
		setSettings((s) => ({ ...s, [key]: value }));
		setSetting(key, value).catch((e) =>
			console.warn("Could not save setting", key, e),
		);
	}, []);

	/**
	 * Puts every setting back to its default. The "access asked" note is not a
	 * preference, so it stays: resetting colors shouldn't bring the notice back.
	 */
	const reset = useCallback(async () => {
		const asked = latest.current.accessAsked;
		await resetDb();
		setSettings({ ...DEFAULT_SETTINGS, accessAsked: asked });
		if (asked) setSetting("accessAsked", true).catch(() => {});
	}, []);

	return { settings, ready, update, reset };
}
