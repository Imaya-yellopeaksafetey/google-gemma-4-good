**Offline Latency Optimization Note**

Historical cleanup note.

This note records a late optimization pass during the earlier hybrid/local experimentation period.
It should not be read as the active product-path definition by itself.

Scope of this pass:
- no model change
- no new model download
- no broader architecture change
- no TTS or voice

Changes made:
- the offline emergency submit path in [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx) now short-circuits before `routeQuery(...)` when the backend is unavailable
- offline incident handling now uses one local completion only through [buildOfflineGuardedResponse](mobile_code/src/local/localRoute.ts)
- submit-time local model preparation/initialization now reuses cached runtime readiness when startup already established:
  - `localModelAvailable`
  - `localModelInitialized`
- online full-path behavior remains in place:
  - online preventive routing still uses local classification plus cloud handoff
  - online emergency path still preserves cloud controller behavior

Local route shape after this pass:
- online:
  - local readiness reuse
  - local routing/classification where already designed
  - cloud full response preserved
- offline incident:
  - one local guarded completion
  - optional clarification from that same completion if the model says the query is too ambiguous

What was reduced:
- removed the offline pattern:
  - `routeQuery(...)`
  - then `buildOfflineGuardedResponse(...)`
- replaced with:
  - `buildOfflineGuardedResponse(...)` only

Validation result for this pass:
- build and typecheck passed
- the updated code is present
- however, this pass did not finish with a clean user-visible offline guarded response on the emulator

Truthful conclusion:
- the code now reflects the intended one-call offline optimization
- repeated submit-time prep/init has been reduced
- but this pass still does not close the emulator UX proof with a clean visible offline guarded response
