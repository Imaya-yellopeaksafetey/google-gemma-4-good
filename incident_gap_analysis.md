# Incident Gap Analysis

## What the current system did before this pass

- `app/services/controller_service.py` sent every `worker_query` through the emergency controller.
- `controller_stack/normalizer.py` was built to infer one of the benchmarked incident families only.
- `controller_stack/controller.py` allowed full release only when:
  - the family was in a strong lane
  - `family_confidence == "high"`
- all other paths were downgraded into guarded emergency output

## Why realistic phrasing was weaker

- Realistic phrases like `spray went into my ear` or `it touched the side of my face` were not explicit benchmark incident cues.
- The normalizer knew canonical incident families such as:
  - `eye_exposure`
  - `skin_exposure`
  - `inhalation`
  - `ingestion`
- but it did not have an explicit canonicalization layer for:
  - ear
  - cheek
  - side-of-face
  - around-eye surface phrasing
- So those queries could fall through into low-confidence matching or the wrong family lane.

## Why PPE / handling questions behaved awkwardly

- Queries like:
  - `what PPE should be used?`
  - `what precautions should I take while spraying?`
- were still being forced into the emergency-response controller.
- That controller is optimized for:
  - first-aid action ordering
  - do-not-do rules
  - escalation
- It is not designed to answer preventive SDS questions cleanly in the same schema.

## Where the fall-through happened

- routing gap: there was no pre-controller query-mode split
- canonicalization gap: realistic body-location variants were not normalized before family selection
- answer-shape gap: the app only expected one emergency response shape

## What this pass fixes

- adds a narrow query-mode router before the controller
- adds a lightweight emergency canonicalization step for realistic field phrasing
- preserves the existing controller for real incidents
- adds a separate preventive guidance path for PPE / handling / storage / prevention questions
- adds a minimal unclear-query clarification path instead of forcing unsafe guessing
