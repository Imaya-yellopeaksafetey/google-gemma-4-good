# Status Wording Implementation Note

## What Was Implemented

The visible mode/readiness wording was moved onto the localization path so it follows the selected app language during normal use.

## Main Files Updated

- [mobile_code/src/i18n/strings.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/i18n/strings.ts)
- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)
- [mobile_code/src/screens/IncidentScreen.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/screens/IncidentScreen.tsx)

## Implemented String Groups

- online/offline mode banner title and body
- secondary readiness card:
  - backend
  - local fallback
  - active route
- offline guarded explanatory wording
- incident-screen limited-backup notice
- local fallback error wording

## Worker-Facing Result

When the selected language changes, the visible wording for:

- mode banners
- status/readiness copy
- incident notices
- response labels
- error wording

changes with it during the session.

## Important Remaining Limitation

The selected language is not yet persisted across a full app restart. That is a state-persistence defect, not a missing localization-wiring defect.
