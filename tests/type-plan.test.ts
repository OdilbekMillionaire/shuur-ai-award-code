import { describe, expect, it } from "vitest";
import {
  clampTypeCount,
  plannedItemsFor,
  totalPlannedItems,
} from "../src/games/type-plan.js";

describe("game planning", () => {
  it("clamps counts to safe per-type bounds", () => {
    expect(clampTypeCount("mcq", 100)).toBe(30);
    expect(clampTypeCount("crossword", 2)).toBe(4);
    expect(clampTypeCount("memorypair", undefined)).toBe(2);
  });

  it("treats crossword and word search as one puzzle item", () => {
    expect(plannedItemsFor("crossword", 10)).toBe(1);
    expect(plannedItemsFor("wordsearch", 12)).toBe(1);
  });

  it("calculates the effective number of game items", () => {
    expect(
      totalPlannedItems(["mcq", "crossword", "tf"], {
        mcq: 5,
        crossword: 10,
        tf: 4,
      }),
    ).toBe(10);
  });
});
