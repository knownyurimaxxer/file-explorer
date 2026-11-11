import type { FileKind, StatCategory } from "../types";
import { extensionOf } from "./paths";

const KINDS: Record<Exclude<FileKind, "folder" | "other">, string[]> = {
	image: "jpg jpeg png gif webp bmp heic heif avif svg ico tif tiff dng raw".split(
		" ",
	),
	video: "mp4 mkv webm avi mov 3gp m4v wmv flv mpg mpeg".split(" "),
	audio: "mp3 wav flac ogg oga opus m4a aac wma amr mid midi".split(" "),
	document:
		"pdf doc docx xls xlsx ppt pptx odt ods odp txt rtf csv md epub mobi azw3 log".split(
			" ",
		),
	archive: "zip rar 7z tar gz tgz bz2 xz zst iso".split(" "),
	apk: "apk apks xapk apkm aab".split(" "),
	code: "js jsx ts tsx json xml html htm css py java kt c cpp h cs go rs sh yml yaml toml ini sql php rb".split(
		" ",
	),
};

const KIND_BY_EXTENSION: Record<string, FileKind> = {};
for (const [kind, list] of Object.entries(KINDS))
	for (const ext of list) KIND_BY_EXTENSION[ext] = kind as FileKind;

export function kindOf(name: string, isDirectory: boolean): FileKind {
	if (isDirectory) return "folder";
	return KIND_BY_EXTENSION[extensionOf(name)] ?? "other";
}

/** Code files count as documents on the Storage tab; folders never reach it. */
export function statCategory(kind: FileKind): StatCategory {
	if (kind === "code") return "document";
	if (kind === "folder") return "other";
	return kind;
}

/** Pictures the phone's image view can draw as a small preview. */
const PREVIEWABLE = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp"]);
export const canPreview = (name: string) =>
	PREVIEWABLE.has(extensionOf(name));

const MIME: Record<string, string> = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	webp: "image/webp",
	bmp: "image/bmp",
	heic: "image/heic",
	heif: "image/heif",
	avif: "image/avif",
	svg: "image/svg+xml",
	tif: "image/tiff",
	tiff: "image/tiff",
	mp4: "video/mp4",
	mkv: "video/x-matroska",
	webm: "video/webm",
	avi: "video/x-msvideo",
	mov: "video/quicktime",
	"3gp": "video/3gpp",
	m4v: "video/x-m4v",
	wmv: "video/x-ms-wmv",
	flv: "video/x-flv",
	mpg: "video/mpeg",
	mpeg: "video/mpeg",
	mp3: "audio/mpeg",
	wav: "audio/x-wav",
	flac: "audio/flac",
	ogg: "audio/ogg",
	oga: "audio/ogg",
	opus: "audio/ogg",
	m4a: "audio/mp4",
	aac: "audio/aac",
	wma: "audio/x-ms-wma",
	amr: "audio/amr",
	mid: "audio/midi",
	midi: "audio/midi",
	pdf: "application/pdf",
	doc: "application/msword",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	ppt: "application/vnd.ms-powerpoint",
	pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	odt: "application/vnd.oasis.opendocument.text",
	ods: "application/vnd.oasis.opendocument.spreadsheet",
	odp: "application/vnd.oasis.opendocument.presentation",
	rtf: "application/rtf",
	epub: "application/epub+zip",
	csv: "text/csv",
	md: "text/markdown",
	html: "text/html",
	htm: "text/html",
	xml: "text/xml",
	json: "application/json",
	zip: "application/zip",
	rar: "application/vnd.rar",
	"7z": "application/x-7z-compressed",
	tar: "application/x-tar",
	gz: "application/gzip",
	apk: "application/vnd.android.package-archive",
};

/**
 * The type to hand to the system when opening a file, so it can pick the app.
 * Plain-text-like files (logs, code, settings) go as text; anything unknown
 * goes as the "any type" wildcard and the system works it out.
 */
export function mimeOf(name: string): string {
	const ext = extensionOf(name);
	if (MIME[ext]) return MIME[ext];
	const kind = KIND_BY_EXTENSION[ext];
	if (kind === "code" || ext === "txt" || ext === "log") return "text/plain";
	return "*/*";
}
