# Consistency Cleanup Note

## What was cleaned up

Reviewed and aligned:

- [demo_operator_guide.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/demo_operator_guide.md)
- [demo_rehearsal_pack.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/demo_rehearsal_pack.md)
- [writeup_eval_and_validation.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/writeup_eval_and_validation.md)
- [submission_prep_readiness.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_prep_readiness.md)

## Main contradiction removed

The earlier Phase 6 grounded evaluation had identified `sf_24d_inhalation_01` as a strong grounded family. That remained true historically, but it conflicted with the current controller pass 2.6 reality:

- `sf_24d_inhalation_01` pass 2 score: `90.352`
- `sf_24d_inhalation_01` pass 2.6 score: `76.680`

So the docs now distinguish clearly between:

- historical benchmark-safe slices
- current live-demo-safe paths

## Current aligned truth

- manual path is validated and demo-usable
- QR-first claim remains conditional until native phone proof is completed
- `sf_24d_inhalation_01` is not a current hero live path
- English glyphosate full-guided flow and Bangla guarded flow are the current validated demo story

## What changed

- removed `2,4-D inhalation` from live backup/hero guidance
- added explicit caveat in write-up validation notes
- added explicit caveat in submission readiness note
