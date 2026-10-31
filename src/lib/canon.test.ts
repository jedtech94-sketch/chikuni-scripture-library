import { describe, expect, it } from "vitest";
import { ALL_BOOKS, ETHIOPIAN, HISTORICAL, NEW_TESTAMENT, OLD_TESTAMENT } from "@/data/bible";

describe("canon registry", () => {
  it("holds 83 books: 39 OT, 27 NT, 8 Ethiopian, 9 historical", () => {
    expect([OLD_TESTAMENT.length, NEW_TESTAMENT.length, ETHIOPIAN.length, HISTORICAL.length]).toEqual([39, 27, 8, 9]);
    expect(ALL_BOOKS.length).toBe(83);
  });
});
