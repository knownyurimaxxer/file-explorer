// Config plugin: sets android:requestLegacyExternalStorage="true" on the
// <application> tag.
//
// Why: on Android 10 an app built for a newer Android version gets "scoped
// storage" and can't read /storage/emulated/0 even with the storage permission
// granted. Expo Go is built for an older target, which is why browsing works
// there but not in a standalone build. This flag opts out of scoped storage on
// Android 10 (Android 11+ ignores it and uses All files access instead).
const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withLegacyStorage(config) {
	return withAndroidManifest(config, (c) => {
		const app = c.modResults.manifest.application?.[0];
		if (app) app.$["android:requestLegacyExternalStorage"] = "true";
		return c;
	});
};
