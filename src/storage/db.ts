/**
 * Internal database (SQLite). Holds the app's settings (theme, language,
 * hidden-files and vibration switches) and the SD card folders you have allowed
 * the app to change: the app never copies or stores your files.
 */
import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
	if (!dbPromise) {
		dbPromise = (async () => {
			const db = await SQLite.openDatabaseAsync("fileexplorer.db");
			await db.execAsync(`
				CREATE TABLE IF NOT EXISTS settings (
					key   TEXT PRIMARY KEY NOT NULL,
					value TEXT NOT NULL
				);
				CREATE TABLE IF NOT EXISTS sd_access (
					volume TEXT PRIMARY KEY NOT NULL,
					tree   TEXT NOT NULL
				);
			`);
			return db;
		})();
	}
	return dbPromise;
}

/** Opens the database ahead of time so the first real query doesn't wait for it. */
export function warmDb(): void {
	getDb().catch((e) => console.warn("Could not open the database", e));
}

/** Every saved setting in one query (instead of one query per setting). */
export async function getAllSettings(): Promise<Record<string, unknown>> {
	const out: Record<string, unknown> = {};
	try {
		const db = await getDb();
		const rows = await db.getAllAsync<{ key: string; value: string }>(
			"SELECT key, value FROM settings",
		);
		rows.forEach((r) => {
			try {
				out[r.key] = JSON.parse(r.value);
			} catch {
				/* unreadable value: behaves as if it was never saved */
			}
		});
	} catch {
		/* no database: every setting falls back to its default */
	}
	return out;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
	const db = await getDb();
	await db.runAsync(
		"INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
		[key, JSON.stringify(value)],
	);
}

/** Empties the settings table. The table itself stays. */
export async function resetDb(): Promise<void> {
	const db = await getDb();
	await db.runAsync("DELETE FROM settings");
}

/**
 * The SD card folders the person has granted, by card id. Not part of the
 * settings: "Reset settings" leaves them alone (Android keeps the permission).
 */
export async function getSdTrees(): Promise<Record<string, string>> {
	const out: Record<string, string> = {};
	try {
		const db = await getDb();
		const rows = await db.getAllAsync<{ volume: string; tree: string }>(
			"SELECT volume, tree FROM sd_access",
		);
		rows.forEach((r) => {
			out[r.volume] = r.tree;
		});
	} catch {
		/* no database: no card has been granted */
	}
	return out;
}

export async function setSdTree(volume: string, tree: string): Promise<void> {
	const db = await getDb();
	await db.runAsync(
		"INSERT INTO sd_access (volume, tree) VALUES (?, ?) ON CONFLICT(volume) DO UPDATE SET tree = excluded.tree",
		[volume, tree],
	);
}
