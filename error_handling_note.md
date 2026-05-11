# Error Handling Note

The backend returns explicit structured errors and never returns partial emergency guidance.

## Error classes

- `unknown_qr` for QR values not in the local demo catalog
- `unknown_chemical` for manual chemical IDs not in the local demo catalog
- `upstream_unavailable` when the backend cannot reach vLLM
- `upstream_timeout` when vLLM does not answer in time
- `upstream_bad_response` when vLLM returns malformed or unexpected payloads
- `controller_output_invalid` when the controller returns an incomplete release object
- `controller_failed` when the controller pipeline raises unexpectedly
- `bad_request` for request validation failures

## Safety posture

- route handlers do not construct emergency guidance
- controller errors do not fall through into half-formed response JSON
- QR/catalog lookup errors stop before controller execution
- vLLM transport errors stop before any app-safe emergency object is returned
