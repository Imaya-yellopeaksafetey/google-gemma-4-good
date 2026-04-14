# Benchmark v0 Kickoff Package

This package implements the benchmark-first kickoff for the Gemma 4 Good hackathon project.

## Files
- `schema_v0.md`: field contract for scenario families and language rows
- `rubric_v0.md`: scoring rules and translation/rendering checks
- `source_pack_v0.json`: minimal SDS-backed source pack across four chemicals
- `scenario_families_v0.json`: structured truth objects
- `benchmark_v0.jsonl`: language-specific eval rows
- `split_manifest_v0.json`: family-level split assignments

## Current package status
- Stage: schema shakeout
- Total scenario families: 8
- Total benchmark rows: 28
- Languages present: English, Malay, Bangla, Bahasa Indonesia
- Quality tier used in rows: `bronze_dev`
- Benchmark sizing note: `36–54` rows is the minimum viable v0 freeze target, not a comfortable final benchmark

## Important constraints
- Structured truth is the canonical source of evaluation, not prose answers.
- Split assignment happens at the scenario-family level.
- Frozen benchmark v0 should include at least one Bahasa Indonesia rendering for every included incident type and at least 20–25% Bahasa Indonesia row coverage.
- Ingestion is out by default unless the first 3–5 source chemicals support it cleanly.
- Current multilingual rows are draft benchmark rows and should not be called Gold without human review.
