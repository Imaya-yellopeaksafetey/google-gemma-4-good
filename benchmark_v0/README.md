# Benchmark v0 Working Package

This package is the current working benchmark set for the Gemma 4 Good hackathon project. It is broader than the first frozen v0 core benchmark and includes bronze/dev stress-test rows alongside cleaner candidate core rows.

## Files
- `schema_v0.md`: field contract for scenario families and language rows
- `rubric_v0.md`: scoring rules and translation/rendering checks
- `source_pack_v0.json`: current SDS-backed source pack
- `scenario_families_v0.json`: structured truth objects
- `benchmark_v0.jsonl`: language-specific eval rows
- `split_manifest_v0.json`: family-level split assignments

## Current package status
- Stage: working benchmark package, not frozen core benchmark
- Total chemicals in source pack: 5
- Total scenario families: 20
- Total benchmark rows: 320
- Languages present: English, Malay, Bangla, Bahasa Indonesia
- Quality tier used in rows: `bronze_dev`
- Benchmark sizing note: `36–54` rows is the minimum viable v0 freeze target, not a comfortable final benchmark; this 320-row package is the broader working set
- Prompt styles currently present: `short_messy_urgent`, `formal_direct`, `third_person_report`, `descriptive_context`

## Important constraints
- Structured truth is the canonical source of evaluation, not prose answers.
- Split assignment happens at the scenario-family level.
- Frozen benchmark v0 should include at least one Bahasa Indonesia rendering for every included incident type and at least 20–25% Bahasa Indonesia row coverage.
- The full working set contains mixed-difficulty ingestion families; the first frozen core benchmark should keep only the cleanest ingestion families first.
- Recommended frozen-core ingestion families: `sf_24d_ingestion_01`, `sf_glufosinate_ingestion_01`
- Keep harder ingestion cases in bronze/dev stress-test rows for now: `sf_glyphosate_ingestion_01`, `sf_fastac_ingestion_01`, `sf_paraquat_ingestion_01`
- Current multilingual rows are draft benchmark rows and should not be called Gold without human review.
- The latest added chemical should increase the benchmark by exactly `64` rows; any other increase means the per-chemical matrix is incomplete.
- The current matrix is complete at `16 rows per scenario family` and `64 rows per chemical`.
