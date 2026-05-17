# Final Submission Note

## Main code locations

- backend: [app](../app)
- mobile app: [mobile_code](../mobile_code)
- controller stack: [controller_stack](../controller_stack)

## Demo assets

- QR assets: [submission_assets/qr_codes](../submission_assets/qr_codes)
- QR manifest: [qr_asset_manifest.md](../qr_asset_manifest.md)

## Demo docs

- operator guide: [demo_operator_guide.md](demo_operator_guide.md)
- rehearsal pack: [demo_rehearsal_pack.md](demo_rehearsal_pack.md)
- final storyline: [final_demo_storyline.md](../final_demo_storyline.md)

## Write-up docs

- merged Kaggle draft: [kaggle_writeup_draft.md](kaggle_writeup_draft.md)
- source notes:
  - [writeup_problem_and_entry.md](writeup_problem_and_entry.md)
  - [writeup_controller_and_safety.md](writeup_controller_and_safety.md)
  - [writeup_app_and_backend_flow.md](writeup_app_and_backend_flow.md)
  - [writeup_eval_and_validation.md](writeup_eval_and_validation.md)

## Remaining human-run check

- native phone QR smoke checklist used for final proof: [native_qr_smoke_checklist.md](../native_qr_smoke_checklist.md)

## Current truthful state

- active product split:
  - online = direct cloud full-response path
  - offline = local guarded emergency fallback path
- APK and local model remain separate artifacts
- offline local model setup is optional for offline/demo testing and is not bundled into the APK
- manual path is validated and demo-usable
- QR-first path is validated on a real Android phone
- `sf_24d_inhalation_01` is not part of the current live hero demo path
