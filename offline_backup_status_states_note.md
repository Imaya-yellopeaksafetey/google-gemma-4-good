# Offline Backup Status States Note

Implemented explicit lifecycle states:

- `not_ready`
- `download_available`
- `downloading`
- `verifying`
- `installing`
- `ready`
- `failed`
- `insufficient_storage`

These states are emitted by the native module and stored in `RuntimeStateViewModel.offlineBackup`.

Main code:

- `mobile_code/src/models/viewModels.ts`
- `mobile_code/src/state/AppSessionContext.tsx`
- `mobile_code/src/local/cactusNative.ts`
- `mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt`
- `mobile_code/src/app/AppShell.tsx`

The UI does not infer readiness from partial progress. It only shows `ready` after install plus runtime readiness confirmation.
