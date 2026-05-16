**Cactus Architecture Decision**

This variant now uses two active product routes plus deterministic local tools.

`Route A — Local Gemma`
- Model: `google/gemma-4-E2B-it` through the Android Cactus native runtime.
- Current active use:
  - offline guarded emergency fallback only
- Rationale:
  - this is the narrow local path that is now working visibly in the emulator
  - it keeps the Cactus claim technically real without forcing a slow or degraded online local-first UX

`Route B — Cloud full-response`
- Uses the existing backend and controller.
- Current active use:
  - all online incident submits
  - all richer preventive/handling guidance while online
- Rationale:
  - this remains the strongest and most validated response engine
  - after experimentation, keeping online submits cloud-direct was the safer product decision

`Route C — Deterministic local tools`
- Used for:
  - QR decode on device
  - local catalog lookup
  - embedded chemical metadata lookup
  - runtime online/offline state
- Rationale:
  - these do not need model inference
  - they should keep working with poor or absent network

Decision history:
- an online hybrid local-first route was implemented and tested
- it was later reduced out of the active product path because:
  - local latency was too high
  - cloud clarify responses could degrade the visible response
- the current architecture therefore keeps:
  - direct cloud when online
  - local guarded fallback when offline

Truthful scope:
- this is not a fully offline full-response assistant
- it is now a narrow honest split:
  - local guarded fallback offline
  - cloud full response online
