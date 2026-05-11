# Mobile Demo Readiness

## Fixed in this pass

- startup retry now re-runs real network work instead of only changing screens
- backend health is checked before catalog/respond flow is treated as ready
- key worker-facing UI text is localized for the selected language
- mobile client timeout increased from `20000ms` to `45000ms` after live validation exposed a real latency failure

## Validated live

- live backend health
- live catalog load
- live manual chemical selection
- one full guided response render
- one guarded response render
- startup recovery after forced `/health` failure
- startup recovery after forced `/api/catalog` failure
- live backend QR resolution contract

## Remaining risk

- native on-device QR decode was not completed on a real device/emulator in this environment
- native device/emulator runtime proof is still missing on this host because:
  - `adb` unavailable
  - `xcrun simctl` unavailable

## Factual status

- manual fallback demo path: ready
- full-guided response rendering: ready
- guarded response rendering: ready
- startup/backend recovery path: ready
- QR-first native camera proof: still pending one native runtime check

## Demo-freeze status

The app is substantially hardened for demo use through the manual-selection path and live response rendering.

It is not fully closed for a QR-first mobile claim until one native device/emulator QR scan pass is completed.
