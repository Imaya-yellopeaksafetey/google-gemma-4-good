from __future__ import annotations

from fastapi import APIRouter, Depends

from app.schemas import (
    AppEmergencyResponse,
    CatalogResponse,
    HealthResponse,
    QRResolveRequest,
    QRResolveResponse,
    AppRespondRequest,
)
from app.services.controller_service import ControllerService


router = APIRouter()


def get_controller_service() -> ControllerService:
    from app.main import controller_service

    return controller_service


@router.get("/health", response_model=HealthResponse)
def health(service: ControllerService = Depends(get_controller_service)) -> dict:
    return service.health()


@router.get("/api/catalog", response_model=CatalogResponse)
def catalog(service: ControllerService = Depends(get_controller_service)) -> dict:
    return {"chemicals": service.catalog_service.list_catalog()}


@router.post("/api/resolve-qr", response_model=QRResolveResponse)
def resolve_qr(payload: QRResolveRequest, service: ControllerService = Depends(get_controller_service)) -> dict:
    chemical = service.catalog_service.resolve_qr(payload.qr_value)
    return {"chemical_id": chemical["chemical_id"], "resolved": True}


@router.post("/api/respond", response_model=AppEmergencyResponse)
def respond(payload: AppRespondRequest, service: ControllerService = Depends(get_controller_service)) -> dict:
    return service.respond(
        chemical_id=payload.chemical_id,
        worker_query=payload.worker_query,
        target_language=payload.target_language,
    )
