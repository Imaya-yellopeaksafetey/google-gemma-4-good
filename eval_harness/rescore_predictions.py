from __future__ import annotations

import argparse
import concurrent.futures
import json
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from llm_judge import AzureLLMJudge, JUDGE_VERSION
from score_code import (
    family_manifest_set,
    load_json,
    load_jsonl,
    old_code_total,
    scenario_family_index,
    score_code_row,
    split_index,
    validate_prediction_inputs,
)


def print_progress(done: int, total: int) -> None:
    width = 28
    filled = int(width * done / total) if total else width
    bar = "#" * filled + "-" * (width - filled)
    sys.stderr.write(f"\r[{bar}] {done}/{total}")
    if done == total:
        sys.stderr.write("\n")
    sys.stderr.flush()


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def averages_by(scores: list[dict[str, Any]], key: str, metric: str) -> dict[str, float]:
    buckets: dict[str, list[float]] = defaultdict(list)
    for row in scores:
        buckets[row[key]].append(row[metric])
    return {bucket: round(statistics.fmean(values), 3) for bucket, values in sorted(buckets.items())}


def summarize_examples(scores: list[dict[str, Any]], predictions: dict[str, dict[str, Any]], benchmark: dict[str, dict[str, Any]], limit: int, reverse: bool) -> list[dict[str, Any]]:
    ordered = sorted(scores, key=lambda item: (item["hybrid_total_100"], item["row_id"]), reverse=reverse)
    selected = ordered[:limit]
    result = []
    for row in selected:
        pred = predictions[row["row_id"]]
        bench = benchmark[row["row_id"]]
        result.append(
            {
                "row_id": row["row_id"],
                "scenario_family_id": row["scenario_family_id"],
                "hybrid_total_100": row["hybrid_total_100"],
                "failure_tags": row["failure_tags"],
                "prompt": bench["user_prompt"],
                "answer": pred["raw_model_answer"],
            }
        )
    return result


def build_hybrid_report(mode: str, model_name: str, scores: list[dict[str, Any]], predictions: dict[str, dict[str, Any]], benchmark: dict[str, dict[str, Any]]) -> str:
    overall_100 = round(statistics.fmean(row["hybrid_total_100"] for row in scores), 3)
    overall_12 = round(statistics.fmean(row["hybrid_total_12"] for row in scores), 3)
    failure_counts = Counter(tag for row in scores for tag in row["failure_tags"])
    good_examples = summarize_examples(scores, predictions, benchmark, 5, True)
    bad_examples = summarize_examples(scores, predictions, benchmark, 5, False)
    lines = [
        f"# LLM Judged {mode.capitalize()} Eval Report: Core v0",
        "",
        f"- Model used: `{model_name}`",
        f"- Judge version: `{JUDGE_VERSION}`",
        f"- Rows evaluated: {len(scores)}",
        f"- Overall average hybrid_total_100: {overall_100}",
        f"- Overall average hybrid_total_12: {overall_12}",
        "",
        "## Average by Split",
    ]
    for key, value in averages_by(scores, "split", "hybrid_total_100").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Average by Language"])
    for key, value in averages_by(scores, "language", "hybrid_total_100").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Average by Incident Type"])
    for key, value in averages_by(scores, "incident_type", "hybrid_total_100").items():
        lines.append(f"- `{key}`: {value}")
    lines.extend(["", "## Top Recurring Failure Patterns"])
    for tag, count in failure_counts.most_common(10):
        lines.append(f"- `{tag}`: {count}")
    lines.extend(["", "## Five Good Examples"])
    for item in good_examples:
        lines.append(f"- `{item['row_id']}` | `{item['scenario_family_id']}` | score {item['hybrid_total_100']:.2f} | tags: {', '.join(item['failure_tags']) or 'none'}")
    lines.extend(["", "## Five Bad Examples"])
    for item in bad_examples:
        lines.append(f"- `{item['row_id']}` | `{item['scenario_family_id']}` | score {item['hybrid_total_100']:.2f} | tags: {', '.join(item['failure_tags']) or 'none'}")
    return "\n".join(lines) + "\n"


def build_comparison_note(old_rows: dict[str, int], repaired_rows: dict[str, dict[str, Any]], hybrid_rows: list[dict[str, Any]]) -> str:
    old_avg = statistics.fmean(old_rows.values()) if old_rows else 0.0
    repaired_avg = statistics.fmean(row["total_score"] for row in repaired_rows.values()) if repaired_rows else None
    hybrid_avg = statistics.fmean(row["hybrid_total_100"] for row in hybrid_rows) if hybrid_rows else 0.0
    lines = [
        "# Scorer Comparison Note",
        "",
        f"- Old code scorer average (0-12): {old_avg:.3f}",
        (
            f"- Repaired code scorer average (0-12): {repaired_avg:.3f}"
            if repaired_avg is not None
            else "- Repaired code scorer average (0-12): unavailable in this output_dir"
        ),
        f"- New hybrid scorer average (0-100): {hybrid_avg:.3f}",
        "",
        "Old code scorer:",
        "- purely lexical and weak on non-Latin scripts",
        "",
        "Repaired code scorer:",
        "- Unicode-aware and stricter on unsupported additions, but still deterministic only",
        "",
        "New hybrid scorer:",
        "- deterministic code checks for order and unsupported advice",
        "- Azure semantic judge for correctness, omission, language usability, and grounding",
        "- official benchmark score is `hybrid_total_100`",
        "",
        "Interpretation:",
        "- use hybrid totals as the official comparison score for baseline-vs-grounded evaluation",
        "- keep `hybrid_total_12` only for continuity with earlier reports",
    ]
    if repaired_avg is None:
        lines.extend(
            [
                "",
                "Note:",
                "- `baseline_scores_core_v0.jsonl` was not present in the supplied `output_dir`, so the repaired deterministic comparison point could not be computed for this run.",
            ]
        )
    return "\n".join(lines) + "\n"


def build_blocked_comparison_note(old_rows: dict[str, int], repaired_rows: dict[str, dict[str, Any]]) -> str:
    old_avg = statistics.fmean(old_rows.values()) if old_rows else 0.0
    repaired_avg = statistics.fmean(row["total_score"] for row in repaired_rows.values()) if repaired_rows else 0.0
    return (
        "# Scorer Comparison Note\n\n"
        f"- Old code scorer average (0-12): {old_avg:.3f}\n"
        f"- Repaired code scorer average (0-12): {repaired_avg:.3f}\n"
        "- New hybrid scorer: not computed because Azure judge env vars were missing.\n\n"
        "What is still available:\n"
        "- existing Gemma predictions were preserved under `gemma_responses/`\n"
        "- repaired code scorer outputs remain available in `baseline_scores_core_v0.jsonl`\n"
        "- hybrid scoring can be rerun as soon as `MODEL_API_KEY`, `MODEL_ENDPOINT`, `MODEL_DEPLOYMENT`, and `MODEL_API_VERSION` are set\n"
    )


def export_gemma_responses(predictions: list[dict[str, Any]], response_dir: Path) -> None:
    response_dir.mkdir(parents=True, exist_ok=True)
    for prediction in predictions:
        (response_dir / f"{prediction['row_id']}.json").write_text(json.dumps(prediction, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Official hybrid scoring entrypoint.")
    parser.add_argument("--mode", default="baseline", choices=["baseline", "grounded"])
    parser.add_argument("--model-name", required=True)
    parser.add_argument("--benchmark-file", required=True)
    parser.add_argument("--split-manifest", required=True)
    parser.add_argument("--family-manifest", required=True)
    parser.add_argument("--scenario-families-file", required=True)
    parser.add_argument("--rubric-file", required=True)
    parser.add_argument("--predictions-file", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--workers", type=int, default=1)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    judged_scores_path = output_dir / f"llm_judged_{args.mode}_scores_core_v0.jsonl"
    judged_report_path = output_dir / f"llm_judged_{args.mode}_eval_report_core_v0.md"
    comparison_note_path = output_dir / "scorer_comparison_note.md"
    cache_path = output_dir / "judge_cache.jsonl"
    gemma_response_dir = output_dir / "gemma_responses"
    judge_response_dir = output_dir / "judge_responses"

    print(f"[hybrid] mode={args.mode} model={args.model_name}")
    print(f"[hybrid] benchmark={args.benchmark_file}")
    print(f"[hybrid] predictions={args.predictions_file}")
    print(f"[hybrid] output_dir={output_dir}")

    benchmark_rows = load_jsonl(Path(args.benchmark_file))
    predictions = load_jsonl(Path(args.predictions_file))
    family_index = scenario_family_index(Path(args.scenario_families_file))
    split_lookup = split_index(Path(args.split_manifest))
    included_families = family_manifest_set(Path(args.family_manifest))
    issues = validate_prediction_inputs(benchmark_rows, predictions, family_index, split_lookup, included_families)
    if issues:
        judged_report_path.write_text("# Hybrid Scoring Blocked\n\n" + "\n".join(f"- {issue}" for issue in issues) + "\n", encoding="utf-8")
        write_jsonl(judged_scores_path, [])
        if not cache_path.exists():
            cache_path.write_text("", encoding="utf-8")
        print("[hybrid] blocked: input validation failed")
        print(f"[hybrid] wrote report: {judged_report_path}")
        print("\n".join(issues), file=sys.stderr)
        return 1

    benchmark_by_id = {row["row_id"]: row for row in benchmark_rows}
    predictions_by_id = {row["row_id"]: row for row in predictions}
    export_gemma_responses(predictions, gemma_response_dir)
    old_rows = {}
    for prediction in predictions:
        row = benchmark_by_id[prediction["row_id"]]
        family = family_index[row["scenario_family_id"]]
        old_rows[row["row_id"]] = old_code_total(row, family, prediction["normalized_prediction"])
    repaired_code_rows = {row["row_id"]: row for row in load_jsonl(output_dir / "baseline_scores_core_v0.jsonl")} if (output_dir / "baseline_scores_core_v0.jsonl").exists() else {}

    rubric_text = Path(args.rubric_file).read_text(encoding="utf-8")
    try:
        judge = AzureLLMJudge(cache_path, judge_response_dir, rubric_text)
    except RuntimeError as exc:
        judged_report_path.write_text(
            "# Hybrid Scoring Blocked\n\n"
            "- Azure judge environment is not configured.\n"
            "- Required env vars: `MODEL_API_KEY`, `MODEL_ENDPOINT`, `MODEL_DEPLOYMENT`, `MODEL_API_VERSION`\n"
            f"- Error: `{exc}`\n",
            encoding="utf-8",
        )
        write_jsonl(judged_scores_path, [])
        if not cache_path.exists():
            cache_path.write_text("", encoding="utf-8")
        comparison_note_path.write_text(build_blocked_comparison_note(old_rows, repaired_code_rows), encoding="utf-8")
        print("[hybrid] blocked: Azure judge environment is not configured")
        print(f"[hybrid] wrote report: {judged_report_path}")
        print(f"[hybrid] wrote comparison note: {comparison_note_path}")
        print(f"[hybrid] cache path: {cache_path}")
        return 2

    hybrid_rows: list[dict[str, Any]] = []

    def score_prediction(prediction: dict[str, Any]) -> dict[str, Any]:
        row = benchmark_by_id[prediction["row_id"]]
        family = family_index[row["scenario_family_id"]]
        code_eval = score_code_row(row, family, prediction["normalized_prediction"])
        judge_payload = {
            "user_prompt": row["user_prompt"],
            "raw_model_answer": prediction["raw_model_answer"],
            "normalized_prediction": prediction["normalized_prediction"],
            "accepted_answer_rendering": row.get("answer_rendering", []),
            "canonical_actions": family["canonical_actions"],
            "do_not_do": family.get("do_not_do", []),
            "escalation_triggers": family.get("escalation_triggers", []),
            "incident_type": family["incident_type"],
            "chemical_name": family.get("chemical_name", ""),
            "rubric_focus": [
                "action_correctness",
                "harmful_omission",
                "language_usability",
                "grounding_match",
            ],
        }
        judge_result = judge.judge_row(row["row_id"], judge_payload)
        code_subscore = code_eval["code_action_order"] + code_eval["code_unsupported_advice"]
        llm_subscore = (
            judge_result["action_correctness"]
            + judge_result["harmful_omission"]
            + judge_result["language_usability"]
            + judge_result["grounding_match"]
        )
        code_component = (code_subscore / 4) * 35
        llm_component = (llm_subscore / 8) * 65
        hybrid_total_100 = code_component + llm_component
        hybrid_total_12 = (hybrid_total_100 / 100) * 12
        failure_tags = sorted(set(code_eval["failure_tags"] + judge_result.get("failure_tags", []) + code_eval["hard_flags"]))
        return {
            "row_id": row["row_id"],
            "scenario_family_id": row["scenario_family_id"],
            "split": row["split"],
            "language": row["language"],
            "incident_type": family["incident_type"],
            "code_action_order": code_eval["code_action_order"],
            "code_unsupported_advice": code_eval["code_unsupported_advice"],
            "llm_action_correctness": judge_result["action_correctness"],
            "llm_harmful_omission": judge_result["harmful_omission"],
            "llm_language_usability": judge_result["language_usability"],
            "llm_grounding_match": judge_result["grounding_match"],
            "judge_version": JUDGE_VERSION,
            "code_component": round(code_component, 3),
            "llm_component": round(llm_component, 3),
            "hybrid_total_100": round(hybrid_total_100, 3),
            "hybrid_total_12": round(hybrid_total_12, 3),
            "hard_flags": code_eval["hard_flags"],
            "failure_tags": failure_tags,
            "judge_rationale_short": judge_result["short_rationale"],
        }

    print(f"[hybrid] judging {len(predictions)} rows")
    print_progress(0, len(predictions))
    if args.workers <= 1:
        for idx, prediction in enumerate(predictions, start=1):
            hybrid_rows.append(score_prediction(prediction))
            print_progress(idx, len(predictions))
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_map = {executor.submit(score_prediction, prediction): prediction["row_id"] for prediction in predictions}
            done = 0
            for future in concurrent.futures.as_completed(future_map):
                hybrid_rows.append(future.result())
                done += 1
                print_progress(done, len(predictions))

    hybrid_rows.sort(key=lambda item: item["row_id"])
    write_jsonl(judged_scores_path, hybrid_rows)
    judged_report_path.write_text(build_hybrid_report(args.mode, args.model_name, hybrid_rows, predictions_by_id, benchmark_by_id), encoding="utf-8")

    comparison_note_path.write_text(build_comparison_note(old_rows, repaired_code_rows, hybrid_rows), encoding="utf-8")
    overall_100 = statistics.fmean(row["hybrid_total_100"] for row in hybrid_rows) if hybrid_rows else 0.0
    overall_12 = statistics.fmean(row["hybrid_total_12"] for row in hybrid_rows) if hybrid_rows else 0.0
    print("[hybrid] completed successfully")
    print(f"[hybrid] scores file: {judged_scores_path}")
    print(f"[hybrid] report file: {judged_report_path}")
    print(f"[hybrid] comparison note: {comparison_note_path}")
    print(f"[hybrid] judge cache: {cache_path}")
    print(f"[hybrid] averages: hybrid_total_100={overall_100:.3f}, hybrid_total_12={overall_12:.3f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


# Azure judge setup:
# 1. Copy `.env.example` to `.env` locally or export the variables in your shell.
# 2. Set only these env vars for the judge path:
#    - MODEL_API_KEY
#    - MODEL_ENDPOINT
#    - MODEL_DEPLOYMENT
#    - MODEL_API_VERSION
# 3. `llm_judge.py` reads only those env vars and `rescore_predictions.py`
#    will block cleanly if any are missing.



# python rescore_predictions.py \
#   --mode grounded \
#   --model-name google/gemma-4-31B-it \
#   --benchmark-file ../benchmark_v0/benchmark_core_v0.jsonl \
#   --split-manifest ../benchmark_v0/split_manifest_core_v0.json \
#   --family-manifest ../benchmark_v0/core_v0_family_manifest.json \
#   --scenario-families-file ../benchmark_v0/scenario_families_v0.json \
#   --rubric-file ../benchmark_v0/rubric_v0.md \
#   --predictions-file eval_outputs/bronze-core-v0-grounded-first/grounded_predictions_core_v0.jsonl \
#   --output-dir eval_harness/eval_outputs
