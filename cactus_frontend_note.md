**Cactus Frontend Note**

Frontend changes stayed narrow.

Key additions:
- runtime operating mode banner
- response provenance model
- route proof card on the response screen
- local catalog embed for offline/manual continuity
- local/cloud route handling in `AppShell`

Files:
- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)
- [mobile_code/src/mappers/responseMapper.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/mappers/responseMapper.ts)
- [mobile_code/src/screens/ResponseScreen.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/screens/ResponseScreen.tsx)
- [mobile_code/src/state/AppSessionContext.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/state/AppSessionContext.tsx)

Intentional non-changes:
- no redesign of the main flow
- no TTS
- no voice
- no attempt to make the local model produce the full cloud response
