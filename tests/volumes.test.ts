import { describe, expect, it } from "vitest";
import {
	isVolumeRoot,
	needsSafFor,
	normalizeTree,
	safDocUri,
	safInitialUri,
	treeTarget,
	volumeOf,
} from "../src/utils/volumes";

describe("volumeOf", () => {
	it("knows the internal storage", () => {
		expect(volumeOf("file:///storage/emulated/0/Download/a.pdf")).toEqual({
			id: "primary",
			primary: true,
			rel: "Download/a.pdf",
		});
		expect(volumeOf("file:///storage/emulated/0")).toEqual({
			id: "primary",
			primary: true,
			rel: "",
		});
	});

	it("knows an SD card, and reads the path as text", () => {
		expect(volumeOf("file:///storage/1A2B-3C4D/My%20Docs/a.txt")).toEqual({
			id: "1A2B-3C4D",
			primary: false,
			rel: "My Docs/a.txt",
		});
		expect(volumeOf("file:///storage/1A2B-3C4D/")).toEqual({
			id: "1A2B-3C4D",
			primary: false,
			rel: "",
		});
	});

	it("is null for places that aren't inside a volume", () => {
		expect(volumeOf("file:///storage")).toBeNull();
		expect(volumeOf("file:///storage/emulated")).toBeNull();
		expect(volumeOf("file:///storage/self")).toBeNull();
		expect(volumeOf("file:///data/user/0/app")).toBeNull();
	});
});

describe("needsSafFor", () => {
	const sd = "file:///storage/1A2B-3C4D/a.txt";
	const internal = "file:///storage/emulated/0/a.txt";

	it("is true for an SD card on Android 10 and older", () => {
		expect(needsSafFor(sd, 29)).toBe(true);
		expect(needsSafFor(sd, 28)).toBe(true);
	});

	it("is false on Android 11 and newer, and for internal storage", () => {
		expect(needsSafFor(sd, 30)).toBe(false);
		expect(needsSafFor(sd, 35)).toBe(false);
		expect(needsSafFor(internal, 29)).toBe(false);
	});

	it("is false when the Android version is unknown", () => {
		expect(needsSafFor(sd, Number.NaN)).toBe(false);
	});
});

describe("granted folders", () => {
	const tree = "content://com.android.externalstorage.documents/tree/1A2B-3C4D%3A";

	it("cuts what the picker returns down to the folder's own address", () => {
		expect(normalizeTree(`${tree}/document/1A2B-3C4D%3A`)).toBe(tree);
		expect(normalizeTree(tree)).toBe(tree);
		expect(normalizeTree("file:///storage/1A2B-3C4D")).toBeNull();
	});

	it("says which card and which folder it is", () => {
		expect(treeTarget(tree)).toEqual({ volume: "1A2B-3C4D", path: "" });
		expect(
			treeTarget(
				"content://com.android.externalstorage.documents/tree/1A2B-3C4D%3ADCIM%2FCamera",
			),
		).toEqual({ volume: "1A2B-3C4D", path: "DCIM/Camera" });
		expect(treeTarget("content://x/y")).toBeNull();
	});

	it("only accepts the very top of the right card", () => {
		expect(isVolumeRoot(tree, "1A2B-3C4D")).toBe(true);
		expect(isVolumeRoot(tree, "FFFF-0000")).toBe(false);
		expect(
			isVolumeRoot(
				"content://com.android.externalstorage.documents/tree/1A2B-3C4D%3ADCIM",
				"1A2B-3C4D",
			),
		).toBe(false);
	});

	it("builds the address of a file below the granted folder", () => {
		expect(safDocUri(tree, "1A2B-3C4D", "")).toBe(tree);
		expect(safDocUri(tree, "1A2B-3C4D", "DCIM/My Photos/a b.jpg")).toBe(
			`${tree}/document/1A2B-3C4D%3ADCIM%2FMy%20Photos%2Fa%20b.jpg`,
		);
	});

	it("starts the picker at the top of the card", () => {
		expect(safInitialUri("1A2B-3C4D")).toBe(
			"content://com.android.externalstorage.documents/document/1A2B-3C4D%3A",
		);
	});
});
