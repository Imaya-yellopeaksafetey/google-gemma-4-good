# Offline Backup End-To-End Validation

## Scenario: first-run online app, backup not yet installed

Validated in emulator:

1. APK installed and launched successfully.
2. App remained immediately usable in online mode.
3. Top card showed:
   - backend connected
   - offline emergency backup not ready
   - download action visible
4. User triggered the in-app download action.
5. Download status changed to `downloading`.
6. Visible progress percentages appeared in the UI.
7. App remained navigable while download continued.
8. App advanced from language selection into the normal QR/manual entry flow while download stayed active.

Observed visible progress states:

- `1%`
- `5%`
- `11%`
- `14%`

## Scenario: interrupted download

Validated in emulator:

1. Download was interrupted by force-stopping the app.
2. App relaunched.
3. Offline emergency backup was still shown as not ready.
4. App did not falsely mark offline backup ready.
5. Restarting the download reused the partial archive.

Observed resume evidence:

- `existingArchiveBytes=953090048`
- resumed UI/log progress restarted around `19%`, then `20%`, then `21%`

## Scenario: insufficient storage

Validated during implementation:

1. With a stricter safety threshold, the native module emitted `insufficient_storage`.
2. The app did not mark offline backup ready.
3. Cloud path remained unaffected.

The final build reduced only the safety margin so the current emulator could start the download on available space.

## Scenario: verification failure

Implementation exists:

- checksum mismatch transitions to `failed`
- archive is deleted
- ready state is not emitted

Validation status:

- not forced end-to-end in this sprint

## Scenario: unpack/install failure

Implementation exists:

- missing runtime shape or unpack exception transitions to `failed`
- ready state is not emitted

Validation status:

- not forced end-to-end in this sprint

## Full completion status

Not fully completed in emulator during this sprint:

- download -> verify -> unpack -> install -> ready -> offline use

Reason:

- the multi-GB Front Door download was still in progress during this session
- full unpack/install completion was therefore not observed to completion inside the emulator session
