# Frontend Adjustment Note

The frontend changes are intentionally small.

## Updated files

- [mobile_code/src/api/types.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/api/types.ts)
- [mobile_code/src/api/client.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/api/client.ts)
- [mobile_code/src/models/viewModels.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/models/viewModels.ts)
- [mobile_code/src/mappers/responseMapper.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/mappers/responseMapper.ts)
- [mobile_code/src/screens/ResponseScreen.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/screens/ResponseScreen.tsx)
- [mobile_code/src/state/AppSessionContext.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/state/AppSessionContext.tsx)
- [mobile_code/src/components/ModeBadge.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/components/ModeBadge.tsx)
- [mobile_code/src/i18n/strings.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/i18n/strings.ts)

## What changed

- `/api/respond` is now treated as a small response union rather than one emergency-only shape
- the mapper converts backend response kinds into app-safe view models
- the response screen conditionally renders:
  - emergency guidance
  - preventive guidance
  - clarification responses

## What did not change

- QR-first entry
- manual fallback
- chemical locking
- incident submission flow
- overall app navigation

This keeps the visible product stable while letting the backend route the query to the right answer engine.
