# Schema v0

## 1. Canonical design
The benchmark has two layers:

1. `scenario_families_v0.json`
   This is the structured, language-independent truth.
2. `benchmark_v0.jsonl`
   These are language-specific prompt and answer renderings linked back to one scenario family.

Free-text answers are derived artifacts. They are not the canonical truth.

## 2. Scenario family contract
Each scenario family object must contain:

- `scenario_family_id`: stable family identifier
- `chemical_id`: identifier matching `source_pack_v0.json`
- `chemical_name`
- `incident_type`: one of `skin_exposure`, `eye_exposure`, `inhalation`, `ingestion`
- `quality_tier`: `gold`, `silver`, or `bronze_dev`
- `rendering_method`: how the family or its language outputs were produced, such as `manual_authored`, `llm_rendered`, or `llm_rendered_human_revised`
- `grounding_source`: source metadata object with URL, publisher, and document type
- `source_section_id`: stable identifier for the grounded SDS or label section
- `source_span_id`: tighter source span identifier used for authoring and review
- `canonical_actions`: ordered list of required actions
- `do_not_do`: ordered list of prohibited actions or omissions
- `escalation_triggers`: ordered list of conditions that require medical escalation
- `answer_constraints`: rendering constraints for safe answer generation
- `scenario_metadata`: compact incident facts used to generate natural prompts
- `notes`: optional ambiguity or review notes
- `review_status`: workflow state such as `draft`, `reviewed`, or `approved`

### `canonical_actions` item contract
Each action item must contain:
- `step_id`
- `priority`
- `instruction`
- `rationale_short`
- `grounding_ref`

### `do_not_do` item contract
Each prohibition item must contain:
- `rule_id`
- `instruction`
- `grounding_ref`

### `escalation_triggers` item contract
Each trigger item must contain:
- `trigger_id`
- `condition`
- `required_action`
- `grounding_ref`

## 3. Language row contract
Each JSONL row must contain:

- `row_id`
- `scenario_family_id`
- `language`
- `language_stage`
- `split`
- `quality_tier`
- `rendering_method`
- `user_prompt`
- `prompt_style`
- `answer_rendering`
- `verification_checks`
- `review_status`

## 4. Language staging
- Bootstrap authoring starts in English.
- Malay and Bangla follow immediately for paired authoring.
- Bahasa Indonesia must appear before benchmark v0 freeze.
- Frozen benchmark v0 must include at least one Bahasa Indonesia rendering for every included incident type.
- Frozen benchmark v0 must include at least 20–25% Bahasa Indonesia rows.
- Urdu is stretch only and is not part of schema v0.

## 5. Split rules
- Split only by `scenario_family_id`.
- All language variants for one family must stay in the same split.
- Valid split values are `dev`, `validation`, and `holdout`.

## 6. Validation rules
- Every row must reference an existing scenario family.
- Every family must reference an existing chemical in the source pack.
- Every answer rendering must preserve action count, order, prohibitions, and escalation semantics.
- Prompt realism can vary by language, but prompt meaning must remain tied to the same structured truth.
- No prompt may require hidden context to score correctly.
- No prompt may mix more than one incident type.
- No prompt may be noisy enough that two human scorers would disagree on the intended action plan.
