# Controller Pass 2 Delta Plan

## Goal of this pass

Upgrade the existing controller scaffold from deterministic replay into a true Gemma-driven controller while preserving deterministic control logic and the strict Phase 6 evaluation lineage.

## Files that should remain mostly intact

Control-layer files:

- [controller_stack/planner.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/planner.py)
- [controller_stack/verifier.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/verifier.py)
- [controller_stack/selector.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/selector.py)

Why:

- these already encode the chosen architecture’s deterministic safety control surfaces
- they do not need redesign unless a concrete bug appears

Strict evaluation files to reuse, not replace:

- [eval_harness/rescore_predictions.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/rescore_predictions.py)
- [eval_harness/llm_judge.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/llm_judge.py)
- [eval_harness/score_code.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/score_code.py)

Why:

- official strict Phase 6 judge lineage is already closed
- pass 2 must score controller outputs through that path, not a new scorer

## Files that require model-driven replacement or extension

To upgrade:

- [controller_stack/normalizer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/normalizer.py)
- [controller_stack/composer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/composer.py)
- [controller_stack/controller.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/controller.py)

Why:

- pass 1 still uses deterministic alias matching and benchmark-rendering replay
- pass 2 must make normalizer + strong lane + guarded lane Gemma-driven

## New files to add

Model I/O and prompt handling:

- `controller_stack/llm_client.py`
- `controller_stack/prompt_builders.py`
- `controller_stack/prompts/normalizer_system_v2.md`
- `controller_stack/prompts/strong_lane_system_v2.md`
- `controller_stack/prompts/guarded_lane_system_v2.md`
- `controller_stack/prompt_config_v2.json`

Bridge and pass-2 runner:

- `controller_stack/eval_bridge.py`
- `controller_stack/run_pass2.py`

Likely generated artifacts:

- `controller_outputs/pass2_*`

## Primary implementation delta

### Normalizer

Current:

- deterministic alias / marker ranking

Pass 2:

- Gemma-primary structured normalizer
- deterministic fallback preserved for failure handling only

### Strong composer

Current:

- benchmark `answer_rendering` replay

Pass 2:

- Gemma generates incident summary + step text + do-not-do + escalation from family truth and plan
- response schema still assembled deterministically around those fields

### Guarded composer

Current:

- benchmark `answer_rendering` replay on guarded subset

Pass 2:

- Gemma generates compressed guarded response from family truth + guarded subset + blocked detail policy
- fallback reason and suppressed-detail note remain policy-driven

## Prompt/config placement

Prompt artifacts should live under:

- [controller_stack/prompts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack)

Reason:

- keeps prompts colocated with the controller implementation
- avoids mixing controller prompts with eval-harness prompts

Config should live in:

- [controller_stack/prompt_config_v2.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/prompt_config_v2.json)

## Controller-to-strict-eval transformation

Bridge shape:

1. controller emits response schema v1 object
2. bridge renders that to the official `STEP/DO NOT/ESCALATE` text form
3. bridge normalizes into:
   - `raw_model_answer`
   - `normalized_prediction`
4. bridge writes prediction JSONL keyed by original benchmark `row_id`
5. bridge creates subset benchmark/manifests so `rescore_predictions.py` can run unchanged on the subset

## Evaluation execution path

The official path for pass 2 subset scoring should be:

1. run controller on the fixed subset
2. export predictions with original row ids
3. build subset benchmark/manifests
4. call [eval_harness/rescore_predictions.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/rescore_predictions.py) unchanged
5. compare new controller strict scores against prior official grounded scores on the same subset

## Main risks to test early

- Gemma returns malformed JSON for normalizer/composer stages
- Gemma drifts into unsupported detail in weak-family guarded mode
- Gemma weakens escalation wording on strong families
- verifier remains too easy to satisfy because model output is over-structured
- subset bridge mismatches row ids or split/family manifests

## Shift-left conclusion

Pass 2 should prioritize:

1. reliable stage JSON outputs
2. cached reproducible local Gemma calls
3. official strict rescoring on controller-generated predictions

before any future app wrapping or demo polish work.
