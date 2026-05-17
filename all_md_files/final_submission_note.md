# Final Submission Note

## Main code locations

- backend: [app](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app)
- mobile app: [mobile_code](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code)
- controller stack: [controller_stack](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/controller_stack)

## Demo assets

- QR assets: [submission_assets/qr_codes](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes)
- QR manifest: [qr_asset_manifest.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/qr_asset_manifest.md)

## Demo docs

- operator guide: [demo_operator_guide.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/demo_operator_guide.md)
- rehearsal pack: [demo_rehearsal_pack.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/demo_rehearsal_pack.md)
- final storyline: [final_demo_storyline.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/final_demo_storyline.md)

## Write-up docs

- merged Kaggle draft: [kaggle_writeup_draft.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/kaggle_writeup_draft.md)
- source notes:
  - [writeup_problem_and_entry.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/writeup_problem_and_entry.md)
  - [writeup_controller_and_safety.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/writeup_controller_and_safety.md)
  - [writeup_app_and_backend_flow.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/writeup_app_and_backend_flow.md)
  - [writeup_eval_and_validation.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/all_md_files/writeup_eval_and_validation.md)

## Remaining human-run check

- native phone QR smoke checklist used for final proof: [native_qr_smoke_checklist.md](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/native_qr_smoke_checklist.md)

## Current truthful state

- active product split:
  - online = direct cloud full-response path
  - offline = local guarded emergency fallback path
- APK and local model remain separate artifacts
- offline local model setup is optional for offline/demo testing and is not bundled into the APK
- manual path is validated and demo-usable
- QR-first path is validated on a real Android phone
- `sf_24d_inhalation_01` is not part of the current live hero demo path
