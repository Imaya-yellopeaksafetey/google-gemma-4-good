# Scorer Comparison Note

- Old code scorer average (0-12): 5.342
- Repaired code scorer average (0-12): 0.000
- New hybrid scorer: not computed because Azure judge env vars were missing.

What is still available:
- existing Gemma predictions were preserved under `gemma_responses/`
- repaired code scorer outputs remain available in `baseline_scores_core_v0.jsonl`
- hybrid scoring can be rerun as soon as `MODEL_API_KEY`, `MODEL_ENDPOINT`, `MODEL_DEPLOYMENT`, and `MODEL_API_VERSION` are set
