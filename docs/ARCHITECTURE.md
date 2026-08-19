# SHUUR Evaluation Architecture

This document describes the technical path demonstrated by this public evaluation repository. It is intentionally narrower than the private production system.

## Core flow

```text
Teacher material
      ↓
Extraction / OCR / transcription
      ↓
Context assembly and hard limits
      ↓
AI model request
      ↓
Structured JSON response
      ↓
Runtime schema validation
      ↓
Retry on malformed output
      ↓
Validated game payload
      ↓
Interactive classroom experience
```

## 1. Material processing

Production SHUUR supports multiple input forms. Material extraction is separated from generation so the model receives normalized text rather than being coupled directly to every file format.

## 2. Context assembly

Before model submission, extracted text is combined and bounded. The public demo includes a hard character cap to show the same defensive design principle used in production: uncontrolled input must not become uncontrolled model context.

## 3. Structured generation

The model boundary is represented by a small `ModelClient` interface. The AI is expected to return structured data rather than free-form prose.

## 4. Validation

Generated payloads are validated at runtime before acceptance. Invalid data is rejected and the pipeline may retry once with validation feedback. This prevents malformed AI output from being treated as trusted application data.

## 5. Game planning

Game-type counts are bounded by type-specific rules. Crossword and word-search modes use single-puzzle semantics: the selected count represents words inside one puzzle rather than a number of separate puzzles.

## 6. Security boundary

The public repository does not include production credentials, service-account material, private prompts, user data, deployment bindings, privileged admin internals, or the complete production source tree.

See `SECURITY-SCOPE.md` for the disclosure policy and `CODE-PROVENANCE.md` for the relationship between this repository and the private production codebase.
