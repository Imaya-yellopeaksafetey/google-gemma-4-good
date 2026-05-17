# Link Cleanup Audit

## Scope Audited

- `final_submission_proof_pack_index.md`
- `submission_story_audit.md`
- `all_md_files/Gemma_4_Good_Hackathon_30_Day_Execution_Plan_Updated_Tracker.md`
- active proof-pack docs listed in the final proof-pack index
- submission/demo docs:
  - `all_md_files/final_submission_note.md`
  - `all_md_files/demo_operator_guide.md`
  - `all_md_files/demo_rehearsal_pack.md`
  - `all_md_files/kaggle_writeup_draft.md`
  - `all_md_files/writeup_app_and_backend_flow.md`

## Files That Needed Link Cleanup

The final submission-facing set had already been largely cleaned before this pass. The remaining files that needed final confirmation or minor normalization were:

- `final_submission_proof_pack_index.md`
- `submission_story_audit.md`
- `all_md_files/final_submission_note.md`
- `all_md_files/demo_operator_guide.md`
- `all_md_files/demo_rehearsal_pack.md`
- `apk_distribution_strategy.md`
- `model_distribution_strategy.md`
- `judge_install_and_run_note.md`
- `github_release_plan.md`
- `visible_string_localization_audit.md`
- `status_wording_implementation_note.md`
- `local_model_route_note.md`

## Links Already Acceptable

These were already acceptable GitHub-friendly links at the end of the audit:

- repo-relative links from the proof-pack index to root docs
- repo-relative links from the proof-pack index to `all_md_files/`
- repo-relative links from `all_md_files/` docs back to root docs and asset folders
- repo-relative links from root docs to `mobile_code/` implementation files

## Links That Should Remain Plain Text

These should stay as plain code paths rather than markdown links:

- `mobile_code/android/app/build/outputs/apk/release/app-release.apk`

Reason:

- this is a local workspace build-output path, not a stable GitHub-browsable artifact path
- the judge-facing downloadable APK should come from GitHub Releases, not from repo browsing

## Audit Result

- no `/Users/...` local absolute filesystem links remain in the audited submission-facing set
- the final proof-pack index is repo-relative and GitHub-friendly
- the remaining machine-specific artifact path is intentionally presented as plain text, not as a clickable markdown link
