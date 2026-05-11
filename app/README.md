# Gemma 4 Good Thin Backend Gateway

This is the minimal backend gateway for the hackathon demo app. It exposes a stable app-facing API, resolves QR/manual chemical selection, and calls the current controller through a local vLLM upstream on the same GPU VM.

## What this backend does

- `GET /health`
- `GET /api/catalog`
- `POST /api/resolve-qr`
- `POST /api/respond`

It does **not**:

- expose vLLM directly to the app
- implement voice
- fetch SDS documents from the internet
- provide dashboard/admin features

## Expected deployment shape

- public app-facing gateway: `http://20.242.52.182:8080`
- local vLLM upstream on the VM: `http://127.0.0.1:8000`

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

## Configuration

Environment variables are documented in `.env.example`.

Most important:

- `VLLM_UPSTREAM_URL=http://127.0.0.1:8000`
- `VLLM_MODEL_NAME=google/gemma-4-31B-it`
- `VLLM_API_KEY=imayaisanawesomehumanbeignWtihGoodIntellect`
- `CHEMICAL_CATALOG_PATH=/absolute/path/to/chemical_catalog.json`

## Demo catalog

The app uses `chemical_catalog.json` for both:

- QR-first entry
- manual chemical selection fallback

## App contract

See:

- `backend_contract.md`
- `catalog_design_note.md`
- `qr_resolution_note.md`
- `error_handling_note.md`
- `backend_build_readiness.md`
