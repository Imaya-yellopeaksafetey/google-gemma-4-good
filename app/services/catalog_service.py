from __future__ import annotations

import json
from pathlib import Path


class CatalogLookupError(Exception):
    pass


class UnknownChemicalError(CatalogLookupError):
    pass


class UnknownQRValueError(CatalogLookupError):
    pass


class CatalogService:
    def __init__(self, catalog_path: Path) -> None:
        self.catalog_path = catalog_path
        payload = json.loads(catalog_path.read_text(encoding="utf-8"))
        self._catalog = payload["chemicals"]
        self._by_id = {item["chemical_id"]: item for item in self._catalog}
        self._by_qr = {item["qr_value"]: item for item in self._catalog}

    def list_catalog(self) -> list[dict]:
        return list(self._catalog)

    def get_chemical(self, chemical_id: str) -> dict:
        try:
            return self._by_id[chemical_id]
        except KeyError as exc:
            raise UnknownChemicalError(f"Unknown chemical_id: {chemical_id}") from exc

    def resolve_qr(self, qr_value: str) -> dict:
        try:
            return self._by_qr[qr_value]
        except KeyError as exc:
            raise UnknownQRValueError(f"Unknown qr_value: {qr_value}") from exc
