import { describe, expect, it } from "vitest";
import {
	canPreview,
	kindOf,
	mimeOf,
	statCategory,
} from "../src/utils/fileTypes";

describe("kindOf", () => {
	it("recognizes the common kinds, whatever the capitals", () => {
		expect(kindOf("a.JPG", false)).toBe("image");
		expect(kindOf("a.mkv", false)).toBe("video");
		expect(kindOf("a.flac", false)).toBe("audio");
		expect(kindOf("a.pdf", false)).toBe("document");
		expect(kindOf("a.7z", false)).toBe("archive");
		expect(kindOf("a.apk", false)).toBe("apk");
		expect(kindOf("a.py", false)).toBe("code");
	});

	it("calls folders folders, and unknown things other", () => {
		expect(kindOf("movie.mp4", true)).toBe("folder");
		expect(kindOf("mystery.xyz", false)).toBe("other");
		expect(kindOf("README", false)).toBe("other");
	});
});

describe("statCategory", () => {
	it("counts code as documents", () => {
		expect(statCategory("code")).toBe("document");
		expect(statCategory("image")).toBe("image");
		expect(statCategory("other")).toBe("other");
	});
});

describe("mimeOf", () => {
	it("gives the type the system uses to pick an app", () => {
		expect(mimeOf("a.pdf")).toBe("application/pdf");
		expect(mimeOf("a.jpg")).toBe("image/jpeg");
		expect(mimeOf("a.apk")).toBe("application/vnd.android.package-archive");
	});

	it("sends text-like files as text and unknown ones as anything", () => {
		expect(mimeOf("notes.txt")).toBe("text/plain");
		expect(mimeOf("main.py")).toBe("text/plain");
		expect(mimeOf("mystery.xyz")).toBe("*/*");
	});
});

describe("canPreview", () => {
	it("only offers previews for pictures the phone can draw", () => {
		expect(canPreview("a.png")).toBe(true);
		expect(canPreview("a.heic")).toBe(false);
		expect(canPreview("a.pdf")).toBe(false);
	});
});
