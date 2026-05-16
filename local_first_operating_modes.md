**Local-First Operating Modes**

`Online full mode`
- Local:
  - QR decode
  - local catalog fallback
  - local query routing
  - local canonicalization when available
- Cloud:
  - full controller-backed emergency response
  - richer preventive response
- User sees:
  - normal app flow
  - full or guarded cloud response as appropriate
- Safety:
  - strongest existing cloud policy remains in control for final full responses

`Offline guarded mode`
- Local:
  - QR/manual chemical identification
  - routing
  - canonicalization
  - short guarded emergency fallback
  - limited preventive deferral response
- Cloud:
  - unavailable
- User sees:
  - explicit limited/offline messaging
  - short emergency guidance only
- Safety:
  - no fake full-grounded claim
  - preventive questions defer instead of inventing rich content

`Weak-network / cloud-unavailable routed mode`
- Local:
  - first-pass routing and canonicalization
  - clarification if needed
  - guarded fallback if cloud fails
- Cloud:
  - attempted only when needed and reachable
- User sees:
  - app stays usable
  - either cloud response or clear limited fallback
- Safety:
  - failure is contained to the response path, not the whole app
