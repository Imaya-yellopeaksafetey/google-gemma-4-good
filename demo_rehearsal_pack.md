# Demo Rehearsal Pack

## Rehearsal set

### Flow A — English hero flow

- label: `Glyphosate eye exposure`
- language: `English`
- chemical: `Roundup / Glyphosate`
- entry path: QR-first preferred, manual fallback available
- worker query: `spray went in my eye`
- expected mode: `full_guided_response`
- expected visible outcome:
  - green mode badge
  - three immediate actions
  - no fallback reason card
  - clear escalation card
- screenshot reference:
  - [full_guided_english.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/full_guided_english.png)

### Flow B — Bangla guarded flow

- label: `Bangla guarded ingestion flow`
- language: `Bangla`
- chemical: `Basta / Glufosinate`
- entry path: manual fallback
- worker query: `মুখে গেছে`
- expected mode: guarded response
- expected visible outcome:
  - yellow guarded badge
  - fallback explanation card
  - strong escalation wording
  - Bangla UI labels and response text
- screenshot reference:
  - [guarded_bangla.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/guarded_bangla.png)

## Startup rehearsal evidence

These are not main demo screens, but they prove the error path is controlled:

- [startup_health_error.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/startup_health_error.png)
- [startup_health_recovered.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/startup_health_recovered.png)
- [startup_catalog_error.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/startup_catalog_error.png)
- [startup_catalog_recovered.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/startup_catalog_recovered.png)

## Spoken cues for the operator

- `The worker starts by identifying the chemical from the QR on the bottle.`
- `If confidence is high and required slots are satisfied, the system releases a full guided response.`
- `If the case is riskier, the system deliberately switches to a guarded response instead of over-answering.`

## What not to use as a hero demo

- `sf_24d_inhalation_01` as a live hero path in the current controller build
- ingestion families as the first story the judge sees
