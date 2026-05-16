**Current Architecture For Cactus**

As of May 16, 2026, the current project is mobile-first in UI but cloud-first in inference.

What is already local in the mobile app:
- QR scanning and QR decode happen on-device in `mobile_code/`.
- Manual chemical selection UI and local state live in the app.
- Language selection, request construction, and response rendering are local.

What is currently backend-only:
- `/health`, `/api/catalog`, `/api/resolve-qr`, and `/api/respond` are all backend HTTP calls.
- Chemical catalog truth is loaded from the backend.
- Query routing and preventive-path handling are backend services.

What is currently model-driven:
- The emergency controller uses model-driven normalizer/composer stages through the backend adapter.
- Preventive guidance is model-assisted through the backend path, not on-device.

What is deterministic:
- Planner, verifier, and release selector in `controller_stack/` are deterministic control surfaces.
- QR resolution is deterministic lookup.
- Chemical catalog mapping is deterministic.

What is already QR-local:
- Camera capture and decode are on-device.
- The app only sends decoded `qr_value` text to the backend.

What currently requires network:
- Startup readiness check.
- Catalog fetch.
- QR resolution.
- Emergency response generation.
- Preventive guidance generation.

What currently requires cloud Gemma:
- Full SDS-grounded emergency response.
- Current preventive guidance path.
- Current controller-backed incident normalization/composition path exposed through the live backend.

Bottom line:
- The current product is not local-first.
- It is a mobile app wrapped around a remote controller-backed Gemma system.
