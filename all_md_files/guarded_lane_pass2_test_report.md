# Guarded Lane Pass 2 Test Report

- Rows inspected: `64`
- Gemma-driven guarded_composer calls: `64/64`
- Method breakdown: `{'gemma': 64}`

## `sf_24d_eye_01`
- sample_language: `english`
- sample_response_mode: `guarded_minimum_response`
- immediate_action_count: `3`
- do_not_count: `1`
- escalation: `Seek immediate medical attention after flushing starts.`

## `sf_24d_ingestion_01`
- sample_language: `english`
- sample_response_mode: `guarded_escalate_now`
- immediate_action_count: `2`
- do_not_count: `1`
- escalation: `Seek immediate medical attention after mouth rinse.`

## `sf_glufosinate_ingestion_01`
- sample_language: `english`
- sample_response_mode: `guarded_minimum_response`
- immediate_action_count: `3`
- do_not_count: `1`
- escalation: `Seek medical attention immediately after mouth rinse and water.`

## `sf_paraquat_inhalation_01`
- sample_language: `english`
- sample_response_mode: `guarded_escalate_now`
- immediate_action_count: `2`
- do_not_count: `1`
- escalation: `Call 911 if not breathing and call a poison control center or doctor for treatment advice.`
