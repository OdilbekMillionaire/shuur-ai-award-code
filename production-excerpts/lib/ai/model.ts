/**
 * The pinned Gemini model — the ONE place the id lives (CLAUDE.md).
 *
 * Split out of `lib/ai/vertex.ts` so it can be imported by tooling that runs
 * OUTSIDE Next: `vertex.ts` starts with `import "server-only"`, a package Next
 * provides and plain Node does not have at all, so importing it from a script
 * fails with "Cannot find module 'server-only'".
 *
 * `scripts/i18n-draft.mjs` needs the model id and nothing else from that file,
 * and duplicating the string there would mean a rollback that changed the
 * product silently left the translation drafter on the old model. This module
 * has no imports at all, so anything can read it.
 */

export const DEFAULT_MODEL = "gemini-3.7-flash";

/**
 * The automatic safety net — the model we were serving BEFORE the current pin,
 * so a fallback lands on something known-good in EU multi-region rather than on
 * something ancient. Moved 3.5 → 3.6 on 2026-08-18: Google has already started
 * pulling `gemini-3.5-flash` from the `global` region (removal postponed
 * 2026-08-06, no new date published), and a safety net that is itself being
 * retired is not a safety net.
 */
export const MODEL_FALLBACK = "gemini-3.6-flash";

/**
 * ROLLBACK is an env var, not a deploy: set `GEMINI_MODEL_ID` on Vercel to
 * `gemini-3.6-flash` and redeploy.
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL_ID?.trim() || DEFAULT_MODEL;

/** Vertex endpoint. `eu` multi-region — single-region does not carry the model. */
export function vertexLocation(): string {
  return process.env.VERTEX_AI_LOCATION || "eu";
}

/**
 * The GCP project, from the explicit env var or — failing that — out of the
 * service-account JSON itself, which always carries `project_id`. Saves
 * setting a second secret that is not actually a secret.
 */
export function vertexProject(): string | undefined {
  const explicit =
    process.env.GOOGLE_CLOUD_PROJECT ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (explicit) return explicit;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trimStart().startsWith("{")) return undefined;
  try {
    return (JSON.parse(raw) as { project_id?: string }).project_id;
  } catch {
    return undefined;
  }
}
