# Backend Build Readiness

## What was built

- a thin FastAPI gateway under `app/`
- local demo chemical catalog in `chemical_catalog.json`
- isolated upstream client in `app/services/vllm_client.py`
- controller adapter/orchestrator in `app/services/controller_service.py`
- app-facing routes for:
  - `/health`
  - `/api/catalog`
  - `/api/resolve-qr`
  - `/api/respond`

## Run path

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

## Env/config needed

- `VLLM_UPSTREAM_URL`
- `VLLM_MODEL_NAME`
- `VLLM_API_KEY`
- `VLLM_TIMEOUT_S`
- `CHEMICAL_CATALOG_PATH`
- optional `ALLOWED_ORIGINS`

## Known limitations

- no auth layer
- no persistence layer
- no voice support
- no external SDS lookup
- chemical resolution is demo-catalog only
- controller quality remains bounded by the current controller lineage
