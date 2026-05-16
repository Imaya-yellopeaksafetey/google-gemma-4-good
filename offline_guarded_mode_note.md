**Offline Guarded Mode Note**

Offline guarded mode is implemented in the app layer and uses the local model only for a short limited response.

Behavior:
- no cloud dependency
- no full-grounded claim
- response shape stays useful:
  - immediate actions
  - avoid/do-not-do
  - escalation instruction
- if the query is unclear, the app can clarify instead of over-answering

Why this matters:
- it gives the Cactus variant a truthful local-first safety story
- it still degrades conservatively

Current proof status:
- code path exists
- model assets are now on-device in the canonical internal location
- the emulator app now shows the intended offline guarded banner
- the Android app now loads the local model successfully and starts local inference offline
- one local completion already succeeds in-app logs
- however, the final guarded response still does not reach the UI promptly because the offline flow is still spending too long in sequential local completions

So today:
- offline guarded mode is visible as a product state
- on-device guarded answer generation is technically active
- but offline guarded UI completion is still too slow to count as a clean user-visible success in the emulator
