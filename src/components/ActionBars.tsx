import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../types";
import { feedback } from "../utils/feedback";
import { formatCount, readableOn } from "../utils/format";
import type { IconName } from "./fileIcons";

const DANGER = "#D64545";

type SelectionProps = {
	onCopy: () => void;
	onMove: () => void;
	onDelete: () => void;
};

/** Copy, Move and Delete for what is selected. */
export function SelectionActions({ onCopy, onMove, onDelete }: SelectionProps) {
	const theme = useTheme();
	const { t } = useI18n();
	const insets = useSafeAreaInsets();
	const s = useMemo(() => makeStyles(theme), [theme]);

	const button = (
		icon: IconName,
		label: string,
		onPress: () => void,
		color: string = theme.text,
	) => (
		<Pressable
			accessibilityRole="button"
			onPress={() => {
				feedback("action");
				onPress();
			}}
			style={({ pressed }) => [s.action, pressed && s.pressed]}
		>
			<Ionicons name={icon} size={24} color={color} />
			<Text style={[s.actionText, { color }]}>{label}</Text>
		</Pressable>
	);

	return (
		<View
			style={[
				s.bar,
				{
					paddingLeft: Math.max(insets.left, 12),
					paddingRight: Math.max(insets.right, 12),
				},
			]}
		>
			{button("copy-outline", t("action.copy"), onCopy)}
			{button("cut-outline", t("action.move"), onMove)}
			{button("trash-outline", t("action.delete"), onDelete, DANGER)}
		</View>
	);
}

type PasteProps = {
	mode: "copy" | "move";
	count: number;
	onPaste: () => void;
	onCancel: () => void;
};

/** What is waiting to be pasted, with Paste here and Cancel. */
export function PasteBar({ mode, count, onPaste, onCancel }: PasteProps) {
	const theme = useTheme();
	const { t, locale } = useI18n();
	const insets = useSafeAreaInsets();
	const s = useMemo(() => makeStyles(theme), [theme]);
	const n = formatCount(count, locale);

	return (
		<View
			style={[
				s.bar,
				s.pasteBar,
				{
					paddingLeft: Math.max(insets.left, 12),
					paddingRight: Math.max(insets.right, 12),
				},
			]}
		>
			<Ionicons
				name={mode === "copy" ? "copy-outline" : "cut-outline"}
				size={22}
				color={theme.text}
			/>
			<Text style={s.pasteLabel} numberOfLines={1}>
				{mode === "copy" ? t("clip.copy", { n }) : t("clip.move", { n })}
			</Text>
			<Pressable
				accessibilityRole="button"
				onPress={() => {
					feedback("up");
					onCancel();
				}}
				style={({ pressed }) => [s.textButton, pressed && s.pressed]}
			>
				<Text style={s.textButtonText}>{t("common.cancel")}</Text>
			</Pressable>
			<Pressable
				accessibilityRole="button"
				onPress={() => {
					feedback("action");
					onPaste();
				}}
				style={({ pressed }) => [s.pasteButton, pressed && s.pressed]}
			>
				<Text style={s.pasteButtonText}>{t("clip.paste")}</Text>
			</Pressable>
		</View>
	);
}

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		bar: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: t.card,
			borderTopWidth: StyleSheet.hairlineWidth,
			borderTopColor: t.text + "33",
			paddingVertical: 8,
		},
		pressed: { opacity: 0.7 },
		action: { flex: 1, alignItems: "center", gap: 2, paddingVertical: 4 },
		actionText: { fontSize: 12, fontWeight: "600" },
		pasteBar: { gap: 10 },
		pasteLabel: {
			flex: 1,
			color: t.text,
			fontSize: 15,
			fontWeight: "700",
		},
		textButton: { paddingHorizontal: 10, paddingVertical: 10 },
		textButtonText: { color: t.text, fontSize: 15, fontWeight: "600" },
		pasteButton: {
			backgroundColor: t.accent,
			borderRadius: 20,
			paddingHorizontal: 18,
			paddingVertical: 10,
		},
		pasteButtonText: {
			color: readableOn(t.accent),
			fontSize: 15,
			fontWeight: "700",
		},
	});
