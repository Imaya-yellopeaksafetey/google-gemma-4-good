# Startup Recovery Fix Note

## What changed

- Startup now runs through a single `bootstrapApp()` path in `src/app/AppShell.tsx`.
- `bootstrapApp()` checks `GET /health` first and then loads `GET /api/catalog`.
- If startup fails, the app goes to the error screen with an explicit message instead of silently leaving empty state behind.
- `Retry` now re-runs the missing network work:
  - if the catalog is empty, retry runs the full startup bootstrap again
  - if the user was already mid-incident and only the respond call failed, retry re-submits the incident request
- `Start again` resets the flow and immediately re-runs startup bootstrap.

## Why the old flow was wrong

- The original scaffold loaded catalog once in a mount effect.
- Error retry mainly changed screens; it did not reliably rerun health or catalog requests.
- That created a real risk of getting stuck on the error screen with no catalog data.

## Runtime proof

Startup recovery was validated with browser-based interception in:

- `scripts/validate_startup_recovery.mjs`

Observed recovery artifacts:

- `validation_artifacts/startup_health_error.png`
- `validation_artifacts/startup_health_recovered.png`
- `validation_artifacts/startup_catalog_error.png`
- `validation_artifacts/startup_catalog_recovered.png`

These runs forced the first `/health` failure and the first `/api/catalog` failure separately, then confirmed that `Retry` moved the app back into a usable entry state after the next live backend call succeeded.
