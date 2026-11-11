import { memo, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../i18n/I18nContext";
import { readMeta } from "../storage/fs";
import { useTheme } from "../theme/ThemeContext";
import type { Entry, Theme } from "../types";
import { canPreview } from "../utils/fileTypes";
import { formatBytes, formatDate, readableOn } from "../utils/format";
import { KIND_ICON } from "./fileIcons";

type Props = {
	entry: Entry;
	/** A line to show instead of the size and date (search results: where it was found). */
	subtitle?: string;
	onPress: (entry: Entry) => void;
};

const SIZE = 44;

/** One file or folder, drawn like a card of the feed. */
function FileRow({ entry, subtitle, onPress }: Props) {
	const theme = useTheme();
	const { t, locale } = useI18n();
	const s = useMemo(() => makeStyles(theme), [theme]);
	// Details are read only for the rows that get drawn, and remembered.
	const meta = useMemo(
		() => (entry.isDirectory ? null : readMeta(entry.uri)),
		[entry],
	);

	const detail =
		subtitle ??
		(entry.isDirectory
			? t("files.folder")
			: [
					meta?.size != null ? formatBytes(meta.size, locale) : null,
					meta?.modifiedAt ? formatDate(meta.modifiedAt, locale) : null,
				]
					.filter(Boolean)
					.join(" · "));

	return (
		<Pressable
			accessibilityRole="button"
			onPress={() => onPress(entry)}
			style={({ pressed }) => [s.card, pressed && s.pressed]}
		>
			<View style={[s.icon, entry.isDirectory ? s.iconFolder : s.iconFile]}>
				{entry.kind === "image" && canPreview(entry.name) ? (
					<Image
						source={{ uri: entry.uri }}
						style={s.thumb}
						resizeMode="cover"
						resizeMethod="resize"
					/>
				) : (
					<Ionicons
						name={KIND_ICON[entry.kind]}
						size={entry.isDirectory ? 26 : 24}
						color={
							entry.isDirectory ? readableOn(theme.accent) : theme.text
						}
					/>
				)}
			</View>
			<View style={s.texts}>
				<Text style={s.name} numberOfLines={1}>
					{entry.name}
				</Text>
				{detail !== "" && (
					<Text style={s.meta} numberOfLines={1}>
						{detail}
					</Text>
				)}
			</View>
			{entry.isDirectory && (
				<Ionicons
					name="chevron-forward"
					size={20}
					color={theme.text + "99"}
				/>
			)}
		</Pressable>
	);
}

export default memo(FileRow);

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		card: {
			flexDirection: "row",
			alignItems: "center",
			gap: 12,
			backgroundColor: t.card,
			borderRadius: 8,
			padding: 10,
			marginBottom: 10,
		},
		pressed: { opacity: 0.7 },
		icon: {
			width: SIZE,
			height: SIZE,
			borderRadius: 6,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
		},
		iconFolder: { backgroundColor: t.accent },
		iconFile: { backgroundColor: t.text + "14" },
		thumb: { width: SIZE, height: SIZE },
		texts: { flex: 1 },
		name: { color: t.text, fontWeight: "700", fontSize: 15 },
		meta: { color: t.text + "99", fontSize: 12, marginTop: 2 },
	});
