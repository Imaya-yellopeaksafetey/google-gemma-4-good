# Gemma 4 Good: QR-First Chemical Emergency Guidance for Plantation Workers

## Problem

Plantation workers facing chemical exposure do not need a long chatbot conversation. They need a fast, structured path from chemical identification to immediate next steps. In real field conditions, workers may have limited connectivity, mixed language backgrounds, and high time pressure. A general-purpose assistant can sound helpful while still over-answering or drifting into unsupported advice. That is especially risky in chemical first-aid.

Our project narrows the problem deliberately: plantation chemical exposure only. This narrower scope makes the system safer, more grounded, and easier to evaluate honestly.

## QR-First Worker Entry

The system starts from chemical identification, not from a vague symptom description alone. The intended worker entry is QR-first: the worker scans a QR tied to a known demo chemical. That early constraint reduces ambiguity before the worker describes what happened.

We also include a manual chemical-selection fallback. This is not a side feature; it is the operational recovery path when a label is damaged, the QR is missing, or the scan fails in the moment. In the current build, both the QR-first path and the manual path have been validated, with manual selection retained as the operational fallback.

## Model-Side Novelty

The novelty is not plain retrieval and not plain chat. The system uses a **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**.

Instead of always answering in one style, the controller can release:

- `full_guided_response`
- `guarded_minimum_response`
- `guarded_escalate_now`

This matters because in a safety-critical setting, the biggest failure is confident over-answering. The controller uses deterministic control surfaces around the model:

- a planner to define required action slots
- a verifier to detect missing or unsafe output structure
- a selector to decide whether a full response is safe to release

When conditions are strong enough, the system gives a fuller structured answer. When they are not, it degrades deliberately into a guarded response instead of improvising.

## Backend and App Flow

The mobile app does not call the model server directly. It talks to a thin backend gateway, which exposes only the narrow surfaces needed for the demo:

- `GET /health`
- `GET /api/catalog`
- `POST /api/resolve-qr`
- `POST /api/respond`

The worker flow is intentionally short:

1. choose language
2. identify the chemical by QR or manual selection
3. describe what happened
4. receive a structured emergency response

The response is rendered as sections, not a generic chat transcript:

- incident summary
- immediate actions
- do-not-do guidance
- escalation guidance
- response mode
- fallback explanation when guarded

## Evaluation Evidence

Under the strict Phase 6 judge lineage:

- baseline average `hybrid_total_100`: `38.582`
- grounded average `hybrid_total_100`: `92.008`
- grounded gain: `+53.426`

This shows that the dominant performance lever is grounding, not base model ability alone.

Earlier grounded evaluation identified strong families including:

- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01`

But we keep the final demo claims tied to the current controller build, not just earlier benchmark history. In controller pass 2.6:

- controller strict average: `93.022`
- strong-family average: `93.535`
- weak-family average: `92.510`

Bangla weak-family failures were materially improved, and verifier-triggered gating became visibly real. At the same time, `sf_24d_inhalation_01` regressed in the current controller build, so we do **not** present it as a current live hero path.

## Validation Evidence

The mobile app was hardened and validated against the live backend for:

- startup recovery after backend failure
- startup recovery after catalog failure
- live catalog load
- manual chemical selection
- one full guided response render
- one guarded response render

Live evidence exists for:

- English full-guided glyphosate eye flow
- Bangla guarded glufosinate ingestion flow
- startup recovery screenshots

Those artifacts are stored under `mobile_code/validation_artifacts/`.

## Why This Is Safer Than Plain Grounded Chat

A plain grounded chat system can still produce fluent but weakly constrained advice. Our system makes the release behavior visible and selective:

- strong cases can receive a fuller guided response
- weak or risky cases degrade into guarded output
- escalation remains prominent
- fallback behavior is surfaced instead of hidden

That makes the system more field-usable and easier to defend than a generic “ask anything” interface.

## Honest Limitations

- Native QR-first proof has been completed on a real Android phone.
- The manual path is validated and demo-usable today.
- `sf_24d_inhalation_01` was strong in earlier grounded evaluation, but it is not part of the current live demo storyline because the latest controller build regressed it.

## Current Submission Position

The project is submission-ready as a narrow, safety-conscious chemical emergency assistant with:

- a structured controller-backed response system
- a thin backend gateway
- a worker-facing mobile app
- static QR assets for demo chemicals
- validated manual fallback
- honest documentation of what has and has not yet been proven
