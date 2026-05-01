# Slot Verifier Test Report

- Challenge cases: `10`
- Expected pass/fail matches: `10/10`

## Challenge cases

### `pass_reference`
- expected: `pass`
- actual: `pass`
- missing_required_slots: `[]`
- blocked_unsupported_slots: `[]`

### `missing_action_slot`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `['a3']`
- blocked_unsupported_slots: `[]`

### `missing_do_not`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `['dn1']`
- blocked_unsupported_slots: `[]`

### `weakened_escalation`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `[]`
- blocked_unsupported_slots: `['weakened_escalation']`

### `unsupported_extra_detail`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `[]`
- blocked_unsupported_slots: `['unknown_slot:drink_milk', 'unsupported_pattern:milk']`

### `generic_chat_drift`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `[]`
- blocked_unsupported_slots: `['generic_chat:stay calm']`

### `schema_missing_field`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `[]`
- blocked_unsupported_slots: `['missing_field:evidence_basis']`

### `missing_escalation`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `['escalate_now']`
- blocked_unsupported_slots: `[]`

### `unknown_slot`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `['a1']`
- blocked_unsupported_slots: `['unknown_slot:a9']`

### `cross_incident_detail`
- expected: `fail`
- actual: `fail`
- missing_required_slots: `[]`
- blocked_unsupported_slots: `['unsupported_pattern:rinse nose', 'unsupported_pattern:wash face']`
