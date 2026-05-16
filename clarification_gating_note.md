## Clarification Gating

Clarification gating is active for the online local-first path.

Behavior:

- if the local first-pass result is `clarify`
- the app renders a clarification response immediately
- the cloud full-response request does not start yet

Reason:

- avoid starting a richer grounded response from an unclear worker report
- keep the route between models truthful and safe

Implementation points:

- `buildOnlineLocalFirstResponse(...)` may return `kind: "clarify"`
- `submitIncident()` exits early after showing the clarification response
