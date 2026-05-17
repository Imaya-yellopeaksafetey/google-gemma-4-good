## Clarification Gating

Exploratory / historical note only.

This note belongs to the earlier online local-first clarification experiment and is not the active online submit path.

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
