**Local Model Route Note**

Implemented in:
- [mobile_code/src/local/cactusNative.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/local/cactusNative.ts)
- [mobile_code/src/local/localRoute.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/local/localRoute.ts)
- [mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt)
- [mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalPackage.kt](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalPackage.kt)

Current local task:
- offline guarded emergency fallback only

The local model is no longer used on the active online submit path.

Current proof status:
- macOS/local harness GO stands
- Android emulator now has the chosen model directory in a canonical app-readable internal path:
  - `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`
- the release app runs on the emulator
- the Android app completes real on-device local inference
- the offline guarded route now renders a clean worker-facing response in emulator validation

This means:
- the local route is implemented and proven
- storage and runtime path visibility are no longer Android blockers
- the current local route is intentionally narrow:
  - offline guarded fallback
- the active online route is cloud-direct
