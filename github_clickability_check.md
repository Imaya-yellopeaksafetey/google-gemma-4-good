# GitHub Clickability Check

## Sanity-Check Scope

The following groups were sanity-checked for GitHub browsing usability:

- proof-pack index
- Cactus truth docs
- release/distribution docs
- multilingual/review docs
- demo/operator docs
- tracker link

## Checked Results

### Final proof-pack index

Verified:

- `final_submission_proof_pack_index.md` uses repo-relative markdown links
- all index targets exist in the repository

### Release / distribution docs

Verified:

- `apk_distribution_strategy.md`
- `model_distribution_strategy.md`
- `judge_install_and_run_note.md`
- `github_release_plan.md`

Result:

- links are GitHub-usable
- local build-output paths are plain text where appropriate

### Cactus truth docs

Verified:

- `cactus_architecture_decision.md`
- `local_first_operating_modes.md`
- `model_routing_policy.md`
- `cactus_validation_report.md`
- `cactus_final_viability_judgment.md`
- `cactus_evidence_summary.md`
- `local_model_route_note.md`
- `offline_guarded_mode_note.md`

Result:

- submission-facing links are repo-relative and usable from GitHub

### Multilingual / review docs

Verified:

- `worker_status_wording.md`
- `secondary_status_wording.md`
- `visible_string_localization_audit.md`
- `status_wording_implementation_note.md`
- `multilingual_validation_report.md`
- `application_review.md`

Result:

- implementation references point to repo-relative `mobile_code/` paths

### Demo / operator docs

Verified:

- `all_md_files/final_submission_note.md`
- `all_md_files/demo_operator_guide.md`
- `all_md_files/demo_rehearsal_pack.md`
- `all_md_files/Gemma_4_Good_Hackathon_30_Day_Execution_Plan_Updated_Tracker.md`

Result:

- relative links between `all_md_files/`, root docs, and asset folders are usable for GitHub browsing

## Remaining Exceptions

One intentional exception remains:

- `mobile_code/android/app/build/outputs/apk/release/app-release.apk` is shown as a plain code path, not a markdown link

Reason:

- it is a local build-output location inside the workspace
- it is not the judge-facing distribution surface
- the clean judge download path is the GitHub Release asset plan already documented

## Overall Sanity-Check Conclusion

- the final proof-pack is practically browseable from GitHub
- the active proof-pack index is safe to hand to judges
- no local absolute filesystem links remain in the audited submission-facing set
