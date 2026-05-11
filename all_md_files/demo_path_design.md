# Demo Path Design

## Demo principle

The first demo should prove that the model is:

- fast on strong families
- structured under pressure
- multilingual
- visibly risk-aware

It should not try to prove complete coverage.

## Primary showcase flows

Show exactly these 3 flows:

### Flow 1: `sf_paraquat_eye_01`

Why:

- strongest grounded family at `100.000`
- eye exposure is easy for judges to understand
- step order and urgency are visually obvious

What the judge should notice:

- immediate eye-rinse action comes first
- the model output is compact and field-usable
- the evidence basis is visible without exposing raw SDS text

### Flow 2: `sf_fastac_eye_01`

Why:

- grounded average `97.969`
- different chemical from paraquat eye case
- shows the system is not hardcoded to a single eye scenario

What the judge should notice:

- same response contract, different family truth
- multilingual consistency can be demonstrated cleanly here

### Flow 3: `sf_24d_inhalation_01`

Why:

- grounded average `96.719`
- inhalation had one of the largest grounding gains
- shows the architecture generalizes beyond eye exposure

What the judge should notice:

- different incident type
- the system still stays structured and urgent
- grounding is doing real work

## Optional responsible-AI moment

Optional fourth moment:

- show `sf_paraquat_inhalation_01` or `sf_glufosinate_ingestion_01` in guarded mode

Purpose:

- not as a hero flow
- as a short proof that the system handles weak families conservatively instead of bluffing

What the judge should notice:

- the model changes response mode
- the limitation is intelligent, not broken
- the safety gate is real

## Exact user journey to show

### Step 1

User enters or speaks a messy worker-style emergency message.

### Step 2

System shows a one-line normalized incident summary.

### Step 3

System returns structured emergency actions in the worker language.

### Step 4

System shows:

- do-not-do warnings
- escalation block
- compact evidence basis

### Step 5

Optional:

- repeat same family in another language to show multilingual stability

## What not to show

Do not show:

- broad chemical search
- long document browsing
- weak ingestion hero flows
- dashboard analytics
- complex settings
- generic open-ended chat

## Model behavior the judge should remember

The judge should leave remembering:

- this system does not just answer; it **releases** answers only when the emergency action slots are satisfied
- strong families get fast complete guidance
- weak families get controlled safe fallback

## Demo constraint

Keep the first judge-facing demo tightly scoped to:

- plantation chemical exposure
- strongest safe families
- one optional guarded fallback moment
