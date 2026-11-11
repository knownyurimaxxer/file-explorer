import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useT } from "../i18n/I18nContext";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../types";
import { feedback } from "../utils/feedback";
import { readableOn } from "../utils/format";
import type { IconName } from "./fileIcons";

export type TabId = "files" | "storage";

const TABS: {
	id: TabId;
	icon: IconName;
	label: "tab.files" | "tab.storage";
}[] = [
	{ id: "files", icon: "folder-open-outline", label: "tab.files" },
	{ id: "storage", icon: "pie-chart-outline", label: "tab.storage" },
];

type Props = { active: TabId; onChange: (tab: TabId) => void };

export default function TabBar({ active, onChange }: Props) {
	const theme = useTheme();
	const t = useT();
	const insets = useSafeAreaInsets();
	const s = useMemo(() => makeStyles(theme), [theme]);

	return (
		<View
			style={[
				s.bar,
				{
					paddingBottom: Math.max(insets.bottom, 8),
					paddingLeft: Math.max(insets.left, 12),
					paddingRight: Math.max(insets.right, 12),
				},
			]}
		>
			{TABS.map((tab) => {
				const on = tab.id === active;
				const color = on ? readableOn(theme.accent) : theme.text + "AA";
				return (
					<Pressable
						key={tab.id}
						accessibilityRole="tab"
						accessibilityState={{ selected: on }}
						onPress={() => {
							if (on) return;
							feedback("tab");
							onChange(tab.id);
						}}
						style={[s.tab, on && s.tabOn]}
					>
						<Ionicons name={tab.icon} size={22} color={color} />
						<Text style={[s.label, { color }]}>{t(tab.label)}</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		bar: {
			flexDirection: "row",
			gap: 8,
			paddingTop: 8,
			backgroundColor: t.card,
		},
		tab: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: 8,
			paddingVertical: 9,
			borderRadius: 18,
		},
		tabOn: { backgroundColor: t.accent },
		label: { fontWeight: "700", fontSize: 14 },
	});
