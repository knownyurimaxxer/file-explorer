/**
 * English: the master list of every text in the app. Other languages are
 * typed against it (see es.ts), so a missing or misspelled key is a compile
 * error. Texts can hold {placeholders}, filled in by the code that uses them.
 * To add a language: copy this file to xx.ts, translate the values, and add one
 * line to LANGUAGES in ../index.ts. Don't translate the keys or the {placeholders}.
 */
export const en = {
	// shared
	"common.cancel": "Cancel",
	"common.continue": "Continue",
	"common.done": "Done",
	"common.close": "Close",

	// tabs
	"tab.files": "Files",
	"tab.storage": "Storage",

	// files
	"files.search": "Search in this folder",
	"files.searching": "Searching…",
	"files.found": "{n} found",
	"files.foundMore": "Showing the first {n}. Try a more specific search.",
	"files.noMatch": "Nothing found.",
	"files.empty": "This folder is empty.",
	"files.loading": "Loading…",
	"files.unreadable": "Can't read this folder.",
	"files.accessBanner":
		"To browse your storage, this app needs “All files access”. Tap to allow it.",
	"files.accessHint":
		"Files missing? Make sure “All files access” is allowed for this app.",
	"files.accessButton": "Allow access",
	"files.up": "Up one level",
	"files.clearSearch": "Clear search",
	"files.folder": "Folder",
	"files.openFailedTitle": "Couldn't open the file",
	"files.noApp": "No app on this phone can open this type of file.",
	"files.openError": "Something went wrong while opening it.",

	// selecting
	"select.count": "{n} selected",
	"select.cancel": "Cancel selection",
	"select.all": "Select all",

	// actions
	"action.copy": "Copy",
	"action.move": "Move",
	"action.delete": "Delete",
	"clip.copy": "Copy: {n}",
	"clip.move": "Move: {n}",
	"clip.paste": "Paste here",

	// delete
	"delete.title": "Delete for good?",
	"delete.body":
		"Selected: {n}. They'll be deleted permanently and can't be recovered.",

	// working
	"op.copying": "Copying…",
	"op.moving": "Moving…",
	"op.deleting": "Deleting…",
	"op.progress": "{done} of {total}",
	"op.stop": "Stop",
	"op.problems": "Finished, with problems",
	"op.stopped": "Stopped",
	"op.completed": "Completed: {n}",
	"op.notDone": "Not done:",
	"op.more": "…and {n} more",
	"op.cantTitle": "Can't do that",

	// problems
	"op.needWrite":
		"To copy, move or delete files, allow this app to access your storage.",
	"op.err.itself": "A folder can't go inside itself.",
	"op.err.sd": "No access to the SD card.",
	"op.err.other": "Something went wrong.",

	// sd card
	"sd.title": "Allow access to the SD card",
	"sd.body":
		"Android only lets apps change files on an SD card once you allow it. On the next screen, choose the SD card's main folder and tap “Use this folder”. You only need to do this once.",
	"sd.choose": "Choose folder",
	"sd.wrong":
		"That isn't the main folder of the SD card. Try again and choose the top level.",

	// quick places
	"place.internal": "Internal storage",
	"place.sd": "SD card",
	"place.downloads": "Downloads",
	"place.camera": "Camera",
	"place.documents": "Documents",
	"place.pictures": "Pictures",
	"place.music": "Music",
	"place.movies": "Movies",

	// storage
	"storage.device": "Device storage",
	"storage.usedOf": "{used} used of {total}",
	"storage.free": "{free} free",
	"storage.unavailable": "Couldn't read the storage numbers.",
	"storage.analyze": "Analyze",
	"storage.analyzeHint":
		"Scan your files to see what is taking up space. It can take a while on a full phone.",
	"storage.again": "Scan again",
	"storage.stop": "Stop",
	"storage.scanning": "Scanning… {files} files · {size}",
	"storage.stopped": "Scan stopped, so these numbers are partial.",
	"storage.scanned": "{files} files · {size}",
	"storage.byType": "By type",
	"storage.byFolder": "Biggest folders",
	"storage.rootFiles": "Loose files",
	"storage.skipped": "Some folders couldn't be read and were skipped.",
	"storage.note":
		"Only what this app is allowed to read is counted, so the numbers can differ from the system's.",
	"kind.image": "Images",
	"kind.video": "Videos",
	"kind.audio": "Audio",
	"kind.document": "Documents",
	"kind.archive": "Archives",
	"kind.apk": "Apps",
	"kind.other": "Other",

	// settings
	"settings.title": "Settings",
	"settings.language": "Language",
	"settings.languageHint":
		"“System default” follows your phone's language, and uses English if your language isn't available.",
	"settings.languageSystem": "System default",
	"settings.files": "Files",
	"settings.showHidden": "Show hidden files",
	"settings.showHiddenHint": "Files and folders whose name starts with a dot.",
	"settings.haptics": "Haptics",
	"settings.hapticsToggle": "Haptic feedback",
	"settings.hapticsHint": "Short vibrations when you tap buttons.",
	"settings.hapticsTriggers": "Choose what vibrates",
	"settings.hapticsStrength": "Vibration strength",
	"settings.hapticsStrengthHint": "Swipe right for a more intense vibration.",
	"haptics.done": "Done button",
	"haptics.settings": "Settings button",
	"haptics.tab": "Switching tabs",
	"haptics.folder": "Opening a folder",
	"haptics.up": "Going up a folder",
	"haptics.file": "Opening a file",
	"haptics.place": "Quick places (Downloads, Camera…)",
	"haptics.refresh": "Pull to refresh",
	"haptics.scan": "Scan buttons (Storage)",
	"haptics.action": "Other buttons",
	"haptics.error": "Errors",
	"settings.theme": "Theme",
	"settings.presets": "Presets",
	"role.background": "Background",
	"role.card": "Cards",
	"role.text": "Text",
	"role.accent": "Contrast / accent",
	"color.custom": "Custom color",
	"color.hue": "Hue",
	"color.saturation": "Saturation",
	"color.lightness": "Lightness",
	"color.hex": "Hex code",
	"color.apply": "Apply",
	"settings.themeTransfer": "Share themes",
	"settings.exportTheme": "Export theme",
	"settings.importTheme": "Import theme",
	"settings.importHint":
		"Paste a theme exported from this app or from any app that uses the same color names: background, card, text and accent.",
	"settings.importInvalid":
		"That isn't a valid theme. It needs background, card, text and accent, each as a #RRGGBB color.",
	"settings.importButton": "Import",
	"preset.navy": "Navy",
	"preset.midnight": "Midnight",
	"preset.paper": "Paper",
	"preset.forest": "Forest",
	"preset.grape": "Grape",
	"settings.reset": "Reset",
	"settings.resetHint":
		"Puts language, hidden files, haptics and colors back to their defaults. Your files are never touched.",
	"settings.resetButton": "Reset settings",
	"settings.resetTitle": "Reset settings?",
	"settings.resetBody":
		"Language, hidden files, haptics and colors go back to their defaults.",

	// about
	"credits.about": "About",
	"about.tagline": "Browse, search and see what's using your space.",
	"credits.madeBy": "Made by {developer}.",
	"credits.icons": "{ionicons} by {ionic}.",
	"credits.kofi": "If you ever feel like it, I have a Ko-fi!",
} as const;

export type MessageKey = keyof typeof en;
/** What every language file must provide: all the keys, as plain text. */
export type Messages = Record<MessageKey, string>;
