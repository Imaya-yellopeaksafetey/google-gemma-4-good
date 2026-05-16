**Local Runtime State Note**

Implemented in:
- [mobile_code/src/state/AppSessionContext.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/state/AppSessionContext.tsx)
- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)

Runtime state now tracks:
- `backendReachable`
- `localCatalogSource`
- `localModelAvailable`
- `localModelInitialized`
- `localModelError`
- `operatingMode`

Use:
- startup decides whether the app begins in `online_full` or `offline_guarded`
- the same state determines whether the app can take a local-only guarded path
- this state is also used for user-visible mode labeling

Current validation result:
- backend reachability is proven in-app by the startup `Online full mode` banner and live `/health` calls
- local model files are present on-device after storage remediation
- online cloud-backed flow is working in the emulator
- when connectivity is removed, the app correctly switches to `Offline guarded mode`
- current offline result is an honest failure state:
  - `Cloud guidance is unavailable, and the local model is not ready on this device.`
- in-app local model invocation is therefore still not complete on Android
