# Manual Selection Note

Manual chemical selection is the fallback when QR scanning is unavailable or the label is damaged.

## Flow

1. app loads catalog from `GET /api/catalog`
2. app maps backend chemical DTOs into localized option view models
3. worker taps a chemical card
4. app locks `chemical_id`
5. flow moves to the incident query screen

## Field usability choices

- no typing of chemical names
- localized label from backend catalog
- short label plus full localized name
- one-tap selection

## Boundary

Manual selection stays inside:

- `src/features/catalog/ChemicalPicker.tsx`
- mapped through `src/mappers/responseMapper.ts`
