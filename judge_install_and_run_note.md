# Judge Install And Run Note

## Fast Path: Normal App Install

1. Download the Android APK from the GitHub Release.
2. Install it on an Android device or emulator.
3. Open `Gemma Soteria`.
4. Select a language.
5. Use the app normally.

What this gives you:

- full online cloud-backed response path
- QR-first flow
- manual chemical fallback

Current workspace build output:

- `mobile_code/android/app/build/outputs/apk/release/app-release.apk`

## Optional Path: Enable Offline Guarded Mode

Offline guarded mode requires a separate model import. This is optional.

1. Download the separate offline model pack.
2. Extract the model pack on a host machine with `adb`.
3. Run:

```bash
mobile_code/scripts/prepare_cactus_internal_model.sh \
  <adb-serial> \
  /path/to/unpacked/gemma-4-e2b-it
```

4. Start the app.
5. If the backend is unavailable, the app will use limited local guarded emergency guidance.

## What To Expect

### Online

- richer cloud-backed guidance
- best path for judge testing

### Offline

- short guarded emergency guidance only
- not full SDS-grounded response
- local fallback may be slower on emulator than on the main online path

## Honest Constraint

The offline model is large and separate from the APK. That is intentional for this submission.
