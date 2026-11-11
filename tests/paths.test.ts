import { describe, expect, it } from "vitest";
import {
	baseName,
	crumbsBelow,
	extensionOf,
	isInside,
	parentUri,
	relativePath,
	sameUri,
	trimSlash,
} from "../src/utils/paths";

const ROOT = "file:///storage/emulated/0";

describe("trimSlash and sameUri", () => {
	it("ignores trailing slashes", () => {
		expect(trimSlash(`${ROOT}/Download/`)).toBe(`${ROOT}/Download`);
		expect(sameUri(`${ROOT}/`, ROOT)).toBe(true);
		expect(sameUri(`${ROOT}/a`, `${ROOT}/b`)).toBe(false);
	});
});

describe("parentUri", () => {
	it("goes up one folder", () => {
		expect(parentUri(`${ROOT}/Download/Books/`)).toBe(`${ROOT}/Download`);
		expect(parentUri(`${ROOT}/Download`)).toBe(ROOT);
	});

	it("stops at the top of the file system", () => {
		expect(parentUri("file:///storage")).toBe("file:///");
		expect(parentUri("file:///")).toBe("file:///");
	});
});

describe("isInside", () => {
	it("accepts the folder itself and anything below it", () => {
		expect(isInside(ROOT, ROOT)).toBe(true);
		expect(isInside(`${ROOT}/a/b`, `${ROOT}/`)).toBe(true);
	});

	it("does not confuse folders that share a prefix", () => {
		expect(isInside(`${ROOT}/Download2`, `${ROOT}/Download`)).toBe(false);
		expect(isInside("file:///storage/ABCD-1234/x", ROOT)).toBe(false);
	});
});

describe("baseName and crumbsBelow", () => {
	it("decodes names for display", () => {
		expect(baseName(`${ROOT}/My%20Files/`)).toBe("My Files");
		expect(baseName(`${ROOT}/100%/`)).toBe("100%"); // not valid encoding: left alone
	});

	it("lists the folders between the root and here, with addresses", () => {
		expect(crumbsBelow(`${ROOT}/Download/My%20Books/`, ROOT)).toEqual([
			{ name: "Download", uri: `${ROOT}/Download` },
			{ name: "My Books", uri: `${ROOT}/Download/My%20Books` },
		]);
		expect(crumbsBelow(ROOT, ROOT)).toEqual([]);
		expect(crumbsBelow("file:///elsewhere", ROOT)).toEqual([]);
	});

	it("gives a readable relative path", () => {
		expect(relativePath(`${ROOT}/Download/My%20Books`, ROOT)).toBe(
			"Download/My Books",
		);
		expect(relativePath(ROOT, ROOT)).toBe("");
	});
});

describe("extensionOf", () => {
	it("lower-cases and skips the dot", () => {
		expect(extensionOf("Photo.JPG")).toBe("jpg");
		expect(extensionOf("archive.tar.gz")).toBe("gz");
	});

	it("returns nothing for names without a real extension", () => {
		expect(extensionOf("README")).toBe("");
		expect(extensionOf(".bashrc")).toBe("");
		expect(extensionOf("trailing.")).toBe("");
	});
});
