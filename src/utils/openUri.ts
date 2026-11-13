/**
 * The address a file gets when it is handed to another app to open.
 *
 * Android refuses plain file:// addresses, so the app has its own file provider
 * (see plugins/withOpenFileProvider.js) that covers the whole storage, the SD
 * card included. A file at /storage/emulated/0/Download/a b.pdf becomes
 *   content://<app id>.openfile/root/storage/emulated/0/Download/a%20b.pdf
 */

/** Added to the app id to make the provider's authority. Keep in sync with the plugin. */
export const OPEN_PROVIDER_SUFFIX = ".openfile";

/** The content:// address for a file:// one, or null if it isn't a plain file address. */
export function providerUriFor(fileUri: string, appId: string): string | null {
	if (!fileUri.startsWith("file://")) return null;
	let path = fileUri.slice("file://".length);
	try {
		path = decodeURIComponent(path);
	} catch {
		/* wasn't percent-encoded: use it as it is */
	}
	if (!path.startsWith("/")) return null;
	const encoded = path.slice(1).split("/").map(encodeURIComponent).join("/");
	return `content://${appId}${OPEN_PROVIDER_SUFFIX}/root/${encoded}`;
}
