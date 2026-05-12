# QR Asset Manifest

## Generation method

QR assets were generated with code from the real demo catalog using:

- [scripts/generate_qr_assets.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/scripts/generate_qr_assets.py)

Input catalog:

- [chemical_catalog.json](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/chemical_catalog.json)

Output folder:

- [/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes)

Re-run:

```bash
cd /Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon
python3 scripts/generate_qr_assets.py
```

## Asset map

| chemical_id | Localized display names | qr_value | Asset |
|---|---|---|---|---|
| `glyphosate_roundup_demo` | English: `Roundup / Glyphosate`  Malay: `Roundup / Glyphosate`  Bangla: `রাউন্ডআপ / গ্লাইফোসেট`  Bahasa Indonesia: `Roundup / Glyphosate` | `demo://chemical/glyphosate_roundup_demo` | [glyphosate_roundup_demo.svg](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes/glyphosate_roundup_demo.svg) |
| `glufosinate_basta_demo` | English: `Basta / Glufosinate`  Malay: `Basta / Glufosinate`  Bangla: `বাস্টা / গ্লুফোসিনেট`  Bahasa Indonesia: `Basta / Glufosinate` | `demo://chemical/glufosinate_basta_demo` | [glufosinate_basta_demo.svg](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes/glufosinate_basta_demo.svg) |
| `24d_amine_demo` | English: `2,4-D Amine`  Malay: `2,4-D Amine`  Bangla: `২,৪-ডি অ্যামিন`  Bahasa Indonesia: `2,4-D Amine` | `demo://chemical/24d_amine_demo` | [24d_amine_demo.svg](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes/24d_amine_demo.svg) |
| `fastac_demo` | English: `Fastac / Alpha-Cypermethrin`  Malay: `Fastac / Alpha-Cypermethrin`  Bangla: `ফাস্টাক / আলফা-সাইপারমেথ্রিন`  Bahasa Indonesia: `Fastac / Alpha-Cypermethrin` | `demo://chemical/fastac_demo` | [fastac_demo.svg](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes/fastac_demo.svg) |
| `paraquat_demo` | English: `Paraquat`  Malay: `Paraquat`  Bangla: `প্যারাকুয়াট`  Bahasa Indonesia: `Paraquat` | `demo://chemical/paraquat_demo` | [paraquat_demo.svg](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/submission_assets/qr_codes/paraquat_demo.svg) |

## Notes

- The assets encode the exact `qr_value` consumed by `POST /api/resolve-qr`.
- Files are SVG so they remain crisp for phone display or print.
- No internet SDS lookup or external QR resolution is involved.
