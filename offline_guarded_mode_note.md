**Offline Guarded Mode Note**

Offline guarded mode is implemented in the app layer and uses the local model only for a short limited fallback signal.

Current behavior:
- no cloud dependency
- no full-grounded claim
- worker-facing response shape is clean:
  - immediate actions
  - do not do
  - escalate now
- no raw model JSON is shown to the worker
- if the model cannot classify safely, the app degrades to a limited honest stop message

Why this matters:
- it gives the Cactus variant a truthful local fallback story
- it degrades conservatively

Current proof status:
- code path exists
- model assets are on-device in the canonical internal location
- the Android app loads the local model successfully
- the offline guarded banner appears correctly
- the local guarded response now reaches the UI cleanly in emulator validation

So today:
- offline guarded mode is visible as a product state
- on-device guarded answer generation is active
- worker-facing offline guarded UI is working
