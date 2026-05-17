# APK Distribution Strategy

## Decision

For this submission, the cleanest judge distribution plan is:

1. Publish the standard Android APK as a GitHub Releases asset.
2. Publish the offline local-model pack as a separate optional asset.
3. Treat online cloud use as the default judge path.
4. Treat offline guarded fallback as an optional advanced setup path for judges or operators who want to test low-connectivity behavior.

## Current Build Facts

- current release APK output:
  - `mobile_code/android/app/build/outputs/apk/release/app-release.apk`
- measured APK size:
  - about `84 MB`
- measured local model size:
  - about `6.3 GB`

## Options Compared

### 1. Raw APK kept in repo

- Pros: simple for the author
- Cons: noisy repo history, awkward downloads, poor release hygiene, easy to mix builds
- Verdict: not recommended

### 2. GitHub Releases APK asset

- Pros: clean download surface, versioned, judge-friendly, easy release notes
- Cons: requires deliberate asset naming and release notes
- Verdict: recommended for the APK

### 3. APK plus separate model-pack distribution

- Pros: honest about the current architecture, keeps APK normal-sized, preserves optional offline capability
- Cons: more setup for offline testing
- Verdict: recommended for this submission

### 4. Single-APK online-only use

- Pros: simplest judge install path
- Cons: hides the real offline architecture, removes the demonstrable local guarded path
- Verdict: not recommended as the only distribution story

### 5. APK plus optional offline add-on

- Pros: best balance between practical install and honest capability split
- Cons: requires an operator note and model import step
- Verdict: best overall submission path

## Final Recommendation

Release the app as:

- `gemma-soteria-android.apk`
- `gemma-soteria-offline-model-pack-gemma-4-e2b-it.zip` or `.tar.zst`

Submission positioning:

- Default judge path: install APK and use online mode
- Optional advanced path: install APK, import model pack once, then test offline guarded mode

## Why This Is The Cleanest Judge Path

- The APK remains normal-sized and easy to install.
- The 6.3 GB local model is not hidden or bundled misleadingly.
- Judges can test the main product quickly online.
- Offline Cactus behavior remains demonstrable without pretending the APK is self-contained.
