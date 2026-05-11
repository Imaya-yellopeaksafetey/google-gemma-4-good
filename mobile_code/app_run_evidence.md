# App Run Evidence

## What was actually run

### Install and typecheck

Executed in `mobile_code/`:

```bash
npm install
npm run typecheck
```

Typecheck passed.

### Live backend checks

Confirmed:

- `GET http://20.242.52.182:8080/health`
- `GET http://20.242.52.182:8080/api/catalog`
- `POST http://20.242.52.182:8080/api/resolve-qr`
- `POST http://20.242.52.182:8080/api/respond`

### Local runnable app build

Executed:

```bash
EXPO_NO_TELEMETRY=1 EXPO_HOME=mobile_code/.expo-home npx expo export --platform web
```

Result:

- web export completed successfully
- output directory: `mobile_code/dist`

### Local served validation target

Served locally with:

```bash
python3 -m http.server 4173 --directory mobile_code/dist
```

Verified reachable via:

- `http://127.0.0.1:4173`

### Browser-driven live validation

Executed:

- `scripts/validate_startup_recovery.mjs`
- `scripts/validate_live_web.mjs`

Browser engine used:

- Google Chrome headless via Playwright Core

## Evidence artifacts

- `validation_artifacts/startup_health_error.png`
- `validation_artifacts/startup_health_recovered.png`
- `validation_artifacts/startup_catalog_error.png`
- `validation_artifacts/startup_catalog_recovered.png`
- `validation_artifacts/full_guided_english.png`
- `validation_artifacts/guarded_bangla.png`

## Native runtime status

This host did not provide a usable native mobile runtime during this pass:

- `adb` not installed
- `xcrun simctl` unavailable

So the app was live-run and validated through the exported mobile web build plus live backend, but not through a native device/emulator on this machine.
