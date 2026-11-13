import { describe, expect, it } from "vitest";
import { OPEN_PROVIDER_SUFFIX, providerUriFor } from "../src/utils/openUri";

const APP = "com.example.app";
const BASE = `content://${APP}${OPEN_PROVIDER_SUFFIX}/root`;

describe("providerUriFor", () => {
	it("turns a file address into one on the app's own provider", () => {
		expect(
			providerUriFor("file:///storage/emulated/0/Download/a.pdf", APP),
		).toBe(`${BASE}/storage/emulated/0/Download/a.pdf`);
	});

	it("works for files on an SD card", () => {
		expect(providerUriFor("file:///storage/1A2B-3C4D/DCIM/x.jpg", APP)).toBe(
			`${BASE}/storage/1A2B-3C4D/DCIM/x.jpg`,
		);
	});

	it("encodes each part once, keeping the slashes", () => {
		// already percent-encoded in the file address: decoded, then encoded again
		expect(
			providerUriFor(
				"file:///storage/emulated/0/My%20Docs/a%20b%20%231.txt",
				APP,
			),
		).toBe(`${BASE}/storage/emulated/0/My%20Docs/a%20b%20%231.txt`);
		// a literal percent sign that isn't a valid escape
		expect(providerUriFor("file:///storage/emulated/0/100%.txt", APP)).toBe(
			`${BASE}/storage/emulated/0/100%25.txt`,
		);
	});

	it("keeps the characters Android's Uri.encode leaves alone", () => {
		const name = "a_b-c.d!e~f'g(h)i*j";
		expect(providerUriFor(`file:///storage/emulated/0/${name}`, APP)).toBe(
			`${BASE}/storage/emulated/0/${name}`,
		);
	});

	it("gives null for anything that isn't a plain file address", () => {
		expect(providerUriFor("content://media/external/file/1", APP)).toBeNull();
		expect(providerUriFor("/storage/emulated/0/a.txt", APP)).toBeNull();
		expect(providerUriFor("file://relative/a.txt", APP)).toBeNull();
	});
});
