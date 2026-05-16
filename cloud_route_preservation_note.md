**Cloud Route Preservation Note**

The cloud path remains the main full-response engine.

Preserved behaviors:
- QR-first and manual identification remain intact
- backend `/health`, `/api/catalog`, `/api/resolve-qr`, and `/api/respond` remain the app-facing cloud surfaces
- full emergency responses still go through the existing backend/controller path when online
- preventive questions still upgrade to the richer cloud path when online

Evidence in this pass:
- the bundled release app shows `Online full mode`
- live React Native logs confirm `/health` payloads from the backend
- manual emulator validation confirmed that the online cloud-backed flow works
- when connectivity is removed, the app stops relying on cloud instead of pretending the path still exists
- no controller redesign was introduced

Safety:
- cloud fallback remains a product fallback only
- it does not count as proof of the local route
