/**
 * Hidden files, the Unix/Android way: a name that starts with a dot
 * (".thumbnails", ".nomedia"). They are kept out of the Files tab and of the
 * search unless the "Show hidden files" setting is on.
 */

export const isHiddenName = (name: string): boolean => name.startsWith(".");

/** The entries to show: all of them when hidden files are on, otherwise without the dotted ones. */
export function visibleOnly<T extends { name: string }>(
	items: T[],
	showHidden: boolean,
): T[] {
	return showHidden ? items : items.filter((i) => !isHiddenName(i.name));
}
