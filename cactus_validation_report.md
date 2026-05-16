**Cactus Validation Report**

What is now validated:

`Offline guarded local route`
- Android emulator storage remediation succeeded:
  - data partition increased to `12G`
  - chosen model path fits on-device
- model import into the canonical internal app path succeeded:
  - `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`
- the app loads the local model successfully on Android
- offline submit now produces a clean worker-facing guarded response on-screen
- the offline guarded screen now shows:
  - `Immediate actions`
  - `Do not do`
  - `Escalate now`
- no raw JSON leaks into the UI
- route/debug evidence on-screen confirms:
  - `kind=emergency`
  - `route=local_guarded_offline`
  - `upgrade=none`

`Online cloud route`
- backend `/health` succeeds
- backend `/api/catalog` succeeds
- when backend is reachable, incident submit now goes directly to `/api/respond`
- the current online path no longer invokes the local model before cloud submit
- latest logs confirm:
  - no `[local-online-first] request`
  - no `[cactus-local] complete:start` during online submit
  - direct `/api/respond` request instead

`What changed from the earlier Cactus attempt`
- the earlier online local-first quick-card path was implemented experimentally
- in practice it created worse UX:
  - high local latency
  - cloud clarify responses overwriting useful local cards
- the current build therefore keeps:
  - offline local guarded route
  - online direct cloud route

Truthful status after the current pass:
- local harness GO still stands
- Android in-app local route is proven
- offline local guarded UX is now visibly working in the emulator
- online route is currently cloud-direct, not local-first
- the app now supports a real local guarded fallback plus a preserved cloud full-response path
