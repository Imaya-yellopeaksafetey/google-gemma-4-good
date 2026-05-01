from __future__ import annotations


class ReleaseSelector:
    def select(
        self,
        *,
        normalization: dict,
        plan: dict,
        strong_candidate: dict | None,
        guarded_candidate: dict,
        verification: dict | None,
    ) -> dict:
        family_strength = plan["family_strength"]
        confidence = normalization["family_confidence"]
        verifier_failed = verification["status"] == "fail" if verification else True
        has_unsupported = bool(verification and verification["blocked_unsupported_slots"])
        has_missing = bool(verification and verification["missing_required_slots"])

        if (
            family_strength == "strong_demo_safe"
            and confidence == "high"
            and strong_candidate is not None
            and verification is not None
            and verification["status"] == "pass"
        ):
            response = strong_candidate
            response["slot_verification"] = verification
            response["response_mode"] = "full_guided_response"
            return response

        if family_strength == "weak_guarded":
            fallback_reason = "weak_family_guardrail"
        elif confidence != "high":
            fallback_reason = "classification_not_confident"
        elif has_missing:
            fallback_reason = "missing_required_slots"
        elif has_unsupported:
            fallback_reason = "unsupported_detail_risk"
        else:
            fallback_reason = "weak_family_guardrail"

        response = guarded_candidate
        response["fallback_reason"] = guarded_candidate["fallback_reason"]
        response["slot_verification"] = verification or {
            "status": "fail",
            "missing_required_slots": [],
            "blocked_unsupported_slots": [],
            "downgrade_required": True,
        }
        if confidence == "low" or plan["default_guarded_mode"] == "guarded_escalate_now":
            response["response_mode"] = "guarded_escalate_now"
        else:
            response["response_mode"] = "guarded_minimum_response"
        if fallback_reason != "weak_family_guardrail":
            # The guarded candidate already contains a localized text string, so keep the mode and verification
            # but let the integration layer rebuild the localized reason if needed.
            response["fallback_reason_key"] = fallback_reason
        return response
