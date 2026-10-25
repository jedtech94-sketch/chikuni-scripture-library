import { describe, expect, it } from "vitest";
import { highlightParts, search } from "./search";

describe("search", () => {
  it("finds words of Jesus in John 1 under New Testament filter", () => {
    const hits = search("come and see", "nt");
    expect(hits.some((h) => h.title === "John 1:39")).toBe(true);
  });
  it("Old Testament filter excludes John", () => {
    const hits = search("beginning", "ot");
    expect(hits.every((h) => h.title.startsWith("Genesis"))).toBe(true);
  });
  it("Ethiopian filter finds 1 Enoch", () => {
    expect(search("ten thousands", "eth")[0].title).toBe("1 Enoch 1:9");
  });
  it("highlights matches case-insensitively", () => {
    expect(highlightParts("The Word was God", "word").filter((p) => p.hit)).toHaveLength(1);
  });
});
