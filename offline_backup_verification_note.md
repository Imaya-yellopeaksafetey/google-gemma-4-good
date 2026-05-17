# Offline Backup Verification Note

The downloaded artifact is verified against:

- `0b3e8c738973b109e391094c98e390941e6d8e73266b1bd2e2282d0f412ae678`

Implementation:

- the app computes SHA-256 on the completed archive file before install
- if the checksum does not match, the archive is deleted and the state moves to `failed`
- the app does not proceed to install or ready state after a checksum mismatch

Current code:

- `mobile_code/android/app/src/main/java/com/imaya/gemmasoteria/cactus/CactusLocalModule.kt`

Validation truth:

- verification logic is implemented
- a forced checksum-failure run was not executed in this sprint
