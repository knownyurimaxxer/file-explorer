import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import { useI18n } from "../i18n/I18nContext";
import { requestLegacyWriteAccess } from "../storage/fs";
import {
	runOperation,
	sdVolumesNeeded,
	type OpItem,
	type OpMode,
	type OpProgress,
	type OpResult,
} from "../storage/operations";
import { hasSdAccess, pickSdRoot } from "../storage/saf";
import { feedback } from "../utils/feedback";
import { formatCount } from "../utils/format";

/** What was copied or cut, waiting to be pasted into a folder. */
export type Clipboard = { mode: "copy" | "move"; items: OpItem[] };

/** A copy, move or delete in progress, or just finished (`result` is set). */
export type RunState = {
	mode: OpMode;
	progress: OpProgress;
	result: OpResult | null;
};

/** How often the progress on screen is refreshed (a big folder reports every file). */
const PROGRESS_MS = 120;

type Options = {
	/** The folder the Files tab is showing: where "paste" puts things. */
	currentUri: string;
	/** Called when something on the phone has changed (the list needs reading again). */
	onChanged: () => void;
};

/** Copy, move and delete from the Files tab: the clipboard, the questions asked, and the work. */
export function useFileOps({ currentUri, onChanged }: Options) {
	const { t, locale } = useI18n();
	const [clipboard, setClipboard] = useState<Clipboard | null>(null);
	const [run, setRun] = useState<RunState | null>(null);
	const stopRef = useRef(false);
	const busyRef = useRef(false);

	const tell = useCallback(
		(title: string, message: string) =>
			new Promise<void>((resolve) =>
				Alert.alert(
					title,
					message,
					[{ text: t("common.close"), onPress: () => resolve() }],
					{ onDismiss: () => resolve() },
				),
			),
		[t],
	);

	const ask = useCallback(
		(title: string, message: string, ok: string) =>
			new Promise<boolean>((resolve) =>
				Alert.alert(
					title,
					message,
					[
						{
							text: t("common.cancel"),
							style: "cancel",
							onPress: () => resolve(false),
						},
						{ text: ok, onPress: () => resolve(true) },
					],
					{ onDismiss: () => resolve(false) },
				),
			),
		[t],
	);

	/** Permissions, and the SD card's granted folder when the job needs one. False: don't start. */
	const ensureReady = useCallback(
		async (
			mode: OpMode,
			items: OpItem[],
			destUri: string | null,
		): Promise<boolean> => {
			if (!(await requestLegacyWriteAccess())) {
				await tell(t("op.cantTitle"), t("op.needWrite"));
				return false;
			}
			for (const id of sdVolumesNeeded(mode, items, destUri)) {
				if (await hasSdAccess(id)) continue;
				if (!(await ask(t("sd.title"), t("sd.body"), t("sd.choose")))) {
					return false;
				}
				const picked = await pickSdRoot(id);
				if (picked === "cancelled") return false;
				if (picked === "wrong") {
					await tell(t("sd.title"), t("sd.wrong"));
					return false;
				}
			}
			return true;
		},
		[ask, tell, t],
	);

	const execute = useCallback(
		async (mode: OpMode, items: OpItem[], destUri: string | null) => {
			if (busyRef.current || items.length === 0) return;
			busyRef.current = true;
			try {
				if (!(await ensureReady(mode, items, destUri))) return;
				stopRef.current = false;
				const total = items.length;
				setRun({
					mode,
					progress: { done: 0, total, current: "" },
					result: null,
				});
				let last = 0;
				const result = await runOperation(
					mode,
					items,
					destUri,
					(progress) => {
						const now = Date.now();
						if (now - last < PROGRESS_MS) return;
						last = now;
						setRun((r) => (r && !r.result ? { ...r, progress } : r));
					},
					() => stopRef.current,
				);
				setRun({
					mode,
					progress: { done: result.done, total, current: "" },
					result,
				});
				if (mode !== "delete") setClipboard(null);
				feedback(
					result.failures.length > 0 || result.stopped ? "error" : "action",
				);
				onChanged();
			} finally {
				busyRef.current = false;
			}
		},
		[ensureReady, onChanged],
	);

	const copy = useCallback(
		(items: OpItem[]) => setClipboard({ mode: "copy", items }),
		[],
	);
	const move = useCallback(
		(items: OpItem[]) => setClipboard({ mode: "move", items }),
		[],
	);
	const cancelClipboard = useCallback(() => setClipboard(null), []);

	const paste = useCallback(() => {
		if (clipboard) void execute(clipboard.mode, clipboard.items, currentUri);
	}, [clipboard, currentUri, execute]);

	/** Asks first (it can't be undone); `onConfirmed` runs right before the work starts. */
	const remove = useCallback(
		(items: OpItem[], onConfirmed?: () => void) => {
			Alert.alert(
				t("delete.title"),
				t("delete.body", { n: formatCount(items.length, locale) }),
				[
					{ text: t("common.cancel"), style: "cancel" },
					{
						text: t("action.delete"),
						style: "destructive",
						onPress: () => {
							onConfirmed?.();
							void execute("delete", items, null);
						},
					},
				],
			);
		},
		[execute, locale, t],
	);

	const stop = useCallback(() => {
		stopRef.current = true;
	}, []);
	const closeRun = useCallback(() => setRun(null), []);

	return {
		clipboard,
		run,
		copy,
		move,
		cancelClipboard,
		paste,
		remove,
		stop,
		closeRun,
	};
}
