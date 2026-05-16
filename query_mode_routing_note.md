# Query Mode Routing Note

Implemented a lightweight router in [app/services/query_router.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app/services/query_router.py).

## Modes

1. `emergency_incident`
   - exposure / accident / immediate first-aid phrasing
   - includes realistic variants such as ear, face, and around-eye phrasing

2. `preventive_handling`
   - PPE
   - handling precautions
   - storage
   - spray-safety wording

3. `unclear`
   - too little information to route safely

## Routing rules

- emergency wins if both preventive and exposure cues appear
- preventive is chosen only when the query looks operational rather than incident-driven
- unclear is returned when neither safe route is supported confidently
- matching is now boundary-aware rather than raw substring-based

This matters because:

- `hand` should not fire inside `handling`
- realistic emergency wording should not drift because a shorter token appears inside a longer word

## Example outcomes

- `spray went into my ear` -> `emergency_incident`
- `it touched the side of my face` -> `emergency_incident`
- `what PPE should be used while spraying?` -> `preventive_handling`
- `what precautions should I take while spraying?` -> `preventive_handling`
- `help please` -> `unclear`

## Scope control

- this is not a broad intent system
- it is a narrow front-door split to stop misrouting real user-visible queries into the wrong answer engine
