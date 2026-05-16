**Model Routing Policy**

Routing signals:
- query type
- network/backend reachability
- local model availability
- ambiguity in the user query
- whether a full grounded answer is required

Deterministic tool route:
- always used for QR decode and local catalog lookup

Local Gemma route:
- used when the task is one of:
  - route classification
  - body-location canonicalization
  - clarification
  - offline guarded fallback
- also used first in hybrid online mode when available, because it can normalize the query before cloud handoff

Cloud route:
- used for:
  - full emergency response when backend is reachable
  - richer preventive guidance when backend is reachable

Fallback rules:
- if backend is down and local model is available:
  - emergency -> local guarded response
  - preventive -> limited local defer-to-online response
- if local model is unavailable:
  - app still works online through cloud
  - offline capability is reduced and must be labeled honestly

Proof signals:
- each response carries provenance:
  - `cloud_controller`
  - `hybrid_local_then_cloud`
  - `local_guarded_offline`
  - `local_clarify`
  - `local_preventive_limited`
