**Routing Proof Instrumentation**

Implemented proof surfaces:
- runtime operating mode on startup
- response provenance attached to mapped view models
- response screen route proof card
- backend health signal visible in app startup behavior

Provenance keys:
- `cloud_controller`
- `hybrid_local_then_cloud`
- `local_guarded_offline`
- `local_clarify`
- `local_preventive_limited`

Additional proof gathered in this pass:
- emulator storage expanded from `6G` to `12G`
- same chosen model directory now fits on-device
- release app launches and executes JS on emulator
- live logcat shows backend health fetches from the running app
- manual emulator validation confirms:
  - online full mode works
  - offline guarded banner appears when connectivity is removed

Still missing:
- one completed in-app local-route invocation captured end-to-end on the emulator
- explicit Android success proof that the local model has initialized and served a response
