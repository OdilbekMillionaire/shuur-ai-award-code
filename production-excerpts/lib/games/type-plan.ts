import type { GameType } from "@/lib/ai/schemas";
import { localeMeta, type Locale } from "@/lib/i18n/locales";

/**
 * The question-count contract. Client-safe on purpose: constants + pure math
 * only, so UI, server validation, and the generation pipeline can share the
 * same rules.
 */
export function supportedTypesFor(
  types: readonly GameType[],
  language: Locale,
): GameType[] {
  const unsupported = new Set(localeMeta(language).unsupportedModes);
  return types.filter((type) => !unsupported.has(type));
}

export function isModeSupported(type: GameType, language: Locale): boolean {
  return !localeMeta(language).unsupportedModes.includes(type);
}

export const MIN_TOTAL_ITEMS = 1;
export const MAX_TOTAL_ITEMS = 60;

export const SINGLE_PUZZLE_TYPES = ["crossword", "wordsearch"] as const;
export type SinglePuzzleType = (typeof SINGLE_PUZZLE_TYPES)[number];

export function isSinglePuzzleType(type: GameType): type is SinglePuzzleType {
  return (SINGLE_PUZZLE_TYPES as readonly GameType[]).includes(type);
}

export interface TypeCountRule {
  min: number;
  max: number;
  defaultCount: number;
}

export const TYPE_COUNT_RULES: Record<GameType, TypeCountRule> = {
  mcq: { min: 1, max: 30, defaultCount: 5 },
  tf: { min: 1, max: 30, defaultCount: 5 },
  fill: { min: 1, max: 30, defaultCount: 5 },
  match: { min: 1, max: 20, defaultCount: 4 },
  sequence: { min: 1, max: 20, defaultCount: 4 },
  sort: { min: 1, max: 20, defaultCount: 4 },
  crossword: { min: 4, max: 12, defaultCount: 8 },
  wordsearch: { min: 4, max: 12, defaultCount: 8 },
  unjumble: { min: 1, max: 20, defaultCount: 4 },
  speedtap: { min: 1, max: 15, defaultCount: 3 },
  flashcard: { min: 1, max: 30, defaultCount: 5 },
  challenge: { min: 1, max: 15, defaultCount: 5 },
  oddoneout: { min: 1, max: 30, defaultCount: 5 },
  placeline: { min: 1, max: 20, defaultCount: 4 },
  cloze: { min: 1, max: 15, defaultCount: 3 },
  anagram: { min: 1, max: 20, defaultCount: 4 },
  swipejudge: { min: 1, max: 10, defaultCount: 2 },
  errorhunt: { min: 1, max: 20, defaultCount: 4 },
  memorypair: { min: 1, max: 10, defaultCount: 2 },
  wordrescue: { min: 1, max: 20, defaultCount: 4 },
};

export function clampTypeCount(type: GameType, raw: number | undefined): number {
  const rule = TYPE_COUNT_RULES[type];
  if (raw === undefined || !Number.isFinite(raw)) return rule.defaultCount;
  return Math.min(Math.max(Math.round(raw), rule.min), rule.max);
}

export function plannedItemsFor(type: GameType, count: number | undefined): number {
  return isSinglePuzzleType(type) ? 1 : clampTypeCount(type, count);
}

export function totalPlannedItems(
  types: readonly GameType[],
  countsPerType: Partial<Record<GameType, number>>,
): number {
  return types.reduce((sum, type) => sum + plannedItemsFor(type, countsPerType[type]), 0);
}

const TYPE_SECONDS: Record<GameType, number> = {
  mcq: 20,
  tf: 12,
  fill: 25,
  match: 45,
  sequence: 40,
  sort: 45,
  crossword: 0,
  wordsearch: 0,
  unjumble: 35,
  speedtap: 30,
  flashcard: 25,
  challenge: 15,
  oddoneout: 18,
  placeline: 20,
  cloze: 40,
  anagram: 35,
  swipejudge: 50,
  errorhunt: 40,
  memorypair: 60,
  wordrescue: 45,
};
const PUZZLE_SECONDS_PER_WORD = 20;

export function estimatedPlaySeconds(
  types: readonly GameType[],
  countsPerType: Partial<Record<GameType, number>>,
): number {
  return types.reduce((sum, type) => {
    const count = clampTypeCount(type, countsPerType[type]);
    if (isSinglePuzzleType(type)) return sum + count * PUZZLE_SECONDS_PER_WORD;
    return sum + count * TYPE_SECONDS[type];
  }, 0);
}

export function estimatedPlayMinutes(
  types: readonly GameType[],
  countsPerType: Partial<Record<GameType, number>>,
): { min: number; max: number } | null {
  const seconds = estimatedPlaySeconds(types, countsPerType);
  if (seconds <= 0) return null;
  return {
    min: Math.max(1, Math.round((seconds * 0.75) / 60)),
    max: Math.max(1, Math.ceil((seconds * 1.35) / 60)),
  };
}
