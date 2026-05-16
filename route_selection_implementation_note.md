**Route Selection Implementation Note**

Primary implementation:
- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)

Current actual route selection:
- startup checks backend health and local model status
- on submit:
  - if backend is reachable:
    - go directly to cloud
  - if backend is unavailable and local model is available:
    - use local guarded offline emergency fallback
  - if backend is unavailable and local model is unavailable:
    - show an honest limited failure state

Deterministic pre-processing still happens locally:
- nearby-body phrasing such as `ear`, `cheek`, `side of face`, `around eye` is normalized to the closest safe exposure lane before submit logic proceeds

Decision history:
- earlier Phase 3 implementation included:
  - online local-first quick card
  - cloud upgrade path
  - local clarify path
- those behaviors were implemented and tested
- the active product path was then simplified because the hybrid online path made the user experience worse in practice

Current validation state:
- online path selects and uses cloud successfully
- offline mode is recognized and surfaced in UI
- offline path now completes a clean guarded worker-facing response
- route/debug cards in the UI reflect the actual chosen path
