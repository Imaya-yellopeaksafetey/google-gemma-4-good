# Controller Eval Bridge

## What the bridge does

- converts controller response-schema objects into the official `STEP/DO NOT/ESCALATE` prediction text
- normalizes that text into `normalized_prediction` using the existing eval-harness parser
- preserves original benchmark `row_id`, `scenario_family_id`, `split`, and `language`
- writes a filtered subset benchmark and subset manifests so the unchanged strict rescoring script can run on the exact controller subset

## Bridge artifacts

- predictions: [controller_subset_predictions_core_v0.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_outputs/pass2/controller_subset_predictions_core_v0.jsonl)
- subset benchmark: [benchmark_core_subset_pass2.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_outputs/pass2/bridge_assets/benchmark_core_subset_pass2.jsonl)
- subset split manifest: [split_manifest_core_subset_pass2.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_outputs/pass2/bridge_assets/split_manifest_core_subset_pass2.json)
- subset family manifest: [core_subset_family_manifest_pass2.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_outputs/pass2/bridge_assets/core_subset_family_manifest_pass2.json)

## Reproducible entrypoint

Run pass 2 end to end with:

```bash
cd /Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon
python3 -m controller_stack.run_pass2
```

This entrypoint will:

- run controller generation on the fixed subset
- write controller predictions
- write subset benchmark/manifests
- call the unchanged strict rescoring script
- write strict eval outputs under `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/controller_pass2_subset_strict_v6`
