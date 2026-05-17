# Write-Up Source — App and Backend Flow

## End-to-end flow

The app does not call the model server directly. It talks to a thin backend gateway. That gateway isolates catalog lookup, QR resolution, and controller-backed response generation behind a stable app-facing contract.

## Backend responsibilities

The backend does only four essential things:

- health check
- chemical catalog
- QR resolution
- emergency response generation

It does not implement a general SDS ingestion platform or a broad administration layer.

## App flow

1. app starts and checks backend health
2. app loads the live chemical catalog
3. worker identifies the chemical by QR or manual selection
4. worker enters what happened
5. if backend is reachable, backend runs the controller-backed response path
6. if backend is not reachable and the local model has been imported, the app uses the local guarded fallback path
7. app renders the structured response

## Why this split is useful

- the app stays thin
- the app does not depend on raw vLLM details
- failure modes stay better contained
- the controller and backend can evolve without changing every mobile screen

## App response contract

The app renders a stable emergency-response JSON shape with:

- incident summary
- immediate actions
- do-not-do guidance
- escalation guidance
- response mode
- fallback reason when guarded
- evidence basis label

That keeps the UI aligned with the controller behavior instead of acting like a generic chat transcript.

## Current Stable Split

- online = direct cloud full-response path
- offline = local guarded emergency fallback path

The earlier online local-first quick-card path was explored experimentally but is not the active product behavior in the current submission build.
