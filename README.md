# SHUUR — President AI Award Technical Evaluation Repository

This public repository contains a **security-sanitized technical excerpt of the production SHUUR codebase**, prepared for technical review in connection with the President AI Award application.

**Live product:** https://shuur.uz

The complete production repository remains private because it contains deployment configuration, security-sensitive implementation details, infrastructure bindings, operational tooling, and proprietary product logic that should not be exposed publicly.

## What SHUUR does

SHUUR turns a teacher's learning materials into interactive classroom activities. In production, the system can process materials such as documents, slides, links, YouTube content, audio, images/scanned pages, and topic-based input, then generate structured learning content that is validated before it becomes playable.

The production architecture follows this core path:

```text
Teacher material
      ↓
Extraction / OCR / transcription
      ↓
Context assembly
      ↓
AI structured generation
      ↓
Schema validation + retry safeguards
      ↓
Game-type transformation
      ↓
Interactive classroom play
      ↓
Participation / performance analytics
```

## What is included here

This repository intentionally contains two kinds of material:

1. **Verbatim safe production excerpts** — selected files copied from the private production repository because they contain no credentials, user data, signing material, or production secrets.
2. **A runnable evaluation-safe pipeline demo** — a compact, dependency-light representation of the same production design principles: structured AI output, strict validation, retry-on-invalid-output, game planning, and tests.

The public demo is not a mock-up of a different product. It is an intentionally reduced disclosure surface derived from the production architecture so reviewers can inspect the technical approach without requiring the production repository to be made public.

## Repository map

```text
.
├── production-excerpts/       # Safe verbatim excerpts from the private production repo
│   └── lib/
│       ├── ai/model.ts
│       └── games/type-plan.ts
├── src/                       # Runnable security-sanitized evaluation code
│   ├── ai/
│   │   ├── context.ts
│   │   ├── pipeline.ts
│   │   └── schemas.ts
│   └── games/type-plan.ts
├── tests/                     # Validation and planning tests
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CODE-PROVENANCE.md
│   └── SECURITY-SCOPE.md
├── .env.example               # Variable names only — no credentials
├── package.json
└── tsconfig.json
```

## Run the evaluation code

Requirements: Node.js 20+.

```bash
npm install
npm test
npm run typecheck
```

No API key is required to run the tests. The AI boundary is dependency-injected and tests use a deterministic fake model client. This allows reviewers to verify the validation/retry architecture without receiving access to production cloud credentials.

## Technical principles demonstrated

- **Structured AI output rather than unvalidated free text**
- **Runtime schema validation before generated content is accepted**
- **Retry after malformed model output**
- **Bounded game-size rules shared between generation and product logic**
- **Single-puzzle semantics for crossword/word-search modes**
- **Hard context limits before model submission**
- **Environment-based model configuration with no hard-coded secret**

## Security disclosure

This repository deliberately does **not** contain:

- API keys or OAuth secrets
- Firebase service-account JSON
- production database identifiers or credentials
- Vercel environment values
- signing certificates / Android keystores
- private admin configuration
- user records, analytics data, uploaded materials, or logs
- proprietary full production prompts
- anti-abuse / privileged operational internals
- full production deployment configuration

See [`docs/SECURITY-SCOPE.md`](docs/SECURITY-SCOPE.md) for the disclosure policy.

## Code provenance

The private production repository is `OdilbekMillionaire/shuur.uz`. It remains private. The mapping between files in this repository and production components is documented in [`docs/CODE-PROVENANCE.md`](docs/CODE-PROVENANCE.md).

## Ownership

SHUUR is developed and operated by **OXFORDER LLC**. This public repository is provided for technical evaluation and transparency. Unless expressly stated otherwise, no open-source license is granted for the proprietary SHUUR source code contained here.
