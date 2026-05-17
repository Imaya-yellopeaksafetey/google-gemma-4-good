# Offline Backup Localization Note

All visible provisioning text was added to the existing localization dictionary for:

- English
- Malay
- Bangla
- Bahasa Indonesia

Localized provisioning groups include:

- not ready
- download action
- downloading
- verifying
- installing
- ready
- failed
- insufficient storage
- retry action

Main file:

- `mobile_code/src/i18n/strings.ts`

UI wiring:

- `mobile_code/src/app/AppShell.tsx`

The status card now changes with the selected app language because it is driven through the same localization system as the rest of the app.
