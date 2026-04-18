# Calibration Audit: Core v0

## Status

Calibration audit is blocked.

There is no completed baseline run to sample from yet:
- `outputs/baseline_predictions_core_v0.jsonl` has `0` rows
- `outputs/baseline_scores_core_v0.jsonl` has `0` rows
- the local vLLM endpoint at `http://localhost:8000/v1` was not reachable during this task, so no fresh baseline outputs could be generated for audit

Because there are no scored baseline rows, the required 16-row audit sample could not be assembled.

## Required Audit Sample

The intended Stage 1 audit remains:
- `4` good rows
- `4` medium rows
- `8` bad rows

Coverage target:
- English plus non-English rows
- skin / eye / inhalation / ingestion

Per-row comparison target:
- `user_prompt`
- `raw_model_answer`
- `normalized_prediction`
- scenario family truth
- script scores

## Stop Condition Assessment

Not yet assessable.

The scorer cannot be judged as fair, too strict, or too lenient until a real baseline output set exists. Grounded eval should not be run until:
1. a baseline run completes successfully on the repaired `benchmark_core_v0.jsonl`
2. the 16-row calibration audit is completed
3. the scorer is judged at least directionally reasonable

## Next Step To Unblock

Run a fresh baseline eval on the repaired frozen core once the local inference endpoint is reachable, then redo Stage 1 against that run folder.
