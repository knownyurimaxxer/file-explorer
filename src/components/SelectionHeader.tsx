import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../theme/ThemeContext";
import { feedback } from "../utils/feedback";
import { formatCount, readableOn } from "../utils/format";

type Props = {
	count: number;
	allSelected: boolean;
	onCancel: () => void;
	onToggleAll: () => void;
};

/** Takes the place of the search bar while files are being selected. */
export default function SelectionHeader({
	count,
	allSelected,
	onCancel,
	onToggleAll,
}: Props) {
	const theme = useTheme();
	const { t, locale } = useI18n();
	const s = styles;
	const onBg = readableOn(theme.background);

	return (
		<View style={s.row}>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={t("select.cancel")}
				hitSlop={8}
				onPress={() => {
					feedback("up");
					onCancel();
				}}
				style={s.icon}
			>
				<Ionicons name="close" size={26} color={onBg} />
			</Pressable>
			<Text style={[s.count, { color: onBg }]} numberOfLines={1}>
				{t("select.count", { n: formatCount(count, locale) })}
			</Text>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={t("select.all")}
				hitSlop={8}
				onPress={() => {
					feedback("action");
					onToggleAll();
				}}
				style={s.icon}
			>
				<Ionicons
					name={allSelected ? "checkbox" : "checkbox-outline"}
					size={24}
					color={onBg}
				/>
			</Pressable>
		</View>
	);
}

// Same height and edges as the search row, so nothing jumps when it swaps in.
const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 14,
		paddingTop: 8,
		minHeight: 48,
	},
	icon: { padding: 4 },
	count: { flex: 1, fontSize: 18, fontWeight: "700" },
});
