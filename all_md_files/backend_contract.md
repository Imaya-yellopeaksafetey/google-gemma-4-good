# Backend Contract

## Purpose

This backend is a thin app-facing gateway that hides direct vLLM access, resolves demo chemicals, and returns one stable emergency-response JSON contract for the mobile app.

## Endpoints

### `GET /health`

Response:

```json
{
  "status": "ok",
  "gateway": "ok",
  "vllm": "ok",
  "model": "google/gemma-4-31B-it",
  "controller_version": "demo-current"
}
```

### `GET /api/catalog`

Response:

```json
{
  "chemicals": [
    {
      "chemical_id": "glyphosate_roundup_demo",
      "qr_value": "demo://chemical/glyphosate_roundup_demo",
      "short_label": "Roundup",
      "names": {
        "english": "Roundup / Glyphosate",
        "malay": "Roundup / Glyphosate",
        "bangla": "রাউন্ডআপ / গ্লাইফোসেট",
        "bahasa_indonesia": "Roundup / Glyphosate"
      }
    }
  ]
}
```

### `POST /api/resolve-qr`

Request:

```json
{
  "qr_value": "demo://chemical/glyphosate_roundup_demo"
}
```

Response:

```json
{
  "chemical_id": "glyphosate_roundup_demo",
  "resolved": true
}
```

### `POST /api/respond`

Request:

```json
{
  "chemical_id": "glyphosate_roundup_demo",
  "worker_query": "spray went in my eye",
  "target_language": "english"
}
```

Response:

```json
{
  "request_id": "req_123abc456def",
  "chemical_id": "glyphosate_roundup_demo",
  "response_mode": "full_guided_response",
  "incident_summary": "Likely Glyphosate isopropylamine salt eye exposure.",
  "immediate_actions": [
    { "instruction": "Start rinsing the eye immediately." }
  ],
  "do_not_do": [
    { "instruction": "Do not stop rinsing early." }
  ],
  "escalate_now": {
    "instruction": "Call a doctor for treatment advice immediately."
  },
  "fallback_reason": null,
  "evidence_basis": [
    {
      "label": "SDS-grounded guidance",
      "source_section_id": "section_4",
      "source_span_id": "p1_l20_l24"
    }
  ],
  "meta": {
    "detected_language": "english",
    "family_id": "sf_glyphosate_eye_01",
    "family_confidence": "high"
  }
}
```

## Error contract

All structured failures return:

```json
{
  "error": {
    "code": "unknown_chemical",
    "message": "Unknown chemical_id: not_in_catalog"
  }
}
```

Expected error codes:

- `bad_request`
- `unknown_qr`
- `unknown_chemical`
- `upstream_unavailable`
- `upstream_timeout`
- `upstream_bad_response`
- `controller_output_invalid`
- `controller_failed`
- `internal_error`
