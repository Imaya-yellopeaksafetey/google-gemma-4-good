**Local Model Route Note**

Implemented in:
- [mobile_code/src/local/cactusNative.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/local/cactusNative.ts)
- [mobile_code/src/local/localRoute.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/local/localRoute.ts)
- [mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt)
- [mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalPackage.kt](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalPackage.kt)

Supported local tasks:
- query routing
- realistic incident canonicalization
- short clarification
- short guarded emergency fallback

Current proof status:
- macOS/local harness GO already stands
- Android emulator now has the chosen model directory in a canonical app-readable internal path:
  - `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`
- the release app runs on the emulator
- the online cloud-backed path works from the emulator app
- the offline product mode is detected correctly
- the Android app has now completed real on-device local inference in logs:
  - `cactusInit ... ok=true`
  - `cloud_handoff: false`
  - first local completion succeeded
- the remaining issue is not model visibility or load failure
- the remaining issue is offline latency and multi-step local orchestration before the UI can render the final guarded response

This means:
- the local route is implemented
- storage and runtime path visibility are no longer the Android blockers
- Android in-app local route proof now exists at the log/runtime level
- but the current offline UI path is still not demo-usable because sequential local completions are too slow in the emulator
