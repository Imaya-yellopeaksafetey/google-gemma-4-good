# Calibration Audit: Core v0

## Sample

- Source files:
  - `eval_harness/eval_outputs/baseline_predictions_core_v0.jsonl`
  - `eval_harness/eval_outputs/baseline_scores_core_v0.jsonl`
- Sample size: `16` rows
- Bucket mix:
  - `4` high-score rows used as the "good" bucket
  - `4` mid-score rows used as the "medium" bucket
  - `8` low-score rows used as the "bad" bucket
- Coverage:
  - languages: `8` English, `8` non-English
  - incident types: `3` skin, `5` eye, `6` inhalation, `2` ingestion

## Verdict

The scorer is **badly miscalibrated**, so grounded eval should **not** be run yet.

The main issue is structural, not just threshold tuning:
- `token_set()` only keeps `[a-z0-9]`, so Bangla text collapses to near-empty token overlap. That makes Bangla rows systematically under-scored even when the answer is clinically close.
- Step matching is too lexical. English paraphrases that are clinically equivalent still lose `action_correctness`, `action_order`, and `grounding_match`.
- `do_not_do` and `escalate` matching is too literal, while `unsupported_advice` is too forgiving for irrelevant extra steps and additions like milk/wash-face/rinse-nose.

So the scorer is directionally useful for obvious English misses, but not reliable enough yet for multilingual comparison or for deciding whether grounded prompting truly helps.

## Row Audit

### Good Bucket

- `row_id`: `row_013`
  - `scenario_family_id`: `sf_glyphosate_eye_01`
  - `language`: `english`
  - `incident_type`: `eye_exposure`
  - `current total_score`: `8`
  - `fair / too strict / too lenient`: `too strict`
  - `what specifically caused the penalty`: The answer gets the main rinse action, contact-lens removal, and urgent escalation right. It was penalized because "hold the eye open" was folded into the rinse wording instead of matching as a separate literal step, and because the `DO NOT` text did not literally restate "do not stop rinsing early."
  - `whether any scoring rule should be adjusted`: Yes. Use semantic step matching and allow equivalent escalation phrasing to satisfy `grounding_match`.

- `row_id`: `row_001`
  - `scenario_family_id`: `sf_glyphosate_skin_01`
  - `language`: `english`
  - `incident_type`: `skin_exposure`
  - `current total_score`: `8`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer removes clothing and rinses correctly, but it downgrades the source-required escalation from "call physician/poison control immediately" to a conditional escalation only if irritation persists. That is a real miss. The added soap/wash wording is extra but not the main problem.
  - `whether any scoring rule should be adjusted`: No major change from this row alone.

- `row_id`: `row_289`
  - `scenario_family_id`: `sf_fastac_skin_01`
  - `language`: `english`
  - `incident_type`: `skin_exposure`
  - `current total_score`: `9`
  - `fair / too strict / too lenient`: `too lenient`
  - `what specifically caused the penalty`: The answer adds two irrelevant actions not grounded in the family truth: removing contaminated clothing and rinsing eyes if splashed. It also weakens the escalation from direct medical attention to only if irritation/systemic symptoms persist.
  - `whether any scoring rule should be adjusted`: Yes. `unsupported_advice` should penalize irrelevant cross-incident instructions more heavily, and mandatory escalation misses should hurt more.

- `row_id`: `row_305`
  - `scenario_family_id`: `sf_fastac_eye_01`
  - `language`: `english`
  - `incident_type`: `eye_exposure`
  - `current total_score`: `9`
  - `fair / too strict / too lenient`: `slightly lenient`
  - `what specifically caused the penalty`: The answer is clinically close, but it adds a separate eyelid-rotation step and a stronger `DO NOT` statement not present in the truth object, while the truth expects the two core actions plus medical attention. The score still reads high because the overlap heuristic likes the wording.
  - `whether any scoring rule should be adjusted`: Yes. Extra detail that changes the step count should not be almost free.

### Medium Bucket

- `row_id`: `row_038`
  - `scenario_family_id`: `sf_glufosinate_ingestion_01`
  - `language`: `english`
  - `incident_type`: `ingestion`
  - `current total_score`: `6`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer correctly says rinse mouth, drink water, and seek medical care, and it captures the no-vomiting rule in `DO NOT`. The main miss is that the truth treats "Do not induce vomiting" as a primary canonical action as well as a prohibition, so the script marks one canonical step missing.
  - `whether any scoring rule should be adjusted`: Yes. When the same instruction exists in both `canonical_actions` and `do_not_do`, the scorer should not double-penalize if one side is satisfied clearly.

- `row_id`: `row_062`
  - `scenario_family_id`: `sf_24d_eye_01`
  - `language`: `english`
  - `incident_type`: `eye_exposure`
  - `current total_score`: `5`
  - `fair / too strict / too lenient`: `too strict`
  - `what specifically caused the penalty`: The answer captures continuous flushing, eyelids open, contact-lens removal, and urgent medical care. It was punished as if three canonical steps were missing because the truth splits flushing into multiple smaller substeps and the matcher expects literal alignment.
  - `whether any scoring rule should be adjusted`: Yes. Eye-rinse sequences need grouped semantic matching rather than literal one-line step accounting.

- `row_id`: `row_109`
  - `scenario_family_id`: `sf_paraquat_skin_01`
  - `language`: `bangla`
  - `incident_type`: `skin_exposure`
  - `current total_score`: `4`
  - `fair / too strict / too lenient`: `too strict`
  - `what specifically caused the penalty`: The answer removes contaminated clothing, rinses for 15-20 minutes, and escalates urgently. The script still says three canonical steps are missing because Bangla step text is effectively invisible to the overlap tokenizer.
  - `whether any scoring rule should be adjusted`: Yes. Unicode-aware tokenization is mandatory before any multilingual score can be trusted.

- `row_id`: `row_125`
  - `scenario_family_id`: `sf_paraquat_eye_01`
  - `language`: `bangla`
  - `incident_type`: `eye_exposure`
  - `current total_score`: `4`
  - `fair / too strict / too lenient`: `too strict`
  - `what specifically caused the penalty`: The answer gives immediate eye irrigation, sustained rinsing, and urgent medical escalation. The missing contact-lens instruction is a legitimate gap, but the current score is still too low because the Bangla text cannot match the truth semantically.
  - `whether any scoring rule should be adjusted`: Yes. Fix multilingual matching first, then re-evaluate whether the remaining penalty is proportional.

### Bad Bucket

- `row_id`: `row_075`
  - `scenario_family_id`: `sf_fastac_inhalation_01`
  - `language`: `english`
  - `incident_type`: `inhalation`
  - `current total_score`: `2`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer gets "fresh air" right, but then drifts into loosening clothes and rinsing the nose, adds an unrelated `DO NOT: induce vomiting`, and weakens the escalation. That is a real low-quality response for this truth object.
  - `whether any scoring rule should be adjusted`: No major change from this row alone.

- `row_id`: `row_257`
  - `scenario_family_id`: `sf_24d_inhalation_01`
  - `language`: `english`
  - `incident_type`: `inhalation`
  - `current total_score`: `2`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer uses a generic chemical-emergency template and adds irrelevant ingestion language (`Do NOT: induce vomiting`). It misses the core "rest" instruction and overstates escalation.
  - `whether any scoring rule should be adjusted`: No major change from this row alone.

- `row_id`: `row_028`
  - `scenario_family_id`: `sf_glufosinate_inhalation_01`
  - `language`: `malay`
  - `incident_type`: `inhalation`
  - `current total_score`: `3`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer moves to fresh air, but it also adds face/nose washing and an unrelated vomiting prohibition. It also delays medical care into a conditional escalation instead of making it immediate.
  - `whether any scoring rule should be adjusted`: Small change only. This row is low quality for real reasons, though multilingual matching still makes the exact score noisy.

- `row_id`: `row_031`
  - `scenario_family_id`: `sf_glufosinate_inhalation_01`
  - `language`: `bangla`
  - `incident_type`: `inhalation`
  - `current total_score`: `3`
  - `fair / too strict / too lenient`: `slightly too strict`
  - `what specifically caused the penalty`: The answer has the correct fresh-air move, but adds unsupported breathing/nose-washing/vomiting content and makes escalation conditional. The row deserves a low score, but not one dominated by tokenization failure.
  - `whether any scoring rule should be adjusted`: Yes. After Unicode-aware matching, this row should still be low, but for the right reasons.

- `row_id`: `row_084`
  - `scenario_family_id`: `sf_fastac_inhalation_01`
  - `language`: `bahasa_indonesia`
  - `incident_type`: `inhalation`
  - `current total_score`: `3`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer reaches fresh air, but then adds nose rinsing and a custom `DO NOT` unrelated to the truth object. It also converts direct urgent care into a conditional escalation.
  - `whether any scoring rule should be adjusted`: Minor only. The row is genuinely poor, even if the multilingual matcher is noisy.

- `row_id`: `row_043`
  - `scenario_family_id`: `sf_glufosinate_ingestion_01`
  - `language`: `bangla`
  - `incident_type`: `ingestion`
  - `current total_score`: `4`
  - `fair / too strict / too lenient`: `too lenient`
  - `what specifically caused the penalty`: The answer says not to induce vomiting, but then tells the worker to drink a lot of water or milk. The truth only allows a specific water amount and does not support milk. That is a meaningful unsupported addition.
  - `whether any scoring rule should be adjusted`: Yes. `unsupported_advice` should penalize unsupported ingestion additions, especially milk, more aggressively.

- `row_id`: `row_250`
  - `scenario_family_id`: `sf_glufosinate_eye_01`
  - `language`: `bangla`
  - `incident_type`: `eye_exposure`
  - `current total_score`: `3`
  - `fair / too strict / too lenient`: `too strict`
  - `what specifically caused the penalty`: The answer gives the core rinse action and urgent specialist escalation. The score collapses because the matcher cannot align Bangla text, and it over-penalizes the extra contact-lens detail.
  - `whether any scoring rule should be adjusted`: Yes. Unicode-aware semantic matching is required; otherwise multilingual eye rows are not auditable.

- `row_id`: `row_269`
  - `scenario_family_id`: `sf_24d_inhalation_01`
  - `language`: `bahasa_indonesia`
  - `incident_type`: `inhalation`
  - `current total_score`: `4`
  - `fair / too strict / too lenient`: `fair`
  - `what specifically caused the penalty`: The answer moves the worker to fresh air, but incorrectly adds clothing removal, face/skin rinsing, and an ingestion-style prohibition. It is meaningfully off-target.
  - `whether any scoring rule should be adjusted`: Minor only. This should still score low after recalibration.

## Scoring Changes Needed Before Grounded Eval

- Make tokenization Unicode-aware so Bangla and other non-Latin rows are scoreable.
- Replace raw lexical overlap with semantic step matching or bilingual normalization before scoring.
- Treat duplicated truth content across `canonical_actions` and `do_not_do` as one obligation, not two separate traps.
- Strengthen penalties for unsupported additions when they introduce a different incident workflow or unsafe advice.
- Score escalation separately for mandatory-vs-conditional errors, since several rows weaken "immediate medical help" to "if symptoms persist."

## Stop Decision

Do **not** run grounded eval yet.

Grounded mode is implemented in the harness, but the current scorer is not calibrated well enough to make the baseline-vs-grounded comparison trustworthy. The scorer should be fixed first, then baseline should be rescored, and then grounded eval can start.
