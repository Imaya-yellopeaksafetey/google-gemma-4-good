## Online Response State Machine

Exploratory / historical note only.

This state machine belongs to the earlier online local-first quick-card experiment.
It is not the active product behavior in the current submission build.

Current active truth:

- online = direct cloud full-response path
- offline = local guarded emergency fallback

States:

- `local_quick_ready`
- `cloud_pending`
- `cloud_complete`
- `cloud_failed_keep_local`

State meanings:

- `local_quick_ready`
  - local first-pass guidance is available
  - route provenance shows local model used
  - cloud may or may not have started yet

- `cloud_pending`
  - local quick card or preventive stub is already on screen
  - the app is waiting for richer cloud-grounded guidance
  - the UI shows a route-status card explaining that fuller guidance is still being prepared

- `cloud_complete`
  - cloud response has replaced the local-first card/stub
  - route provenance shows both local and cloud use
  - the route-status card explains that the cloud response replaced the local first pass

- `cloud_failed_keep_local`
  - cloud did not complete successfully
  - the local quick card or stub remains on screen
  - the route-status card explains that the app is keeping limited local guidance visible

User-visible expectations:

- `clarify` is a separate branch, not an upgrade state
- offline guarded mode remains separate from this online state machine
