# Controller Strict Eval

- Rows evaluated: `128`
- Controller strict average hybrid_total_100: `91.021`
- Prior grounded strict average hybrid_total_100: `91.094`
- Delta: `-0.073`

- Strong-family controller average: `97.334`
- Strong-family grounded average: `97.998`
- Weak-family controller average: `84.707`
- Weak-family grounded average: `84.189`

## By family

- `sf_paraquat_eye_01`: controller `100.000` vs grounded `100.000`
- `sf_fastac_eye_01`: controller `98.984` vs grounded `97.969`
- `sf_glyphosate_eye_01`: controller `100.000` vs grounded `97.305`
- `sf_24d_inhalation_01`: controller `90.352` vs grounded `96.719`
- `sf_glufosinate_ingestion_01`: controller `79.570` vs grounded `81.992`
- `sf_paraquat_inhalation_01`: controller `82.461` vs grounded `83.086`
- `sf_24d_ingestion_01`: controller `85.547` vs grounded `84.805`
- `sf_24d_eye_01`: controller `91.250` vs grounded `86.875`

## Interpretation

- Strong-family preservation is acceptable only if controller strong-family averages remain close to the prior grounded strong-family averages and release gating still activates on noisy prompts.
- Weak-family behavior is safer when unsupported-detail blocks and guarded-mode outputs reduce over-answering even if weak-family scores do not exceed the old grounded average.
