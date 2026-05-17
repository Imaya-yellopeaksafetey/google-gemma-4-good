# Offline Backup Progress Note

Download progress is shown as a visible percentage in the top status card.

Implementation details:

- native module emits progress updates through `offlineBackupStatus`
- JS subscribes through `DeviceEventEmitter`
- the UI renders:
  - `Offline emergency backup downloading (N%)`
  - `Downloading offline emergency backup. N%`

Observed emulator proof:

- visible `1%`, `5%`, `11%`, and `14%` progress states were captured
- after interruption and restart, resumed progress jumped to `19%`, then `20%`, then `21%`

For `verifying` and `installing`, the app uses staged status labels rather than fake numeric progress.
