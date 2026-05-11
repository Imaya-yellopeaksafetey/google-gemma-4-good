# Controller Failure Analysis

- Low-confidence rows: `7`
- Downgraded strong-lane rows: `0`
- Guarded rows total: `70`

## Findings

- The current deterministic controller does not miss required slots on the fixed subset; the main control behavior is family-strength gating, not verifier-triggered repair.
- Weak-family rows all stay in guarded mode by policy, which keeps unsafe expansion out but means the subset run does not yet stress partial-release behavior inside weak families.
- Normalizer confidence is strong on the repaired benchmark prompts. The present failure risk is not misclassification on the fixed subset; it is future drift on noisier live prompts.
- Because action rendering comes from frozen benchmark renderings, multilingual wording stays stable. The main remaining weakness is that the controller does not yet synthesize novel safe wording outside known family-language renderings.

## Guarded family counts

- `sf_24d_eye_01`: `16`
- `sf_24d_ingestion_01`: `16`
- `sf_24d_inhalation_01`: `1`
- `sf_fastac_eye_01`: `1`
- `sf_glufosinate_ingestion_01`: `16`
- `sf_glyphosate_eye_01`: `3`
- `sf_paraquat_eye_01`: `1`
- `sf_paraquat_inhalation_01`: `16`
