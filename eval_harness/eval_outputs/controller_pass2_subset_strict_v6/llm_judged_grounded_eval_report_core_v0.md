# LLM Judged Grounded Eval Report: Core v0

- Model used: `google/gemma-4-31B-it`
- Judge version: `strict_v6_2026-04-30`
- Rows evaluated: 128
- Overall average hybrid_total_100: 91.021
- Overall average hybrid_total_12: 10.922

## Average by Split
- `dev`: 93.867
- `holdout`: 92.773
- `validation`: 87.005

## Average by Language
- `bahasa_indonesia`: 92.012
- `bangla`: 84.219
- `english`: 95.625
- `malay`: 92.227

## Average by Incident Type
- `eye_exposure`: 97.559
- `ingestion`: 82.559
- `inhalation`: 86.406

## Top Recurring Failure Patterns
- `action_order`: 64
- `over-escalation`: 5
- `unsupported_advice`: 3
- `conditional-escalation-mismatch`: 3
- `source_mismatch`: 2
- `wrong_incident_guidance`: 2
- `missed_required_action`: 2
- `order_degraded_but_safe`: 1
- `cross_incident_skin_instructions`: 1
- `missed_do_not_induce_vomiting`: 1

## Five Good Examples
- `row_319` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_318` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_317` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_316` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_315` | `sf_fastac_eye_01` | score 100.00 | tags: none

## Five Bad Examples
- `row_045` | `sf_glufosinate_ingestion_01` | score 8.12 | tags: action_order, cross_incident_skin_instructions, missed_do_not_induce_vomiting, missed_drink_water_200_300ml, missed_mouth_rinse, source_mismatch, unsupported_advice, wrong_escalation_specialist, wrong_incident_guidance
- `row_283` | `sf_24d_ingestion_01` | score 25.62 | tags: action_order, added_skin_exposure_steps, missing_do_not_induce_vomiting, missing_mouth_rinse, source_mismatch, wrong_incident_guidance
- `row_142` | `sf_paraquat_inhalation_01` | score 50.00 | tags: action_order, conditionalized_required_escalation, dropped_poison_control_or_doctor_call, missed_required_action
- `row_143` | `sf_paraquat_inhalation_01` | score 58.75 | tags: action_order, conditional_escalation_weakens_required_action, missed_required_action, poison_control_doctor_advice_not_stated_as_immediate_step
- `row_144` | `sf_paraquat_inhalation_01` | score 58.75 | tags: action_order, incomplete_escalation_condition, missed_poison_control_or_doctor_call
