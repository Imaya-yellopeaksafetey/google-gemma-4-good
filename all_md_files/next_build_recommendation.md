# Next Build Recommendation

## Exact recommendation

Build next:

- **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**

## Why this is the best path to maximize hackathon win probability

It is the strongest fit to the actual evidence:

- baseline is weak: `38.582`
- grounded is strong: `92.008`
- the dominant lever is grounded control, not raw model knowledge

It is the strongest fit to the demo reality:

- we already know which families are safe to showcase
- we already know which families are too risky to answer in the same way

It is the strongest fit to the novelty requirement:

- judges will remember that the system does not always answer the same way
- the model decides whether it is safe to release a full response
- weak-family conservative behavior is a visible feature, not hidden uncertainty

## What exactly should be built first

Build in this order:

1. family-aware incident normalizer
2. response planner that turns family truth into required slots
3. strong-lane composer
4. guarded-lane composer
5. slot verifier
6. release selector
7. evaluation harness for:
   - strong-lane pass rate
   - downgrade rate
   - weak-family guarded behavior

## First demo target

Use the architecture first on:

- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01`

Optionally show one guarded weak-family moment as a responsible-AI proof point, but not as the hero flow.

## Why this beats the alternatives

It beats plain grounded chat because:

- it has response-mode intelligence
- it has omission control
- it has explicit safety fallback

It beats LoRA-first because:

- the benchmark says control logic is the next leverage point

It beats app-first implementation because:

- the model-side novelty is what can still materially move judge perception

## Final answer

The next architecture to build is:

- **a safety-gated, family-aware, slot-verified dual-path emergency response system**

That is the highest-leverage, most novel, and most defensible next step for the hackathon.
