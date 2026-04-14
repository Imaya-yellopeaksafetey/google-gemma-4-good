# Gemma 4 Good Hackathon — 30-Day Execution Plan

## 1) Objective
Ship a narrow, convincing, offline-first Android demo for the Gemma 4 Good Hackathon:

> An offline multilingual emergency copilot for plantation chemical exposure incidents, grounded in public SDSs and optimized for Indonesian- and Bangla-speaking workers in Malaysian oil-palm estates.

This plan uses:
- 30 execution days
- 5 hours/day baseline
- last 5 days held as buffer outside this plan
- escalation to 7 hours/day only if a gate is missed

## 2) Scope Lock

### In scope for v1
- chemical exposure response
  - skin exposure
  - eye splash
  - inhalation
  - accidental ingestion only if SDS coverage is easy and clean
- typed interaction
- offline-first runtime story
- public SDS corpus
- languages:
  - Bahasa Indonesia
  - Bangla
  - Malay
  - English

### Stretch only if time remains
- Urdu
- voice input/output
- spill/leak response
- cloud fallback path

### Explicitly out of scope
- snakebite
- insect bite
- broad worker safety
- training platform
- compliance dashboard
- image input
- multi-country expansion
- full fine-tuning by default

## 3) Win Strategy
This is a judged-demo plan, not a breadth plan.

The submission should win by being:
- extremely clear
- obviously useful
- grounded in real documents
- multilingual
- offline-capable
- visibly built around the worker, not the dashboard

So the order is:
1. lock the benchmark contract
2. validate a minimal SDS source pack
3. author structured scenario families
4. benchmark base Gemma
5. improve with grounding and response control
6. build the offline demo app
7. package for judging

## 4) Success Criteria
By the end of day 30, we should have:
- a narrow benchmark v0 with structured truth underneath multilingual renderings
- a baseline + improved Gemma evaluation report
- a working offline-capable Android demo
- 1 clean end-to-end incident flow in 4 languages
- a public benchmark release candidate for Hugging Face
- a submission story that fits in a 3-minute video

## 5) Phase Plan

## Phase 0 — Benchmark contract and minimal source validation
**Days:** 1–5
**Budget:** 25 hours
**Goal:** define a scoreable benchmark shape before app work or corpus expansion

### Tasks
- write the benchmark spec v0
- lock the incident taxonomy v1
- define structured truth objects for scenario families
- separate prompt generation from answer rendering
- validate a minimal SDS source pack across 3–5 chemicals
- confirm that each structured field maps cleanly to grounded source spans
- write a short problem brief and scope memo so the benchmark stays narrow

### Deliverables
- benchmark schema v0
- incident taxonomy v1
- structured source pack v0
- rubric v0
- problem brief
- scope memo

### Gate at end of day 5
We proceed only if:
- the schema can represent at least 3–5 chemicals without awkward exceptions
- structured truth is clearly separated from language-specific outputs
- the task is still sharp enough in one sentence
- no new scope has been added

### Failure mode
If the source material is messy, reduce breadth immediately and keep only chemicals with clean first-aid guidance.

## Phase 1 — Structured multilingual benchmark build
**Days:** 6–14
**Budget:** 45 hours
**Goal:** create a narrow, scoreable benchmark around scenario families rather than free-text rows

### Tasks
- author scenario families in structured form
- define scenario-family split logic
- create English bootstrap rows from structured truth
- create immediate paired rows in Malay and Bangla
- bring Bahasa Indonesia into the benchmark before v0 freeze
- create natural worker-style prompts separately from answer renderings
- label rows by quality tier:
  - Gold
  - Silver
  - Bronze/dev
- create family-level dev, validation, and holdout splits
- run translation and rendering verification passes for:
  - same number of action steps
  - same action order
  - no dropped warnings
  - no added medical advice
  - preserved escalation triggers
  - preserved prohibited actions

### Initial target size
- 24–36 total rows for schema shakeout
- 36–54 total rows for benchmark v0 freeze

### Deliverables
- scenario families v0
- benchmark v0 JSONL
- scoring rubric
- family-level split manifest
- multilingual benchmark package including Bahasa Indonesia

### Gate at end of day 14
We proceed only if:
- benchmark items are specific and scoreable
- multilingual outputs preserve the same structured truth
- no scenario family leaks across splits
- Bahasa Indonesia is meaningfully represented in the frozen benchmark

### Failure mode
If multilingual generation quality is weak, reduce quantity and keep quality high. Do not scale bad data.

## Phase 2 — Base Gemma benchmark
**Days:** 15–18
**Budget:** 20 hours
**Goal:** measure whether base Gemma is already good enough on the structured benchmark

### Tasks
- define output schema for model responses
- run base Gemma on benchmark v0
- collect outputs by language and incident type
- manually inspect failure modes
- categorize errors into:
  - grounding failure
  - omission of critical step
  - over-verbose answer
  - incorrect order of steps
  - unsupported medical advice
  - language quality failure

### Deliverables
- baseline scorecard
- failure taxonomy
- examples file
- go-forward memo for system improvements

### Gate at end of day 18
We proceed only if:
- we know exactly where base Gemma fails
- we can state whether the problem is mostly retrieval, prompting, rendering control, or model capability

### Failure mode
If evaluation is noisy or subjective, simplify the rubric before making model decisions.

## Phase 3 — Grounding, retrieval, and response control
**Days:** 19–23
**Budget:** 25 hours
**Goal:** improve performance without fine-tuning

### Tasks
- build SDS retrieval / lookup layer
- test section-constrained prompting
- enforce concise action-step response schema
- add internal grounding path even if hidden from worker
- retry multilingual response control
- evaluate again on benchmark v0
- compare before vs after

### Deliverables
- system pipeline v1
- improved scorecard
- before/after examples
- decision memo: tune or do not tune

### Gate at end of day 23
Default decision should be:
- do not fine-tune unless performance is still clearly insufficient

We only greenlight tuning if:
- the remaining errors are not mostly retrieval or parsing issues
- the benchmark shows repeated instruction-following or response-style failures that prompt + grounding cannot fix

### Failure mode
If the system still fails badly, reduce languages before considering tuning. Narrow scope before adding training complexity.

## Phase 4 — Fine-tuning decision slot
**Days:** 24–25
**Budget:** 10 hours
**Goal:** make a disciplined decision, not a reflex decision

### Option A — No fine-tuning
This should be the default.
Use these days for:
- benchmark cleanup
- app integration prep
- faster inference path work

### Option B — Minimal LoRA experiment
Only if justified.
Use these days for:
- define train/val split
- define narrow training objective
- run one small experiment
- compare against grounded baseline

### Gate at end of day 25
If tuning does not show a clear lift quickly, stop immediately.
Do not sink the project into training iteration hell.

## Phase 5 — Offline app prototype
**Days:** 26–30
**Budget:** 25 hours
**Goal:** produce the actual judged artifact

### Tasks
- build Android-first demo shell
- implement one clean question-answer flow
- add language switcher
- add offline asset packaging / local inference path
- add fallback canned demo path if local runtime is unstable
- test on a real Android device
- optimize UX for field clarity:
  - large text
  - obvious next-step formatting
  - minimal clutter
  - clear emergency tone

### Deliverables
- working Android demo
- 1 polished flow in 4 languages
- demo script outline
- backup demo path

### Gate at end of day 30
We should have:
- a working app flow
- predictable demo behavior
- no dependence on internet for the core path

### Failure mode
If native Android runtime becomes unstable, use the fallback plan immediately rather than burning buffer days.

## 6) Escalation Rule: When 5 Hours/Day Becomes 7
Stay at 5 hours/day unless one of these happens:
- Phase 0 slips past day 5
- benchmark v0 is not usable by day 14
- base Gemma benchmark is still unclear by day 18
- app prototype has no stable local path by day 28

If any one of these happens, move to 7 hours/day for the next 3–5 days.

## 7) What We Deliberately Skip
To protect the submission, we will skip:
- extra languages before quality is proven in the 4 core languages
- image support
- voice unless the typed demo is already stable
- large-scale fine-tuning by default
- multi-turn sophistication beyond minimal follow-up
- full spill/leak workflow unless exposure workflow is done first
- extra product features that do not improve the 3-minute demo

## 8) Daily Breakdown

### Days 1–2
- benchmark schema
- structured truth contract
- incident taxonomy
- problem brief

### Days 3–5
- minimal source pack for 3–5 chemicals
- source-section mapping
- rubric definition

### Days 6–8
- first scenario families
- English bootstrap rows
- Malay and Bangla paired rows

### Days 9–11
- worker-style prompt variants
- rendering verification
- split manifest

### Days 12–14
- Bahasa Indonesia inclusion
- holdout freeze by scenario family
- benchmark freeze v0

### Days 15–16
- base Gemma evaluation run
- output collection

### Days 17–18
- failure analysis
- baseline report

### Days 19–20
- retrieval and grounding layer
- response schema control

### Days 21–23
- re-evaluation
- comparison report
- tune/no-tune decision

### Days 24–25
- minimal LoRA only if justified
- otherwise app integration prep

### Days 26–27
- Android app shell
- local inference integration

### Days 28–29
- language switching
- UX cleanup
- offline stability testing

### Day 30
- internal demo day
- freeze app for buffer-week packaging

## 9) Required Artifacts by End of Each Phase

### End of Day 5
- benchmark schema v0
- incident taxonomy v1
- structured source pack v0
- rubric v0
- problem brief

### End of Day 14
- scenario families v0
- benchmark v0
- split manifest
- multilingual freeze including Bahasa Indonesia

### End of Day 18
- baseline Gemma report
- failure taxonomy

### End of Day 23
- improved system report
- tune/no-tune memo

### End of Day 30
- offline-capable demo app
- benchmark release candidate
- draft demo script

## 10) Immediate Next Actions
1. validate the first 3–5 SDS sources and extract only the incident-critical first-aid spans
2. finalize the structured scenario-family schema
3. write the first English grounded scenarios in structured form
4. render paired Malay and Bangla outputs from that structured truth
5. bring Bahasa Indonesia into the benchmark before v0 freeze

## 11) Non-Negotiables
- do not expand scope before the benchmark contract is stable
- do not treat free-text answers as the real ground truth
- do not split multilingual equivalents across different dataset splits
- do not fine-tune before baseline + grounded prompting are tested
- do not add voice before typed flow is stable
- do not add Urdu unless the 4 core languages are already solid
- do not let the benchmark become broad and fuzzy
- do not let the app become a generic chatbot

## 12) Working Principle
> Narrow beats broad. Grounded beats flashy. Structured truth beats prose. Demo clarity beats technical ego.
