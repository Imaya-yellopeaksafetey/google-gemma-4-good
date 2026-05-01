# LLM Judged Baseline Eval Report: Core v0

- Model used: `google/gemma-4-31B-it`
- Rows evaluated: 272
- Overall average hybrid_total_100: 87.796
- Overall average hybrid_total_12: 10.536

## Average by Split
- `dev`: 88.486
- `holdout`: 89.844
- `validation`: 85.055

## Average by Language
- `bahasa_indonesia`: 88.097
- `bangla`: 89.577
- `english`: 85.91
- `malay`: 87.601

## Average by Incident Type
- `eye_exposure`: 91.539
- `ingestion`: 80.859
- `inhalation`: 86.391
- `skin_exposure`: 88.234

## Top Recurring Failure Patterns
- `action_order`: 158
- `order_degraded`: 18
- `overgeneralized_escalation`: 17
- `escalation_condition_omitted`: 11
- `escalation_condition_missing`: 9
- `overbroad_escalation`: 7
- `escalation_condition_weakened`: 7
- `unsupported_advice`: 5
- `order_mismatch`: 5
- `escalation_overstated`: 5

## Five Good Examples
- `row_268` | `sf_24d_inhalation_01` | score 100.00 | tags: none
- `row_267` | `sf_24d_inhalation_01` | score 100.00 | tags: none
- `row_266` | `sf_24d_inhalation_01` | score 100.00 | tags: none
- `row_265` | `sf_24d_inhalation_01` | score 100.00 | tags: none
- `row_251` | `sf_glufosinate_eye_01` | score 100.00 | tags: none

## Five Bad Examples
- `row_138` | `sf_paraquat_inhalation_01` | score 66.25 | tags: action_order, escalation_order_weakened, order_mismatch
- `row_139` | `sf_paraquat_inhalation_01` | score 66.25 | tags: action_order, escalation_order_weakened, order_mismatch
- `row_134` | `sf_paraquat_inhalation_01` | score 66.88 | tags: action_order, escalation_order_weakened, order_degraded
- `row_137` | `sf_paraquat_inhalation_01` | score 66.88 | tags: action_order, escalation_order_weakened, priority_order_degraded
- `row_141` | `sf_paraquat_inhalation_01` | score 66.88 | tags: action_order, escalation_priority_weakened, order_degraded
