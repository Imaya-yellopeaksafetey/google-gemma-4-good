**Cactus Evidence Summary**

`Cloud-heavy path`
- strongest and already validated for full response quality
- still online-dependent
- preserved in this variant

`Local guarded path`
- local harness GO already established with `google/gemma-4-E2B-it`
- Android storage blocker is now removed
- local model assets are now imported into the app-readable internal path
- offline app mode is detected correctly
- Android in-app local route is now proven in logs:
  - local model initialized successfully
  - `cloud_handoff: false`
  - first local completion succeeded on-device
- practical offline UI completion is still weak because the local offline flow remains too slow in the emulator

`Hybrid routed path`
- implemented in app state and route selection code
- app can use local classification/canonicalization before cloud handoff
- route provenance is part of the response model

Latency/storage signals from this sprint:
- emulator data partition expanded successfully to `12G`
- available emulator user storage after remediation: about `11G`
- same chosen Android model directory copied successfully: about `6.3G`
- local init time in emulator app logs: about `5.31s`
- first local completion timing in emulator app logs:
  - `time_to_first_token_ms: 3763.8`
  - `total_time_ms: 41272.46`
- a later routing completion took about `62.6s` end-to-end before the next local step began

Bottom line:
- storage and runtime path visibility no longer block Android validation
- the remaining blocker is offline local latency / orchestration, not model packaging or path visibility
