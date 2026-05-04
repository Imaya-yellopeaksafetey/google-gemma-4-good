# Gemma 4 Good — 10 Day Ship Plan

## Goal
Ship a **judge-winning demo + write-up** in the remaining 10 days.

## Core principle
Do not spend the remaining time on broad improvement.
Use the current controller as the foundation and finish only what changes win probability.

## Current state
- Evaluation control: done
- Controller pass 2: real and Gemma-driven
- Strong-family lane: mostly preserved
- Weak-family guarded mode: real and product-visible
- Main blockers before app wrapping:
  1. `sf_24d_inhalation_01` recovery
  2. Bangla weak-family robustness
  3. verifier-triggered downgrade/blocking not yet visible enough

## Ship decision
We will **not** wait for a perfect controller.
We will do one final narrow controller hardening pass, then move immediately into app wrapping and submission packaging.

## Demo lane
### Hero demo families
- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01` (must be recovered)

### Optional responsible-AI guarded moment
- one weak-family guarded example only
- not a hero flow
- used to show safety-gated behavior

## Day-by-day plan
### Day 1–2
Controller Pass 2.6
- recover `sf_24d_inhalation_01`
- fix Bangla weak-family guarded failures
- make verifier-triggered downgrade/blocking visibly real
- rerun strict subset eval

### Day 3
App shell and response rendering
- mobile shell
- language switching
- response mode display
- immediate actions / do-not / escalation cards
- guarded-mode rendering

### Day 4
Controller integration into app
- wire controller output into app flow
- family summary + response cards
- evidence-basis rendering
- fallback reason rendering

### Day 5
Demo-path implementation
- implement the 3 hero flows
- implement optional guarded responsible-AI moment
- constrain app to narrow demo path

### Day 6
Offline/demo hardening
- remove non-demo paths
- tighten copy and transitions
- ensure fast deterministic demo experience

### Day 7
Evaluation-backed demo freeze
- verify hero flows still align to controller outputs
- verify guarded moment is safe and intentional
- freeze demo scenarios

### Day 8
Write-up draft
- problem
- novelty
- architecture
- evaluation evidence
- safety behavior
- why Gemma matters

### Day 9
Submission packaging
- repo cleanup
- README / setup clarity
- final write-up polish
- asset collection for video/demo

### Day 10
Final lock
- final app sanity pass
- final write-up pass
- submission checklist

## Non-negotiables
- no scope expansion
- no generic chatbot drift
- no dashboard-first work
- no extra benchmark work unless required for the final controller hardening pass
- no app polish before the demo path is implemented

## Immediate next action
Start **Controller Pass 2.6** immediately, then move directly into app wrapping.
