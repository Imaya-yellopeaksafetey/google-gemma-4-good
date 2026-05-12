# QR Live Validation

## What was validated live

- Live backend QR resolution contract works.
- The app entry screen renders the on-device QR scanner path and permission gate.
- The QR fallback path to manual selection renders correctly.

Live backend QR resolution check:

```json
{"chemical_id":"glyphosate_roundup_demo","resolved":true}
```

Request used:

```json
{"qr_value":"demo://chemical/glyphosate_roundup_demo"}
```

## Native proof update

QR-first was later completed on a real Android phone:

- scan succeeded
- QR resolved correctly
- chemical locked correctly
- worker query proceeded
- expected full guided response was returned

## Current factual status

- backend QR resolution: validated
- QR entry UI: validated
- native on-device decode: validated on real Android
