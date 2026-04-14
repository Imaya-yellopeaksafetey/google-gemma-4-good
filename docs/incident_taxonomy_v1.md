# Incident Taxonomy v1

## Included in benchmark v0

### `skin_exposure`
Use when the product contacts skin or soaked clothing. Required benchmark coverage.

### `eye_exposure`
Use when splash, mist, or residue reaches the eye. Required benchmark coverage.

### `inhalation`
Use when the worker breathes spray, vapour, or aerosol and symptoms or concern follow. Required benchmark coverage.

### `ingestion`
Use only when the source document gives clean, explicit first-aid steps. Included for kickoff because the current minimal source pack supports it.

## Excluded from benchmark v0

### `ppe_uncertainty`
Out for now unless the source pack shows repeated, directly grounded patterns that score cleanly.

### `spill_response`
Out of scope for kickoff benchmark and demo.

### `chronic_exposure`
Out of scope. The benchmark is for acute, immediate-response incidents.

### `multi_step diagnosis`
Out of scope. The assistant is not diagnosing the condition; it is mapping a known incident to grounded first aid.

## Benchmark authoring rules
- Every scenario family must map to exactly one incident type.
- The worker prompt can be noisy, but the intended action plan must stay unambiguous.
- If a source mixes multiple incident types in a way that cannot be separated cleanly, reject that source for benchmark use.
- If ingestion guidance is missing or inconsistent for a chemical, exclude ingestion for that chemical instead of filling gaps with general advice.
