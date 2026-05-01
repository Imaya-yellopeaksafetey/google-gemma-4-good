# Scorer Comparison Note

- Old code scorer average (0-12): 4.151
- Repaired code scorer average (0-12): unavailable in this output_dir
- New hybrid scorer average (0-100): 38.433

Old code scorer:
- purely lexical and weak on non-Latin scripts

Repaired code scorer:
- Unicode-aware and stricter on unsupported additions, but still deterministic only

New hybrid scorer:
- deterministic code checks for order and unsupported advice
- Azure semantic judge for correctness, omission, language usability, and grounding
- official benchmark score is `hybrid_total_100`

Interpretation:
- use hybrid totals as the official comparison score for baseline-vs-grounded evaluation
- keep `hybrid_total_12` only for continuity with earlier reports

Note:
- `baseline_scores_core_v0.jsonl` was not present in the supplied `output_dir`, so the repaired deterministic comparison point could not be computed for this run.
