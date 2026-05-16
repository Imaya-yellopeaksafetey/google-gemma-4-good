**Cactus Validation Report**

What was re-tested in this pass:

`Android emulator storage remediation`
- Original state:
  - `disk.dataPartition.size=6G`
  - only about `2.2G` free
  - model push failed with `No space left on device`
- Remediation:
  - increased AVD data partition to `12G`
  - cold restarted with wiped userdata
- Result:
  - emulator now reports about `11G` free on `/data`
  - same chosen model path copies successfully

`On-device model asset placement`
- Initial external model path used:
  - `/sdcard/Android/data/com.imaya.gemmasoteria/files/cactus/gemma-4-e2b-it`
- Result:
  - copy succeeded
  - `config.txt` present
  - on-device cactus directory size about `6.3G`
- Runtime remediation:
  - app now imports the model into the canonical internal location
  - canonical runtime path:
    - `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`
  - app logs confirm `exists=true` and `canRead=true`

`App runtime validation`
- Debug APK was not sufficient because it expected Metro
- Release APK with bundled JS was built and installed
- Release app launches successfully on emulator
- App shows `Online full mode`
- Logcat confirms live backend health fetches from the running app
- Manual emulator validation confirmed the online cloud-backed app flow works
- When connectivity is disabled, the app switches into `Offline guarded mode`
- Earlier offline result was:
  - `Cloud guidance is unavailable, and the local model is not ready on this device.`
- After the runtime-path fix:
  - the app now initializes the local model successfully in emulator logs
  - one local completion succeeds in-app logs with `cloud_handoff: false`
  - the UI still does not complete promptly because the offline flow remains too slow during sequential local completions

`Local route validation status`
- Partially complete and now materially stronger on emulator
- Reasons now updated:
  - the language and incident screen scrolling issues were real UI bugs and have been fixed
  - online cloud validation works manually in the emulator
  - the remaining blocker is no longer scrolling, storage, or runtime path visibility
  - the app does now consider the local model ready
  - the remaining blocker is offline local latency before the UI can show the guarded response

Truthful status after this sprint:
- local harness GO still stands
- Android storage no longer blocks the chosen local model path
- Android in-app local-model validation is now proven at the runtime/log level
- cloud-backed emulator validation is proven
- offline/local Android UI validation is still weak because the local path is too slow to produce a clean user-visible response in emulator time
