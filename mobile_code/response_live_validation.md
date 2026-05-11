# Response Live Validation

## Full guided response

Validated flow:

- chemical: `glyphosate_roundup_demo`
- language: `english`
- incident: `spray went in my eye`
- expected mode: `full_guided_response`

Observed result:

- mode badge rendered as `Full guided response`
- immediate actions rendered correctly
- do-not-do rendered correctly
- escalation section rendered correctly
- no fallback reason shown, as expected

Evidence:

- `validation_artifacts/full_guided_english.png`

## Guarded response

Validated flow:

- chemical: `glufosinate_basta_demo`
- language: `bangla`
- incident: `মুখে গেছে`
- expected mode: guarded response

Observed result:

- mode badge rendered as `সতর্ক ন্যূনতম প্রতিক্রিয়া`
- guarded fallback explanation rendered
- escalation section rendered
- response remained structurally intact in Bangla

Evidence:

- `validation_artifacts/guarded_bangla.png`

## Live issue found and fixed during this pass

The original app timeout of `20000ms` was too short for real controller latency and caused the response screen to fail with:

- `The backend took too long to respond.`

Fix applied:

- `src/config/env.ts`
- `requestTimeoutMs: 45000`

The live validations above were rerun after that timeout increase.
