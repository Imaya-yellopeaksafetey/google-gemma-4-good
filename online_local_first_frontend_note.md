## Online Local-First Frontend Changes

Exploratory / historical note only.

This note records UI work for the earlier online local-first experiment.
Those behaviors are not the active current submission path.

Frontend changes were kept narrow.

Updated files:

- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx`
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/screens/ResponseScreen.tsx`
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/models/viewModels.ts`
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/mappers/responseMapper.ts`
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/i18n/strings.ts`

Frontend support added:

- route upgrade state on response view models
- route status section in the response screen
- local quick-card labeling
- cloud-pending / cloud-complete / keep-local status text
- new route labels for:
  - `local_quick_then_cloud`
  - `cloud_failed_keep_local`
