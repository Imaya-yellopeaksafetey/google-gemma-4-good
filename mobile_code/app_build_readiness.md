# App Build Readiness

## What was built

- self-contained Expo mobile app under `mobile_code/`
- language-first startup
- QR-first chemical identification
- manual chemical selection fallback
- incident query screen
- emergency response rendering with visible mode differences
- explicit loading/error/retry states
- isolated backend API client
- isolated response mapping layer

## Backend assumptions

- backend base URL defaults to `http://20.242.52.182:8080`
- backend routes:
  - `GET /health`
  - `GET /api/catalog`
  - `POST /api/resolve-qr`
  - `POST /api/respond`

## Run

```bash
cd mobile_code
npm install
npx expo start
```

## Known limitations

- voice is not implemented
- app was not emulator-run in this environment
- backend availability is required for catalog and response flow
- UI is optimized for the narrow hackathon demo flow, not general product breadth

## Remaining before demo freeze

- install dependencies and run on a device/emulator
- validate live QR scan with printed demo QR payloads
- validate one full guided flow and one guarded flow against the live backend
