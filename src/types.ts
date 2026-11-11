export type Theme = {
	background: string;
	card: string;
	text: string;
	accent: string;
};

import type { HapticTrigger } from "./constants";
import type { MessageKey } from "./i18n/locales/en";

export type Settings = {
	theme: Theme;
	/** "system" (follow the phone), or the code of one of the languages in i18n/LANGUAGES. */
	language: string;
	/** Show files and folders whose name starts with a dot. Off by default. */
	showHidden: boolean;
	/** Master switch for vibration feedback. Off by default. */
	hapticsEnabled: boolean;
	/** Which haptic triggers are on (only used while hapticsEnabled is on). */
	haptics: Record<HapticTrigger, boolean>;
	/** How strong the vibration is: 0 (softest) to HAPTIC_STRENGTH.max (the original strength). Android only.
	 *  Saved under its own name so the scale of an earlier version isn't misread. */
	hapticLevel: number;
	/** Not shown in Settings: true once the "allow access to all files" notice has been acted on. */
	accessAsked: boolean;
};

export type UpdateSetting = <K extends keyof Settings>(
	key: K,
	value: Settings[K],
) => void;

/** What a file or folder is, for its icon and for the Storage tab. */
export type FileKind =
	| "folder"
	| "image"
	| "video"
	| "audio"
	| "document"
	| "archive"
	| "apk"
	| "code"
	| "other";

/** The groups the Storage tab adds sizes up into. */
export type StatCategory =
	| "image"
	| "video"
	| "audio"
	| "document"
	| "archive"
	| "apk"
	| "other";

/** One line of a folder listing. */
export type Entry = {
	name: string;
	/** Full URI (file:///storage/emulated/0/...). */
	uri: string;
	isDirectory: boolean;
	kind: FileKind;
};

/** A search result: an entry plus where it was found. */
export type SearchHit = Entry & {
	/** URI of the folder that holds it. */
	parentUri: string;
	/** How many folders below the place the search started. 0 = directly inside it. */
	depth: number;
};

/** A quick-access location shown as a chip at the top of the Files tab. */
export type Place = {
	id: string;
	/** Text (see i18n) for the chip. */
	labelKey: MessageKey;
	uri: string;
};
