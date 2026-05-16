# Application Improvement Validation

## Live backend validation completed

Validated against the deployed backend at `http://20.242.52.182:8080`.

## Infrastructure checks

- `GET /health` passed
  - `status=ok`
  - `gateway=ok`
  - `vllm=ok`
  - `model=google/gemma-4-31B-it`
- `GET /api/catalog` passed

## Emergency path

### Existing strong emergency flow

Request:

- chemical: `glyphosate_roundup_demo`
- query: `spray went in my eye`
- language: `english`

Observed result:

- `response_kind = emergency_guidance`
- `response_mode = full_guided_response`
- `family_id = sf_glyphosate_eye_01`
- `family_confidence = high`

Status:

- passed

### Existing guarded emergency flow

Request:

- chemical: `glufosinate_basta_demo`
- query: `Basta entered the mouth while handling concentrate`
- language: `bangla`

Observed result:

- `response_kind = emergency_guidance`
- `response_mode = guarded_minimum_response`
- `family_id = sf_glufosinate_ingestion_01`

Status:

- passed

## Improved realistic phrasing target

### Ear phrasing

Request:

- chemical: `glyphosate_roundup_demo`
- query: `spray went into my ear`
- language: `english`

Observed result:

- `response_kind = emergency_guidance`
- `response_mode = guarded_minimum_response`
- `route_reason = face_or_ear_variant_to_skin_exposure`
- `family_id = sf_glyphosate_skin_01`
- `family_confidence = high`

Status:

- passed

## Preventive path

### PPE question

Request:

- chemical: `glyphosate_roundup_demo`
- query: `what PPE should be used while spraying?`
- language: `english`

Observed result:

- `response_kind = preventive_guidance`
- `response_mode = preventive_guidance`

Status:

- passed

### Handling / precaution question

Request:

- chemical: `glyphosate_roundup_demo`
- query: `what precautions should I take while spraying?`
- language: `english`

Observed result:

- `response_kind = preventive_guidance`
- `response_mode = preventive_guidance`

Status:

- passed

## Follow-up router patch verified live

The follow-up patch to [app/services/query_router.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app/services/query_router.py) fixed two concrete issues:

- ear / face canonicalization no longer leaks ingestion cues into the controller prompt
- boundary-aware matching prevents `hand` from firing inside `handling`

Evidence:

- `spray went into my ear` now lands on `sf_glyphosate_skin_01`
- `Basta entered the mouth while handling concentrate` stays on `sf_glufosinate_ingestion_01`

## Overall validation status

Passed live:

- health
- catalog
- strong emergency flow
- guarded emergency flow
- improved ear phrasing
- PPE preventive flow
- precautions preventive flow

## Honest conclusion

This final application improvement pass is now working as intended:

- strongest validated emergency flows remain intact
- realistic ear / nearby-body-surface phrasing is handled more intelligently
- preventive SDS-style questions are no longer forced through the emergency controller
- unclear-query handling remains available without broadening the product into a generic chatbot
