# Preventive Guidance Path Note

Implemented a separate preventive path in:

- [app/services/controller_service.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app/services/controller_service.py)
- [app/services/preventive_guidance_service.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app/services/preventive_guidance_service.py)

## Why this path exists

The emergency controller is optimized for:

- incident completion
- immediate first-aid actions
- do-not-do rules
- escalation

It is the wrong engine for:

- PPE questions
- handling precautions
- storage questions
- exposure-prevention wording

## What the preventive path returns

- `response_kind = preventive_guidance`
- concise preventive summary
- recommended precautions
- avoid-actions list
- follow-up note that tells the worker to switch back to the emergency path if exposure already happened

## Grounding basis

- selected demo chemical identity from `chemical_catalog.json`
- local source metadata from `benchmark_v0/source_pack_v0.json`
- conservative handling copy packaged in the backend for this final sprint

## Honest limitation

The local benchmark source pack is strongest for first-aid / incident handling, not full preventive SDS tables. So this path is intentionally:

- concise
- conservative
- product-aware

It is not pretending to be a complete chemical-label compliance engine.
