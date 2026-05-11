from __future__ import annotations

from pydantic import BaseModel


class CatalogChemical(BaseModel):
    chemical_id: str
    qr_value: str
    short_label: str
    names: dict[str, str]


class CatalogResponse(BaseModel):
    chemicals: list[CatalogChemical]


class QRResolveRequest(BaseModel):
    qr_value: str


class QRResolveResponse(BaseModel):
    chemical_id: str
    resolved: bool
