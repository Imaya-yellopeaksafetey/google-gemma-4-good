# Response Schema v1

## Design goal

The schema is designed for emergency control, not chat richness.

It must support:

- strong-family full responses
- weak-family guarded responses
- visible safety mode
- later mobile rendering without redesign

## Top-level schema

```json
{
  "response_mode": "full_guided_response | guarded_minimum_response | guarded_escalate_now",
  "family_id": "string",
  "family_strength": "strong_demo_safe | weak_guarded",
  "family_confidence": "high | medium | low",
  "language": "string",
  "incident_summary": "string",
  "immediate_actions": [
    {
      "slot": "string",
      "instruction": "string",
      "source_support": "direct | constrained",
      "required": true
    }
  ],
  "do_not_do": [
    {
      "instruction": "string",
      "source_support": "direct | constrained"
    }
  ],
  "escalate_now": {
    "required": true,
    "instruction": "string",
    "reason": "string"
  },
  "evidence_basis": {
    "chemical_name": "string",
    "incident_type": "string",
    "source_section_id": "string",
    "source_span_id": "string"
  },
  "fallback_reason": "string | null",
  "suppressed_detail_note": "string | null",
  "slot_verification": {
    "status": "pass | fail",
    "missing_required_slots": ["string"],
    "blocked_unsupported_slots": ["string"]
  }
}
```

## Field intent

### `response_mode`

Mandatory user-visible control state.

Why:

- judges should see that the system changes posture based on safety conditions

### `family_strength`

Internal-to-visible bridge.

Why:

- strong vs weak family behavior is part of the product novelty

### `incident_summary`

One-line normalized restatement of what the model believes happened.

Why:

- helps the worker confirm the model understood the event
- gives judges a visible interpretation stage

### `immediate_actions`

Ordered action slots only.

Each action should be short enough to render as a single mobile card row later.

### `source_support`

Possible values:

- `direct`
  - directly grounded in family truth
- `constrained`
  - allowed safe minimum wording used in guarded mode

### `do_not_do`

Critical prohibitions only.

This must remain short and prominent.

### `escalate_now`

Always present.

Even if escalation is not the first step, the field should exist so the UI can render it consistently.

### `evidence_basis`

Compact structured evidence handle only.

Do not include raw SDS prose.

### `fallback_reason`

Present only when the system did not release the full response.

Examples:

- `weak_family_guardrail`
- `missing_required_slots`
- `classification_not_confident`
- `unsupported_detail_risk`

### `suppressed_detail_note`

Short explanation of what the system intentionally chose not to elaborate.

This is important for judges because it makes risk handling visible.

### `slot_verification`

Internal control object that can also be logged for evaluation.

It should not necessarily be shown verbatim to workers, but the app can use it to render conservative mode.

## Rendered user version

The worker-facing rendering should usually show only:

- `incident_summary`
- `immediate_actions`
- `do_not_do`
- `escalate_now`
- compact `fallback_reason` only in guarded mode

## Why the old benchmark schema is not enough

The benchmark schema captures truth and evaluation rows, but not:

- response mode
- family strength
- fallback reason
- suppressed detail behavior
- slot verification state

Those are necessary for the new model-side novelty claim.
