# LLM Judged Grounded Eval Report: Core v0

- Model used: `google/gemma-4-31B-it`
- Judge version: `strict_v6_2026-04-30`
- Rows evaluated: 128
- Overall average hybrid_total_100: 93.022
- Overall average hybrid_total_12: 11.163

## Average by Split
- `dev`: 89.141
- `holdout`: 95.625
- `validation`: 95.169

## Average by Language
- `bahasa_indonesia`: 93.086
- `bangla`: 95.156
- `english`: 92.578
- `malay`: 91.27

## Average by Incident Type
- `eye_exposure`: 97.178
- `ingestion`: 91.25
- `inhalation`: 86.484

## Top Recurring Failure Patterns
- `action_order`: 64
- `overstated_escalation`: 7
- `overformatted`: 3
- `escalation_condition_mismatch`: 3
- `overbroad_escalation`: 3
- `escalation_condition_missing`: 3
- `conditional-escalation-mismatch`: 3
- `over-escalation`: 3
- `slightly_verbose`: 2
- `escalation_condition_changed`: 2

## Five Good Examples
- `row_320` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_318` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_317` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_316` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_315` | `sf_fastac_eye_01` | score 100.00 | tags: none

## Five Bad Examples
- `row_257` | `sf_24d_inhalation_01` | score 66.88 | tags: action_order, escalation_condition_mismatch, overbroad_escalation
- `row_258` | `sf_24d_inhalation_01` | score 66.88 | tags: action_order, escalation_condition_missing, overstated_escalation
- `row_259` | `sf_24d_inhalation_01` | score 66.88 | tags: action_order, escalation_condition_missing, overstated_escalation
- `row_260` | `sf_24d_inhalation_01` | score 66.88 | tags: action_order, escalation_condition_missing, overbroad_escalation
- `row_261` | `sf_24d_inhalation_01` | score 66.88 | tags: action_order, escalation_condition_changed, overstated_escalation
