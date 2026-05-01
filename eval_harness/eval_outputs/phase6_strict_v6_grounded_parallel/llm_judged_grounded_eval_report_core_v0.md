# LLM Judged Grounded Eval Report: Core v0

- Model used: `google/gemma-4-31B-it`
- Judge version: `strict_v6_2026-04-30`
- Rows evaluated: 272
- Overall average hybrid_total_100: 92.008
- Overall average hybrid_total_12: 11.041

## Average by Split
- `dev`: 92.168
- `holdout`: 93.525
- `validation`: 90.539

## Average by Language
- `bahasa_indonesia`: 91.921
- `bangla`: 93.162
- `english`: 90.809
- `malay`: 92.142

## Average by Incident Type
- `eye_exposure`: 94.789
- `ingestion`: 83.398
- `inhalation`: 92.18
- `skin_exposure`: 92.5

## Top Recurring Failure Patterns
- `action_order`: 158
- `unsupported_advice`: 5
- `order_degraded`: 5
- `action_order_degraded`: 4
- `overformatted`: 3
- `slightly_verbose`: 3
- `escalation_overgeneralized`: 3
- `overbroad_escalation`: 3
- `order_degraded_minor`: 2
- `slightly_verbose_format`: 2

## Five Good Examples
- `row_320` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_319` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_318` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_316` | `sf_fastac_eye_01` | score 100.00 | tags: none
- `row_315` | `sf_fastac_eye_01` | score 100.00 | tags: none

## Five Bad Examples
- `row_137` | `sf_paraquat_inhalation_01` | score 66.88 | tags: action_order, degraded_action_order, missed_required_action
- `row_141` | `sf_paraquat_inhalation_01` | score 66.88 | tags: action_order, incomplete_escalation_condition, missed_required_action
- `row_145` | `sf_paraquat_inhalation_01` | score 66.88 | tags: action_order, conditional_escalation_buried, degraded_action_order, slightly_verbose_format
- `row_001` | `sf_glyphosate_skin_01` | score 73.75 | tags: action_order, unsupported_advice
- `row_062` | `sf_24d_eye_01` | score 73.75 | tags: action_order, unsupported_advice
