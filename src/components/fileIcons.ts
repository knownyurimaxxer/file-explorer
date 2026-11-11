import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";
import type { FileKind, StatCategory } from "../types";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export const KIND_ICON: Record<FileKind, IconName> = {
	folder: "folder",
	image: "image-outline",
	video: "videocam-outline",
	audio: "musical-notes-outline",
	document: "document-text-outline",
	archive: "archive-outline",
	apk: "logo-android",
	code: "code-slash-outline",
	other: "document-outline",
};

export const CATEGORY_ICON: Record<StatCategory, IconName> = {
	image: "image-outline",
	video: "videocam-outline",
	audio: "musical-notes-outline",
	document: "document-text-outline",
	archive: "archive-outline",
	apk: "logo-android",
	other: "document-outline",
};
