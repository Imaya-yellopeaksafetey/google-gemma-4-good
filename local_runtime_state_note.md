**Local Runtime State Note**

Implemented in:
- [mobile_code/src/state/AppSessionContext.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/state/AppSessionContext.tsx)
- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)

Runtime state tracks:
- `backendReachable`
- `localCatalogSource`
- `localModelAvailable`
- `localModelInitialized`
- `localModelError`
- `operatingMode`

Use:
- startup decides whether the app begins in `online_full` or `offline_guarded`
- the same state determines whether the app can take the local guarded path when backend is unavailable
- this state is also used for user-visible mode labeling

Current validation result:
- backend reachability is proven in-app by the startup `Online full mode` banner and live `/health` calls
- the local model files are present on-device in the internal canonical path
- online cloud-backed flow is working in the emulator
- when connectivity is removed, the app correctly switches to `Offline guarded mode`
- the local model now initializes successfully and is used in offline guarded runs
- offline guarded UI is now visible and worker-facing in emulator validation

Decision taken along the way:
- earlier in Phase 3, runtime state supported a wider hybrid online-local path
- current implementation still keeps the state needed for that experimentation history
- but active submit behavior now uses:
  - online -> cloud
  - offline -> local guarded fallback
