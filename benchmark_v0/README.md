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

## Important constraints
- Structured truth is the canonical source of evaluation, not prose answers.
- Split assignment happens at the scenario-family level.
- Bahasa Indonesia is included in the kickoff package but not yet across every family.
- Current multilingual rows are draft benchmark rows and should not be called Gold without human review.
