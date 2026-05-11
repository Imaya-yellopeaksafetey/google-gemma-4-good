# Phase 6 Next-Lane Decision

## Recommendation

Choose exactly one next lane:

- `targeted grounding/prompt improvement`

## Why this lane

The evidence says the main performance lever is still grounding quality, not base model knowledge or app plumbing.

Supporting evidence:

- baseline average: `38.582`
- grounded average: `92.008`
- grounded gain: `+53.426`

That gap is too large to ignore. It means:

- the model without grounded context is not reliable enough on its own
- the current grounded setup is already powerful enough to produce demo-safe slices
- the weakest remaining failures are still mostly grounding/prompt-shaping problems, not obvious model-capacity problems

## Why the other three options were not chosen

### Not `minimal LoRA`

Not chosen because the current evidence does not show that weights are the next bottleneck.

What the benchmark says instead:

- grounded prompting already moves performance from weak to strong
- the remaining weak slices are concentrated in specific incident families and specific response-shaping issues
- that pattern points to prompt/grounding refinement before parameter adaptation

### Not `app integration prep`

Not chosen because evaluation control was only just repaired and some grounded slices remain too risky for demo emphasis.

Why that matters:

- moving into app prep now would lock product work around avoidable evaluation weaknesses
- the safe demo families are clear, but the risky ones are also clear
- we should tighten the grounding path on the weak families before spending effort on mobile integration

### Not `direct Phase 7 start`

Not chosen because Phase 6 closure only now became trustworthy enough for decision support.

Direct escalation would skip the highest-leverage near-term fix:

- improve grounded prompt/context behavior on the weakest families

## What targeted grounding/prompt improvement should focus on

Focus narrowly on the weak grounded slices:

- `sf_glufosinate_ingestion_01`
- `sf_paraquat_inhalation_01`
- `sf_24d_ingestion_01`
- `sf_24d_eye_01`

Priority problems to attack:

- action-order degradation
- missed required action in paraquat inhalation
- overbroad escalation wording
- ingestion phrasing that weakens the required immediate sequence

## What must be true before switching lanes again

Before changing lanes away from targeted grounding/prompt improvement, all of the following should be true:

1. The grounded benchmark remains on the final strict judge lineage or a stricter documented successor.
2. The weakest grounded families are either:
   - improved materially, or
   - explicitly excluded from the first demo scope.
3. The chosen demo slice has:
   - grounded family averages comfortably above `95`, and
   - no repeated `missed_required_action` pattern in the selected demo path.
4. The baseline-vs-grounded comparison remains reproducible from saved predictions and versioned judge caches.

## Operational conclusion

Phase 6 is now decision-grade.

The correct next move is not more broad experimentation and not app work yet.

The correct next move is:

- `targeted grounding/prompt improvement`
