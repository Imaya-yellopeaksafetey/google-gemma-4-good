# Normalizer Pass 2 Test Report

- Cases run: `6`
- Family expectation checks passed: `6/6`
- Gemma-driven normalizer calls: `6/6`

## `normalizer_strong_en`
- prompt: `Paraquat went in my eye. Burning bad. Fast please.`
- expected_family_id: `sf_paraquat_eye_01`
- family_id_guess: `sf_paraquat_eye_01`
- family_confidence: `high`
- ambiguity_flags: `none`
- method: `gemma`

## `normalizer_strong_ms`
- prompt: `Terhidu 2,4-D masa kerja. Apa langkah segera?`
- expected_family_id: `sf_24d_inhalation_01`
- family_id_guess: `sf_24d_inhalation_01`
- family_confidence: `high`
- ambiguity_flags: `none`
- method: `gemma`

## `normalizer_weak_en`
- prompt: `Some Basta went into my mouth by mistake. Tell me exactly.`
- expected_family_id: `sf_glufosinate_ingestion_01`
- family_id_guess: `sf_glufosinate_ingestion_01`
- family_confidence: `high`
- ambiguity_flags: `none`
- method: `gemma`

## `normalizer_weak_bn`
- prompt: `২,৪-ডি মুখে গেছে। এখন ঠিক কী করব?`
- expected_family_id: `sf_24d_ingestion_01`
- family_id_guess: `sf_24d_ingestion_01`
- family_confidence: `high`
- ambiguity_flags: `none`
- method: `gemma`

## `normalizer_noisy_id`
- prompt: `Fastac masuk mata waktu campur, perih sekali, langkah pertama?`
- expected_family_id: `sf_fastac_eye_01`
- family_id_guess: `sf_fastac_eye_01`
- family_confidence: `high`
- ambiguity_flags: `none`
- method: `gemma`

## `normalizer_ambiguous`
- prompt: `Chemical splash, burning, not sure eye or skin. What now?`
- expected_family_id: `None`
- family_id_guess: `sf_paraquat_skin_01`
- family_confidence: `low`
- ambiguity_flags: `missing_chemical_identity, cross_incident_type, low_signal`
- method: `gemma`
