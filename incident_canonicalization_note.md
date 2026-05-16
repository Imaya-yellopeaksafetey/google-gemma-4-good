# Incident Canonicalization Note

Implemented a small explicit canonicalization layer inside [app/services/query_router.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app/services/query_router.py).

## What it covers

- `ear`
- `face`
- `cheek`
- `side of my face`
- `around eye`
- `near eye`
- `eyelid`
- hand / arm / clothing variants

## Safety behavior

- around-eye phrasing is rewritten toward supported `eye_exposure`
- face / cheek / ear phrasing is rewritten toward supported `skin_exposure`
- direct skin-surface phrasing is rewritten toward supported `skin_exposure`

## Important constraint

- this layer does **not** invent new benchmark families
- it only rewrites realistic field phrasing into the safest supported canonical incident lane already available to the controller

## Example

Input:

`spray went into my ear`

Rewritten controller-facing prompt fragment:

`Supported incident interpretation: treat this as skin exposure on the face or outer ear area.`

## Follow-up fix in this pass

The first version of this canonicalization note included extra disambiguation text mentioning `mouth`.

That turned out to be unsafe because it leaked ingestion cues into the downstream controller prompt and could bias normalization toward an ingestion family.

The canonicalization text is now shorter and safer:

- enough to steer the query into a supported skin-exposure lane
- not broad enough to inject a competing incident type

## Why this is narrow enough

- no benchmark expansion
- no controller redesign
- just enough explicit canonicalization to prevent realistic field phrasing from collapsing into a weak generic path
