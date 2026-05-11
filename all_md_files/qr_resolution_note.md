# QR Resolution Note

QR resolution is intentionally simple in v1.

## Flow

1. The app scans a QR payload such as `demo://chemical/glyphosate_roundup_demo`
2. The backend performs a direct lookup against `chemical_catalog.json`
3. If found, the backend returns the stable `chemical_id`
4. If not found, the backend returns a structured `unknown_qr` error

## Why this is enough

- the demo only needs stable, local QR lookup
- no internet SDS fetch is required
- wrongness is contained to one service boundary: QR parsing cannot alter controller logic
