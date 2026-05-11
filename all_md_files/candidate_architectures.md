# Candidate Architectures

## Candidate 1: Single-Pass Grounded Structured Generator

### Mechanism

- Input:
  - worker query
  - selected family truth
  - language target
- Retrieval role:
  - fetch one scenario family truth object
- Routing logic:
  - none beyond family selection
- Generation stage:
  - one grounded generation pass into a structured response schema
- Fallback behavior:
  - static prompt instruction to "be cautious"
- Source-use behavior:
  - family truth injected directly
- Escalation behavior:
  - inferred from family truth in the same pass
- Output structure:
  - incident summary
  - immediate actions
  - do-not-do
  - escalate

### Why it is better than plain grounded chat

- structured output
- better prompt discipline

### Why it is not enough

- still one response mode for all families
- no explicit release gate
- weak-family handling is too implicit
- little novelty beyond "prompted structured grounding"

## Candidate 2: Retrieve -> Generate -> Self-Check -> Release

### Mechanism

- Input:
  - worker query
  - candidate family truth
  - language target
- Retrieval role:
  - select family truth
- Routing logic:
  - no strong/weak split
- Generation stages:
  1. produce structured draft
  2. run a slot checker against required action fields
  3. release only if checker passes
- Fallback behavior:
  - if checker fails, emit conservative emergency response
- Source-use behavior:
  - family truth used for draft and for checker
- Escalation behavior:
  - explicit checker verifies escalation presence
- Output structure:
  - fixed schema with release status

### Why it is better than plain grounded chat

- introduces a true model-side verification stage
- catches missing required actions

### Why it is still limited

- does not differentiate strong and weak families before generation
- fallback is reactive, not strategic
- good safety mechanism, but weaker judge-facing novelty story than a deliberate dual-path design

## Candidate 3: Strong-Family Fast Lane + Weak-Family Conservative Lane

### Mechanism

- Input:
  - worker query
  - detected family ID
  - family strength label
  - language target
- Retrieval role:
  - fetch one family truth object and family strength metadata
- Routing logic:
  - if family is demo-safe strong family: full-response lane
  - if family is weak family: conservative lane
  - if family confidence is low: conservative lane
- Generation stages:
  1. family-aware incident normalization
  2. lane selection
  3. lane-specific structured generation
- Fallback behavior:
  - weak lane provides only safe minimum actions + escalation + explicit limitation
- Source-use behavior:
  - strong lane uses full canonical actions, do-not-do, escalation
  - weak lane uses only safe minimum source-backed action subset
- Escalation behavior:
  - strong lane gives full escalation logic
  - weak lane foregrounds escalation earlier
- Output structure:
  - same response schema with `response_mode`

### Why it is better than plain grounded chat

- visible model-side risk stratification
- makes weakness handling a feature
- easy for judges to understand

### Why it is not the best final choice

- still vulnerable to missed required slots inside the strong lane unless a checker is added

## Candidate 4: Family-Aware Dual Path with Slot Verification and Fallback Release Gate

### Mechanism

- Input:
  - worker query
  - candidate family truth
  - family strength label
  - language target
- Retrieval role:
  - fetch one family truth object only
  - no broad document retrieval at answer time
- Routing logic:
  1. identify family and family-confidence
  2. map to `strong_demo_safe`, `weak_guarded`, or `uncertain`
  3. choose fast lane or guarded lane
- Generation stages:
  1. **incident normalizer**
     - compress messy worker phrasing into structured incident facts
  2. **response planner**
     - derive required action slots from family truth
  3. **lane-specific composer**
     - strong lane: full response
     - guarded lane: safe minimum response
  4. **slot verifier**
     - checks required slots, forbidden content, escalation consistency
  5. **release selector**
     - if strong lane fails verification, downgrade to guarded lane
- Fallback behavior:
  - conservative lane is not just "sorry"
  - it provides safe immediate steps, do-not-do, and urgent escalation while suppressing unsupported detail
- Source-use behavior:
  - only family truth and allowed family metadata are used
  - no raw SDS prose shown to the user
- Escalation behavior:
  - verification step ensures escalation is present when required
  - guarded lane may move escalation earlier than strong lane if needed for safety
- Output structure:
  - fixed schema with:
    - `response_mode`
    - `family_strength`
    - `incident_summary`
    - `immediate_actions`
    - `do_not_do`
    - `escalate_now`
    - `evidence_basis`
    - `fallback_reason`
    - `language`

### Why it is better than plain grounded chat

- explicit dual-path safety control
- explicit slot verification before answer release
- family-aware suppression of over-answering
- clear novelty story for judges

### Why this is the best candidate

- strongest novelty with strongest safety logic
- directly aligned to Phase 6 evidence
- easy to demonstrate on mobile later
- handles strong and weak families in one coherent architecture
