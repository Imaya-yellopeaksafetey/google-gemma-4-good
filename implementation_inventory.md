# Implementation Inventory

## Placement decision

The controller stack now lives in a new package:

- [controller_stack/__init__.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/__init__.py)
- [controller_stack/controller.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/controller.py)
- [controller_stack/normalizer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/normalizer.py)
- [controller_stack/planner.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/planner.py)
- [controller_stack/composer.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/composer.py)
- [controller_stack/verifier.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/verifier.py)
- [controller_stack/selector.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/selector.py)
- [controller_stack/loaders.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/loaders.py)
- [controller_stack/language.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/language.py)
- [controller_stack/config.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/config.py)

This keeps the model-control implementation separate from:

- the benchmark package in [benchmark_v0](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0)
- the scoring/eval harness in [eval_harness](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness)

That separation is deliberate:

- `benchmark_v0` remains immutable benchmark truth
- `eval_harness` remains the Phase 6 inference/scoring path
- `controller_stack` is the new behavior-control layer that can later feed the eval harness or an app wrapper

## Existing files reused

Benchmark truth and manifests:

- [benchmark_v0/scenario_families_v0.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/scenario_families_v0.json)
- [benchmark_v0/benchmark_core_v0.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/benchmark_core_v0.jsonl)
- [benchmark_v0/schema_v0.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/schema_v0.md)
- [benchmark_v0/rubric_v0.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/rubric_v0.md)
- [benchmark_v0/source_pack_v0.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/benchmark_v0/source_pack_v0.json)

Architecture package:

- [architecture_decision.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/architecture_decision.md)
- [response_control_policy.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/response_control_policy.md)
- [response_schema_v1.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/response_schema_v1.md)
- [weak_family_fallback_policy.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/weak_family_fallback_policy.md)
- [prompt_blueprint_v1.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/prompt_blueprint_v1.md)
- [architecture_eval_plan.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/architecture_eval_plan.md)

Phase 6 evaluation lineage:

- [eval_harness/eval_outputs/phase6_strict_v6_baseline_parallel/llm_judged_baseline_scores_core_v0.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_baseline_parallel/llm_judged_baseline_scores_core_v0.jsonl)
- [eval_harness/eval_outputs/phase6_strict_v6_grounded_parallel/llm_judged_grounded_scores_core_v0.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_grounded_parallel/llm_judged_grounded_scores_core_v0.jsonl)

Existing harness logic reused by concept rather than direct code import:

- prompt-only vs grounded separation from [eval_harness/run_eval.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/run_eval.py)
- strict Phase 6 evaluation lineage retained as comparison source of truth, not replaced

## New files created

Controller package:

- [controller_stack/response_schema_v1.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/response_schema_v1.json)
- [controller_stack/prompt_config_v1.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/prompt_config_v1.json)
- [controller_stack/run_reports.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack/run_reports.py)

Generated machine-readable outputs:

- [controller_outputs/controller_subset_outputs.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_outputs/controller_subset_outputs.jsonl)
- [controller_outputs/controller_subset_metrics.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_outputs/controller_subset_metrics.json)

Generated reports:

- [normalizer_test_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/normalizer_test_report.md)
- [planner_test_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/planner_test_report.md)
- [strong_lane_test_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/strong_lane_test_report.md)
- [guarded_lane_test_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/guarded_lane_test_report.md)
- [slot_verifier_test_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/slot_verifier_test_report.md)
- [release_selector_test_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/release_selector_test_report.md)
- [controller_integration_report.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_integration_report.md)
- [controller_subset_eval.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_subset_eval.md)
- [controller_failure_analysis.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_failure_analysis.md)

## Controller-to-eval connection

Current connection is file-level, not yet code-path replacement:

1. `controller_stack` reads frozen benchmark truth and row renderings.
2. It emits structured controller outputs plus a rendered worker-facing text form.
3. Subset evaluation compares controller behavior to the Phase 6 official baseline/grounded score outputs on the same rows.

This means:

- the strict judge lineage remains authoritative
- the controller can be evaluated without rewriting `eval_harness`
- later integration can add a bridge from controller outputs into eval-harness prediction/scoring files if needed

## Minimal-extension rationale

No existing benchmark or evaluation files were renamed or moved.

The implementation uses a new package and generated outputs only, which keeps:

- benchmark lineage intact
- Phase 6 scoring lineage intact
- controller behavior observable and easy to iterate on
