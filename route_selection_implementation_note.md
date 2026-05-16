**Route Selection Implementation Note**

Primary implementation:
- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)

Actual route selection:
- local QR resolution is attempted first via embedded catalog
- startup checks backend health and local model status
- on submit:
  - local route classification is attempted when the local model is available
  - unclear -> local clarify response
  - preventive + online -> cloud preventive response
  - preventive + offline -> limited local preventive response
  - emergency + online -> local canonicalization then cloud full response
  - emergency + offline -> local guarded response

This is real route selection, not documentation-only routing.

Current validation state:
- online runtime selection is visible
- offline/local guarded behavior is implemented
- direct emulator proof of a completed local guarded response is still missing
- what is now proven:
  - online path selects and uses cloud successfully
  - offline mode is recognized and surfaced in UI
  - offline path currently terminates in a truthful error because the local model is not ready in-app
