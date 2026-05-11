# Normalizer Test Report

- Cases run: `6`
- Cases passed against expected behavior: `6/6`

## Sample outputs

### `Paraquat went in my eye. Burning bad. Fast please.`
- detected_language: `english`
- family_id_guess: `sf_paraquat_eye_01`
- family_confidence: `high`
- ambiguity_flags: `none`

### `I breathed 2,4-D and feel bad. What first?`
- detected_language: `english`
- family_id_guess: `sf_24d_inhalation_01`
- family_confidence: `high`
- ambiguity_flags: `none`

### `Some Basta went into my mouth by mistake. Tell me exactly.`
- detected_language: `english`
- family_id_guess: `sf_glufosinate_ingestion_01`
- family_confidence: `high`
- ambiguity_flags: `none`

### `2,4-D got in my mouth. Exact steps now?`
- detected_language: `english`
- family_id_guess: `sf_24d_ingestion_01`
- family_confidence: `high`
- ambiguity_flags: `none`

### `Chemical splash, burning, not sure if in eye or skin.`
- detected_language: `english`
- family_id_guess: `sf_glyphosate_skin_01`
- family_confidence: `low`
- ambiguity_flags: `missing_explicit_chemical_identity, multiple_family_candidates, low_signal_prompt`

### `Spray terkena saya masa kerja, rasa pedih. Apa dulu?`
- detected_language: `english`
- family_id_guess: `sf_glyphosate_skin_01`
- family_confidence: `low`
- ambiguity_flags: `missing_explicit_chemical_identity, missing_explicit_incident_signal, low_signal_prompt`
