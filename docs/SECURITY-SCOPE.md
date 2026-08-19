# Security and Disclosure Scope

This repository is intentionally narrower than the private production SHUUR repository.

## Included

Only material that is both technically useful to an evaluator and safe to disclose publicly is included. That means selected production excerpts, reduced evaluation code, documentation, and tests that demonstrate the architecture without granting access to production systems.

## Excluded

The following classes of information are deliberately excluded:

- API keys, tokens, OAuth secrets, cookies, and credentials;
- cloud service-account material;
- production environment values and deployment bindings;
- signing certificates and mobile signing material;
- user data, uploaded educational materials, analytics, logs, or identifiers;
- privileged admin logic and internal operational tooling;
- production anti-abuse details whose disclosure would increase attack surface;
- complete proprietary prompt libraries and full product implementation;
- private Git history from the production repository.

## Why this is a separate repository

The production repository remains private to protect users, infrastructure, and proprietary implementation details. This repository was created from a fresh public history so that no deleted secret or historical production value can remain reachable through earlier commits.

## Review principle

The objective is verifiability, not source-code publication. Reviewers can inspect genuine production-derived components and run the reduced validation pipeline without requiring production credentials or access to private infrastructure.
