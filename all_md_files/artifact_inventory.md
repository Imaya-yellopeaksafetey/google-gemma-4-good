# Artifact Inventory

## Official benchmark set

- Frozen Bronze core benchmark:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/benchmark_core_v0.jsonl`
  - row count: `272`
- Working benchmark:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/benchmark_v0.jsonl`
  - row count: `320`
- Frozen core split manifest:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/split_manifest_core_v0.json`
- Frozen core family manifest:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/core_v0_family_manifest.json`
- Scenario families:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/scenario_families_v0.json`
- Source pack:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/source_pack_v0.json`
- Rubric:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/rubric_v0.md`
- Schema:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/schema_v0.md`

## Eval harness code

- Inference / prompt builder:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/run_eval.py`
- Official hybrid rescoring entrypoint:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/rescore_predictions.py`
- Deterministic scorer:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/score_code.py`
- Current official judge:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/llm_judge.py`
  - judge version: `strict_v6_2026-04-30`

## Prediction artifacts

### Baseline predictions

- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/baseline_predictions_core_v0.jsonl`
- row count: `272`

### Grounded predictions

- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/bronze-core-v0-grounded-first/grounded_predictions_core_v0.jsonl`
- row count: `272`
- run manifest:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/bronze-core-v0-grounded-first/run_manifest.json`

## Official Phase 6 score artifacts

### Baseline

- scores:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_baseline_parallel/llm_judged_baseline_scores_core_v0.jsonl`
  - row count: `272`
- report:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_baseline_parallel/llm_judged_baseline_eval_report_core_v0.md`
- judge cache:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_baseline_parallel/judge_cache.jsonl`
  - row count: `272`

### Grounded

- scores:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_grounded_parallel/llm_judged_grounded_scores_core_v0.jsonl`
  - row count: `272`
- report:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_grounded_parallel/llm_judged_grounded_eval_report_core_v0.md`
- judge cache:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_grounded_parallel/judge_cache.jsonl`
  - row count: `272`

## Judge audit artifacts

- audit set:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/judge_audit_set.jsonl`
  - case count: `20`
- legacy audit results:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/judge_audit_results_current.jsonl`
  - row count: `20`
- official strict audit results:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/judge_audit_results_strict_v6_2026-04-30.jsonl`
  - row count: `20`

## Prior / non-authoritative score artifacts

These exist but should not be used as the official Phase 6 comparison source of truth:

- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/llm_judged_grounded_scores_core_v0.jsonl`
  - earlier judge lineage
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/llm_judged_baseline_scores_core_v0.jsonl`
  - blocked / empty lineage
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_harness/eval_outputs/*`
  - stale nested output path from an earlier invocation mistake

## Set alignment verification

Verified facts:

- baseline predictions and grounded predictions both evaluate the same frozen benchmark file:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/benchmark_core_v0.jsonl`
- baseline predictions row count = `272`
- grounded predictions row count = `272`
- baseline row IDs match frozen core row IDs exactly
- grounded row IDs match frozen core row IDs exactly
- baseline and grounded row IDs match each other exactly
- row order also matched exactly during verification

Conclusion:

- baseline and grounded are being compared on the same frozen evaluation set

## Version notes

- The official Phase 6 semantic judge lineage is `strict_v6_2026-04-30`.
- Older score files used a looser judge and unsafe cache identity and are preserved only for lineage, not for official comparison.
- The official comparison should use only the `phase6_strict_v6_*_parallel` output directories.
