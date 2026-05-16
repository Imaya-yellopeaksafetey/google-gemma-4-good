**Local Gemma Test Harness Report**

Harness target:
- `google/gemma-4-E2B-it`

Comparison model:
- not used
- `google/gemma-4-E2B-it-assistant` was not needed for the first decision

Environment:
- official Cactus repository cloned to `/private/tmp/cactus_shallow`
- official Cactus Python runtime built locally
- official Cactus model artifact downloaded from `Cactus-Compute/gemma-4-E2B-it`
- extracted weights path:
  - `/private/tmp/cactus_shallow/weights/gemma-4-e2b-it`

Important setup notes:
- the first blocker was missing `cmake`
- after installing `cmake`, the native Cactus runtime built successfully
- Cactus warned:
  - `model.mlpackage not found; using CPU prefill`
- that means this harness used a real local path, but not an Apple-specific NPU package

Core results:

1. Load test
- load success: yes
- init time: `5.24 s`
- model handle returned successfully

2. Query routing test
- prompt: classify `spray went into my ear`
- output: `{"mode":"emergency_incident"}`
- result: credible pass
- metrics:
  - time_to_first_token_ms: `213.68`
  - total_time_ms: `425.44`
  - ram_usage_mb: `2041.44`

3. Preventive query routing test
- prompt: `what PPE should be used while spraying paraquat?`
- output: code-fenced JSON with `preventive_handling`
- result: pass with minor formatting looseness
- metrics:
  - time_to_first_token_ms: `273.73`
  - total_time_ms: `727.71`
  - ram_usage_mb: `2053.15`

4. Incident canonicalization test
- prompt: `it touched the side of my face near the eye`
- output:
  - `{"bucket":"eye_exposure","reason":"touched the side of my face near the eye"}`
- result: credible pass
- metrics:
  - time_to_first_token_ms: `303.71`
  - total_time_ms: `973.28`
  - ram_usage_mb: `2107.58`

5. Short clarification test
- prompt: `something happened with the chemical`
- output:
  - `Which chemical are you referring to?`
- result: pass, but somewhat under-specified versus body-location clarification
- metrics:
  - time_to_first_token_ms: `189.61`
  - total_time_ms: `408.35`
  - ram_usage_mb: `2111.08`

6. Short guarded fallback response test
- prompt: offline guarded response for `Chemical spray went into my ear while working in the field.`
- output:
  - `Immediate: Remove any contaminated clothing. Gently clean the affected ear with water if safe to do so.`
  - `Avoid: Do not insert objects into the ear. Do not apply heat or excessive pressure.`
  - `Escalate: Seek immediate medical attention or contact emergency services for professional assessment.`
- result: usable narrow pass, but still needs application-level safety constraints before product use
- metrics:
  - time_to_first_token_ms: `272.96`
  - total_time_ms: `2231.97`
  - ram_usage_mb: `2125.05`

Assessment:
- For the narrow task set requested by the user, `google/gemma-4-E2B-it` is credible.
- It is good enough to justify continuing Cactus feasibility work.
- It is not sufficient by itself to justify a broad “fully local emergency assistant” claim.

Remaining proof gap:
- Android app integration and route behavior in the emulator still need to be tested separately.
