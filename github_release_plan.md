# GitHub Release Plan

## Recommended Release Structure

Create one GitHub Release for the submission build with:

- release title: `Gemma Soteria - Submission Build`
- tag example: `v0.1.0-submission`

## Release Assets

Required:

- `gemma-soteria-android.apk`

Optional offline add-on:

- `gemma-soteria-offline-model-pack-gemma-4-e2b-it.zip`

Optional helper/reference:

- short install note copied from [judge_install_and_run_note.md](judge_install_and_run_note.md)

## Recommended Release Notes

Suggested wording:

```text
Gemma Soteria is a plantation chemical emergency assistant.

Default mode:
- Install the APK and use the app online for the full cloud-backed response path.

Optional offline mode:
- A separate local-model pack is available for testing the limited guarded offline fallback.
- The model is intentionally separate from the APK.

Current product split:
- Online: direct cloud full-response path
- Offline: local guarded emergency fallback
```

## Why GitHub Releases Is Best

- judges can download one clean APK artifact
- offline model packaging stays separate and honest
- versioning is clearer than keeping APK files inside the repo
- release notes can explain online vs offline behavior without ambiguity

## What Not To Do

- do not put the 6.3 GB model inside the APK
- do not rely on repo browsing as the primary judge download flow
- do not present the offline pack as required for normal app use
