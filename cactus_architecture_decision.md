**Cactus Architecture Decision**

This variant uses three real routes and keeps them narrow.

`Route A — Local Gemma`
- Model: `google/gemma-4-E2B-it` through the Android Cactus native runtime.
- Used only for:
  - emergency vs preventive query routing
  - incident/body-location canonicalization
  - short clarification when the query is unclear
  - short guarded emergency fallback when cloud is unavailable
- Rationale:
  - these tasks are short, latency-sensitive, and still useful offline
  - they do not require the full SDS-grounded controller stack

`Route B — Cloud full-response`
- Uses the existing backend and controller.
- Used for:
  - full grounded emergency response
  - stronger multilingual structured output
  - the validated strong cloud path already used by the main track
- Rationale:
  - this is still the highest-quality path for full response generation
  - it preserves the strongest current demo-safe behavior

`Route C — Deterministic local tools`
- Used for:
  - QR decode on device
  - local catalog lookup
  - embedded chemical metadata lookup
  - runtime online/offline state
- Rationale:
  - these do not need model inference
  - they should keep working with poor or absent network

Truthful scope:
- this is not a fully offline full-response assistant
- it is a routed emergency assistant where meaningful local work happens on-device and cloud is used for the heavy grounded path
