import { createAudioPlayer, AudioPlayer } from "expo-audio";
import type { HapticTrigger } from "../constants";

/**
 * Short interface sounds (made by tools/generate_sounds.py). Like haptics,
 * App.tsx keeps the setting up to date, so any component can call sound()
 * without receiving it as a prop.
 */
type SoundName = "tap" | "open" | "back" | "file" | "error";

const SOURCES: Record<SoundName, number> = {
	tap: require("../../assets/sounds/tap.wav"),
	open: require("../../assets/sounds/open.wav"),
	back: require("../../assets/sounds/back.wav"),
	file: require("../../assets/sounds/file.wav"),
	error: require("../../assets/sounds/error.wav"),
};

/** Which sound each moment makes. */
const SOUND_FOR: Record<HapticTrigger, SoundName> = {
	done: "tap",
	settings: "tap",
	tab: "tap",
	folder: "open",
	up: "back",
	file: "file",
	place: "tap",
	refresh: "tap",
	scan: "tap",
	action: "tap",
	error: "error",
};

const VOLUME = 0.6;

let enabled = true;
// Players are built the first time a sound is needed, then reused.
const players: Partial<Record<SoundName, AudioPlayer>> = {};

export function configureSounds(on: boolean) {
	enabled = on;
}

function play(name: SoundName) {
	try {
		let player = players[name];
		if (!player) {
			player = createAudioPlayer(SOURCES[name]);
			player.volume = VOLUME;
			players[name] = player;
		}
		Promise.resolve(player.seekTo(0)).catch(() => {});
		player.play();
	} catch {
		/* no sound on this device: nothing to do */
	}
}

/** Plays the sound of this moment, if sounds are on. */
export function sound(trigger: HapticTrigger) {
	if (!enabled) return;
	play(SOUND_FOR[trigger]);
}

/** Plays the plain tap whatever the setting says (the preview when the switch is turned on). */
export function previewSound() {
	play("tap");
}
