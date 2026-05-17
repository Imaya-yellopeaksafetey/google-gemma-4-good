## Online Route Instrumentation

Exploratory / historical note only.

This instrumentation note belongs to the earlier online local-first experiment and should not be read as the current active route.

Added route instrumentation in `submitIncident()`:

- `[route] submit:start`
- `[route] localFirst`
- `[route] localQuick:shown`
- `[route] cloudUpgrade:start`
- `[route] cloudUpgrade:complete`
- `[route] cloudUpgrade:failed_keep_local`

Local model instrumentation remains available through:

- `[cactus-local] complete:start`
- native/local completion success and failure logs from the existing Cactus integration

Purpose:

- prove whether local model ran first
- prove whether cloud started after local-first content
- prove whether upgrade completed or fallback retained local content
