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

## What was not fully validated in this environment

True native camera scan + decode was not completed on a real device/emulator during this pass.

Reason:

- `adb` is not installed in this shell
- `xcrun simctl` is unavailable on this host

So the QR module itself is present and the live `/api/resolve-qr` path is proven, but the final camera-based scan proof still needs one native device/emulator pass.

## Current factual status

- backend QR resolution: validated
- QR entry UI: validated
- native on-device decode: still pending native runtime proof
