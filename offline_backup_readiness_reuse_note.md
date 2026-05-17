# Offline Backup Readiness Reuse Note

The app reuses the existing local runtime readiness expectations.

What this means:

- install success alone is not enough
- after unpack, the app calls back into the same local model runtime path already used by the app
- only after the runtime path is confirmed available does the UI move to `ready`

Current code path:

- native install finishes
- native module runs the same canonical-path preparation/initialization logic
- JS receives the updated runtime availability in `offlineBackupStatus`

This prevents a second disconnected truth for offline availability.
