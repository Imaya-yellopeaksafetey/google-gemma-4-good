# Gemma 4 Good — Progress Tracker

## North Star
Build a **judge-winning, worker-facing emergency controller** for plantation chemical exposure where Gemma is used as a **family-aware, safety-gated emergency response engine**, not a generic chatbot.

## Locked Decisions
- Scope remains strictly **plantation chemical exposure**.
- Novelty is **model-side first**, product UX second.
- First judge-facing demo uses only the **strongest safe families**.
- Weak families are handled through **guarded fallback**, not hero demos.
- The chosen architecture is:
  - **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**

## Current Project State
### Phase 6
- Evaluation control is closed.
- Official judge lineage is `strict_v6_2026-04-30`.
- Baseline vs grounded comparison is decision-grade.

### Controller Pass 2
- Pass 2 is real, not scaffold-only.
- Controller uses Gemma for:
  - incident normalizer
  - strong-lane composer
  - guarded-lane composer
- Planner, verifier, and release selector remain deterministic control surfaces.

## Current Readout
- Controller strict subset average is effectively flat vs prior grounded on the fixed 128-row subset.
- Strong-family lane is preserved overall.
- Weak-family guarded mode is real and product-visible.
- The main remaining issues are concentrated, not broad.

## What Is Completed
- Benchmark freeze
- Strict judge repair and rescoring lineage
- Baseline vs grounded comparison
- Model-side architecture package
- Controller scaffold implementation
- Gemma-driven controller pass 2
- Strict rescoring of controller outputs on the fixed subset

## Current Blockers Before App Wrapping
### 1. Strong-family regression to repair
- `sf_24d_inhalation_01` is still below its prior grounded level and must be recovered.

### 2. Weak-family multilingual robustness
Priority weak-family slices:
- `sf_glufosinate_ingestion_01`
- `sf_paraquat_inhalation_01`
- `sf_24d_ingestion_01`

Priority weakness:
- Bangla weak-family failures and awkward guarded outputs.

### 3. Verifier is still under-demonstrated
The verifier exists and is real, but most visible routing work still comes from:
- weak-family default guarded routing
- low-confidence guarded routing

The next pass must create cases where verifier-triggered downgrade/blocking is visibly real.

## Next Immediate Task
### Controller Pass 2.6
Focus only on:
1. recover `sf_24d_inhalation_01`
2. fix Bangla weak-family guarded behavior
3. make verifier-triggered downgrade/blocking visibly real

No app work.
No architecture redesign.
No benchmark expansion.

## App-Wrapping Gate
Do **not** move to app wrapping until all of the following are true:
- `sf_24d_inhalation_01` is back in line with the strong demo-safe lane
- Bangla weak-family severe failures are removed
- guarded mode remains concise and safe
- verifier-triggered blocking/downgrade is visibly exercised
- no new regressions appear in the hero strong-family flows

## Source-of-Truth Files To Check Each Pass
- `controller_strict_eval.md`
- `controller_pass2_failure_analysis.md`
- `controller_stress_eval.md`
- `controller_pass2_build_readiness.md`
- `controller_eval_bridge.md`

## Working Rule For This Thread
The agent is a **workhorse**.
It implements and produces artifacts.
It does **not** make strategic recommendations.
Architecture choice, lane choice, demo choice, and app-readiness decisions are overseer decisions.
