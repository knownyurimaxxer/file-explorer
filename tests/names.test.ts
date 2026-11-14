import { describe, expect, it } from "vitest";
import { uniqueName } from "../src/utils/names";

const taken = (...names: string[]) => new Set(names.map((n) => n.toLowerCase()));

describe("uniqueName", () => {
	it("keeps a name that is free", () => {
		expect(uniqueName("a.txt", false, taken("b.txt"))).toBe("a.txt");
	});

	it("puts the number before the extension", () => {
		expect(uniqueName("photo.jpg", false, taken("photo.jpg"))).toBe(
			"photo (1).jpg",
		);
	});

	it("goes on counting while the names are taken", () => {
		expect(
			uniqueName("a.txt", false, taken("a.txt", "a (1).txt", "a (2).txt")),
		).toBe("a (3).txt");
	});

	it("doesn't tell capitals apart", () => {
		expect(uniqueName("Photo.JPG", false, taken("photo.jpg"))).toBe(
			"Photo (1).JPG",
		);
	});

	it("adds the number at the end of a folder name, dots and all", () => {
		expect(uniqueName("Books", true, taken("books"))).toBe("Books (1)");
		expect(uniqueName("v1.2", true, taken("v1.2"))).toBe("v1.2 (1)");
	});

	it("treats a name that only starts with a dot as having no extension", () => {
		expect(uniqueName(".nomedia", false, taken(".nomedia"))).toBe(
			".nomedia (1)",
		);
	});

	it("only splits at the last dot", () => {
		expect(uniqueName("backup.tar.gz", false, taken("backup.tar.gz"))).toBe(
			"backup.tar (1).gz",
		);
	});
});
