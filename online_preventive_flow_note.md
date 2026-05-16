## Online Preventive Flow

For preventive or handling questions while online:

- local model classifies first
- local side does not try to produce a rich preventive answer
- the app shows a minimal preventive holding state
- the cloud path returns the richer preventive/full response

Current UI behavior:

- `makeLocalPreventiveCheckingResponse(...)` renders a short summary and follow-up note
- route provenance marks this as local-first then cloud
- cloud success upgrades the screen
- cloud failure keeps the limited local preventive stub on screen
