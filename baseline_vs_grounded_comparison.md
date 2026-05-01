# Baseline vs Grounded Comparison

## Source of truth

This report uses only the final Phase 6 strict judge lineage:

- baseline:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_baseline_parallel/llm_judged_baseline_scores_core_v0.jsonl`
- grounded:
  - `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/eval_harness/eval_outputs/phase6_strict_v6_grounded_parallel/llm_judged_grounded_scores_core_v0.jsonl`
- judge version:
  - `strict_v6_2026-04-30`

Both files contain `272` rows and were verified against the same frozen core benchmark.

## Overall

- Baseline average `hybrid_total_100`: `38.582`
- Grounded average `hybrid_total_100`: `92.008`
- Absolute gain: `+53.426`

Interpretation:

- the benchmarked gain survives judge tightening
- the dominant performance lever is grounding, not unguided baseline ability
- the comparison is now trustworthy enough for planning, with explicit caution on weaker grounded slices

## By split

| Split | Baseline | Grounded | Delta |
|---|---:|---:|---:|
| `dev` | 42.856 | 92.168 | +49.312 |
| `validation` | 32.523 | 90.539 | +58.016 |
| `holdout` | 37.607 | 93.525 | +55.918 |

## By language

| Language | Baseline | Grounded | Delta |
|---|---:|---:|---:|
| `english` | 36.149 | 90.809 | +54.660 |
| `malay` | 38.759 | 92.142 | +53.382 |
| `bangla` | 37.647 | 93.162 | +55.515 |
| `bahasa_indonesia` | 41.774 | 91.921 | +50.147 |

Takeaway:

- gains are broad-based across all four languages
- Bangla shows the largest gain
- Bahasa Indonesia remains strong, but slightly behind Bangla and Malay on grounded average

## By incident type

| Incident type | Baseline | Grounded | Delta |
|---|---:|---:|---:|
| `skin_exposure` | 37.352 | 92.500 | +55.148 |
| `eye_exposure` | 63.039 | 94.789 | +31.750 |
| `inhalation` | 22.938 | 92.180 | +69.242 |
| `ingestion` | 19.629 | 83.398 | +63.770 |

Takeaway:

- inhalation benefits the most from grounding
- ingestion also improves sharply, but remains the weakest grounded incident slice
- eye exposure was already the strongest baseline incident slice and remains the strongest grounded slice

## By scenario family

| Scenario family | Baseline | Grounded | Delta |
|---|---:|---:|---:|
| `sf_24d_inhalation_01` | 22.461 | 96.719 | +74.258 |
| `sf_glyphosate_inhalation_01` | 17.188 | 90.195 | +73.008 |
| `sf_24d_ingestion_01` | 15.039 | 84.805 | +69.766 |
| `sf_glufosinate_inhalation_01` | 25.195 | 93.438 | +68.242 |
| `sf_paraquat_inhalation_01` | 15.469 | 83.086 | +67.617 |
| `sf_24d_skin_01` | 30.898 | 96.211 | +65.312 |
| `sf_glyphosate_skin_01` | 26.406 | 90.156 | +63.750 |
| `sf_fastac_inhalation_01` | 34.375 | 97.461 | +63.086 |
| `sf_glufosinate_ingestion_01` | 24.219 | 81.992 | +57.773 |
| `sf_paraquat_skin_01` | 38.789 | 94.531 | +55.742 |
| `sf_glufosinate_skin_01` | 37.109 | 90.742 | +53.633 |
| `sf_paraquat_eye_01` | 50.508 | 100.000 | +49.492 |
| `sf_fastac_skin_01` | 53.555 | 90.859 | +37.305 |
| `sf_glyphosate_eye_01` | 62.227 | 97.305 | +35.078 |
| `sf_fastac_eye_01` | 66.836 | 97.969 | +31.133 |
| `sf_glufosinate_eye_01` | 63.594 | 91.797 | +28.203 |
| `sf_24d_eye_01` | 72.031 | 86.875 | +14.844 |

## Strongest grounded slices

Strongest families by grounded score:

- `sf_paraquat_eye_01`: `100.000`
- `sf_fastac_eye_01`: `97.969`
- `sf_fastac_inhalation_01`: `97.461`
- `sf_glyphosate_eye_01`: `97.305`
- `sf_24d_inhalation_01`: `96.719`
- `sf_24d_skin_01`: `96.211`

Why these are strong:

- high grounded means
- no repeated `missed_required_action` pattern in the grounded failure tags
- high minimum per-row performance inside the family

## Weakest grounded slices

Weakest families by grounded score:

- `sf_glufosinate_ingestion_01`: `81.992`
- `sf_paraquat_inhalation_01`: `83.086`
- `sf_24d_ingestion_01`: `84.805`
- `sf_24d_eye_01`: `86.875`

Observed weaknesses:

- ingestion remains the weakest incident family cluster even after grounding
- `sf_paraquat_inhalation_01` still shows repeated `missed_required_action` and action-order degradation
- `sf_24d_eye_01` carries repeated `action_order` plus `unsupported_advice` noise even though its average is still usable

## Safe for demo emphasis

Recommended demo-emphasis candidates:

- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01`

Why these are safe:

- grounded averages above `96` except glyphosate eye, which remains above `97`
- low or zero dangerous grounded failure patterns
- strong enough multilingual grounded behavior to survive stricter judging

## Still too risky for demo emphasis

Avoid emphasizing these in the first demo lane:

- `sf_glufosinate_ingestion_01`
- `sf_paraquat_inhalation_01`
- `sf_24d_ingestion_01`
- `sf_24d_eye_01`

Why:

- grounded means are the lowest in the frozen core
- some still carry repeated order degradation or missed required action patterns
- ingestion remains the least mature grounded slice overall

## Did the gains survive judge tightening?

Yes.

The comparison is now based on a stricter judge than the earlier lineage:

- hard-fail semantics for dangerous unsupported claims
- versioned cache identity
- validated JSON contract
- accepted row rendering included in the judge payload

Even under that tighter control:

- baseline remains weak at `38.582`
- grounded remains strong at `92.008`
- the grounded advantage is therefore robust, not an artifact of the earlier lenient judge

## Residual uncertainty

This is strong enough for a decision, but not uncertainty-free:

- ingestion is still the weakest grounded incident slice
- some grounded families still show action-order degradation
- the new judge is materially better, but still somewhat softer on non-dangerous overlong answers than a maximal human safety reviewer would be

Those uncertainties should shape the next lane, not block it.
