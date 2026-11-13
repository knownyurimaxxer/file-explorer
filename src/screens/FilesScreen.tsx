import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ComponentRef,
} from "react";
import {
	ActivityIndicator,
	Alert,
	BackHandler,
	FlatList,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Chip from "../components/Chip";
import FileRow from "../components/FileRow";
import { useI18n } from "../i18n/I18nContext";
import { useBrowser } from "../hooks/useBrowser";
import { useFileSearch } from "../hooks/useFileSearch";
import {
	needsAllFilesAccess,
	openAllFilesAccessSettings,
	openFile,
} from "../storage/fs";
import { useTheme } from "../theme/ThemeContext";
import type { Entry, SearchHit, Theme } from "../types";
import { feedback } from "../utils/feedback";
import { formatCount, readableOn } from "../utils/format";
import { crumbsBelow, isInside, relativePath, sameUri } from "../utils/paths";

type Props = {
	browser: ReturnType<typeof useBrowser>;
	/** This tab is the one on screen (only then does it answer the back button). */
	active: boolean;
	/** Show files and folders whose name starts with a dot (in the search; the folder list is handled by `browser`). */
	showHidden: boolean;
	accessAsked: boolean;
	onAccessAsked: () => void;
	onOpenSettings: () => void;
};

const COLUMN_MIN_WIDTH = 360;
const MAX_COLUMNS = 3;

export default function FilesScreen({
	browser,
	active,
	showHidden,
	accessAsked,
	onAccessAsked,
	onOpenSettings,
}: Props) {
	const theme = useTheme();
	const { t, locale } = useI18n();
	const insets = useSafeAreaInsets();
	const { width } = useWindowDimensions();
	const s = useMemo(() => makeStyles(theme), [theme]);
	const onBg = readableOn(theme.background);
	const listRef = useRef<FlatList<Entry | SearchHit>>(null);
	const crumbsRef = useRef<ComponentRef<typeof ScrollView>>(null);
	const [query, setQuery] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	const { uri, root, places, entries, error, canGoUp } = browser;
	// These two never change, so rows aren't redrawn just because the list state did.
	const { open: openFolder, up: goUp } = browser;
	const search = useFileSearch(uri, query, showHidden);
	const searching = search.active;

	const columns = Math.min(
		MAX_COLUMNS,
		Math.max(
			1,
			Math.floor((width - insets.left - insets.right) / COLUMN_MIN_WIDTH),
		),
	);

	// Moving to another folder clears the search and starts at the top.
	useEffect(() => {
		setQuery("");
		listRef.current?.scrollToOffset({ offset: 0, animated: false });
	}, [uri]);

	const crumbs = useMemo(() => crumbsBelow(uri, root), [uri, root]);
	useEffect(() => {
		const id = setTimeout(
			() => crumbsRef.current?.scrollToEnd({ animated: true }),
			50,
		);
		return () => clearTimeout(id);
	}, [crumbs]);

	// The chip of the place we are in: the deepest place that contains this folder.
	const activePlaceId = useMemo(() => {
		let best: { id: string; len: number } | null = null;
		for (const p of places)
			if (isInside(uri, p.uri) && (!best || p.uri.length > best.len))
				best = { id: p.id, len: p.uri.length };
		return best?.id ?? null;
	}, [places, uri]);

	// The back button: clear the search, then go up a folder, then leave.
	useEffect(() => {
		if (!active) return;
		const sub = BackHandler.addEventListener("hardwareBackPress", () => {
			if (query !== "") {
				setQuery("");
				return true;
			}
			if (canGoUp) {
				feedback("up");
				goUp();
				return true;
			}
			return false;
		});
		return () => sub.remove();
	}, [active, query, canGoUp, goUp]);

	const onPressEntry = useCallback(
		async (entry: Entry) => {
			if (entry.isDirectory) {
				feedback("folder");
				openFolder(entry.uri);
				return;
			}
			feedback("file");
			const result = await openFile(entry.uri, entry.name);
			if (result.status !== "ok") {
				feedback("error");
				Alert.alert(
					t("files.openFailedTitle"),
					result.status === "noApp"
						? t("files.noApp")
						: `${t("files.openError")}\n\n${result.detail}`,
				);
			}
		},
		[openFolder, t],
	);

	const onAllowAccess = () => {
		feedback("action");
		onAccessAsked();
		openAllFilesAccessSettings();
	};

	const onRefresh = () => {
		feedback("refresh");
		setRefreshing(true);
		browser.refresh();
		setTimeout(() => setRefreshing(false), 400);
	};

	const showBanner = needsAllFilesAccess() && (!accessAsked || error);
	const data: (Entry | SearchHit)[] = searching ? search.results : entries;

	const renderItem = useCallback(
		({ item }: { item: Entry | SearchHit }) => {
			const hit = searching ? (item as SearchHit) : null;
			return (
				<View style={s.cell}>
					<FileRow
						entry={item}
						subtitle={
							hit
								? relativePath(hit.parentUri, uri) || undefined
								: undefined
						}
						onPress={onPressEntry}
					/>
				</View>
			);
		},
		[searching, uri, onPressEntry, s],
	);

	const header = (
		<View>
			{searching && (
				<View style={s.status}>
					{search.searching && (
						<ActivityIndicator size="small" color={theme.accent} />
					)}
					<Text style={s.statusText}>
						{search.searching
							? t("files.searching")
							: search.results.length === 0
								? t("files.noMatch")
								: search.truncated
									? t("files.foundMore", {
											n: formatCount(
												search.results.length,
												locale,
											),
										})
									: t("files.found", {
											n: formatCount(
												search.results.length,
												locale,
											),
										})}
					</Text>
				</View>
			)}
		</View>
	);

	const empty = searching ? null : (
		<View style={s.emptyBox}>
			<Ionicons
				name={error ? "lock-closed-outline" : "folder-open-outline"}
				size={40}
				color={onBg + "88"}
			/>
			<Text style={s.emptyText}>
				{!browser.loaded
					? t("files.loading")
					: error
						? t("files.unreadable")
						: t("files.empty")}
			</Text>
			{browser.loaded && needsAllFilesAccess() && (
				<>
					<Text style={s.emptyHint}>{t("files.accessHint")}</Text>
					<Pressable
						accessibilityRole="button"
						onPress={onAllowAccess}
						style={({ pressed }) => [
							s.accessBtn,
							pressed && s.pressed,
						]}
					>
						<Text style={s.accessBtnText}>
							{t("files.accessButton")}
						</Text>
					</Pressable>
				</>
			)}
		</View>
	);

	return (
		<View style={s.root}>
			{showBanner && (
				<Pressable
					accessibilityRole="button"
					onPress={onAllowAccess}
					style={s.banner}
				>
					<Text style={s.bannerText}>{t("files.accessBanner")}</Text>
				</Pressable>
			)}

			<View style={s.searchRow}>
				<View style={s.searchBox}>
					<Ionicons
						name="search"
						size={18}
						color={theme.text + "88"}
					/>
					<TextInput
						style={s.searchInput}
						value={query}
						onChangeText={setQuery}
						placeholder={t("files.search")}
						placeholderTextColor={theme.text + "88"}
						autoCapitalize="none"
						autoCorrect={false}
						returnKeyType="search"
					/>
					{query !== "" && (
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("files.clearSearch")}
							hitSlop={8}
							onPress={() => setQuery("")}
						>
							<Ionicons
								name="close-circle"
								size={18}
								color={theme.text + "88"}
							/>
						</Pressable>
					)}
				</View>
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
				horizontal
				showsHorizontalScrollIndicator={false}
				style={s.chipsScroll}
				contentContainerStyle={s.chips}
			>
				{places.map((p) => (
					<Chip
						key={p.id}
						label={t(p.labelKey)}
						active={p.id === activePlaceId && sameUri(uri, p.uri)}
						onPress={() => {
							feedback("place");
							browser.open(p.uri);
						}}
					/>
				))}
			</ScrollView>

			<View style={s.pathRow}>
				<ScrollView
					ref={crumbsRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={s.crumbs}
				>
					<Pressable
						onPress={() => {
							if (!sameUri(uri, root)) {
								feedback("up");
								browser.open(root);
							}
						}}
					>
						<Text
							style={[
								s.crumb,
								crumbs.length === 0 && s.crumbLast,
							]}
						>
							{t(
								places.find((p) => sameUri(p.uri, root))
									?.labelKey ?? "place.internal",
							)}
						</Text>
					</Pressable>
					{crumbs.map((c, i) => (
						<View key={c.uri} style={s.crumbItem}>
							<Ionicons
								name="chevron-forward"
								size={14}
								color={onBg + "88"}
								style={{
									top: 2,
									left: 1,
								}}
							/>
							<Pressable
								onPress={() => {
									if (i < crumbs.length - 1) {
										feedback("up");
										browser.open(c.uri);
									}
								}}
							>
								<Text
									style={[
										s.crumb,
										i === crumbs.length - 1 && s.crumbLast,
									]}
								>
									{c.name}
								</Text>
							</Pressable>
						</View>
					))}
				</ScrollView>
			</View>

			<FlatList
				ref={listRef}
				key={columns}
				data={data}
				numColumns={columns}
				keyExtractor={(item) => item.uri}
				renderItem={renderItem}
				ListHeaderComponent={header}
				ListEmptyComponent={empty ?? undefined}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				initialNumToRender={14}
				windowSize={7}
				contentContainerStyle={[
					s.list,
					{
						paddingLeft: Math.max(insets.left, 10),
						paddingRight: Math.max(insets.right, 10),
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
			/>
		</View>
	);
}

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		root: { flex: 1 },
		banner: {
			backgroundColor: "#FF4D4D",
			paddingVertical: 10,
			paddingHorizontal: 14,
		},
		bannerText: { color: "#FFFFFF", fontWeight: "600", fontSize: 13 },
		searchRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			paddingHorizontal: 14,
			paddingTop: 8,
		},
		searchBox: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			backgroundColor: t.card,
			borderRadius: 8,
			paddingHorizontal: 12,
			minHeight: 40,
		},
		searchInput: {
			flex: 1,
			color: t.text,
			fontSize: 15,
			paddingVertical: 10,
		},
		// the negative margin pulls the icon itself to 15 from the edge (not its 4 of padding)
		gear: { padding: 4, marginRight: -4 },
		chipsScroll: { flexShrink: 0, flexGrow: 0 },
		chips: {
			gap: 8,
			paddingHorizontal: 14,
			paddingTop: 8,
			paddingBottom: 10,
		},
		pathRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			paddingLeft: 14,
			paddingBottom: 8,
		},
		upBtn: {
			width: 28,
			height: 28,
			borderRadius: 14,
			backgroundColor: t.accent,
			alignItems: "center",
			justifyContent: "center",
		},
		crumbs: { alignItems: "center", paddingRight: 14 },
		crumbItem: { flexDirection: "row", alignItems: "center", gap: 2 },
		crumb: {
			color: readableOn(t.background) + "BB",
			fontSize: 13,
			fontWeight: "600",
		},
		crumbLast: { color: readableOn(t.background), fontWeight: "800" },
		list: { paddingTop: 4, paddingBottom: 4, flexGrow: 1 },
		cell: { flex: 1, paddingHorizontal: 4 },
		status: {
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			paddingBottom: 10,
		},
		statusText: {
			color: readableOn(t.background) + "CC",
			fontSize: 13,
			fontWeight: "600",
		},
		emptyBox: {
			alignItems: "center",
			paddingTop: 48,
			gap: 10,
			paddingHorizontal: 24,
		},
		emptyText: {
			color: readableOn(t.background),
			fontWeight: "700",
			fontSize: 16,
			textAlign: "center",
		},
		emptyHint: {
			color: readableOn(t.background) + "BB",
			fontSize: 13,
			textAlign: "center",
		},
		accessBtn: {
			marginTop: 6,
			backgroundColor: t.accent,
			borderRadius: 18,
			paddingVertical: 10,
			paddingHorizontal: 20,
		},
		accessBtnText: { color: readableOn(t.accent), fontWeight: "700" },
		pressed: { opacity: 0.7 },
	});
