# Freeze Note: Bronze Core v0

## Summary
This freeze creates a Bronze core v0 as a strict filtered subset of the current `benchmark_v0` working package.

## Freeze rules applied
- No rows, chemicals, languages, or new content were added.
- All non-ingestion families were kept.
- Only these ingestion families were kept in the Bronze core:
  - `sf_24d_ingestion_01`
  - `sf_glufosinate_ingestion_01`
- These ingestion families were deferred to Bronze/dev stress-test only:
  - `sf_fastac_ingestion_01`
  - `sf_glyphosate_ingestion_01`
  - `sf_paraquat_ingestion_01`
- `quality_tier` remains `bronze_dev` everywhere.
- No rows were relabeled to Gold or Silver.

## Result
- Included families: 17
- Deferred families: 3
- Final core row count: 272
- Split method: scenario-family level only
- Core row source: filtered subset of `benchmark_v0.jsonl`

## Validation expectations
- Every included family appears in exactly one split.
- Every core row references an included family.
- All 16 rows per included family are preserved.
