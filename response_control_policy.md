# Response Control Policy

## Purpose

This policy defines how the chosen architecture changes model behavior based on family strength, family confidence, and slot-verification status.

## Response modes

The model may emit only one of these modes:

- `full_guided_response`
- `guarded_minimum_response`
- `guarded_escalate_now`

## Policy variables

The controller decides from:

- `family_id`
- `family_strength`
  - `strong_demo_safe`
  - `weak_guarded`
- `family_confidence`
  - `high`
  - `medium`
  - `low`
- `slot_verification_status`
  - `pass`
  - `fail`
- `unsupported_detail_risk`
  - `low`
  - `high`

## Strong-family policy

Applies to:

- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01`

### If family confidence is high and slot verification passes

Use:

- `full_guided_response`

Behavior:

- provide full stepwise actions
- provide do-not-do warnings
- provide escalation triggers
- keep answer compressed and urgent
- include visible evidence basis at the family/source level

### If family confidence is not high

Use:

- `guarded_minimum_response`

Behavior:

- do not force a full answer from a shaky classification
- provide only the safest immediate actions that are robust across the family interpretation
- ask for clarification only if absolutely necessary for safe next action
- foreground escalation

### If slot verification fails

Use:

- `guarded_minimum_response`

Behavior:

- downgrade automatically
- do not release the full planned answer
- expose a conservative, source-safe subset only

## Weak-family policy

Applies to:

- `sf_glufosinate_ingestion_01`
- `sf_paraquat_inhalation_01`
- `sf_24d_ingestion_01`
- `sf_24d_eye_01`

Default mode:

- `guarded_minimum_response`

Behavior:

- never attempt a maximal step-rich answer just because the model can sound fluent
- only emit:
  - safe immediate actions with the strongest support
  - critical do-not-do rules
  - immediate escalation wording
- explicitly suppress speculative or low-support detail

## When the model gives full stepwise response

Only when all of the following are true:

1. family is in `strong_demo_safe`
2. family confidence is `high`
3. slot verification passes
4. unsupported detail risk is `low`

## When the model gives conservative response plus escalation

Triggered when any of these are true:

- family is weak
- family confidence is not high
- required action slots are missing
- unsupported detail risk is high
- answer planner proposes content outside the allowed family envelope

## Unsupported-detail suppression rules

The model must suppress:

- medical explanation beyond the grounded action contract
- speculative treatment detail
- cross-incident instructions
- generic filler advice
- extra procedural steps not in the allowed lane contract

If a step cannot be defended by the family truth:

- it is not emitted

## Evidence-basis policy

The model should indicate evidence basis in compact form:

- family/source linked
- not raw SDS prose
- not long citations

Example policy output:

- `Based on the first-aid guidance for this chemical and exposure type`

## Multilingual policy

The model must:

- answer in the worker language
- keep action order stable across languages
- keep escalation meaning stable across languages
- keep guarded-vs-full mode visible across languages

## Novelty-defining behavior

This policy is the novelty core:

- the model is not only generating content
- it is deciding whether it is safe to generate a full response at all
