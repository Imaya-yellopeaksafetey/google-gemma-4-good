from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def scenario_family_index(path: Path) -> dict[str, dict[str, Any]]:
    families = load_json(path)["scenario_families"]
    return {family["scenario_family_id"]: family for family in families}


def benchmark_rows_by_family_language(
    rows: list[dict[str, Any]],
) -> dict[str, dict[str, dict[str, dict[str, Any]]]]:
    index: dict[str, dict[str, dict[str, dict[str, Any]]]] = {}
    for row in rows:
        index.setdefault(row["scenario_family_id"], {}).setdefault(row["language"], {})[row["prompt_style"]] = row
    return index


def preferred_rendering_row(
    row_index: dict[str, dict[str, dict[str, dict[str, Any]]]],
    family_id: str,
    language: str,
) -> dict[str, Any]:
    variants = row_index[family_id][language]
    for style in ("formal_direct", "short_messy_urgent", "third_person_report", "descriptive_context"):
        if style in variants:
            return variants[style]
    return next(iter(variants.values()))
