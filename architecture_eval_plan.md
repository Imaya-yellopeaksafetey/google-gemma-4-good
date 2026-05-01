# Architecture Eval Plan

## Goal

Evaluate whether the new architecture improves the demo-relevant grounded behavior without expanding benchmark scope.

## First benchmark subset

Use the frozen Bronze core only.

First optimization subset:

- strong demo-safe families:
  - `sf_paraquat_eye_01`
  - `sf_fastac_eye_01`
  - `sf_glyphosate_eye_01`
  - `sf_24d_inhalation_01`
- weak guarded families:
  - `sf_glufosinate_ingestion_01`
  - `sf_paraquat_inhalation_01`
  - `sf_24d_ingestion_01`
  - `sf_24d_eye_01`

Why this subset:

- it directly matches the planned architecture behavior
- it tests both the fast path and the guarded path

## What to optimize first

### For strong families

Optimize for:

- slot-verification pass rate
- action-order stability
- no downgrade when not needed
- strong multilingual consistency

### For weak families

Optimize for:

- safe guarded responses
- no unsupported detail leakage
- clear fallback reason
- no dangerous over-answering

## Success criteria before app integration

### Strong-family criteria

All first-demo families should satisfy:

- grounded average remains at or above current safe-demo level
- no repeated `missed_required_action` pattern
- strong-lane verification pass rate is high enough that the demo does not depend on frequent downgrades

### Weak-family criteria

Weak families should satisfy:

- guarded mode prevents unsupported detail leakage
- guarded outputs remain worker-usable
- dangerous unsupported claims are reduced versus current grounded behavior

### Overall criteria

- the architecture improves safety posture without flattening strong-family performance
- the response-mode distinction is visible enough to matter in demo evaluation

## How to evaluate novelty impact, not just wording

Do not only compare average scores.

Track:

- strong-lane release rate
- downgrade rate
- guarded-mode activation rate on weak families
- unsupported-detail suppression count
- missed-required-slot block count

If those improve while strong-family quality remains high, the novelty is doing real work.

## Failure cases that block rollout to first demo

Block rollout if any of these happen:

1. strong demo-safe families frequently downgrade because the slot verifier is too brittle
2. weak-family guarded mode still leaks unsupported detail
3. multilingual guarded outputs become awkward or confusing
4. strong-family action order degrades relative to current grounded benchmark
5. the architecture looks like hidden internal complexity without visible user benefit

## Evaluation sequence

1. simulate the architecture on the strong demo-safe family subset
2. verify strong-lane slot pass rates
3. simulate guarded mode on the weak families
4. verify unsupported-detail suppression
5. compare against current Phase 6 grounded outputs
6. only then decide whether to start app integration

## Decision gate

Move to app integration only when:

- strong-family demo flows remain clearly excellent
- weak-family fallback looks deliberate and intelligent
- the new response modes are visibly more defensible than plain grounded chat
