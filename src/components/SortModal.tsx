import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../i18n/I18nContext";
import type { MessageKey } from "../i18n/locales/en";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../types";
import { feedback } from "../utils/feedback";
import { readableOn } from "../utils/format";
import { NATURAL_DESC, SORT_BYS, type SortBy } from "../utils/sorting";

type Props = {
	visible: boolean;
	sortBy: SortBy;
	sortDesc: boolean;
	onChange: (by: SortBy, desc: boolean) => void;
	onClose: () => void;
};

const BY_LABEL: Record<SortBy, MessageKey> = {
	name: "sort.name",
	date: "sort.date",
	size: "sort.size",
};

// The two directions, worded for what is being sorted.
const ORDER_LABEL: Record<SortBy, { asc: MessageKey; desc: MessageKey }> = {
	name: { asc: "sort.nameAsc", desc: "sort.nameDesc" },
	date: { asc: "sort.dateAsc", desc: "sort.dateDesc" },
	size: { asc: "sort.sizeAsc", desc: "sort.sizeDesc" },
};

/** Choose what the Files tab sorts by, and which way round. Changes apply straight away. */
export default function SortModal({
	visible,
	sortBy,
	sortDesc,
	onChange,
	onClose,
}: Props) {
	const theme = useTheme();
	const { t } = useI18n();
	const s = useMemo(() => makeStyles(theme), [theme]);

	const option = (label: string, selected: boolean, onPress: () => void) => (
		<Pressable
			key={label}
			accessibilityRole="radio"
			accessibilityState={{ selected }}
			onPress={() => {
				feedback("action");
				onPress();
			}}
			style={({ pressed }) => [s.option, pressed && s.pressed]}
		>
			<Ionicons
				name={selected ? "radio-button-on" : "radio-button-off"}
				size={22}
				color={selected ? theme.accent : theme.text + "88"}
			/>
			<Text style={s.optionText}>{label}</Text>
		</Pressable>
	);

	return (
		<Modal
			transparent
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={s.backdrop} onPress={onClose}>
				{/* a tap on the card itself must not close it */}
				<Pressable style={s.card} onPress={() => {}}>
					<Text style={s.title}>{t("sort.title")}</Text>

					<Text style={s.section}>{t("sort.by")}</Text>
					{SORT_BYS.map((by) =>
						option(t(BY_LABEL[by]), by === sortBy, () => {
							// Picking a new way starts with the direction you most likely want.
							if (by !== sortBy) onChange(by, NATURAL_DESC[by]);
						}),
					)}

					<Text style={s.section}>{t("sort.order")}</Text>
					{option(t(ORDER_LABEL[sortBy].asc), !sortDesc, () =>
						onChange(sortBy, false),
					)}
					{option(t(ORDER_LABEL[sortBy].desc), sortDesc, () =>
						onChange(sortBy, true),
					)}

					<Pressable
						accessibilityRole="button"
						onPress={onClose}
						style={({ pressed }) => [
							s.button,
							pressed && s.pressed,
						]}
					>
						<Text style={s.buttonText}>{t("common.close")}</Text>
					</Pressable>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		backdrop: {
			flex: 1,
			backgroundColor: "rgba(0,0,0,0.55)",
			alignItems: "center",
			justifyContent: "center",
			padding: 24,
		},
		card: {
			width: "100%",
			maxWidth: 380,
			backgroundColor: t.card,
			borderRadius: 14,
			padding: 20,
		},
		title: { color: t.text, fontSize: 18, fontWeight: "700" },
		section: {
			color: t.text + "AA",
			fontSize: 12,
			fontWeight: "700",
			textTransform: "uppercase",
			letterSpacing: 0.5,
			marginTop: 16,
			marginBottom: 2,
		},
		option: {
			flexDirection: "row",
			alignItems: "center",
			gap: 12,
			paddingVertical: 10,
		},
		optionText: { color: t.text, fontSize: 16 },
		pressed: { opacity: 0.7 },
		button: {
			alignSelf: "flex-end",
			backgroundColor: t.accent,
			borderRadius: 20,
			paddingHorizontal: 20,
			paddingVertical: 10,
			marginTop: 16,
		},
		buttonText: {
			color: readableOn(t.accent),
			fontSize: 15,
			fontWeight: "700",
		},
	});
