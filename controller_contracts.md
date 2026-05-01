# Controller Contracts

## Stage contracts

### 1. Incident normalizer

Implementation:

- [controller_stack/normalizer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/normalizer.py)

Input:

- `worker_prompt`
- optional `target_language`

Output:

```json
{
  "detected_language": "string",
  "incident_type_guess": "string",
  "chemical_guess": "string",
  "family_id_guess": "string",
  "family_confidence": "high | medium | low",
  "normalized_incident_summary": "string",
  "ambiguity_flags": ["string"],
  "candidate_rankings": []
}
```

Behavior:

- no treatment advice
- word-boundary matching for aliases and incident markers
- carries worker language through when caller provides it

### 2. Response planner

Implementation:

- [controller_stack/planner.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/planner.py)

Input:

- one `scenario_family` truth object

Output:

```json
{
  "family_id": "string",
  "family_strength": "strong_demo_safe | weak_guarded",
  "required_action_slots": [],
  "required_do_not_slots": [],
  "required_escalation_slots": [],
  "allowed_guarded_subset": [],
  "blocked_detail_categories": [],
  "default_guarded_mode": "guarded_minimum_response | guarded_escalate_now"
}
```

Behavior:

- preserves canonical action order
- encodes weak-family guarded subsets
- keeps machine-checkable slot ids

### 3. Strong-lane composer

Implementation:

- [controller_stack/composer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/composer.py)

Input:

- `family`
- `plan`
- `normalization`
- `language`

Output:

- response-schema-v1-shaped object with `response_mode=full_guided_response`

Behavior:

- uses frozen benchmark `answer_rendering` rows for action-language stability
- translates do-not and escalation via exact family-text maps
- includes compact evidence basis handles only

### 4. Guarded-lane composer

Implementation:

- [controller_stack/composer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/composer.py)

Input:

- `family`
- `plan`
- `normalization`
- `language`
- `fallback_reason`
- `response_mode`

Output:

- response-schema-v1-shaped object with `guarded_minimum_response` or `guarded_escalate_now`

Behavior:

- emits only planner-approved guarded subset steps
- always includes explicit escalation
- includes fallback reason and suppressed-detail note

### 5. Slot verifier

Implementation:

- [controller_stack/verifier.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/verifier.py)

Input:

- candidate response object
- planner output
- `verification_target=full|guarded`

Output:

```json
{
  "status": "pass | fail",
  "missing_required_slots": [],
  "blocked_unsupported_slots": [],
  "downgrade_required": true
}
```

Behavior:

- checks required action slots
- checks required do-not slots for full release
- checks escalation weakening
- blocks unsupported patterns and generic-chat drift
- checks required top-level schema fields

### 6. Release selector

Implementation:

- [controller_stack/selector.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/selector.py)

Input:

- `normalization`
- `plan`
- optional `strong_candidate`
- `guarded_candidate`
- optional `verification`

Output:

- final response-schema-v1 object

Behavior:

- full release only for strong family + high confidence + verifier pass
- weak families default to guarded
- low confidence blocks forced full release
- verifier failures route to guarded response

## Deterministic vs model-driven stages

Architecture package intent:

- normalizer, strong composer, guarded composer were designed as model-driven stages
- planner, verifier, release selector were designed as deterministic control stages

Current implementation:

- all six stages are implemented deterministically
- the deterministic implementation still preserves the architecture’s control surfaces and contracts
- prompt-oriented reproducibility is captured in [controller_stack/prompt_config_v1.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/prompt_config_v1.json)

Why this implementation choice was used now:

- it makes the first controller pass reproducible and testable against the frozen benchmark
- it avoids introducing a new uncontrolled model dependency before the stage contracts are proven

## Schema artifacts

- machine-readable schema: [controller_stack/response_schema_v1.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/response_schema_v1.json)
- human design schema: [response_schema_v1.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/response_schema_v1.md)

## Entrypoints

Controller API:

- [controller_stack/controller.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/controller.py)
  - `run_with_trace(...)`
  - `render_response_text(...)`

Reproducible test/eval runner:

- [controller_stack/run_reports.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/run_reports.py)

Run command:

```bash
cd /Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon
python3 -m controller_stack.run_reports
```
