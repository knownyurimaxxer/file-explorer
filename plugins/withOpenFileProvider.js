// Config plugin: gives the app its own FileProvider, so a file anywhere on the
// storage (the SD card too) can be handed to another app to open.
//
// The provider's authority is "<package>.openfile" and it serves the whole file
// system under the name "root", so /storage/emulated/0/a.pdf is reachable as
// content://<package>.openfile/root/storage/emulated/0/a.pdf. The app builds
// that address itself (src/utils/openUri.ts). Keep the suffix in sync there.
const fs = require("node:fs");
const path = require("node:path");
const {
	withAndroidManifest,
	withDangerousMod,
} = require("expo/config-plugins");

const AUTHORITY_SUFFIX = ".openfile";
const PATHS_NAME = "open_file_paths";
const PATHS_XML = `<?xml version="1.0" encoding="utf-8"?>
<paths>
    <root-path name="root" path="/" />
</paths>
`;

function addProvider(config) {
	return withAndroidManifest(config, (c) => {
		const app = c.modResults.manifest.application?.[0];
		const pkg = config.android?.package;
		if (!app || !pkg) return c;
		const authority = pkg + AUTHORITY_SUFFIX;
		app.provider = app.provider ?? [];
		if (!app.provider.some((p) => p.$["android:authorities"] === authority)) {
			app.provider.push({
				$: {
					"android:name": "androidx.core.content.FileProvider",
					"android:authorities": authority,
					"android:exported": "false",
					"android:grantUriPermissions": "true",
				},
				"meta-data": [
					{
						$: {
							"android:name": "android.support.FILE_PROVIDER_PATHS",
							"android:resource": `@xml/${PATHS_NAME}`,
						},
					},
				],
			});
		}
		return c;
	});
}

function writePaths(config) {
	return withDangerousMod(config, [
		"android",
		async (c) => {
			const dir = path.join(
				c.modRequest.platformProjectRoot,
				"app/src/main/res/xml",
			);
			fs.mkdirSync(dir, { recursive: true });
			fs.writeFileSync(path.join(dir, `${PATHS_NAME}.xml`), PATHS_XML);
			return c;
		},
	]);
}

module.exports = function withOpenFileProvider(config) {
	return writePaths(addProvider(config));
};
