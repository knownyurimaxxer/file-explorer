import { useMemo, useState } from "react";
import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORY_ICON } from "../components/fileIcons";
import UsageBar from "../components/UsageBar";
import { useI18n } from "../i18n/I18nContext";
import { useStorageScan } from "../hooks/useStorageScan";
import { readDiskSpace } from "../storage/fs";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../types";
import { feedback } from "../utils/feedback";
import {
	formatBytes,
	formatCount,
	formatPercent,
	readableOn,
} from "../utils/format";
import { fraction, STAT_CATEGORIES } from "../utils/scan";

type Props = {
	onOpenFolder: (uri: string) => void;
	onOpenSettings: () => void;
};

export default function StorageScreen({ onOpenFolder, onOpenSettings }: Props) {
	const theme = useTheme();
	const { t, locale } = useI18n();
	const insets = useSafeAreaInsets();
	const s = useMemo(() => makeStyles(theme), [theme]);
	const onBg = readableOn(theme.background);
	const { scan, start, stop } = useStorageScan();
	const [disk, setDisk] = useState(() => readDiskSpace());
	const [refreshing, setRefreshing] = useState(false);

	const scanning = scan.status === "scanning";
	const hasResult = scan.status !== "idle";
	const used = disk ? Math.max(0, disk.total - disk.free) : 0;
	const bytes = (n: number) => formatBytes(n, locale);

	const onRefresh = () => {
		feedback("refresh");
		setRefreshing(true);
		setDisk(readDiskSpace());
		setTimeout(() => setRefreshing(false), 400);
	};

	const onScan = () => {
		feedback("scan");
		if (scanning) stop();
		else start();
	};

	const categories = STAT_CATEGORIES.filter((c) => scan.totals.byCategory[c] > 0)
		.sort((a, b) => scan.totals.byCategory[b] - scan.totals.byCategory[a]);
	const biggest = Math.max(1, ...categories.map((c) => scan.totals.byCategory[c]));
	const biggestFolder = Math.max(1, ...scan.folders.map((f) => f.bytes));

	return (
		<View style={s.root}>
			<View style={s.topRow}>
				<Text style={s.title}>{t("tab.storage")}</Text>
				<Pressable
					accessibilityRole="button"
					onPress={() => {
						feedback("settings");
						onOpenSettings();
					}}
					hitSlop={8}
					style={s.gear}
				>
					<Ionicons name="settings-outline" size={24} color={onBg} />
				</Pressable>
			</View>

			<ScrollView
				contentContainerStyle={[
					s.content,
					{
						paddingLeft: Math.max(insets.left, 14),
						paddingRight: Math.max(insets.right, 14),
					},
				]}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={theme.accent}
						colors={[theme.accent]}
					/>
				}
			>
				{/* the whole device: always available, no scan needed */}
				<View style={s.card}>
					<Text style={s.cardTitle}>{t("storage.device")}</Text>
					{disk ? (
						<>
							<Text style={s.big}>
								{t("storage.usedOf", { used: bytes(used), total: bytes(disk.total) })}
							</Text>
							<View style={{ marginTop: 10 }}>
								<UsageBar fraction={fraction(used, disk.total)} height={16} />
							</View>
							<Text style={s.meta}>
								{t("storage.free", { free: bytes(disk.free) })} ·{" "}
								{formatPercent(used, disk.total)}
							</Text>
						</>
					) : (
						<Text style={s.meta}>{t("storage.unavailable")}</Text>
					)}
				</View>

				{/* what is using it: found by scanning, only when asked */}
				<View style={s.card}>
					<View style={s.cardHead}>
						<Text style={s.cardTitle}>{t("storage.byType")}</Text>
						<Pressable
							accessibilityRole="button"
							onPress={onScan}
							style={({ pressed }) => [s.pill, pressed && s.pressed]}
						>
							<Text style={s.pillText}>
								{scanning
									? t("storage.stop")
									: hasResult
										? t("storage.again")
										: t("storage.analyze")}
							</Text>
						</Pressable>
					</View>

					{!hasResult && <Text style={s.meta}>{t("storage.analyzeHint")}</Text>}

					{hasResult && (
						<Text style={s.meta}>
							{scanning
								? t("storage.scanning", {
										files: formatCount(scan.totals.files, locale),
										size: bytes(scan.totals.bytes),
									})
								: t("storage.scanned", {
										files: formatCount(scan.totals.files, locale),
										size: bytes(scan.totals.bytes),
									})}
						</Text>
					)}
					{scan.status === "stopped" && (
						<Text style={s.warn}>{t("storage.stopped")}</Text>
					)}

					{categories.map((c) => (
						<View key={c} style={s.line}>
							<View style={s.lineHead}>
								<Ionicons name={CATEGORY_ICON[c]} size={18} color={theme.text} />
								<Text style={s.lineName}>{t(`kind.${c}`)}</Text>
								<Text style={s.lineSize}>{bytes(scan.totals.byCategory[c])}</Text>
							</View>
							<UsageBar
								fraction={fraction(scan.totals.byCategory[c], biggest)}
								height={8}
							/>
						</View>
					))}
				</View>

				{hasResult && scan.folders.length + scan.loose.files > 0 && (
					<View style={s.card}>
						<Text style={s.cardTitle}>{t("storage.byFolder")}</Text>
						{scan.folders.map((f) => (
							<Pressable
								key={f.uri}
								accessibilityRole="button"
								onPress={() => {
									feedback("folder");
									onOpenFolder(f.uri);
								}}
								style={({ pressed }) => [s.line, pressed && s.pressed]}
							>
								<View style={s.lineHead}>
									<Ionicons name="folder" size={18} color={theme.text} />
									<Text style={s.lineName} numberOfLines={1}>
										{f.name}
									</Text>
									<Text style={s.lineSize}>{bytes(f.bytes)}</Text>
								</View>
								<UsageBar fraction={fraction(f.bytes, biggestFolder)} height={8} />
							</Pressable>
						))}
						{scan.loose.bytes > 0 && (
							<View style={s.line}>
								<View style={s.lineHead}>
									<Ionicons name="document-outline" size={18} color={theme.text} />
									<Text style={s.lineName}>{t("storage.rootFiles")}</Text>
									<Text style={s.lineSize}>{bytes(scan.loose.bytes)}</Text>
								</View>
							</View>
						)}
						{scan.unreadable > 0 && (
							<Text style={[s.meta, { marginTop: 12 }]}>
								{t("storage.skipped")}
							</Text>
						)}
					</View>
				)}

				<Text style={s.note}>{t("storage.note")}</Text>
			</ScrollView>
		</View>
	);
}

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		root: { flex: 1 },
		topRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: 14,
			paddingTop: 10,
			paddingBottom: 4,
		},
		title: { color: readableOn(t.background), fontSize: 22, fontWeight: "800" },
		gear: { padding: 4 },
		content: { paddingTop: 10, paddingBottom: 28 },
		card: {
			backgroundColor: t.card,
			borderRadius: 8,
			padding: 14,
			marginBottom: 14,
		},
		cardHead: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		cardTitle: { color: t.text, fontWeight: "800", fontSize: 15 },
		big: { color: t.text, fontSize: 20, fontWeight: "800", marginTop: 8 },
		meta: { color: t.text + "AA", fontSize: 13, marginTop: 8 },
		warn: { color: "#FF4D4D", fontSize: 13, fontWeight: "600", marginTop: 8 },
		pill: {
			backgroundColor: t.accent,
			borderRadius: 16,
			paddingHorizontal: 14,
			paddingVertical: 6,
		},
		pillText: { color: readableOn(t.accent), fontWeight: "700", fontSize: 13 },
		line: { marginTop: 14 },
		lineHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
		lineName: { flex: 1, color: t.text, fontWeight: "600", fontSize: 14 },
		lineSize: { color: t.text + "CC", fontSize: 13, fontWeight: "600" },
		note: { color: readableOn(t.background) + "AA", fontSize: 12, paddingHorizontal: 4 },
		pressed: { opacity: 0.7 },
	});
