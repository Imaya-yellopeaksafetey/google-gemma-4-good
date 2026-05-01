# Benchmark v0 Working Package

This package is the current working benchmark set for the Gemma 4 Good hackathon project. It is broader than the first frozen v0 core benchmark and includes bronze/dev stress-test rows alongside cleaner candidate core rows.

## Files
- `schema_v0.md`: field contract for scenario families and language rows
- `rubric_v0.md`: scoring rules and translation/rendering checks
- `source_pack_v0.json`: current SDS-backed source pack
- `scenario_families_v0.json`: structured truth objects
- `benchmark_v0.jsonl`: language-specific eval rows
- `split_manifest_v0.json`: family-level split assignments
- `benchmark_core_v0.jsonl`: repaired frozen Bronze core subset used for baseline evaluation
- `split_manifest_core_v0.json`: family-level split manifest for the frozen core
- `core_v0_family_manifest.json`: included/deferred family list for the frozen core
- `freeze_note_core_v0.md`: freeze rules and resulting core package summary

## Current package status
- Stage: working benchmark package, not frozen core benchmark
- Total chemicals in source pack: 5
- Total scenario families: 20
- Total benchmark rows: 320
- Frozen Bronze core families: 17
- Frozen Bronze core rows: 272
- Languages present: English, Malay, Bangla, Bahasa Indonesia
- Quality tier used in rows: `bronze_dev`
- Benchmark sizing note: `36–54` rows is the minimum viable v0 freeze target, not a comfortable final benchmark; this 320-row package is the broader working set
- Prompt styles currently present: `short_messy_urgent`, `formal_direct`, `third_person_report`, `descriptive_context`

## Important constraints
- Structured truth is the canonical source of evaluation, not prose answers.
- Split assignment happens at the scenario-family level.
- Frozen benchmark v0 should include at least one Bahasa Indonesia rendering for every included incident type and at least 20–25% Bahasa Indonesia row coverage.
- The full working set contains mixed-difficulty ingestion families; the first frozen core benchmark should keep only the cleanest ingestion families first.
- Recommended frozen-core ingestion families: `sf_24d_ingestion_01`, `sf_glufosinate_ingestion_01`
- Keep harder ingestion cases in bronze/dev stress-test rows for now: `sf_glyphosate_ingestion_01`, `sf_fastac_ingestion_01`, `sf_paraquat_ingestion_01`
- Current multilingual rows are draft benchmark rows and should not be called Gold without human review.
- The latest added chemical should increase the benchmark by exactly `64` rows; any other increase means the per-chemical matrix is incomplete.
- The current matrix is complete at `16 rows per scenario family` and `64 rows per chemical`.

## Eval pipeline status
- `eval_harness/run_eval.py` is the inference + normalization entrypoint only.
- `eval_harness/rescore_predictions.py` is the official rescoring entrypoint.
- `eval_harness/score_code.py` owns deterministic validation, order scoring, unsupported-advice scoring, and hard unsafe flags.
- `eval_harness/llm_judge.py` is the Azure semantic judge path with cache and resume support.
- Repaired baseline code-scored outputs currently live under `eval_harness/eval_outputs/`.
- Hybrid official scoring is implemented but blocked until Azure judge env vars are available.

## Azure judge setup
- Copy repo-root `.env.example` to a local `.env` or export the variables in shell.
- Required env vars:
  - `MODEL_API_KEY`
  - `MODEL_ENDPOINT`
  - `MODEL_DEPLOYMENT`
  - `MODEL_API_VERSION`
- `.env` should remain local-only and is ignored by git.

## Eval harness commands

### Validate the repaired frozen core without inference
```bash
python3 -m eval_harness.run_eval \
  --mode baseline \
  --model-name google/gemma-4-31B-it \
  --benchmark-file benchmark_v0/benchmark_core_v0.jsonl \
  --split-manifest benchmark_v0/split_manifest_core_v0.json \
  --family-manifest benchmark_v0/core_v0_family_manifest.json \
  --scenario-families-file benchmark_v0/scenario_families_v0.json \
  --output-dir outputs \
  --validate-only
```

### Run baseline Gemma inference
```bash
python3 -m eval_harness.run_eval \
  --mode baseline \
  --model-name google/gemma-4-31B-it \
  --benchmark-file benchmark_v0/benchmark_core_v0.jsonl \
  --split-manifest benchmark_v0/split_manifest_core_v0.json \
  --family-manifest benchmark_v0/core_v0_family_manifest.json \
  --scenario-families-file benchmark_v0/scenario_families_v0.json \
  --output-dir eval_harness/eval_outputs \
  --workers 8 \
  --run-name bronze-core-v0-baseline
```

### Run grounded Gemma inference
```bash
python3 -m eval_harness.run_eval \
  --mode grounded \
  --model-name google/gemma-4-31B-it \
  --benchmark-file benchmark_v0/benchmark_core_v0.jsonl \
  --split-manifest benchmark_v0/split_manifest_core_v0.json \
  --family-manifest benchmark_v0/core_v0_family_manifest.json \
  --scenario-families-file benchmark_v0/scenario_families_v0.json \
  --output-dir eval_harness/eval_outputs \
  --workers 8 \
  --run-name bronze-core-v0-grounded
```

### Rescore saved predictions with the repaired deterministic scorer
```bash
python3 -m eval_harness.rescore_predictions \
  --mode baseline \
  --model-name google/gemma-4-31B-it \
  --benchmark-file benchmark_v0/benchmark_core_v0.jsonl \
  --split-manifest benchmark_v0/split_manifest_core_v0.json \
  --family-manifest benchmark_v0/core_v0_family_manifest.json \
  --scenario-families-file benchmark_v0/scenario_families_v0.json \
  --rubric-file benchmark_v0/rubric_v0.md \
  --predictions-file eval_harness/eval_outputs/baseline_predictions_core_v0.jsonl \
  --output-dir eval_harness/eval_outputs
```

### Run official hybrid scoring after Azure judge env vars are set
```bash
python3 -m eval_harness.rescore_predictions \
  --mode grounded \
  --model-name google/gemma-4-31B-it \
  --benchmark-file benchmark_v0/benchmark_core_v0.jsonl \
  --split-manifest benchmark_v0/split_manifest_core_v0.json \
  --family-manifest benchmark_v0/core_v0_family_manifest.json \
  --scenario-families-file benchmark_v0/scenario_families_v0.json \
  --rubric-file benchmark_v0/rubric_v0.md \
  --predictions-file /path/to/grounded_predictions_core_v0.jsonl \
  --output-dir eval_harness/eval_outputs
```

Notes:
- `run_eval.py` writes Gemma predictions and per-row response files, but it does not produce the official final benchmark score.
- `rescore_predictions.py` is the official scoring entrypoint.
- Hybrid judging will block cleanly until the Azure judge env vars are set.
