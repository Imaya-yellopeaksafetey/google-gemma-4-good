from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    gateway: str
    vllm: str
    model: str
    controller_version: str
