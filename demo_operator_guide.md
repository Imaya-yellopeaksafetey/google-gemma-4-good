# Demo Operator Guide

## Backend assumption

- Backend base URL: `http://20.242.52.182:8080`
- Health route: `GET /health`

## App startup

1. Launch the app.
2. Wait for the startup readiness check to pass.
3. If startup fails:
   - tap `Retry`
   - if it still fails, verify the backend health route
   - if the backend is slow, wait a few seconds and retry again

## Safest languages to show

- Primary: `English`
- Secondary multilingual proof: `Bangla`

Why:

- English full-guided response was live-render validated.
- Bangla guarded response was live-render validated.
- Malay and Bahasa Indonesia are present in the app UI and catalog, but were not the primary live-render showcase flows in this environment.

## Hero demo flows

### Hero flow 1

- language: `English`
- entry path: manual selection
- chemical: `Roundup / Glyphosate`
- worker query: `spray went in my eye`
- expected mode: `full_guided_response`

Why use it:

- clean, high-confidence full response
- easy to explain
- screenshot already captured in [full_guided_english.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/full_guided_english.png)

### Hero flow 2

- language: `Bangla`
- entry path: manual selection
- chemical: `Basta / Glufosinate`
- worker query: `মুখে গেছে`
- expected mode: guarded response

Why use it:

- visibly multilingual
- shows guarded release behavior as a deliberate safety feature
- screenshot already captured in [guarded_bangla.png](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/validation_artifacts/guarded_bangla.png)

## Optional benchmark-strong backup flows

Use only if rehearsed once on the live app before the demo:

- `Paraquat eye`
- `Fastac eye`

These are strong evaluation slices or stable response families, but were not the main mobile live-render artifacts captured in this environment.

Do not use `2,4-D inhalation` as a live backup flow in the current controller build. It was strong in the earlier grounded evaluation lineage, but it regressed in controller pass 2.6 and is not a current hero path.

## Recommended demo order

1. Start in English.
2. Show chemical identification:
   - scan QR first if native QR smoke check has passed
   - otherwise use manual selection immediately
3. Run the English full-guided glyphosate eye flow.
4. Switch to Bangla.
5. Run the Bangla guarded glufosinate ingestion flow.
6. Point out the response mode difference:
   - full guided response
   - guarded response with fallback explanation

## If QR scan fails

1. Stop trying to force the scan.
2. Tap manual fallback.
3. Choose the chemical from the localized catalog.
4. Continue the demo on the manual path.

This is acceptable because the manual path is already live-validated.

## If backend is briefly slow

1. Wait for the response screen.
2. If the app shows a timeout or error, tap `Retry`.
3. If the same request fails twice, restart the flow and use the pre-rehearsed query again.

The app timeout was already increased to `45000ms`, so brief slowness should usually recover without code changes.

## If native QR proof is still unavailable at demo time

Use this operator wording:

- `QR-first is the intended worker entry. The manual path is the validated fallback and is what we are using here because native camera proof depends on the final phone environment.`

That keeps the claim honest without disrupting the demo.
