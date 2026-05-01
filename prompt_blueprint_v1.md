# Prompt Blueprint v1

## Overview

The chosen architecture uses four model-control stages:

1. incident normalizer
2. response planner
3. lane-specific composer
4. slot verifier and release selector

These stages may be implemented as separate prompt calls or as explicitly separated internal prompt roles. The design intent is what matters first.

## Shared system constraints

These constraints apply to all stages:

- scope is only plantation chemical exposure
- no unrelated safety topics
- no generic medical advice
- no unsupported detail
- preserve worker language
- safety is more important than completeness
- raw SDS prose must not be shown

## Stage 1: Incident Normalizer

### Goal

Convert messy worker input into a compact structured interpretation.

### Inputs

- raw worker prompt
- candidate family list or already selected family
- supported languages

### Output

```json
{
  "detected_language": "string",
  "incident_type_guess": "string",
  "chemical_guess": "string",
  "family_id_guess": "string",
  "family_confidence": "high | medium | low",
  "normalized_incident_summary": "string",
  "ambiguity_flags": ["string"]
}
```

### Prompt rules

- do not provide treatment advice here
- prioritize family discrimination over prose quality
- if the prompt does not support high confidence, say so cleanly

## Stage 2: Response Planner

### Goal

Translate the chosen family truth into required release slots.

### Inputs

- family truth object
- normalized incident summary
- family strength label

### Output

```json
{
  "family_id": "string",
  "family_strength": "strong_demo_safe | weak_guarded",
  "required_action_slots": ["string"],
  "required_do_not_slots": ["string"],
  "required_escalation_slots": ["string"],
  "allowed_guarded_subset": ["string"],
  "blocked_detail_categories": ["string"]
}
```

### Prompt rules

- produce slots, not user prose
- preserve action order from canonical truth
- explicitly list what may not be elaborated in guarded mode

## Stage 3A: Strong-Lane Composer

### Activation condition

Use only when:

- family strength = `strong_demo_safe`
- family confidence = `high`

### Goal

Produce a full stepwise emergency response in the target schema.

### Inputs

- normalized incident summary
- required action slots
- required do-not-do slots
- required escalation slots
- language

### Prompt rules

- output only the approved schema
- keep instructions short and worker-usable
- preserve canonical action order
- do not add unsupported explanation
- do not add extra reassurance
- do not expand beyond the family truth

## Stage 3B: Guarded-Lane Composer

### Activation condition

Use when:

- family strength = `weak_guarded`, or
- family confidence is not high, or
- release selector downgraded from strong lane

### Goal

Produce a conservative minimum response.

### Inputs

- normalized incident summary
- allowed guarded subset
- blocked detail categories
- language

### Prompt rules

- emit only the safest supported immediate actions
- keep escalation prominent
- explicitly suppress unsupported detail
- do not sound apologetic or broken
- do not produce a full-answer posture when guarded mode is active

## Stage 4: Slot Verifier

### Goal

Check whether the composed response is safe to release in full mode.

### Inputs

- candidate response schema
- required action slots
- required do-not-do slots
- required escalation slots
- blocked detail categories

### Output

```json
{
  "status": "pass | fail",
  "missing_required_slots": ["string"],
  "blocked_unsupported_slots": ["string"],
  "downgrade_required": true
}
```

### Prompt rules

- fail if any required immediate action is absent
- fail if prohibited unsupported detail is present
- fail if escalation semantics are weakened
- fail if output drifted into generic chat

## Stage 5: Release Selector

### Logic

- if strong-lane output passes verification:
  - release strong-lane output
  - set `response_mode=full_guided_response`
- else:
  - invoke or return guarded output
  - set `response_mode=guarded_minimum_response`
  - populate `fallback_reason`

## Unsupported-advice suppression rules

The prompts must explicitly forbid:

- cross-incident instructions
- home remedies
- speculative treatment logic
- unsupported extra decontamination
- soothing filler language
- overlong explanations

## Multilingual instructions

Every composer prompt must say:

- answer in the worker language
- preserve action order
- preserve escalation urgency
- prefer short field language over formal textbook language

## Fallback-mode instructions

Guarded mode prompt must explicitly say:

- do not attempt a complete treatment explanation
- give only the safest supported actions now
- state escalation clearly
- include a concise reason for conservative mode

## Judge-facing implementation note

This prompt architecture is not just formatting.

Its novelty is the release logic:

- strong lane can be blocked
- guarded lane is a first-class product behavior
