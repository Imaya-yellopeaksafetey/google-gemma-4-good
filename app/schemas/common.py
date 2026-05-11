from __future__ import annotations

from pydantic import BaseModel, Field


class ErrorDetails(BaseModel):
    code: str = Field(..., description="Stable machine-readable error code.")
    message: str = Field(..., description="Human-readable error message safe for app display.")


class ErrorResponse(BaseModel):
    error: ErrorDetails
