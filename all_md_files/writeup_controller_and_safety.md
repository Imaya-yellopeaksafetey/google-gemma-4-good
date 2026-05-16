# Write-Up Source — Controller and Safety

## Controller idea

The core novelty is not plain retrieval and not plain prompting. The system uses a Family-Aware Dual Path with Slot Verification and a Fallback Release Gate. It does not always answer in the same mode.

## Three response modes

- `full_guided_response`
- `guarded_minimum_response`
- `guarded_escalate_now`

This gives the system a visible safety behavior that a generic grounded chatbot does not have.

## Why guarded release matters

In a safety-critical setting, the worst failure is not silence. It is confident over-answering. The controller reduces that risk by routing strong families toward a fuller structured response while defaulting weaker families toward a guarded answer that stays within the safest supported subset.

## Deterministic control surfaces

The planner, verifier, and selector remain deterministic. That keeps the release decision machine-checkable even though the normalizer and composers are model-driven.

## What the verifier does

The verifier checks for:

- missing required action slots
- weakened or missing escalation
- unsupported extra detail
- cross-incident contamination
- schema completeness problems

Pass 2.6 made verifier-triggered gating visibly real instead of only theoretical:

- activation-set downgrades: `15`
- blocked unsupported detail cases: `13`
- missing-required-slot cases: `4`

## Safety value versus plain chat

A plain grounded chat system can still sound good while slipping into generic advice or unsafe elaboration. This controller makes risk handling explicit. When confidence or slot coverage is not strong enough, it degrades the answer mode on purpose and surfaces that guarded behavior to the user.
