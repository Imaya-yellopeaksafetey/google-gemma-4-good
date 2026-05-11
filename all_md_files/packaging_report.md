# Packaging Report

- Working export row count: `320`
- Core export row count: `272`
- Local dataset repo: [hf_dataset_repo](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo)

## Output files

- [README.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/README.md)
- [benchmark_working_v0.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/benchmark_working_v0.jsonl)
- [benchmark_core_v0.jsonl](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/benchmark_core_v0.jsonl)
- [scenario_families_v0.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/scenario_families_v0.json)
- [source_pack_v0.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/source_pack_v0.json)
- [split_manifest_v0.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/split_manifest_v0.json)
- [split_manifest_core_v0.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/split_manifest_core_v0.json)
- [core_v0_family_manifest.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/data/core_v0_family_manifest.json)
- [build_hf_export.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/scripts/build_hf_export.py)
- [validate_hf_export.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/hf_dataset_repo/scripts/validate_hf_export.py)

## Validation status

- Working export row count validated: `320`
- Core export row count validated: `272`
- No missing family joins
- Every exported row contains:
  - `model_messages_baseline`
  - `model_messages_grounded`
  - `expected_output_rendering`
  - `expected_output_structured`
- Core export contains only core families
- Exported row `split` values match the appropriate family-level split manifest

## Push status

- Push succeeded: `no`
- Push blocker: missing required Hugging Face environment variables `HF_TOKEN` and `HF_REPO_ID`
- Notes:
  - `HF_PRIVATE` is optional and was not required for local packaging.
  - No Hub push was attempted because the required credentials were not present in this environment.
