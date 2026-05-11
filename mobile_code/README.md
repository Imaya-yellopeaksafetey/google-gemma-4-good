# Gemma 4 Good Mobile App

Worker-facing emergency response app for plantation chemical exposure.

## Backend

The app is locked to the thin backend gateway:

- `http://20.242.52.182:8080`

It uses:

- `GET /health`
- `GET /api/catalog`
- `POST /api/resolve-qr`
- `POST /api/respond`

## Start

```bash
cd mobile_code
npm install
npx expo start
```

Optional local config:

```bash
cp .env.example .env
```

## Main flow

1. choose language
2. scan QR
3. or choose chemical manually
4. lock chemical
5. describe incident
6. render emergency response

## Scope

- plantation chemical exposure only
- no voice in v1
- no generic chatbot
