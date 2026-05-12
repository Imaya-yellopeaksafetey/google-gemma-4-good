#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "chemical_catalog.json"
OUTPUT_DIR = ROOT / "submission_assets" / "qr_codes"


def load_segno():
    try:
        import segno  # type: ignore
        return segno
    except ModuleNotFoundError:
        extra = Path("/private/tmp/gemma4_qrdeps")
        if extra.exists():
            sys.path.insert(0, str(extra))
            import segno  # type: ignore
            return segno
        raise


def main() -> int:
    segno = load_segno()
    data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for chemical in data["chemicals"]:
        filename = f"{chemical['chemical_id']}.svg"
        qr = segno.make(chemical["qr_value"], error="m")
        qr.save(
            OUTPUT_DIR / filename,
            scale=8,
            dark="#0f3d31",
            light="#f8f4ea",
            border=3,
        )

    print(f"Generated {len(data['chemicals'])} QR assets in {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
