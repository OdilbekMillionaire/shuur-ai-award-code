export const GAME_TYPES = [
  "mcq",
  "tf",
  "fill",
  "match",
  "sequence",
  "sort",
  "crossword",
  "wordsearch",
  "unjumble",
  "speedtap",
  "flashcard",
  "challenge",
  "oddoneout",
  "placeline",
  "cloze",
  "anagram",
  "swipejudge",
  "errorhunt",
  "memorypair",
  "wordrescue",
] as const;

export type GameType = (typeof GAME_TYPES)[number];

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

const SINGLE_PUZZLE_TYPES = new Set<GameType>(["crossword", "wordsearch"]);

export function isSinglePuzzleType(type: GameType): boolean {
  return SINGLE_PUZZLE_TYPES.has(type);
}

export function clampTypeCount(type: GameType, raw?: number): number {
  const rule = TYPE_COUNT_RULES[type];
  if (raw === undefined || !Number.isFinite(raw)) return rule.defaultCount;
  return Math.min(Math.max(Math.round(raw), rule.min), rule.max);
}

export function plannedItemsFor(type: GameType, count?: number): number {
  return isSinglePuzzleType(type) ? 1 : clampTypeCount(type, count);
}

export function totalPlannedItems(
  types: readonly GameType[],
  counts: Partial<Record<GameType, number>>,
): number {
  return types.reduce((total, type) => total + plannedItemsFor(type, counts[type]), 0);
}
