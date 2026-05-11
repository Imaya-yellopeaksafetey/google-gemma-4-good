# Manual Flow Validation

## Validation method

Manual selection was validated against the live backend using:

- exported web build from `npx expo export --platform web`
- local static serve on `http://127.0.0.1:4173`
- browser automation in `scripts/validate_live_web.mjs`

## Validated manual selections

1. English full-guided flow
   - language: `English`
   - manual chemical: `Roundup / Glyphosate`
   - incident text: `spray went in my eye`

2. Bangla guarded flow
   - language: `বাংলা`
   - manual chemical: `বাস্টা / গ্লুফোসিনেট`
   - incident text: `মুখে গেছে`

## What this proves

- catalog loaded from the live backend
- localized chemical names rendered correctly
- manual selection locked the chemical and advanced to the incident screen
- the selected chemical carried through to the response screen

## Evidence

- `validation_artifacts/full_guided_english.png`
- `validation_artifacts/guarded_bangla.png`
