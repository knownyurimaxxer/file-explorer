import type { MessageKey } from "./i18n/locales/en";
import { Settings, Theme } from "./types";

/** The name shown in the app (the launcher name itself is in app.json). */
export const APP_NAME = "File Explorer";
/** Same as android.package in app.json: needed to open this app's own settings page. */
export const APP_ID = "com.knownyurimaxxer.fileexplorer";

/** Shared storage as the system shows it to apps (the phone's "Internal storage"). */
export const INTERNAL_ROOT = "file:///storage/emulated/0";
/** Where Android lists every storage volume (internal, SD cards...). */
export const VOLUMES_DIR = "file:///storage";
/** Entries of VOLUMES_DIR that are not volumes of their own. */
export const NOT_VOLUMES = ["emulated", "self"];

/** Folders of the internal storage offered as quick places, if they exist. */
export const PLACE_FOLDERS: {
	id: string;
	folder: string;
	label: MessageKey;
}[] = [
	{ id: "downloads", folder: "Download", label: "place.downloads" },
	{ id: "camera", folder: "DCIM", label: "place.camera" },
	{ id: "documents", folder: "Documents", label: "place.documents" },
	{ id: "pictures", folder: "Pictures", label: "place.pictures" },
	{ id: "music", folder: "Music", label: "place.music" },
	{ id: "movies", folder: "Movies", label: "place.movies" },
];

/** Search: results kept, wait after typing, and how a long walk shares the thread. */
export const SEARCH = { maxResults: 300, debounceMs: 250 } as const;
export const WALK = { sliceMs: 12, maxDepth: 40 } as const;
/** Storage scan: how often the numbers on screen are refreshed. */
export const SCAN_REFRESH_MS = 250;

export const PRESETS: Record<string, Theme> = {
	Navy: {
		background: "#001935",
		card: "#FFFFFF",
		text: "#222222",
		accent: "#00B8FF",
	},
	Midnight: {
		background: "#0D0D0F",
		card: "#1C1C21",
		text: "#EDEDED",
		accent: "#FF6B9D",
	},
	Paper: {
		background: "#F2EFE9",
		card: "#FFFFFF",
		text: "#2B2B2B",
		accent: "#E4572E",
	},
	Forest: {
		background: "#12251B",
		card: "#1D3A2A",
		text: "#E6F2E9",
		accent: "#9BE564",
	},
	Grape: {
		background: "#2A1B3D",
		card: "#3D2A57",
		text: "#F3E8FF",
		accent: "#FFD166",
	},
};

export const SWATCHES: Record<keyof Theme, string[]> = {
	background: [
		"#001935",
		"#0D0D0F",
		"#12251B",
		"#2A1B3D",
		"#F2EFE9",
		"#1B2A41",
		"#3B1F2B",
		"#FFFFFF",
	],
	card: [
		"#FFFFFF",
		"#1C1C21",
		"#1D3A2A",
		"#3D2A57",
		"#FFF7E6",
		"#24385C",
		"#4A2838",
		"#F0F0F0",
	],
	text: [
		"#222222",
		"#EDEDED",
		"#E6F2E9",
		"#F3E8FF",
		"#2B2B2B",
		"#FFFFFF",
		"#FFD9A0",
		"#000000",
	],
	accent: [
		"#00B8FF",
		"#FF6B9D",
		"#E4572E",
		"#9BE564",
		"#FFD166",
		"#B388FF",
		"#FF8A00",
		"#00E5A8",
	],
};

/** Texts (see i18n) for the color rows in Settings. */
export const ROLE_LABELS: Record<keyof Theme, MessageKey> = {
	background: "role.background",
	card: "role.card",
	text: "role.text",
	accent: "role.accent",
};

/** Texts (see i18n) for the preset names. A preset without one shows its own name. */
export const PRESET_LABELS: Record<string, MessageKey> = {
	Navy: "preset.navy",
	Midnight: "preset.midnight",
	Paper: "preset.paper",
	Forest: "preset.forest",
	Grape: "preset.grape",
};

/** Every moment the app can vibrate. Each one has its own switch in Settings. */
export const HAPTIC_TRIGGERS = [
	"done",
	"settings",
	"tab",
	"folder",
	"up",
	"file",
	"place",
	"refresh",
	"scan",
	"action",
	"error",
] as const;
export type HapticTrigger = (typeof HAPTIC_TRIGGERS)[number];

/**
 * Steps of the vibration-strength slider. 0 is the softest (and the default);
 * the top step is the app's original vibration.
 */
export const HAPTIC_STRENGTH = { min: 0, max: 5, default: 0 } as const;

export const DEFAULT_SETTINGS: Settings = {
	theme: PRESETS["Navy"],
	language: "system",
	soundsEnabled: true,
	hapticsEnabled: false,
	haptics: Object.fromEntries(
		HAPTIC_TRIGGERS.map((k) => [k, true]),
	) as Record<HapticTrigger, boolean>,
	hapticLevel: HAPTIC_STRENGTH.default,
	accessAsked: false,
};

export const LINKS = {
	developer: "https://www.tumblr.com/knownyurimaxxer",
	kofi: "https://ko-fi.com/knownyurimaxxer",
	ionicons: "https://ionic.io/ionicons",
	ionic: "https://ionic.io/",
} as const;
