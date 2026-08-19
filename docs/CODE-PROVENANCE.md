# Code Provenance

The production SHUUR application is maintained in the private repository `OdilbekMillionaire/shuur.uz`. This public repository is a deliberately limited technical disclosure prepared for evaluation.

## Verbatim production excerpts

The following files are copied from the production codebase without credentials or production values:

- `production-excerpts/lib/ai/model.ts` — model-selection and environment-bound configuration pattern.
- `production-excerpts/lib/games/type-plan.ts` — game-type count rules, single-puzzle semantics, language-aware mode filtering, and play-time estimation.

These excerpts are included to let reviewers inspect genuine production code while keeping the complete application private.

## Evaluation-safe implementation

Files under `src/` are compact, self-contained representations of production design principles. They are intentionally reduced so they can be run without production infrastructure:

- `src/ai/context.ts` — bounded context assembly;
- `src/ai/schemas.ts` — runtime validation of generated game payloads;
- `src/ai/pipeline.ts` — model boundary, structured generation, validation, and retry;
- `src/games/type-plan.ts` — standalone game planning rules used by the demo.

These files should not be interpreted as the full production implementation. They are provided to make the architecture reviewable and runnable without publishing proprietary prompts, privileged infrastructure logic, or user-facing application code.

## Production relationship

The public repository demonstrates the same key engineering principles used by SHUUR in production: bounded input, structured AI output, runtime validation, retry safeguards, and explicit game-mode constraints. The live product remains available at https://shuur.uz.
