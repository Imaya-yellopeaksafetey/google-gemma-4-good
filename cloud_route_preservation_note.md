**Cloud Route Preservation Note**

The cloud path remains the main full-response engine.

Preserved behaviors:
- QR-first and manual identification remain intact
- backend `/health`, `/api/catalog`, `/api/resolve-qr`, and `/api/respond` remain the app-facing cloud surfaces
- full emergency responses go through the existing backend/controller path when online
- preventive questions still use the richer cloud path when online

Evidence in the current pass:
- the bundled release app shows `Online full mode`
- live React Native logs confirm `/health` payloads from the backend
- latest online submit logs confirm direct `/api/respond` use
- the current online submit path no longer invokes the local model first
- manual emulator validation confirmed that the online cloud-backed flow works
- when connectivity is removed, the app stops relying on cloud and falls back to the local guarded path instead of pretending cloud still exists
- no controller redesign was introduced

Decision taken along the way:
- an online local-first cloud-upgrade path was explored during the sprint
- it was not kept as the active behavior
- the current preserved online product path is direct cloud because it remains the most stable and highest-quality route

Safety:
- cloud remains the richer and more trusted responder
- local fallback remains product continuity only when backend is unavailable
