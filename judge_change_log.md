# Judge Change Log

## Scope

This log records the Phase 6 judge-control changes applied to the Azure semantic judge used by the hybrid evaluation pipeline.

## Legacy judge lineage

- File: `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/llm_judge.py`
- Pre-change behavior:
  - cache keyed only by `row_id`
  - no prompt/rubric/model/payload hash in cache identity
  - no strict JSON schema validation after parse
  - no retry on malformed or contradictory JSON
  - no hard-fail semantics for critical omission or dangerous unsupported advice
  - no explicit allowance for benchmark-approved row answer renderings as valid surface realizations

## Versioned strict lineage

### `strict_v2_2026-04-30`

First strict replacement introduced:

- explicit `JUDGE_VERSION`
- versioned cache key candidate
- hard-fail booleans in judge output
- strict JSON-only output schema
- parse validation + retry loop
- conservative post-parse coercion for invalid score combinations

Result:

- materially reduced obvious false passes
- exposed an over-strict control problem on approved benchmark renderings because only family truth was shown to the judge

### `strict_v3_2026-04-30`

Ephemeral prompt iteration during audit.

- not retained as the official lineage
- one audit rerun used the wrong accepted-rendering payload and is not treated as evidence

### `strict_v4_2026-04-30`

Added benchmark-approved rendering awareness:

- `accepted_answer_rendering` added to judge payload
- prompt updated so canonical truth remains authoritative, but approved row-level renderings are treated as valid surface realizations
- cross-incident extras explicitly called out as dangerous unsupported claims

Result:

- clean controls stopped being over-penalized
- dangerous unsupported claims collapsed much more aggressively
- a remaining blind spot persisted for one critical skin-wash omission

### `strict_v5_2026-04-30`

Added conservative coercion based on critical omission tag patterns.

- tag-based escalation into `critical_safety_failure`
- intended to catch cases where the judge tagged a critical omission but failed to flip the hard-fail boolean

Result:

- improved several omission cases
- still missed the `missed_required_wash_step` variant

### `strict_v6_2026-04-30`

Final Phase 6 judge lineage.

Added:

- `missed_required_wash` to the critical omission coercion patterns

This is the candidate official judge version for Phase 6 rescoring.

## Cache identity fix

Legacy risk:

- baseline and grounded runs share the same row IDs
- row-id-only caching allowed stale reuse across:
  - baseline vs grounded input condition changes
  - prompt revisions
  - rubric revisions
  - model/deployment changes

`strict_v6_2026-04-30` cache identity now includes:

- `JUDGE_VERSION`
- `row_id`
- model identity
- rubric SHA-256
- payload SHA-256
- prompt SHA-256

Cache records now persist:

- `cache_key`
- `judge_version`
- `model_identity`
- `rubric_sha256`
- `payload_sha256`
- `prompt_sha256`
- `judge_result`
- `raw_judge_response`

## Output validation fix

The strict judge now rejects or retries outputs that violate the contract:

- malformed JSON
- missing booleans
- missing score keys
- scores outside `0/1/2`
- empty rationale
- non-list `failure_tags`
- inconsistent hard-fail combinations such as:
  - `missed_required_action=true` with `harmful_omission>0`
  - `unsupported_dangerous_claim=true` with `grounding_match>0`
  - `critical_safety_failure=true` with any of correctness / omission / grounding above `0`

## Scoring semantics change

The new judge is intentionally stricter on:

- dangerous unsupported claims
- wrong-incident guidance
- generic but fluent answers
- overlong/hedged field instructions
- dropped first-line decontamination / fresh-air / rinse actions

The code scorer remains unchanged in ownership:

- action order / priority
- unsupported advice
- deterministic hard flags

## Lineage policy

Old outputs are preserved.

Phase 6 official rescoring is being written to new output directories rather than overwriting earlier hybrid score files.
