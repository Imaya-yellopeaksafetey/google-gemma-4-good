# Write-Up Source — Evaluation and Validation

## Evaluation summary

Under the strict Phase 6 judge lineage:

- baseline average `hybrid_total_100`: `38.582`
- grounded average `hybrid_total_100`: `92.008`
- grounded gain: `+53.426`

That means the main performance lever is grounding, not base model ability alone.

## Strong demo-safe slices

In the Phase 6 grounded evaluation, the strongest families included:

- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01`

These were the recommended safe emphasis families from the Phase 6 comparison.

Important current-build caveat:

- `sf_24d_inhalation_01` should not be treated as a current live demo hero path in the controller pass 2.6 build.
- Controller pass 2.6 regressed that family from `90.352` to `76.680`.
- The live demo package should therefore emphasize the validated glyphosate full-guided flow and Bangla guarded flow instead.

## Weak slices handled conservatively

Weak or risky slices included:

- `sf_glufosinate_ingestion_01`
- `sf_paraquat_inhalation_01`
- `sf_24d_ingestion_01`
- `sf_24d_eye_01`

The controller architecture treats these as candidates for guarded release instead of trying to answer as fully as the strongest families.

## Controller pass 2.6 evidence

Current controller subset scores:

- controller strict average: `93.022`
- strong-family average: `93.535`
- weak-family average: `92.510`

Important nuance:

- Bangla weak-family severe failures were materially fixed
- verifier-triggered gating became visibly real
- `sf_24d_inhalation_01` remained a concentrated weak point in the current controller build

## Mobile validation summary

The app was hardened and validated through the live backend for:

- startup recovery after backend and catalog failure
- live catalog load
- manual chemical selection
- one full guided response render
- one guarded response render

Live evidence is captured in:

- `mobile_code/validation_artifacts/full_guided_english.png`
- `mobile_code/validation_artifacts/guarded_bangla.png`
- startup recovery screenshots under `mobile_code/validation_artifacts/`

## Honest limitations

- Native camera QR proof was not completed in this environment.
- The manual path is live-validated and demo-usable.
- A final human-run phone QR smoke check is still required before making a strong QR-first claim on stage.
- `sf_24d_inhalation_01` was strong in earlier grounded evaluation, but it is not part of the current live demo storyline because the latest controller build regressed it.
