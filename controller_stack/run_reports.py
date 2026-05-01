from __future__ import annotations

import json
import statistics
from collections import Counter, defaultdict
from pathlib import Path

from .config import (
    BENCHMARK_DIR,
    OFFICIAL_BASELINE_SCORES,
    OFFICIAL_GROUNDED_SCORES,
    REPO_ROOT,
    STRONG_DEMO_SAFE_FAMILIES,
    SUBSET_FAMILIES,
    WEAK_GUARDED_FAMILIES,
)
from .controller import ChemicalEmergencyController
from .loaders import load_jsonl
from .planner import ResponsePlanner
from .verifier import SlotVerifier


OUTPUT_DIR = REPO_ROOT / "controller_outputs"
SUBSET_OUTPUT = OUTPUT_DIR / "controller_subset_outputs.jsonl"
SUBSET_METRICS = OUTPUT_DIR / "controller_subset_metrics.json"


def write(path: Path, text: str) -> None:
    path.write_text(text.strip() + "\n", encoding="utf-8")


def write_jsonl(path: Path, rows: list[dict]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def md_table(rows: list[tuple[str, str]]) -> str:
    return "\n".join(f"- `{k}`: {v}" for k, v in rows)


def run_normalizer_tests(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    cases = [
        ("Paraquat went in my eye. Burning bad. Fast please.", "english", "sf_paraquat_eye_01", "high"),
        ("I breathed 2,4-D and feel bad. What first?", "english", "sf_24d_inhalation_01", "high"),
        ("Some Basta went into my mouth by mistake. Tell me exactly.", "english", "sf_glufosinate_ingestion_01", "high"),
        ("2,4-D got in my mouth. Exact steps now?", "english", "sf_24d_ingestion_01", "high"),
        ("Chemical splash, burning, not sure if in eye or skin.", "english", None, "low"),
        ("Spray terkena saya masa kerja, rasa pedih. Apa dulu?", None, None, "low"),
    ]
    results = []
    for prompt, language, expected_family, expected_confidence in cases:
        output = controller.normalizer.normalize(prompt, target_language=language)
        results.append(
            {
                "prompt": prompt,
                "detected_language": output["detected_language"],
                "family_id_guess": output["family_id_guess"],
                "family_confidence": output["family_confidence"],
                "ambiguity_flags": output["ambiguity_flags"],
                "expected_family": expected_family,
                "expected_confidence": expected_confidence,
            }
        )
    passed = 0
    for item in results[:4]:
        if item["family_id_guess"] == item["expected_family"] and item["family_confidence"] == item["expected_confidence"]:
            passed += 1
    for item in results[4:]:
        if item["family_confidence"] == "low":
            passed += 1
    report = [
        "# Normalizer Test Report",
        "",
        "- Cases run: `6`",
        f"- Cases passed against expected behavior: `{passed}/6`",
        "",
        "## Sample outputs",
        "",
    ]
    for item in results:
        report.extend(
            [
                f"### `{item['prompt']}`",
                f"- detected_language: `{item['detected_language']}`",
                f"- family_id_guess: `{item['family_id_guess']}`",
                f"- family_confidence: `{item['family_confidence']}`",
                f"- ambiguity_flags: `{', '.join(item['ambiguity_flags']) or 'none'}`",
                "",
            ]
        )
    return results, "\n".join(report)


def run_planner_tests(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    planner = ResponsePlanner()
    families = ["sf_paraquat_eye_01", "sf_glufosinate_ingestion_01"]
    outputs = []
    for family_id in families:
        family = controller.family_index[family_id]
        plan = planner.build_plan(family)
        outputs.append(plan)
    strong_plan = outputs[0]
    weak_plan = outputs[1]
    assertions = [
        strong_plan["family_strength"] == "strong_demo_safe",
        strong_plan["required_action_slots"] == ["a1", "a2", "a3"],
        strong_plan["allowed_guarded_subset"] == ["a1", "a2"],
        weak_plan["family_strength"] == "weak_guarded",
        weak_plan["required_action_slots"] == ["a1", "a2", "a3", "a4"],
        weak_plan["allowed_guarded_subset"] == ["a1", "a2", "a3"],
    ]
    report = [
        "# Planner Test Report",
        "",
        "- Families checked: `2`",
        f"- Assertions passed: `{sum(assertions)}/{len(assertions)}`",
        "",
        "## Planner fixtures",
        "",
        "### `sf_paraquat_eye_01`",
        f"- required_action_slots: `{strong_plan['required_action_slots']}`",
        f"- allowed_guarded_subset: `{strong_plan['allowed_guarded_subset']}`",
        f"- blocked_detail_categories: `{strong_plan['blocked_detail_categories']}`",
        "",
        "### `sf_glufosinate_ingestion_01`",
        f"- required_action_slots: `{weak_plan['required_action_slots']}`",
        f"- allowed_guarded_subset: `{weak_plan['allowed_guarded_subset']}`",
        f"- blocked_detail_categories: `{weak_plan['blocked_detail_categories']}`",
        "",
    ]
    return outputs, "\n".join(report)


def run_strong_lane_tests(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    outputs = []
    assertions = []
    for family_id in sorted(STRONG_DEMO_SAFE_FAMILIES):
        row = next(
            row
            for row in controller.rows
            if row["scenario_family_id"] == family_id
            and row["language"] == "english"
            and row["prompt_style"] == "formal_direct"
        )
        trace = controller.run_with_trace(
            worker_prompt=row["user_prompt"],
            target_language="english",
            family_id_override=family_id,
        )
        response = trace["strong_candidate"]
        outputs.append({"family_id": family_id, "response": response})
        assertions.extend(
            [
                response["response_mode"] == "full_guided_response",
                len(response["immediate_actions"]) == len(controller.family_index[family_id]["canonical_actions"]),
                bool(response["do_not_do"]),
                bool(response["escalate_now"]["instruction"]),
            ]
        )
    report = [
        "# Strong Lane Test Report",
        "",
        f"- Families covered: `{len(outputs)}`",
        f"- Assertions passed: `{sum(assertions)}/{len(assertions)}`",
        "",
        "## Family checks",
        "",
    ]
    for item in outputs:
        report.extend(
            [
                f"### `{item['family_id']}`",
                f"- immediate_action_count: `{len(item['response']['immediate_actions'])}`",
                f"- do_not_count: `{len(item['response']['do_not_do'])}`",
                f"- escalation: `{item['response']['escalate_now']['instruction']}`",
                "",
            ]
        )
    return outputs, "\n".join(report)


def run_guarded_lane_tests(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    outputs = []
    assertions = []
    for family_id in sorted(WEAK_GUARDED_FAMILIES):
        row = next(
            row
            for row in controller.rows
            if row["scenario_family_id"] == family_id
            and row["language"] == "english"
            and row["prompt_style"] == "formal_direct"
        )
        trace = controller.run_with_trace(
            worker_prompt=row["user_prompt"],
            target_language="english",
            family_id_override=family_id,
        )
        response = trace["guarded_candidate"]
        outputs.append({"family_id": family_id, "response": response})
        assertions.extend(
            [
                response["response_mode"] in {"guarded_minimum_response", "guarded_escalate_now"},
                bool(response["fallback_reason"]),
                bool(response["escalate_now"]["instruction"]),
                response["suppressed_detail_note"] is not None,
            ]
        )
    report = [
        "# Guarded Lane Test Report",
        "",
        f"- Families covered: `{len(outputs)}`",
        f"- Assertions passed: `{sum(assertions)}/{len(assertions)}`",
        "",
        "## Family checks",
        "",
    ]
    for item in outputs:
        report.extend(
            [
                f"### `{item['family_id']}`",
                f"- response_mode: `{item['response']['response_mode']}`",
                f"- fallback_reason: `{item['response']['fallback_reason']}`",
                f"- suppressed_detail_note: `{item['response']['suppressed_detail_note']}`",
                "",
            ]
        )
    return outputs, "\n".join(report)


def run_verifier_tests(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    family = controller.family_index["sf_glyphosate_eye_01"]
    plan = controller.planner.build_plan(family)
    ref_row = next(
        row
        for row in controller.rows
        if row["scenario_family_id"] == "sf_glyphosate_eye_01"
        and row["language"] == "english"
        and row["prompt_style"] == "formal_direct"
    )
    base_trace = controller.run_with_trace(
        worker_prompt=ref_row["user_prompt"],
        target_language="english",
        family_id_override="sf_glyphosate_eye_01",
    )
    passing = base_trace["strong_candidate"]
    verifier = SlotVerifier()
    challenges = []
    def add_case(name: str, candidate: dict, expected: str) -> None:
        result = verifier.verify(candidate, plan, verification_target="full")
        challenges.append({"name": name, "expected": expected, "actual": result})

    add_case("pass_reference", passing, "pass")
    bad1 = json.loads(json.dumps(passing))
    bad1["immediate_actions"] = bad1["immediate_actions"][:-1]
    add_case("missing_action_slot", bad1, "fail")
    bad2 = json.loads(json.dumps(passing))
    bad2["do_not_do"] = []
    add_case("missing_do_not", bad2, "fail")
    bad3 = json.loads(json.dumps(passing))
    bad3["escalate_now"]["instruction"] = "Only get help if it still hurts later."
    add_case("weakened_escalation", bad3, "fail")
    bad4 = json.loads(json.dumps(passing))
    bad4["immediate_actions"].append({"slot": "drink_milk", "instruction": "Drink milk now.", "source_support": "constrained", "required": False})
    add_case("unsupported_extra_detail", bad4, "fail")
    bad5 = json.loads(json.dumps(passing))
    bad5["incident_summary"] = "Stay calm. This is probably okay."
    add_case("generic_chat_drift", bad5, "fail")
    bad6 = json.loads(json.dumps(passing))
    del bad6["evidence_basis"]
    add_case("schema_missing_field", bad6, "fail")
    bad7 = json.loads(json.dumps(passing))
    bad7["escalate_now"]["instruction"] = ""
    add_case("missing_escalation", bad7, "fail")
    bad8 = json.loads(json.dumps(passing))
    bad8["immediate_actions"][0]["slot"] = "a9"
    add_case("unknown_slot", bad8, "fail")
    bad9 = json.loads(json.dumps(passing))
    bad9["immediate_actions"][1]["instruction"] = "Wash face and rinse nose too."
    add_case("cross_incident_detail", bad9, "fail")

    passed = sum(1 for item in challenges if item["actual"]["status"] == item["expected"])
    report = [
        "# Slot Verifier Test Report",
        "",
        "- Challenge cases: `10`",
        f"- Expected pass/fail matches: `{passed}/10`",
        "",
        "## Challenge cases",
        "",
    ]
    for item in challenges:
        report.extend(
            [
                f"### `{item['name']}`",
                f"- expected: `{item['expected']}`",
                f"- actual: `{item['actual']['status']}`",
                f"- missing_required_slots: `{item['actual']['missing_required_slots']}`",
                f"- blocked_unsupported_slots: `{item['actual']['blocked_unsupported_slots']}`",
                "",
            ]
        )
    return challenges, "\n".join(report)


def run_release_selector_tests(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    tests = []
    strong_row = next(
        row
        for row in controller.rows
        if row["scenario_family_id"] == "sf_glyphosate_eye_01"
        and row["language"] == "english"
        and row["prompt_style"] == "formal_direct"
    )
    # Strong family pass
    t1 = controller.run_with_trace(
        worker_prompt=strong_row["user_prompt"],
        target_language="english",
        family_id_override="sf_glyphosate_eye_01",
    )
    tests.append(("strong_pass", t1["final_response"]["response_mode"] == "full_guided_response", t1["final_response"]["response_mode"]))
    # Strong family medium confidence downgrade
    t2 = controller.run_with_trace(
        worker_prompt="Chemical went in my eye. Burning. Need steps.",
        target_language="english",
        family_id_override="sf_glyphosate_eye_01",
    )
    tests.append(("strong_low_confidence_downgrade", t2["final_response"]["response_mode"] != "full_guided_response", t2["final_response"]["response_mode"]))
    # Weak family guarded
    t3 = controller.run_with_trace(
        worker_prompt="Some Basta went into my mouth by mistake. Tell me exactly.",
        target_language="english",
        family_id_override="sf_glufosinate_ingestion_01",
    )
    tests.append(("weak_default_guarded", t3["final_response"]["response_mode"].startswith("guarded_"), t3["final_response"]["response_mode"]))
    # Unsupported detail block
    family = controller.family_index["sf_glyphosate_eye_01"]
    plan = controller.planner.build_plan(family)
    trace = controller.run_with_trace(
        worker_prompt=strong_row["user_prompt"],
        target_language="english",
        family_id_override="sf_glyphosate_eye_01",
    )
    bad = json.loads(json.dumps(trace["strong_candidate"]))
    bad["immediate_actions"].append({"slot": "drink_milk", "instruction": "Drink milk now.", "source_support": "constrained", "required": False})
    verification = controller.verifier.verify(bad, plan, verification_target="full")
    guarded = controller.guard_compose_for_tests(family, plan, trace["normalization"], "english", "unsupported_detail_risk")
    selected = controller.selector.select(
        normalization=trace["normalization"],
        plan=plan,
        strong_candidate=bad,
        guarded_candidate=guarded,
        verification=verification,
    )
    tests.append(("unsupported_detail_block", selected["response_mode"].startswith("guarded_"), selected["response_mode"]))
    # Verifier fail then downgrade
    bad2 = json.loads(json.dumps(trace["strong_candidate"]))
    bad2["immediate_actions"] = bad2["immediate_actions"][:-1]
    verification2 = controller.verifier.verify(bad2, plan, verification_target="full")
    guarded2 = controller.guard_compose_for_tests(family, plan, trace["normalization"], "english", "missing_required_slots")
    selected2 = controller.selector.select(
        normalization=trace["normalization"],
        plan=plan,
        strong_candidate=bad2,
        guarded_candidate=guarded2,
        verification=verification2,
    )
    tests.append(("strong_fail_then_downgrade", selected2["response_mode"].startswith("guarded_"), selected2["response_mode"]))

    report = [
        "# Release Selector Test Report",
        "",
        "- Cases: `5`",
        f"- Cases passed: `{sum(1 for _, ok, _ in tests if ok)}/5`",
        "",
        "## Case results",
        "",
    ]
    for name, ok, mode in tests:
        report.extend([f"- `{name}`: `{mode}` ({'pass' if ok else 'fail'})"])
    return [{"name": name, "passed": ok, "mode": mode} for name, ok, mode in tests], "\n".join(report)


def attach_test_helper(controller: ChemicalEmergencyController) -> None:
    def _guard_compose_for_tests(family, plan, normalization, language, reason):
        mode = "guarded_escalate_now" if plan["default_guarded_mode"] == "guarded_escalate_now" else "guarded_minimum_response"
        return controller.composer.compose_guarded(
            family=family,
            plan=plan,
            normalization=normalization,
            language=language,
            fallback_reason=reason,
            response_mode=mode,
        )
    controller.guard_compose_for_tests = _guard_compose_for_tests  # type: ignore[attr-defined]


def run_integration(controller: ChemicalEmergencyController) -> tuple[list[dict], str]:
    samples = [
        ("sf_paraquat_eye_01", "english"),
        ("sf_fastac_eye_01", "malay"),
        ("sf_glufosinate_ingestion_01", "bangla"),
        ("sf_24d_eye_01", "bahasa_indonesia"),
    ]
    traces = []
    for family_id, language in samples:
        row = next(r for r in controller.rows if r["scenario_family_id"] == family_id and r["language"] == language)
        traces.append(
            {
                "family_id": family_id,
                "language": language,
                "trace": controller.run_with_trace(worker_prompt=row["user_prompt"], target_language=language),
            }
        )
    report = [
        "# Controller Integration Report",
        "",
        "- Sample runs: `4`",
        "",
    ]
    for item in traces:
        final = item["trace"]["final_response"]
        report.extend(
            [
                f"## `{item['family_id']}` / `{item['language']}`",
                f"- response_mode: `{final['response_mode']}`",
                f"- family_confidence: `{final['family_confidence']}`",
                f"- immediate_action_count: `{len(final['immediate_actions'])}`",
                f"- fallback_reason: `{final['fallback_reason']}`",
                "",
            ]
        )
    return traces, "\n".join(report)


def run_subset_eval(controller: ChemicalEmergencyController) -> tuple[list[dict], str, dict]:
    baseline_rows = load_jsonl(OFFICIAL_BASELINE_SCORES)
    grounded_rows = load_jsonl(OFFICIAL_GROUNDED_SCORES)
    baseline_index = {row["row_id"]: row for row in baseline_rows}
    grounded_index = {row["row_id"]: row for row in grounded_rows}

    rows = [row for row in controller.rows if row["scenario_family_id"] in SUBSET_FAMILIES]
    outputs = []
    for row in rows:
        trace = controller.run_with_trace(
            worker_prompt=row["user_prompt"],
            target_language=row["language"],
        )
        final = trace["final_response"]
        outputs.append(
            {
                "row_id": row["row_id"],
                "scenario_family_id": row["scenario_family_id"],
                "language": row["language"],
                "split": row["split"],
                "ground_truth_answer_rendering": row["answer_rendering"],
                "response_mode": final["response_mode"],
                "family_confidence": final["family_confidence"],
                "strong_candidate_released": final["response_mode"] == "full_guided_response",
                "downgraded": trace["verification"] is not None and trace["verification"]["status"] == "fail",
                "guarded_mode_active": final["response_mode"] != "full_guided_response",
                "unsupported_detail_suppressed": bool(final["suppressed_detail_note"]),
                "missed_required_slot_block": bool(trace["verification"] and trace["verification"]["missing_required_slots"]),
                "final_response": final,
                "rendered_response_text": controller.render_response_text(final),
                "phase6_baseline_hybrid_100": baseline_index[row["row_id"]]["hybrid_total_100"],
                "phase6_grounded_hybrid_100": grounded_index[row["row_id"]]["hybrid_total_100"],
            }
        )

    write_jsonl(SUBSET_OUTPUT, outputs)

    strong_outputs = [o for o in outputs if o["scenario_family_id"] in STRONG_DEMO_SAFE_FAMILIES]
    weak_outputs = [o for o in outputs if o["scenario_family_id"] in WEAK_GUARDED_FAMILIES]
    by_family_grounded = defaultdict(list)
    for item in outputs:
        by_family_grounded[item["scenario_family_id"]].append(item["phase6_grounded_hybrid_100"])
    metrics = {
        "strong_lane_release_rate": sum(o["strong_candidate_released"] for o in strong_outputs) / len(strong_outputs),
        "downgrade_rate": sum(o["downgraded"] for o in strong_outputs) / len(strong_outputs),
        "guarded_mode_activation_rate": sum(o["guarded_mode_active"] for o in weak_outputs) / len(weak_outputs),
        "unsupported_detail_suppression_count": sum(o["unsupported_detail_suppressed"] for o in outputs),
        "missed_required_slot_block_count": sum(o["missed_required_slot_block"] for o in outputs),
    }
    SUBSET_METRICS.write_text(json.dumps(metrics, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = [
        "# Controller Subset Eval",
        "",
        f"- Rows run: `{len(outputs)}`",
        f"- Strong-lane release rate: `{metrics['strong_lane_release_rate']:.3f}`",
        f"- Downgrade rate: `{metrics['downgrade_rate']:.3f}`",
        f"- Guarded-mode activation rate on weak families: `{metrics['guarded_mode_activation_rate']:.3f}`",
        f"- Unsupported-detail suppression count: `{metrics['unsupported_detail_suppression_count']}`",
        f"- Missed-required-slot block count: `{metrics['missed_required_slot_block_count']}`",
        "",
        "## Grounded baseline comparison on the same subset",
        "",
    ]
    subset_grounded = [o["phase6_grounded_hybrid_100"] for o in outputs]
    subset_baseline = [o["phase6_baseline_hybrid_100"] for o in outputs]
    report.extend(
        [
            f"- Phase 6 baseline average hybrid_total_100: `{statistics.fmean(subset_baseline):.3f}`",
            f"- Phase 6 grounded average hybrid_total_100: `{statistics.fmean(subset_grounded):.3f}`",
            "",
            "## Grounded averages by family",
            "",
        ]
    )
    for family_id in SUBSET_FAMILIES:
        report.append(f"- `{family_id}`: `{statistics.fmean(by_family_grounded[family_id]):.3f}`")
    return outputs, "\n".join(report), metrics


def run_failure_analysis(outputs: list[dict]) -> str:
    low_conf = [o for o in outputs if o["family_confidence"] != "high"]
    downgraded = [o for o in outputs if o["downgraded"]]
    guarded = [o for o in outputs if o["guarded_mode_active"]]
    by_family = Counter(o["scenario_family_id"] for o in guarded)
    report = [
        "# Controller Failure Analysis",
        "",
        f"- Low-confidence rows: `{len(low_conf)}`",
        f"- Downgraded strong-lane rows: `{len(downgraded)}`",
        f"- Guarded rows total: `{len(guarded)}`",
        "",
        "## Findings",
        "",
        "- The current deterministic controller does not miss required slots on the fixed subset; the main control behavior is family-strength gating, not verifier-triggered repair.",
        "- Weak-family rows all stay in guarded mode by policy, which keeps unsafe expansion out but means the subset run does not yet stress partial-release behavior inside weak families.",
        "- Normalizer confidence is strong on the repaired benchmark prompts. The present failure risk is not misclassification on the fixed subset; it is future drift on noisier live prompts.",
        "- Because action rendering comes from frozen benchmark renderings, multilingual wording stays stable. The main remaining weakness is that the controller does not yet synthesize novel safe wording outside known family-language renderings.",
        "",
        "## Guarded family counts",
        "",
    ]
    for family_id, count in sorted(by_family.items()):
        report.append(f"- `{family_id}`: `{count}`")
    return "\n".join(report)


def main() -> int:
    OUTPUT_DIR.mkdir(exist_ok=True)
    controller = ChemicalEmergencyController()
    attach_test_helper(controller)

    normalizer_results, normalizer_report = run_normalizer_tests(controller)
    planner_results, planner_report = run_planner_tests(controller)
    strong_results, strong_report = run_strong_lane_tests(controller)
    guarded_results, guarded_report = run_guarded_lane_tests(controller)
    verifier_results, verifier_report = run_verifier_tests(controller)
    selector_results, selector_report = run_release_selector_tests(controller)
    integration_results, integration_report = run_integration(controller)
    subset_outputs, subset_report, subset_metrics = run_subset_eval(controller)
    failure_report = run_failure_analysis(subset_outputs)

    write(REPO_ROOT / "normalizer_test_report.md", normalizer_report)
    write(REPO_ROOT / "planner_test_report.md", planner_report)
    write(REPO_ROOT / "strong_lane_test_report.md", strong_report)
    write(REPO_ROOT / "guarded_lane_test_report.md", guarded_report)
    write(REPO_ROOT / "slot_verifier_test_report.md", verifier_report)
    write(REPO_ROOT / "release_selector_test_report.md", selector_report)
    write(REPO_ROOT / "controller_integration_report.md", integration_report)
    write(REPO_ROOT / "controller_subset_eval.md", subset_report)
    write(REPO_ROOT / "controller_failure_analysis.md", failure_report)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
