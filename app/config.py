from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class Settings:
    backend_host: str = os.environ.get("BACKEND_HOST", "0.0.0.0")
    backend_port: int = int(os.environ.get("BACKEND_PORT", "8080"))
    vllm_upstream_url: str = os.environ.get("VLLM_UPSTREAM_URL", "http://127.0.0.1:8000")
    vllm_timeout_s: int = int(os.environ.get("VLLM_TIMEOUT_S", "120"))
    vllm_model_name: str = os.environ.get("VLLM_MODEL_NAME", "google/gemma-4-31B-it")
    vllm_api_key: str = os.environ.get("VLLM_API_KEY", "imayaisanawesomehumanbeignWtihGoodIntellect")
    controller_version: str = os.environ.get("CONTROLLER_VERSION", "demo-current")
    allowed_origins_raw: str = os.environ.get("ALLOWED_ORIGINS", "*")
    chemical_catalog_path: Path = Path(os.environ.get("CHEMICAL_CATALOG_PATH", REPO_ROOT / "chemical_catalog.json"))

    @property
    def allowed_origins(self) -> list[str]:
        raw = self.allowed_origins_raw.strip()
        if not raw:
            return ["*"]
        if raw == "*":
            return ["*"]
        return [item.strip() for item in raw.split(",") if item.strip()]


settings = Settings()
