# Native QR Smoke Checklist

## Goal

Close the last-mile native QR proof gap with one real phone test.

## Use this first

- QR asset: [glyphosate_roundup_demo.svg](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes/glyphosate_roundup_demo.svg)
- Expected backend resolution:
  - `chemical_id = glyphosate_roundup_demo`
- Expected demo query after lock:
  - `spray went in my eye`

## Exact test steps

1. Put `glyphosate_roundup_demo.svg` on a second phone, tablet, or printed sheet.
2. Open the app on the demo phone.
3. Choose `English`.
4. Stay on the QR-first entry screen.
5. Grant camera permission if prompted.
6. Point the camera at the QR asset.
7. Confirm that the app resolves and locks `Roundup / Glyphosate`.
8. Proceed to the incident screen.
9. Enter `spray went in my eye`.
10. Submit and wait for the response.

## Pass criteria

All of the following must happen:

1. camera opens successfully
2. QR decodes on-device
3. app calls QR resolution successfully
4. chemical locks correctly
5. incident screen opens
6. response returns with `Full guided response`

## Evidence to capture

- one screenshot of the QR scanner detecting the code or immediately after chemical lock
- one screenshot of the locked chemical screen
- one screenshot of the final response screen
- optional short screen recording of the entire scan-to-response path

## If camera permission fails

1. close and reopen the app
2. re-allow camera permission in phone settings
3. return to the QR entry screen

## If scan does not trigger

1. increase screen brightness on the device showing the QR
2. move the phone slightly farther back
3. avoid glare
4. try the printed QR or another display
5. if still failing, switch to manual selection and continue the demo

## If QR resolves incorrectly

1. verify you are using the matching file from `submission_assets/qr_codes`
2. test the QR payload directly against:
   - `POST /api/resolve-qr`
3. if the issue persists, use manual fallback for the demo and keep the QR proof out of the spoken claim
