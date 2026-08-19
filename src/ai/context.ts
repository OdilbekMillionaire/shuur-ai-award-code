const CONTEXT_HARD_CAP_CHARS = 100_000;

export function assembleContext(materials: readonly string[]): string {
  const cleaned = materials
    .map((material) => material.trim())
    .filter(Boolean);

  if (cleaned.length === 0) {
    throw new Error("no_materials");
  }

  return cleaned.join("\n\n---\n\n").slice(0, CONTEXT_HARD_CAP_CHARS);
}

export { CONTEXT_HARD_CAP_CHARS };
