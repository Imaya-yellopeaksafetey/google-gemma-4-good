# Controller Pass 2.6 Delta Plan

## Targeted root causes

1. `sf_24d_inhalation_01` is losing score because the strong-lane composer is allowed to produce an unconditional `ESCALATE` line even though the family truth is conditional: seek medical attention only if symptoms develop or persist. The verifier currently checks for weakened escalation, but it does not catch the opposite failure: over-escalating a conditional source into an unconditional urgent line.

2. The severe Bangla weak-family failures in `sf_glufosinate_ingestion_01` and `sf_24d_ingestion_01` are primarily routing failures. The normalizer is interpreting Bangla prompts like `মুখে গেছে` as surface contact on the mouth and selecting `skin_exposure` families instead of ingestion families. That produces catastrophic cross-incident outputs before the guarded composer even gets a correct family.

3. The Bangla weak-family failures in `sf_paraquat_inhalation_01` are not primarily routing failures. The family is classified correctly, but guarded output omits the poison-control / doctor contact as a standalone required action because the current guarded subset excludes `a3`, and the prompt allows it to remain only inside conditional escalation wording.

4. Verifier-triggered gating is under-visible because current strong-lane drafts often pass slot presence checks even when escalation conditioning is wrong, and because there is no dedicated activation set showing real downgrade behavior on malformed drafts.

## Files to change

- `controller_stack/normalizer.py`
  - add narrow post-validation correction for explicit mouth-ingestion cues that were misrouted away from ingestion
- `controller_stack/prompt_builders.py`
  - pass escalation condition/mode and stricter guarded constraints into model payloads
- `controller_stack/prompts/normalizer_system_v2.md`
  - add explicit ingestion-vs-skin disambiguation for Bangla mouth phrasing
- `controller_stack/prompts/strong_lane_system_v2.md`
  - forbid unconditional escalation when the family truth is conditional
- `controller_stack/prompts/guarded_lane_system_v2.md`
  - require all guarded slots in order, preserve prohibition slots as steps, and keep paraquat inhalation doctor/poison-control action explicit
- `controller_stack/config.py`
  - widen guarded subset for `sf_paraquat_inhalation_01` to include `a3`
- `controller_stack/planner.py`
  - expose escalation condition/mode metadata for verifier and prompts
- `controller_stack/composer.py`
  - preserve slot order deterministically after model generation
- `controller_stack/verifier.py`
  - add narrow over-escalation detection for families with conditional escalation
- `controller_stack/run_pass26.py`
  - new pass-2.6 runner with subset rerun, verifier activation eval, strict-eval bridge, and output writing

## Files that do not need to change

- `controller_stack/selector.py`
  - release policy is already aligned; visible change should come from better verification inputs, not selector redesign
- `eval_harness/llm_judge.py`
  - strict judge lineage stays fixed
- benchmark files under `benchmark_v0/`
  - no benchmark content changes are required
- app or UI files
  - out of scope for this pass
