# Bangla Weak Family Fix Report

## What changed

- Bangla mouth-ingestion prompts now trigger a narrow ingestion override instead of being left as skin-exposure guesses
- guarded prompt now requires every allowed slot in order and keeps prohibition slots as explicit steps
- paraquat inhalation guarded subset now includes the poison-control / doctor contact action as its own guarded step

## Family score change

- `sf_24d_ingestion_01`: pass2 `74.844` -> pass2.6 `91.250`
- `sf_glufosinate_ingestion_01`: pass2 `57.344` -> pass2.6 `91.250`
- `sf_paraquat_inhalation_01`: pass2 `60.469` -> pass2.6 `93.594`

## Routing / failure-type summary

- `row_043` `sf_glufosinate_ingestion_01` -> normalized `sf_glufosinate_ingestion_01` / confidence `high` / flags `none` / mode `guarded_minimum_response`
- `row_044` `sf_glufosinate_ingestion_01` -> normalized `sf_glufosinate_ingestion_01` / confidence `high` / flags `none` / mode `guarded_minimum_response`
- `row_045` `sf_glufosinate_ingestion_01` -> normalized `sf_glufosinate_ingestion_01` / confidence `high` / flags `none` / mode `guarded_minimum_response`
- `row_141` `sf_paraquat_inhalation_01` -> normalized `sf_paraquat_inhalation_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_142` `sf_paraquat_inhalation_01` -> normalized `sf_paraquat_inhalation_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_143` `sf_paraquat_inhalation_01` -> normalized `sf_paraquat_inhalation_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_144` `sf_paraquat_inhalation_01` -> normalized `sf_paraquat_inhalation_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_179` `sf_glufosinate_ingestion_01` -> normalized `sf_glufosinate_ingestion_01` / confidence `high` / flags `none` / mode `guarded_minimum_response`
- `row_281` `sf_24d_ingestion_01` -> normalized `sf_24d_ingestion_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_282` `sf_24d_ingestion_01` -> normalized `sf_24d_ingestion_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_283` `sf_24d_ingestion_01` -> normalized `sf_24d_ingestion_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
- `row_284` `sf_24d_ingestion_01` -> normalized `sf_24d_ingestion_01` / confidence `high` / flags `none` / mode `guarded_escalate_now`
