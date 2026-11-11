import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsModal from "../components/SettingsModal";
import TabBar, { TabId } from "../components/TabBar";
import { useBrowser } from "../hooks/useBrowser";
import { useT } from "../i18n/I18nContext";
import { requestLegacyReadAccess } from "../storage/fs";
import { useTheme } from "../theme/ThemeContext";
import type { Settings, Theme, UpdateSetting } from "../types";
import { feedback } from "../utils/feedback";
import FilesScreen from "./FilesScreen";
import StorageScreen from "./StorageScreen";

type Props = {
	settings: Settings;
	updateSetting: UpdateSetting;
	resetSettings: () => Promise<void>;
	/** Called once the first folder has been listed. */
	onFirstLoad: () => void;
};

/** The two tabs, the tab bar and the settings sheet. Both tabs stay alive, so each keeps its place. */
export default function MainScreen({
	settings,
	updateSetting,
	resetSettings,
	onFirstLoad,
}: Props) {
	const theme = useTheme();
	const t = useT();
	const insets = useSafeAreaInsets();
	const s = useMemo(() => makeStyles(theme), [theme]);
	const browser = useBrowser(settings.showHidden);
	const [tab, setTab] = useState<TabId>("files");
	const [settingsOpen, setSettingsOpen] = useState(false);

	useEffect(() => {
		if (browser.loaded) onFirstLoad();
	}, [browser.loaded, onFirstLoad]);

	// Android 10 and older ask for the ordinary read permission up front.
	const { refresh } = browser;
	useEffect(() => {
		requestLegacyReadAccess().then((granted) => {
			if (granted) refresh();
		});
	}, [refresh]);

	// On the Storage tab the back button returns to Files (Files handles its own).
	useEffect(() => {
		if (tab !== "storage" || settingsOpen) return;
		const sub = BackHandler.addEventListener("hardwareBackPress", () => {
			setTab("files");
			return true;
		});
		return () => sub.remove();
	}, [tab, settingsOpen]);

	const openSettings = useCallback(() => setSettingsOpen(true), []);
	const onAccessAsked = useCallback(
		() => updateSetting("accessAsked", true),
		[updateSetting],
	);
	const showFolder = useCallback(
		(uri: string) => {
			browser.open(uri);
			setTab("files");
		},
		[browser],
	);

	const confirmReset = () => {
		feedback("action");
		Alert.alert(t("settings.resetTitle"), t("settings.resetBody"), [
			{ text: t("common.cancel"), style: "cancel" },
			{
				text: t("settings.resetButton"),
				style: "destructive",
				onPress: () => {
					resetSettings().catch((e) =>
						console.warn("Could not reset the settings", e),
					);
				},
			},
		]);
	};

	return (
		<View style={[s.root, { paddingTop: insets.top }]}>
			<View style={[s.pane, tab !== "files" && s.hidden]}>
				<FilesScreen
					browser={browser}
					active={tab === "files" && !settingsOpen}
					showHidden={settings.showHidden}
					accessAsked={settings.accessAsked}
					onAccessAsked={onAccessAsked}
					onOpenSettings={openSettings}
				/>
			</View>
			<View style={[s.pane, tab !== "storage" && s.hidden]}>
				<StorageScreen
					onOpenFolder={showFolder}
					onOpenSettings={openSettings}
				/>
			</View>
			<TabBar active={tab} onChange={setTab} />
			<SettingsModal
				visible={settingsOpen}
				settings={settings}
				update={updateSetting}
				onResetAll={confirmReset}
				onClose={() => setSettingsOpen(false)}
			/>
		</View>
	);
}

const makeStyles = (t: Theme) =>
	StyleSheet.create({
		root: { flex: 1, backgroundColor: t.background },
		pane: { flex: 1 },
		hidden: { display: "none" },
	});
