import { useMemo } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useI18n } from "../i18n/I18nContext";
import type { RunState } from "../hooks/useFileOps";
import type { OpFailure } from "../storage/operations";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../types";
import { formatCount, readableOn } from "../utils/format";

type Props = {
	run: RunState | null;
	onStop: () => void;
	onClose: () => void;
};

const MAX_LISTED = 5;

/** Progress while copying, moving or deleting, then what happened. */
export default function OperationModal({ run, onStop, onClose }: Props) {
	const theme = useTheme();
	const { t, locale } = useI18n();
	const s = useMemo(() => makeStyles(theme), [theme]);
	if (!run) return null;

	const { mode, progress, result } = run;
	const reason = (f: OpFailure) =>
		f.code === "itself"
			? t("op.err.itself")
			: f.code === "sd"
				? t("op.err.sd")
				: f.detail || t("op.err.other");

	const title = !result
		? mode === "copy"
			? t("op.copying")
			: mode === "move"
				? t("op.moving")
				: t("op.deleting")
		: result.failures.length > 0
			? t("op.problems")
			: result.stopped
				? t("op.stopped")
				: t("common.done");

	return (
		<Modal
			transparent
			animationType="fade"
			// While it works, the back button does nothing: stopping is on purpose.
			onRequestClose={result ? onClose : undefined}
		>
			<View style={s.backdrop}>
				<View style={s.card}>
					<Text style={s.title}>{title}</Text>
					{!result ? (
						<>
							<ActivityIndicator
								size="large"
								color={theme.accent}
								style={s.spinner}
							/>
							<Text style={s.current} numberOfLines={1}>
								{progress.current}
							</Text>
							<Text style={s.muted}>
								{t("op.progress", {
									done: formatCount(progress.done, locale),
									total: formatCount(progress.total, locale),
								})}
							</Text>
							<Pressable
								accessibilityRole="button"
								onPress={onStop}
								style={({ pressed }) => [s.button, pressed && s.pressed]}
							>
								<Text style={s.buttonText}>{t("op.stop")}</Text>
							</Pressable>
						</>
					) : (
						<>
							<Text style={s.muted}>
								{t("op.completed", { n: formatCount(result.done, locale) })}
							</Text>
							{result.failures.length > 0 && (
								<View style={s.failures}>
									<Text style={s.failHeader}>{t("op.notDone")}</Text>
									{result.failures.slice(0, MAX_LISTED).map((f, i) => (
										<Text key={`${f.name}-${i}`} style={s.fail}>
											{`• ${f.name}: ${reason(f)}`}
										</Text>
									))}
									{result.failures.length > MAX_LISTED && (
										<Text style={s.fail}>
											{t("op.more", {
												n: formatCount(
													result.failures.length - MAX_LISTED,
													locale,
												),
											})}
										</Text>
									)}
								</View>
							)}
							<Pressable
								accessibilityRole="button"
								onPress={onClose}
								style={({ pressed }) => [s.button, pressed && s.pressed]}
							>
								<Text style={s.buttonText}>{t("common.close")}</Text>
							</Pressable>
						</>
					)}
				</View>
			</View>
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
		spinner: { marginTop: 18, marginBottom: 12 },
		current: { color: t.text, fontSize: 14, textAlign: "center" },
		muted: { color: t.text + "AA", fontSize: 14, marginTop: 8 },
		failures: { marginTop: 14, gap: 4 },
		failHeader: { color: t.text, fontSize: 14, fontWeight: "700" },
		fail: { color: t.text + "CC", fontSize: 13 },
		button: {
			alignSelf: "flex-end",
			backgroundColor: t.accent,
			borderRadius: 20,
			paddingHorizontal: 20,
			paddingVertical: 10,
			marginTop: 18,
		},
		buttonText: {
			color: readableOn(t.accent),
			fontSize: 15,
			fontWeight: "700",
		},
		pressed: { opacity: 0.7 },
	});
