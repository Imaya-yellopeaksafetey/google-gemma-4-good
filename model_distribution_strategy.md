# Model Distribution Strategy

## Submission Truth

- The APK and the local model are separate artifacts.
- The local model must not be bundled into the APK.
- The local model is optional for judge testing, but required for offline guarded mode.

## Current Artifact Size

- APK: about `84 MB`
- local model runtime folder: about `6.3 GB`

## Recommended Submission Model Plan

Distribute the model as a separate compressed pack containing the Cactus runtime folder for:

- `google/gemma-4-E2B-it`

The model pack should unpack to a host-side folder equivalent to:

- `gemma-4-e2b-it/`

That folder is then imported onto the Android target using the existing helper script.

## Canonical Runtime Path

The app now expects the model at the internal runtime path:

- `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`

This path is correct for the current Android local-runtime integration.

## One-Time Import Flow

Host-side helper:

- [mobile_code/scripts/prepare_cactus_internal_model.sh](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/scripts/prepare_cactus_internal_model.sh)

Recommended usage:

```bash
/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/scripts/prepare_cactus_internal_model.sh \
  emulator-5554 \
  /path/to/unpacked/gemma-4-e2b-it
```

What the helper does:

- pushes/imports the model into the app-readable internal location
- avoids relying on external storage as the runtime source of truth
- prepares the canonical internal path used by the Android native module

## Operational Guidance

- Online mode does not require the model pack.
- Offline guarded mode requires the model pack to have been imported successfully once.
- The app’s visible readiness/status panel should be used to confirm:
  - backend connected/unavailable
  - local fallback ready/import needed

## Packaging Recommendation

Recommended release packaging:

- compressed archive, not raw folder upload
- include a short checksum note if publishing externally
- keep the archive outside the repo and attach it to the GitHub Release or share separately for operator-only testing
