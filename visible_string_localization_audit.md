# Visible String Localization Audit

## Scope Audited

- top mode banners
- secondary readiness/status card
- language screen headings and continue button
- QR/manual entry screen
- incident screen warning notice
- response screen labels
- error screen labels
- loading screen labels

## Files Audited

- [mobile_code/src/i18n/strings.ts](mobile_code/src/i18n/strings.ts)
- [mobile_code/src/app/AppShell.tsx](mobile_code/src/app/AppShell.tsx)
- [mobile_code/src/screens/ResponseScreen.tsx](mobile_code/src/screens/ResponseScreen.tsx)
- [mobile_code/src/screens/IncidentScreen.tsx](mobile_code/src/screens/IncidentScreen.tsx)
- [mobile_code/src/screens/EntryScreen.tsx](mobile_code/src/screens/EntryScreen.tsx)
- [mobile_code/src/screens/ManualSelectionScreen.tsx](mobile_code/src/screens/ManualSelectionScreen.tsx)
- [mobile_code/src/screens/LoadingScreen.tsx](mobile_code/src/screens/LoadingScreen.tsx)
- [mobile_code/src/screens/ErrorScreen.tsx](mobile_code/src/screens/ErrorScreen.tsx)
- [mobile_code/src/features/qr/QRScannerPanel.tsx](mobile_code/src/features/qr/QRScannerPanel.tsx)

## Coverage Result

### Localized correctly in-session

- mode/status banners
- readiness card labels and values
- QR/manual entry copy
- incident warning copy
- loading messages
- error messages and buttons
- response labels:
  - incident summary
  - immediate actions
  - do not do
  - escalate now
  - guarded explanation
  - preventive sections
  - clarify sections
  - evidence basis
  - start new response

### Intentionally not localized

- product name: `Gemma Soteria`
- language option labels:
  - `English`
  - `Bahasa Melayu`
  - `বাংলা`
  - `Bahasa Indonesia`
- chemical names such as `Roundup / Glyphosate` and `Basta / Glufosinate`

These are acceptable fixed labels rather than ordinary UI copy.

## Residual Issues Found

### 1. Language choice does not persist across full app relaunch

Observed during emulator QA:

- after `force-stop` / relaunch, the app returned to the default English language state
- the previously selected language was not remembered

Impact:

- not a blocker for in-session language switching
- but a real judge/operator quality issue

### 2. Pre-selection screen naturally starts in default language

Before the user explicitly selects a language, the app shows the default language copy.

Impact:

- acceptable if language persistence is not implemented
- still worth documenting for judges/operators

## Audit Verdict

- In-session visible UI localization is now broad and consistent.
- The remaining localization issue is persistence across full relaunch, not missing string wiring.
