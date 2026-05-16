**Local-First Operating Modes**

`Online full mode`
- Local:
  - QR decode
  - local catalog fallback
  - deterministic nearby-body query normalization before submit
- Cloud:
  - full controller-backed emergency response
  - richer preventive response
- User sees:
  - normal app flow
  - full or guarded cloud response as appropriate
- Safety:
  - strongest existing cloud policy remains in control for final responses
- Current decision:
  - online no longer uses the local model at submit time

`Offline guarded mode`
- Local:
  - manual/local chemical identification from cached catalog
  - guarded bucket generation
  - deterministic worker-facing guarded card rendering
- Cloud:
  - unavailable
- User sees:
  - explicit limited/offline messaging
  - short emergency guidance only
- Safety:
  - no fake full-grounded claim
  - no raw model JSON shown to the worker
  - if local classification fails, the app stops honestly

`Weak-network / cloud-unavailable routed mode`
- Local:
  - guarded fallback if backend cannot be reached
- Cloud:
  - used directly when reachable
- User sees:
  - either the normal cloud response path
  - or the offline guarded fallback
- Safety:
  - failure is contained to the response path, not the whole app

Current implementation truth:
- the active product no longer uses the earlier online local-first quick-card flow
- the active split is:
  - online direct cloud
  - offline local guarded fallback
