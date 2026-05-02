from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from eval_harness.run_eval import normalize_prediction


def render_response_as_eval_text(response: dict[str, Any]) -> str:
    lines: list[str] = []
    for idx, action in enumerate(response.get("immediate_actions", []), start=1):
        instruction = action.get("instruction", "").strip()
        if instruction:
            lines.append(f"STEP {idx}: {instruction}")
    for item in response.get("do_not_do", []):
        instruction = item.get("instruction", "").strip()
        if instruction:
            lines.append(f"DO NOT: {instruction}")
    escalation = response.get("escalate_now", {}).get("instruction", "").strip()
    if escalation:
        lines.append(f"ESCALATE: {escalation}")
    return "\n".join(lines)


def controller_output_to_prediction(row: dict[str, Any], final_response: dict[str, Any], model_name: str) -> dict[str, Any]:
    raw_model_answer = render_response_as_eval_text(final_response)
    return {
        "row_id": row["row_id"],
        "scenario_family_id": row["scenario_family_id"],
        "split": row["split"],
        "language": row["language"],
        "model_name": model_name,
        "raw_model_answer": raw_model_answer,
        "normalized_prediction": normalize_prediction(raw_model_answer, row["language"]),
    }


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def subset_benchmark_assets(
    *,
    benchmark_rows: list[dict[str, Any]],
    subset_family_ids: list[str],
    output_dir: Path,
) -> dict[str, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    subset_rows = [row for row in benchmark_rows if row["scenario_family_id"] in subset_family_ids]
    benchmark_path = output_dir / "benchmark_core_subset_pass2.jsonl"
    split_manifest_path = output_dir / "split_manifest_core_subset_pass2.json"
    family_manifest_path = output_dir / "core_subset_family_manifest_pass2.json"

    write_jsonl(benchmark_path, subset_rows)

    split_groups: dict[str, list[str]] = {"dev": [], "validation": [], "holdout": []}
    seen = set()
    for row in subset_rows:
        family_id = row["scenario_family_id"]
        if family_id in seen:
            continue
        split_groups[row["split"]].append(family_id)
        seen.add(family_id)
    split_manifest = {
        "package_version": "core_subset_pass2",
        "split_strategy": "scenario_family_level",
        "included_family_count": len(seen),
        "deferred_family_count": 0,
        "deferred_families": [],
        "splits": split_groups,
    }
    split_manifest_path.write_text(json.dumps(split_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    family_manifest = {
        "package_version": "core_subset_pass2",
        "status": "controller_pass2_eval_subset",
        "source_package": "benchmark_core_v0",
        "included_family_count": len(seen),
        "deferred_family_count": 0,
        "included_families": sorted(seen),
        "deferred_bronze_dev_stress_test_families": [],
        "allowed_ingestion_families": sorted([fid for fid in seen if "ingestion" in fid]),
        "notes": [
            "Subset manifest for controller pass 2 strict rescoring.",
            "Uses original frozen Bronze core rows filtered to the overseer-approved family subset.",
        ],
    }
    family_manifest_path.write_text(json.dumps(family_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {
        "benchmark_file": benchmark_path,
        "split_manifest": split_manifest_path,
        "family_manifest": family_manifest_path,
    }
