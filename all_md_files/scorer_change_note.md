# Scorer Change Note

## Scope

This update repairs the evaluation scorer without rerunning model inference.

Reused input:
- `eval_harness/eval_outputs/baseline_predictions_core_v0.jsonl`

Regenerated outputs:
- `eval_harness/eval_outputs/baseline_scores_core_v0.jsonl`
- `eval_harness/eval_outputs/baseline_eval_report_core_v0.md`

This note covers the repaired deterministic scorer only. The intended official benchmark path now uses hybrid scoring:
- deterministic code scoring from `score_code.py`
- Azure semantic judging from `llm_judge.py`
- official score composition from `rescore_predictions.py`

## What Changed

### 1. Unicode-aware tokenization

The old scorer tokenized with `[a-z0-9]`, which broke Bangla and under-scored other non-Latin outputs.

The repaired scorer now:
- tokenizes with Unicode-aware `\w+`
- uses character n-grams as a second matching signal
- combines token overlap, character n-gram overlap, and sequence similarity

### 2. More semantic step matching

The old scorer matched expected and predicted steps using only raw lexical overlap against English canonical truth.

The repaired scorer now:
- matches predicted steps against `row.answer_rendering` when available
- keeps matching in the row language instead of forcing English-only comparison
- uses a best-match assignment with a semantic similarity threshold

### 3. No double penalty for duplicated truth obligations

Some families encode the same instruction in both:
- `canonical_actions`
- `do_not_do`

The repaired scorer now detects duplicated `do_not_do` items and avoids penalizing the row twice when the same obligation is already clearly satisfied by the main action sequence.

### 4. Stricter unsupported-advice scoring

The repaired scorer is stricter when predictions add:
- cross-incident steps
- unsafe ingestion additions like milk
- irrelevant wash/rinse instructions from another incident workflow

This especially affects inhalation and ingestion rows where the old scorer was too forgiving.

### 5. Mandatory escalation weakening is now explicit

The repaired scorer now distinguishes:
- missing escalation
- semantically present escalation
- weakened escalation where a mandatory/immediate escalation was turned into a conditional one

This shows up in `failure_tags` as `conditional_escalation` when detected.

## Impact Summary

Average total score:
- old scorer: `4.151`
- repaired scorer: `6.423`
- delta: `+2.272`

Average by language:
- `english`: `5.485 -> 5.500` (`+0.015`)
- `malay`: `3.706 -> 6.618` (`+2.912`)
- `bangla`: `3.706 -> 6.971` (`+3.265`)
- `bahasa_indonesia`: `3.706 -> 6.603` (`+2.897`)

Average by incident type:
- `skin_exposure`: `4.725 -> 7.162` (`+2.438`)
- `eye_exposure`: `4.350 -> 7.612` (`+3.263`)
- `inhalation`: `3.462 -> 5.225` (`+1.762`)
- `ingestion`: `3.938 -> 4.594` (`+0.656`)

## Interpretation

The biggest correction is multilingual fairness. English stayed almost unchanged, while Malay, Bangla, and Bahasa Indonesia moved sharply upward because the scorer can now actually read and align their content.

The scorer is still intentionally strict on:
- unsupported additions
- cross-incident drift
- weakened escalation

That is why ingestion and inhalation remain relatively low even after repair.

## Current benchmark scoring status

- The repaired deterministic scorer is the current local fallback and debugging tool.
- The official target score is now the hybrid score produced by the Azure-judge pipeline.
- Hybrid judging has been implemented, including cache/resume behavior and per-row response storage, but it cannot run until these env vars are set:
  - `MODEL_API_KEY`
  - `MODEL_ENDPOINT`
  - `MODEL_DEPLOYMENT`
  - `MODEL_API_VERSION`
- Repo-root `.env.example` now documents the required Azure judge configuration.
