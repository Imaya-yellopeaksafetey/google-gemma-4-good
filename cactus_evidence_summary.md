**Cactus Evidence Summary**

`Cloud path`
- strongest and already validated for full response quality
- currently used directly when connectivity is available
- preserved in the current build

`Offline local guarded path`
- local harness GO already established with `google/gemma-4-E2B-it`
- Android storage blocker was removed
- local model assets are imported into the app-readable internal path
- Android in-app local inference is proven
- offline app mode is detected correctly
- offline worker-facing guarded response now renders cleanly in the emulator
- on-screen evidence confirms:
  - local source currently shown
  - `route=local_guarded_offline`
  - no cloud upgrade

`Route split in the current app`
- online:
  - direct cloud controller path
- offline:
  - local guarded emergency fallback

Latency/storage signals from the work:
- emulator data partition expanded successfully to `12G`
- available emulator user storage after remediation: about `11G`
- chosen Android model directory copied successfully: about `6.3G`
- local init time in emulator app logs: about `5.31s`
- local generation remained too slow for a strong online local-first UX, which is why the current online path was simplified back to cloud-direct

Bottom line:
- storage and runtime path visibility no longer block Android validation
- offline local guarded behavior is now visibly working
- the current app is a narrow honest split:
  - local guarded fallback offline
  - direct cloud full response online
