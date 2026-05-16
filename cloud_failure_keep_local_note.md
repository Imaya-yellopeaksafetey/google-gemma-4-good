## Cloud Failure Keep-Local Behavior

If cloud fails after local-first content is already available:

- the app does not collapse to a blank error-only state
- the local quick card or preventive stub remains on screen
- route provenance switches to `cloud_failed_keep_local`
- upgrade state switches to `cloud_failed_keep_local`

Why this matters:

- it preserves continuity for the worker
- it makes the routed architecture visible
- it avoids pretending that cloud grounding completed
