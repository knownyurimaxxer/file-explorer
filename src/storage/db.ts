/**
 * Internal database (SQLite). Holds only the app's settings (theme, language,
 * sound and vibration switches): the app never copies or stores your files.
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
