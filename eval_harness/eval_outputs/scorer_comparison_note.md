# Scorer Comparison Note

- Old code scorer average (0-12): 5.342
- Repaired code scorer average (0-12): 6.423
- New hybrid scorer average (0-100): 87.796

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
