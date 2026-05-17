## Online Quick Card Implementation

Exploratory / historical note only.

This note records an implemented experiment that was later not kept as the active product path.

Current active truth:

- online = direct cloud full-response path
- offline = local guarded emergency fallback

Implemented in:

- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/local/localRoute.ts`
- `/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx`

What changed:

- added `buildOnlineLocalFirstResponse(...)` for a single local-first online completion
- added `makeLocalQuickEmergencyResponse(...)` in `AppShell.tsx`
- added `makeLocalPreventiveCheckingResponse(...)` in `AppShell.tsx`
- online submit now branches:
  - local clarify and stop
  - local preventive stub then cloud upgrade
  - local emergency quick card then cloud upgrade

Optimization applied in this sprint:

- tightened the local-first online prompt
- reduced the online local-first token budget from `120` to `64`
- kept the cloud controller path unchanged

Status:

- implemented
- rebuilt into release APK
- user-visible quick-card-first behavior still requires final emulator proof
