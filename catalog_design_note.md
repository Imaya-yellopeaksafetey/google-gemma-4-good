# Catalog Design Note

The catalog is a local demo-only lookup file. It is intentionally not a general SDS registry.

## What it contains

- stable `chemical_id`
- stable QR payload
- multilingual display names
- a controller context mapping with the chemical/product name used to enrich the worker prompt before controller execution

## Why it is local

- QR-first resolution for the demo does not need external SDS fetching
- manual selection uses the same local catalog
- keeping it local prevents network and parsing failure from contaminating emergency response routing

## Catalog scope

The current catalog includes only the plantation chemicals already represented in the benchmark/controller work:

- Roundup / Glyphosate
- Basta / Glufosinate
- 2,4-D Amine
- Fastac / Alpha-Cypermethrin
- Paraquat
