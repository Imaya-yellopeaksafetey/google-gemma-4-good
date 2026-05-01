# Weak Family Fallback Policy

## Purpose

Weak-family fallback is not a degraded chatbot apology.

It is a deliberate **guarded emergency mode** designed to:

- give the worker useful immediate help
- prevent unsafe over-answering
- make responsible limitation visible to judges

## Common fallback rules

For all weak families:

- give only the most source-defensible immediate actions
- include the strongest do-not-do rule if available
- escalate early and clearly
- do not improvise additional treatment detail
- do not give broad reassurance
- do not sound uncertain in a confused way
- sound deliberate: "here is what is safe to do now"

## `sf_glufosinate_ingestion_01`

### Safe information to provide

- do not induce vomiting
- rinse the mouth
- drink the specified safe water amount only if directly supported
- seek immediate medical help

### What to avoid saying

- anything about milk
- any stomach-soothing home remedy
- any extra monitoring instructions not source-backed
- speculative discussion of severity thresholds

### Escalation behavior

- escalation should be near-immediate in the response
- if the answer lane is guarded, the system should foreground escalation more strongly than in strong families

### Demo posture

This should look like:

- "I can safely give you the immediate emergency actions, but I will not guess beyond that."

## `sf_paraquat_inhalation_01`

### Safe information to provide

- move to fresh air immediately
- breathing support only if directly supported by the family truth
- immediate medical escalation

### What to avoid saying

- nose rinsing
- face washing
- generic respiratory home-care advice
- any extra decontamination not in the family truth

### Escalation behavior

- escalation should be very prominent
- if the system cannot satisfy the full required slot set, it should still give fresh-air action and urgent escalation

### Demo posture

This should look like:

- "I will give the critical first move and escalate immediately rather than over-explaining."

## `sf_24d_ingestion_01`

### Safe information to provide

- only the directly supported first steps
- immediate escalation behavior
- the strongest prohibition if present

### What to avoid saying

- home remedy advice
- symptom-based branching that is not explicitly supported
- reassurance phrasing that delays escalation

### Escalation behavior

- strong and early
- guarded mode should state that this is an emergency lane where the model is intentionally limiting detail

### Demo posture

This should look intelligent because:

- it is decisive
- it is sparse on purpose
- it communicates control rather than uncertainty panic

## `sf_24d_eye_01`

### Safe information to provide

- immediate rinsing
- contact lens handling if directly supported
- escalation

### What to avoid saying

- extra eye treatment suggestions
- unsupported rinsing modifications
- speculative recovery advice

### Escalation behavior

- still strong, but less dramatic than ingestion when not required
- conservative mode may still give a nearly full answer if the blocked issue is only low-risk wording drift rather than action uncertainty

### Demo posture

This fallback can be shown as:

- "the system keeps the emergency core intact while suppressing unsupported embellishment"

## How guarded mode should sound

Guarded mode must not sound broken.

It should sound like:

- precise
- compressed
- safety-prioritized
- intentionally limited

Bad tone:

- "I’m not sure"
- "maybe"
- "this could be"

Good tone:

- "Do these steps now."
- "I am limiting this response to the safest supported actions."
- "Get medical help now."

## Why this helps the demo

The fallback behavior itself becomes a differentiator:

- the system knows when not to improvise
- the system still helps
- the system’s safety limitation is visible and productized
