# Architecture Decision

## Chosen architecture

Choose:

- **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**

## Why this one wins

This architecture best fits the actual benchmark evidence.

Phase 6 taught us:

- grounded prompting is the main performance lever
- strong families are already good enough to showcase
- weak families are not uniformly bad, but they are not safe to answer with the same posture
- evaluation trust required explicit control logic, not just better wording

The chosen architecture turns those lessons into a visible system behavior:

1. **family-aware**
   - because not all families deserve the same answer mode
2. **dual-path**
   - because strong families and weak families should not be treated identically
3. **slot verification**
   - because the system must prove required actions are present before full release
4. **fallback release gate**
   - because a weaker answer mode is safer than a falsely complete answer

## Why this is better for judges than the alternatives

Compared with single-pass structured generation:

- it is more novel
- it has an explicit safety release gate

Compared with retrieve-generate-self-check only:

- it is more legible as a product story
- it has visible strong-vs-weak family behavior

Compared with dual-path only:

- it adds hard control over omissions before final release

## Why this is the best fit for current family behavior

Strong demo-safe families:

- `sf_paraquat_eye_01`
- `sf_fastac_eye_01`
- `sf_glyphosate_eye_01`
- `sf_24d_inhalation_01`

These can use:

- full-response strong lane
- with slot verification to preserve the grounded strengths already proven

Weak families:

- `sf_glufosinate_ingestion_01`
- `sf_paraquat_inhalation_01`
- `sf_24d_ingestion_01`
- `sf_24d_eye_01`

These should use:

- guarded lane by default
- or downgrade into guarded lane if verification fails

## Why this is the best demo architecture

A judge can understand the novelty in one sentence:

- the system does not just answer; it decides whether it is safe to answer fully

That is better than a generic "RAG but better" pitch.

## Final decision

Build next:

- **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**
