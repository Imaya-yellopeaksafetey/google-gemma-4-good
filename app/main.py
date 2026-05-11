from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.config import settings
from app.schemas import ErrorResponse
from app.services.catalog_service import CatalogService, UnknownChemicalError, UnknownQRValueError
from app.services.controller_service import ControllerGatewayError, ControllerOutputError, ControllerService
from app.services.vllm_client import VLLMClient, VLLMResponseError, VLLMTimeoutError, VLLMUpstreamUnavailable


catalog_service = CatalogService(settings.chemical_catalog_path)
vllm_client = VLLMClient(
    upstream_url=settings.vllm_upstream_url,
    model_name=settings.vllm_model_name,
    api_key=settings.vllm_api_key,
    timeout_s=settings.vllm_timeout_s,
)
controller_service = ControllerService(
    catalog_service=catalog_service,
    vllm_client=vllm_client,
    controller_version=settings.controller_version,
)

app = FastAPI(title="Gemma 4 Good Thin Gateway", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


def error_response(status_code: int, code: str, message: str) -> JSONResponse:
    payload = ErrorResponse(error={"code": code, "message": message}).model_dump()
    return JSONResponse(status_code=status_code, content=payload)


@app.exception_handler(UnknownChemicalError)
async def unknown_chemical_handler(_: Request, exc: UnknownChemicalError) -> JSONResponse:
    return error_response(404, "unknown_chemical", str(exc))


@app.exception_handler(UnknownQRValueError)
async def unknown_qr_handler(_: Request, exc: UnknownQRValueError) -> JSONResponse:
    return error_response(404, "unknown_qr", str(exc))


@app.exception_handler(VLLMTimeoutError)
async def vllm_timeout_handler(_: Request, exc: VLLMTimeoutError) -> JSONResponse:
    return error_response(504, "upstream_timeout", str(exc))


@app.exception_handler(VLLMUpstreamUnavailable)
async def vllm_unavailable_handler(_: Request, exc: VLLMUpstreamUnavailable) -> JSONResponse:
    return error_response(503, "upstream_unavailable", str(exc))


@app.exception_handler(VLLMResponseError)
async def vllm_response_handler(_: Request, exc: VLLMResponseError) -> JSONResponse:
    return error_response(502, "upstream_bad_response", str(exc))


@app.exception_handler(ControllerOutputError)
async def controller_output_handler(_: Request, exc: ControllerOutputError) -> JSONResponse:
    return error_response(502, "controller_output_invalid", str(exc))


@app.exception_handler(ControllerGatewayError)
async def controller_gateway_handler(_: Request, exc: ControllerGatewayError) -> JSONResponse:
    return error_response(500, "controller_failed", str(exc))


@app.exception_handler(RequestValidationError)
async def validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return error_response(422, "bad_request", str(exc))


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return error_response(exc.status_code, "http_error", str(exc.detail))


@app.exception_handler(Exception)
async def generic_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return error_response(500, "internal_error", str(exc))
