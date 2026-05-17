# Offline Backup Architecture Note

The implemented provisioning flow follows the locked post-install path:

1. install the APK first
2. open the app normally
3. keep the online cloud path usable immediately
4. show offline emergency backup state in the existing top status card
5. let the user tap a download action inside the app
6. download the Front Door `tar.zst` artifact in native Android code
7. verify SHA-256
8. unpack/install into the canonical runtime path
9. reuse the existing local runtime readiness checks
10. mark offline emergency backup ready only after the runtime check succeeds

The implementation lives in:

- `mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt`
- `mobile_code/src/local/cactusNative.ts`
- `mobile_code/src/app/AppShell.tsx`

The cloud path remains the active primary path. Offline backup provisioning is optional and non-blocking.
