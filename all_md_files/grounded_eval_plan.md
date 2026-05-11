# Grounded Eval Plan

## Goal

Add a `grounded` mode to the eval harness that keeps the same:
- row file
- split logic
- scoring logic
- normalization logic
- output contract

Only the model input condition changes.

## Grounded Input Contract

In grounded mode, each model call receives:

1. the original `user_prompt`
2. explicit chemical or product identity
3. explicit incident type
4. minimal SDS-grounded context for that exact chemical + incident pair

The harness now builds grounded input from the linked scenario family object.

## Exact Injected Context

For each row, grounded mode injects:
- `Chemical/Product: <chemical_name>`
- `Incident Type: <incident_type>`
- `Minimal SDS-grounded context:`
- one bullet per canonical immediate action, in source order
- one bullet per `do_not_do` rule
- one bullet per escalation trigger

This context is intentionally narrow:
- no full SDS excerpt
- no unrelated sections
- no extra chemical background
- no split or label metadata
- no scoring hints

## Why This Context

This is the minimum useful grounded condition because it:
- preserves the original worker prompt as the center of the task
- disambiguates chemical-dependent first aid
- keeps the grounding tied to the exact incident type
- gives the model only the immediate first-aid content needed to answer
- allows a clean comparison against baseline because normalization and scoring stay unchanged

## Output Contract

Grounded mode keeps the same required answer format:

```text
STEP 1: ...
STEP 2: ...
STEP 3: ...
DO NOT: ...
ESCALATE: ...
```

Empty sections may still be omitted when truly not needed.

## Harness Behavior

The harness now supports:
- `--mode baseline`
- `--mode grounded`

Grounded mode uses the same:
- benchmark file
- family manifest
- split manifest
- scenario family truth file
- predictions output schema
- scores output schema
- report structure

The only difference is the constructed model-facing user content.

## Run Gate

Do not run grounded eval until:
1. repaired baseline completes successfully
2. calibration audit is completed
3. the scorer is judged directionally reasonable

## Current status

- Grounded mode is implemented in the eval harness.
- The repaired deterministic scorer is available, but the post-repair calibration check still showed mixed calibration.
- The official target architecture is now hybrid scoring:
  - deterministic code scoring for order and unsupported advice
  - Azure LLM judge scoring for correctness, omission, usability, and grounding
- Grounded eval should wait until:
  - Azure judge env vars are configured
  - the hybrid scoring path is runnable
  - baseline-vs-grounded comparison can use the hybrid score rather than deterministic-only scoring
