**Model Routing Policy**

Routing signals:
- backend reachability
- local model availability
- whether the worker is online or offline
- whether the request is an incident submit in the emergency flow

Deterministic tool route:
- always used for:
  - QR decode
  - local catalog lookup
  - nearby-body phrasing normalization such as `ear`, `cheek`, `side of face`, `around eye`

Current local Gemma route:
- used only when backend is unavailable and a guarded emergency fallback is needed

Current cloud route:
- used for:
  - full emergency response when backend is reachable
  - richer preventive guidance when backend is reachable

Decision history:
- a broader hybrid route was implemented during Phase 2 + 3:
  - local-first online quick card
  - cloud upgrade
  - local clarify path
- after validation, that route was not kept as the active behavior because:
  - local latency was too high
  - online cloud clarify could overwrite a better local emergency result

Current fallback rules:
- if backend is reachable:
  - submit goes directly to cloud
- if backend is down and local model is available:
  - emergency -> local guarded response
- if backend is down and local model is unavailable:
  - app shows an honest limited error state

Proof signals:
- each response carries provenance such as:
  - `cloud_controller`
  - `local_guarded_offline`
