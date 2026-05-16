## Online Local-First Validation

Historical note only.

What was learned from the experiment:

- the online local-first path was implemented
- local completion did run on-device
- cloud upgrade behavior did run
- however, the combination was not good enough in the current app for product use because:
  - local latency was too high
  - cloud clarify could overwrite a useful local emergency card

Current implemented behavior:

- the active online submit path is now direct cloud
- the active offline submit path is local guarded fallback

Current factual conclusion:

- this document should be read as validation history for an experiment, not the current product path
- the current app behavior is no longer online local-first
