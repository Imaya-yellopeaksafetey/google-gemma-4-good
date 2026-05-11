# Verifier Pass 2.6 Change Log

- Added `overstated_conditional_escalation` detection for full-release verification.
- This applies only when the family truth has conditional escalation and the candidate emits unconditional urgent escalation without the source condition.
- No broad heuristic rewrite was added.
- Existing missing-slot, weakened-escalation, unsupported-detail, and generic-chat checks remain in place.
