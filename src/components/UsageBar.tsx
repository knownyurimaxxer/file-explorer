import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../types";

type Props = { fraction: number; height?: number };

/** A pill-shaped bar filled up to `fraction` (0..1), in the style of the sliders. */
export default function UsageBar({ fraction, height = 12 }: Props) {
	const theme = useTheme();
	const s = useMemo(() => makeStyles(theme, height), [theme, height]);
	const f = Math.min(1, Math.max(0, fraction));
	return (
		<View style={s.track}>
			{f > 0 && (
				<View
					style={[s.fill, { width: `${Math.max(f * 100, 2)}%` }]}
				/>
			)}
		</View>
	);
}

const makeStyles = (t: Theme, h: number) =>
	StyleSheet.create({
		track: {
			height: h,
			borderRadius: h / 2,
			backgroundColor: t.text + "22",
			borderWidth: 1,
			borderColor: "#88888855",
			overflow: "hidden",
		},
		fill: { height: "100%", borderRadius: h / 2, backgroundColor: t.accent },
	});
