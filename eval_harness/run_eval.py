from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import re
import statistics
import sys
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any


SYSTEM_PROMPT = (
    "You are a farm chemical first-aid assistant. "
    "Answer in the same language as the user's prompt. "
    "Give only immediate next steps that are short, urgent, and worker-usable. "
    "Use exactly this human-readable format when content exists:\n"
    "STEP 1: ...\n"
    "STEP 2: ...\n"
    "STEP 3: ...\n"
    "DO NOT: ...\n"
    "ESCALATE: ...\n"
    "Omit empty sections if truly not needed. "
    "Do not add explanations, citations, or extra advice."
)

INCIDENT_LABELS = {
    "skin_exposure": "skin exposure",
    "eye_exposure": "eye exposure",
    "inhalation": "inhalation",
    "ingestion": "ingestion",
}

INCIDENT_HINTS = {
    "skin_exposure": [
        "skin",
        "hand",
        "arm",
        "sleeve",
        "shirt",
        "clothing",
        "kulit",
        "tangan",
        "baju",
        "হাত",
        "ত্বক",
        "জামা",
        "lengan",
        "baju kerja",
    ],
    "eye_exposure": ["eye", "mata", "চোখ"],
    "inhalation": [
        "breathed",
        "inhaled",
        "mist",
        "drift",
        "vapour",
        "vapor",
        "spray",
        "nose",
        "chest",
        "terhidu",
        "শ্বাসে",
        "terhirup",
        "hirup",
        "menghirup",
        "sedut",
        "hidung",
        "kabus",
        "kabut",
        "কুয়াশা",
        "uap",
        "semprotan",
    ],
    "ingestion": ["mouth", "swallow", "drank", "drink", "mulut", "muka", "মুখ", "মুখে", "telan"],
}

CHEMICAL_ALIASES = {
    "glyphosate": ["glyphosate", "roundup", "গ্লাইফোসেট", "রাউন্ডআপ"],
    "glufosinate": ["glufosinate", "basta", "গ্লুফোসিনেট", "বাস্টা"],
    "paraquat": ["paraquat", "প্যারাকুয়াট"],
    "24d": ["2,4-d", "24-d", "24d", "2,4 d"],
    "fastac": ["fastac", "alpha-cypermethrin", "cypermethrin", "ফাস্টাক"],
}

HARMFUL_EXTRA_PATTERNS = [
    "induce vomiting",
    "make the person vomit",
    "force vomiting",
    "give milk",
    "give water immediately",
]


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def derive_suffix(benchmark_path: Path) -> str:
    name = benchmark_path.stem
    if name.startswith("benchmark_"):
        return name[len("benchmark_") :]
    return name


def chemical_key_for_family(family_id: str) -> str:
    parts = family_id.split("_")
    return parts[1] if len(parts) > 1 else family_id


def scenario_family_index(path: Path) -> dict[str, dict[str, Any]]:
    families = load_json(path)["scenario_families"]
    return {family["scenario_family_id"]: family for family in families}


def split_index(path: Path) -> dict[str, str]:
    split_manifest = load_json(path)
    result: dict[str, str] = {}
    for split_name, family_ids in split_manifest["splits"].items():
        for family_id in family_ids:
            result[family_id] = split_name
    return result


def family_manifest_set(path: Path) -> set[str]:
    return set(load_json(path)["included_families"])


def validate_dataset_integrity(
    rows: list[dict[str, Any]],
    family_index: dict[str, dict[str, Any]],
    split_lookup: dict[str, str],
    included_families: set[str],
) -> list[str]:
    issues: list[str] = []
    row_ids = [row["row_id"] for row in rows]
    duplicates = [row_id for row_id, count in Counter(row_ids).items() if count > 1]
    if duplicates:
        issues.append(f"Duplicate row_ids found: {duplicates[:20]}")

    missing_family_rows = [row["row_id"] for row in rows if row["scenario_family_id"] not in family_index]
    if missing_family_rows:
        issues.append(f"Rows reference missing scenario families: {missing_family_rows[:20]}")

    excluded_family_rows = [row["row_id"] for row in rows if row["scenario_family_id"] not in included_families]
    if excluded_family_rows:
        issues.append(f"Rows reference non-core families: {excluded_family_rows[:20]}")

    split_mismatch_rows = [
        row["row_id"]
        for row in rows
        if split_lookup.get(row["scenario_family_id"]) != row["split"]
    ]
    if split_mismatch_rows:
        issues.append(f"Rows with split mismatch: {split_mismatch_rows[:20]}")

    families_in_rows = Counter(row["scenario_family_id"] for row in rows)
    for family_id, count in families_in_rows.items():
        if count != 16:
            issues.append(f"Family {family_id} has {count} rows instead of 16")

    families_without_split = [family_id for family_id in families_in_rows if family_id not in split_lookup]
    if families_without_split:
        issues.append(f"Included families missing from split manifest: {families_without_split}")

    return issues


def validate_prompt_rows(
    rows: list[dict[str, Any]],
    family_index: dict[str, dict[str, Any]],
) -> list[dict[str, Any]]:
    failures: list[dict[str, Any]] = []
    for row in rows:
        family = family_index[row["scenario_family_id"]]
        prompt = normalize_text(row["user_prompt"])
        incident_type = family["incident_type"]
        chemical_key = chemical_key_for_family(row["scenario_family_id"])
        aliases = CHEMICAL_ALIASES.get(chemical_key, [chemical_key])
        alias_match = any(alias in prompt for alias in aliases)
        incident_match = any(hint in prompt for hint in INCIDENT_HINTS.get(incident_type, []))

        reasons: list[str] = []
        if not alias_match:
            reasons.append("missing_explicit_chemical_or_product_identity")
        if not incident_match:
            reasons.append("missing_explicit_incident_signal")

        if reasons:
            failures.append(
                {
                    "row_id": row["row_id"],
                    "scenario_family_id": row["scenario_family_id"],
                    "language": row["language"],
                    "prompt_style": row["prompt_style"],
                    "user_prompt": row["user_prompt"],
                    "reasons": reasons,
                    "expected_aliases": aliases,
                    "incident_type": incident_type,
                }
            )
    return failures


def call_openai_compatible(
    *,
    api_base: str,
    api_key: str | None,
    model_name: str,
    user_content: str,
    temperature: float,
    timeout_s: int,
) -> str:
    payload = {
        "model": model_name,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
    }
    req = urllib.request.Request(
        f"{api_base.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {api_key}"} if api_key else {})},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout_s) as response:
        body = json.loads(response.read().decode("utf-8"))
    return body["choices"][0]["message"]["content"].strip()


def normalize_prediction(raw_model_answer: str, language: str) -> dict[str, Any]:
    prediction = {
        "immediate_steps": [],
        "do_not_do": [],
        "escalate_when": [],
        "language": language,
    }
    for line in raw_model_answer.splitlines():
        clean = line.strip()
        if not clean:
            continue
        upper = clean.upper()
        if upper.startswith("STEP "):
            _, _, content = clean.partition(":")
            content = content.strip()
            if content:
                prediction["immediate_steps"].append(content)
        elif upper.startswith("DO NOT"):
            _, _, content = clean.partition(":")
            content = content.strip()
            if content:
                prediction["do_not_do"].append(content)
        elif upper.startswith("ESCALATE"):
            _, _, content = clean.partition(":")
            content = content.strip()
            if content:
                prediction["escalate_when"].append(content)
    return prediction


def grounded_context_from_family(family: dict[str, Any]) -> str:
    lines = [
        f"Chemical/Product: {family.get('chemical_name', family['scenario_family_id'])}",
        f"Incident Type: {INCIDENT_LABELS.get(family['incident_type'], family['incident_type'])}",
        "Minimal SDS-grounded context:",
    ]
    for action in family.get("canonical_actions", [])[:4]:
        lines.append(f"- Immediate action: {action['instruction']}")
    for rule in family.get("do_not_do", [])[:2]:
        lines.append(f"- Do not: {rule['instruction']}")
    for trigger in family.get("escalation_triggers", [])[:2]:
        lines.append(f"- Escalate when: {trigger['required_action']}")
    return "\n".join(lines)


def build_user_content(mode: str, row: dict[str, Any], family: dict[str, Any]) -> str:
    if mode == "baseline":
        return row["user_prompt"]
    if mode == "grounded":
        return (
            f"Worker prompt:\n{row['user_prompt']}\n\n"
            f"{grounded_context_from_family(family)}\n\n"
            "Use the worker prompt plus the SDS-grounded context above. "
            "Respond only in the required STEP/DO NOT/ESCALATE format."
        )
    raise ValueError(f"Unsupported mode: {mode}")


def token_set(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", normalize_text(text)))


def overlap_score(a: str, b: str) -> float:
    aa = token_set(a)
    bb = token_set(b)
    if not aa or not bb:
        return 0.0
    return len(aa & bb) / len(aa | bb)


def score_row(
    row: dict[str, Any],
    family: dict[str, Any],
    normalized_prediction: dict[str, Any],
) -> dict[str, Any]:
    canonical_steps = [item["instruction"] for item in family["canonical_actions"]]
    canonical_donot = [item["instruction"] for item in family.get("do_not_do", [])]
    canonical_escalate = [item["required_action"] for item in family.get("escalation_triggers", [])]
    predicted_steps = normalized_prediction["immediate_steps"]
    predicted_donot = normalized_prediction["do_not_do"]
    predicted_escalate = normalized_prediction["escalate_when"]

    matched_scores = []
    matched_indices = []
    for canonical in canonical_steps:
        best_score = 0.0
        best_idx = None
        for idx, predicted in enumerate(predicted_steps):
            candidate = overlap_score(canonical, predicted)
            if candidate > best_score:
                best_score = candidate
                best_idx = idx
        matched_scores.append(best_score)
        if best_idx is not None and best_score >= 0.25:
            matched_indices.append(best_idx)

    avg_match = statistics.fmean(matched_scores) if matched_scores else 0.0
    missing_actions = sum(score < 0.25 for score in matched_scores)
    extra_steps = max(0, len(predicted_steps) - len(canonical_steps))
    action_correctness = 2 if avg_match >= 0.5 and missing_actions == 0 else 1 if avg_match >= 0.25 else 0

    order_ok = matched_indices == sorted(matched_indices) and len(matched_indices) == len(canonical_steps)
    action_order = 2 if order_ok else 1 if matched_indices == sorted(matched_indices) and matched_indices else 0

    harmful_omission = 2 if missing_actions == 0 else 1 if missing_actions == 1 else 0

    harmful_extra = any(pattern in normalize_text(" ".join(predicted_steps + predicted_donot + predicted_escalate)) for pattern in HARMFUL_EXTRA_PATTERNS)
    unsupported_advice = 2 if extra_steps == 0 and not harmful_extra else 1 if extra_steps <= 1 and not harmful_extra else 0

    language_usability = 2
    if not predicted_steps:
        language_usability = 0
    elif any(len(step.split()) > 18 for step in predicted_steps):
        language_usability = 1

    donot_match = all(any(overlap_score(expected, actual) >= 0.25 for actual in predicted_donot) for expected in canonical_donot) if canonical_donot else True
    escalate_match = all(any(overlap_score(expected, actual) >= 0.25 for actual in predicted_escalate) for expected in canonical_escalate) if canonical_escalate else True
    grounding_match = 2 if donot_match and escalate_match and action_correctness >= 1 else 1 if action_correctness >= 1 else 0

    failure_tags: list[str] = []
    if action_correctness < 2:
        failure_tags.append("action_mismatch")
    if action_order < 2:
        failure_tags.append("order_mismatch")
    if harmful_omission < 2:
        failure_tags.append("harmful_omission")
    if unsupported_advice < 2:
        failure_tags.append("unsupported_advice")
    if language_usability < 2:
        failure_tags.append("language_usability")
    if grounding_match < 2:
        failure_tags.append("grounding_mismatch")

    total_score = (
        action_correctness
        + action_order
        + harmful_omission
        + unsupported_advice
        + language_usability
        + grounding_match
    )
    rationale_bits = []
    if missing_actions:
        rationale_bits.append(f"{missing_actions} canonical step(s) missing")
    if extra_steps:
        rationale_bits.append(f"{extra_steps} extra step(s)")
    if not donot_match and canonical_donot:
        rationale_bits.append("do-not-do mismatch")
    if not escalate_match and canonical_escalate:
        rationale_bits.append("escalation mismatch")
    if not rationale_bits:
        rationale_bits.append("aligned with family truth")

    return {
        "row_id": row["row_id"],
        "scenario_family_id": row["scenario_family_id"],
        "split": row["split"],
        "language": row["language"],
        "incident_type": family["incident_type"],
        "action_correctness": action_correctness,
        "action_order": action_order,
        "harmful_omission": harmful_omission,
        "unsupported_advice": unsupported_advice,
        "language_usability": language_usability,
        "grounding_match": grounding_match,
        "total_score": total_score,
        "failure_tags": failure_tags,
        "judge_rationale_short": "; ".join(rationale_bits),
    }


def summarize_examples(
    scores: list[dict[str, Any]],
    predictions_by_row: dict[str, dict[str, Any]],
    rows_by_id: dict[str, dict[str, Any]],
    limit: int,
    reverse: bool,
) -> list[dict[str, Any]]:
    ordered = sorted(scores, key=lambda item: (item["total_score"], item["row_id"]), reverse=reverse)
    selected = ordered[:limit]
    result = []
    for score in selected:
        row = rows_by_id[score["row_id"]]
        pred = predictions_by_row[score["row_id"]]
        result.append(
            {
                "row_id": score["row_id"],
                "scenario_family_id": score["scenario_family_id"],
                "split": score["split"],
                "language": score["language"],
                "user_prompt": row["user_prompt"],
                "raw_model_answer": pred["raw_model_answer"],
                "total_score": score["total_score"],
                "failure_tags": score["failure_tags"],
            }
        )
    return result


def averages_by(scores: list[dict[str, Any]], key: str) -> dict[str, float]:
    buckets: dict[str, list[int]] = defaultdict(list)
    for score in scores:
        buckets[score[key]].append(score["total_score"])
    return {bucket: round(statistics.fmean(values), 3) for bucket, values in sorted(buckets.items())}


def report_text(
    *,
    mode: str,
    model_name: str,
    rows: list[dict[str, Any]],
    scores: list[dict[str, Any]],
    predictions: list[dict[str, Any]],
    prompt_failures: list[dict[str, Any]],
) -> str:
    if prompt_failures:
        lines = [
            f"# {mode.title()} Eval Report: Core v0",
            "",
            f"- Model used: `{model_name}`",
            "- Status: stopped before model inference",
            f"- Prompt validity failures: {len(prompt_failures)}",
            "",
            "## Invalid Rows",
        ]
        for failure in prompt_failures:
            lines.append(
                f"- `{failure['row_id']}` | `{failure['scenario_family_id']}` | `{failure['language']}` | "
                f"{', '.join(failure['reasons'])} | prompt: {failure['user_prompt']}"
            )
        return "\n".join(lines) + "\n"

    by_row = {item["row_id"]: item for item in predictions}
    rows_by_id = {row["row_id"]: row for row in rows}
    overall_average = round(statistics.fmean(score["total_score"] for score in scores), 3) if scores else 0.0
    unsupported_zero = sum(score["unsupported_advice"] == 0 for score in scores)
    omission_zero = sum(score["harmful_omission"] == 0 for score in scores)
    failure_counts = Counter(tag for score in scores for tag in score["failure_tags"])

    good_examples = summarize_examples(scores, by_row, rows_by_id, limit=5, reverse=True)
    bad_examples = summarize_examples(scores, by_row, rows_by_id, limit=5, reverse=False)
    worst_rows = summarize_examples(scores, by_row, rows_by_id, limit=10, reverse=False)

    lines = [
        f"# {mode.title()} Eval Report: Core v0",
        "",
        f"- Model used: `{model_name}`",
        f"- Rows evaluated: {len(scores)}",
        f"- Overall average total_score: {overall_average}",
        f"- Count of unsupported_advice = 0: {unsupported_zero}",
        f"- Count of harmful_omission = 0: {omission_zero}",
        "",
        "## Average by Split",
    ]
    for key, value in averages_by(scores, "split").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Average by Language"])
    for key, value in averages_by(scores, "language").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Average by Incident Type"])
    for key, value in averages_by(scores, "incident_type").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Average by Scenario Family"])
    for key, value in averages_by(scores, "scenario_family_id").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Top 10 Worst Rows"])
    for item in worst_rows:
        lines.append(
            f"- `{item['row_id']}` | `{item['scenario_family_id']}` | score {item['total_score']} | "
            f"tags: {', '.join(item['failure_tags']) or 'none'}"
        )
    lines.extend(["", "## Five Good Examples"])
    for item in good_examples:
        lines.append(
            f"- `{item['row_id']}` | `{item['scenario_family_id']}` | score {item['total_score']} | "
            f"prompt: {item['user_prompt']} | answer: {item['raw_model_answer']}"
        )
    lines.extend(["", "## Five Bad Examples"])
    for item in bad_examples:
        lines.append(
            f"- `{item['row_id']}` | `{item['scenario_family_id']}` | score {item['total_score']} | "
            f"prompt: {item['user_prompt']} | answer: {item['raw_model_answer']}"
        )
    lines.extend(["", "## Top Recurring Failure Patterns"])
    for tag, count in failure_counts.most_common(10):
        lines.append(f"- `{tag}`: {count}")
    return "\n".join(lines) + "\n"


def build_output_paths(output_dir: Path, benchmark_path: Path, mode: str) -> dict[str, Path]:
    suffix = derive_suffix(benchmark_path)
    return {
        "predictions": output_dir / f"{mode}_predictions_{suffix}.jsonl",
        "scores": output_dir / f"{mode}_scores_{suffix}.jsonl",
        "report": output_dir / f"{mode}_eval_report_{suffix}.md",
    }


def resolve_api_key(api_base: str, explicit_api_key: str | None) -> str | None:
    if explicit_api_key:
        return explicit_api_key
    if api_base.rstrip("/") == "http://localhost:8000/v1":
        return "imayaisanawesomehumanbeignWtihGoodIntellect"
    return None


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def make_run_dir(output_dir: Path, benchmark_path: Path, model_name: str, run_name: str | None) -> Path:
    suffix = derive_suffix(benchmark_path)
    if run_name:
        folder_name = slugify(run_name)
    else:
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"{stamp}_{slugify(model_name)}_{suffix}"
    run_dir = output_dir / folder_name
    run_dir.mkdir(parents=True, exist_ok=True)
    return run_dir


def build_run_output_paths(run_dir: Path, benchmark_path: Path, mode: str) -> dict[str, Path]:
    suffix = derive_suffix(benchmark_path)
    response_dir = run_dir / "responses"
    response_dir.mkdir(parents=True, exist_ok=True)
    return {
        "run_dir": run_dir,
        "responses_dir": response_dir,
        "predictions": run_dir / f"{mode}_predictions_{suffix}.jsonl",
        "scores": run_dir / f"{mode}_scores_{suffix}.jsonl",
        "report": run_dir / f"{mode}_eval_report_{suffix}.md",
        "manifest": run_dir / "run_manifest.json",
    }


def print_progress(done: int, total: int) -> None:
    width = 28
    filled = int(width * done / total) if total else width
    bar = "#" * filled + "-" * (width - filled)
    sys.stderr.write(f"\r[{bar}] {done}/{total}")
    if done == total:
        sys.stderr.write("\n")
    sys.stderr.flush()


def write_row_response(response_dir: Path, row: dict[str, Any], model_name: str, raw_model_answer: str, normalized_prediction: dict[str, Any]) -> None:
    payload = {
        "row_id": row["row_id"],
        "scenario_family_id": row["scenario_family_id"],
        "split": row["split"],
        "language": row["language"],
        "model_name": model_name,
        "user_prompt": row["user_prompt"],
        "raw_model_answer": raw_model_answer,
        "normalized_prediction": normalized_prediction,
    }
    (response_dir / f"{row['row_id']}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def infer_one_row(
    row: dict[str, Any],
    family: dict[str, Any],
    *,
    mode: str,
    api_base: str,
    api_key: str | None,
    model_name: str,
    temperature: float,
    timeout_s: int,
) -> tuple[dict[str, Any], dict[str, Any]]:
    user_content = build_user_content(mode, row, family)
    raw_model_answer = call_openai_compatible(
        api_base=api_base,
        api_key=api_key,
        model_name=model_name,
        user_content=user_content,
        temperature=temperature,
        timeout_s=timeout_s,
    )
    normalized = normalize_prediction(raw_model_answer, row["language"])
    prediction_row = {
        "row_id": row["row_id"],
        "scenario_family_id": row["scenario_family_id"],
        "split": row["split"],
        "language": row["language"],
        "model_name": model_name,
        "raw_model_answer": raw_model_answer,
        "normalized_prediction": normalized,
    }
    return prediction_row, normalized


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run reusable benchmark evals.")
    parser.add_argument("--mode", required=True, choices=["baseline", "grounded"])
    parser.add_argument("--model-name", required=True)
    parser.add_argument("--benchmark-file", required=True)
    parser.add_argument("--split-manifest", required=True)
    parser.add_argument("--family-manifest", required=True)
    parser.add_argument("--scenario-families-file", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--backend", default="openai_compatible", choices=["openai_compatible"])
    parser.add_argument("--api-base", default=os.environ.get("OPENAI_API_BASE", "http://localhost:8000/v1"))
    parser.add_argument("--api-key", default=os.environ.get("OPENAI_API_KEY"))
    parser.add_argument("--temperature", type=float, default=0.0)
    parser.add_argument("--timeout-s", type=int, default=120)
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--run-name")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    benchmark_path = Path(args.benchmark_file)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    outputs = build_output_paths(output_dir, benchmark_path, args.mode)
    api_key = resolve_api_key(args.api_base, args.api_key)

    rows = load_jsonl(benchmark_path)
    family_index = scenario_family_index(Path(args.scenario_families_file))
    split_lookup = split_index(Path(args.split_manifest))
    included_families = family_manifest_set(Path(args.family_manifest))

    integrity_issues = validate_dataset_integrity(rows, family_index, split_lookup, included_families)
    if integrity_issues:
        report = f"# {args.mode.title()} Eval Report: Core v0\n\n## Integrity Errors\n" + "\n".join(f"- {issue}" for issue in integrity_issues) + "\n"
        outputs["report"].write_text(report, encoding="utf-8")
        write_jsonl(outputs["predictions"], [])
        write_jsonl(outputs["scores"], [])
        print("\n".join(integrity_issues), file=sys.stderr)
        return 1

    prompt_failures = validate_prompt_rows(rows, family_index)
    if prompt_failures:
        outputs["report"].write_text(
            report_text(
                mode=args.mode,
                model_name=args.model_name,
                rows=rows,
                scores=[],
                predictions=[],
                prompt_failures=prompt_failures,
            ),
            encoding="utf-8",
        )
        write_jsonl(outputs["predictions"], [])
        write_jsonl(outputs["scores"], [])
        print(json.dumps(prompt_failures, ensure_ascii=False, indent=2), file=sys.stderr)
        return 2

    if args.validate_only:
        print(
            json.dumps(
                {
                    "status": "prompt_validity_passed",
                    "rows": len(rows),
                    "families": len({row["scenario_family_id"] for row in rows}),
                    "benchmark_file": str(benchmark_path),
                },
                ensure_ascii=False,
            )
        )
        return 0

    run_dir = make_run_dir(output_dir, benchmark_path, args.model_name, args.run_name)
    outputs = build_run_output_paths(run_dir, benchmark_path, args.mode)
    outputs["manifest"].write_text(
        json.dumps(
            {
                "mode": args.mode,
                "model_name": args.model_name,
                "benchmark_file": str(benchmark_path),
                "split_manifest": args.split_manifest,
                "family_manifest": args.family_manifest,
                "scenario_families_file": args.scenario_families_file,
                "api_base": args.api_base,
                "workers": args.workers,
                "temperature": args.temperature,
                "timeout_s": args.timeout_s,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    predictions: list[dict[str, Any]] = []
    scores: list[dict[str, Any]] = []
    rows_by_id = {row["row_id"]: row for row in rows}
    completed = 0
    print_progress(completed, len(rows))
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
            future_to_row_id = {
                executor.submit(
                    infer_one_row,
                    row,
                    family_index[row["scenario_family_id"]],
                    mode=args.mode,
                    api_base=args.api_base,
                    api_key=api_key,
                    model_name=args.model_name,
                    temperature=args.temperature,
                    timeout_s=args.timeout_s,
                ): row["row_id"]
                for row in rows
            }
            for future in concurrent.futures.as_completed(future_to_row_id):
                row_id = future_to_row_id[future]
                row = rows_by_id[row_id]
                try:
                    prediction_row, normalized = future.result()
                except urllib.error.URLError as exc:
                    outputs["report"].write_text(
                        (
                            f"# {args.mode.title()} Eval Report: Core v0\n\n"
                            f"- Model used: `{args.model_name}`\n"
                            "- Status: failed during model inference\n"
                            f"- Error: `{exc}`\n"
                            f"- Failed row_id: `{row_id}`\n"
                            f"- Run directory: `{run_dir}`\n"
                        ),
                        encoding="utf-8",
                    )
                    write_jsonl(outputs["predictions"], predictions)
                    write_jsonl(outputs["scores"], scores)
                    print(f"\nModel inference failed at row {row_id}: {exc}", file=sys.stderr)
                    return 3
                predictions.append(prediction_row)
                scores.append(score_row(row, family_index[row["scenario_family_id"]], normalized))
                write_row_response(outputs["responses_dir"], row, args.model_name, prediction_row["raw_model_answer"], normalized)
                completed += 1
                print_progress(completed, len(rows))
    except KeyboardInterrupt:
        write_jsonl(outputs["predictions"], predictions)
        write_jsonl(outputs["scores"], scores)
        print("\nInterrupted; partial outputs written.", file=sys.stderr)
        return 130

    predictions.sort(key=lambda item: item["row_id"])
    scores.sort(key=lambda item: item["row_id"])

    write_jsonl(outputs["predictions"], predictions)
    write_jsonl(outputs["scores"], scores)
    outputs["report"].write_text(
        report_text(
            mode=args.mode,
            model_name=args.model_name,
            rows=rows,
            scores=scores,
            predictions=predictions,
            prompt_failures=[],
        ),
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))



# python3 -m eval_harness.run_eval \
#   --mode baseline \
#   --model-name google/gemma-4-31B-it \
#   --benchmark-file benchmark_v0/benchmark_core_v0.jsonl \
#   --split-manifest benchmark_v0/split_manifest_core_v0.json \
#   --family-manifest benchmark_v0/core_v0_family_manifest.json \
#   --scenario-families-file benchmark_v0/scenario_families_v0.json \
#   --output-dir eval_outputs


# python run_eval.py \
#   --mode baseline \
#   --model-name google/gemma-4-31B-it \
#   --benchmark-file ../benchmark_v0/benchmark_core_v0.jsonl \
#   --split-manifest ../benchmark_v0/split_manifest_core_v0.json \
#   --family-manifest ../benchmark_v0/core_v0_family_manifest.json \
#   --scenario-families-file ../benchmark_v0/scenario_families_v0.json \
#   --output-dir eval_outputs
