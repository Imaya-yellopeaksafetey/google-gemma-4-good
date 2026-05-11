# App Implementation Inventory

## Chosen app location

All mobile app code lives inside:

- `mobile_code/`

## Stack

- Expo React Native
- TypeScript
- on-device QR scanning through `expo-camera`

## Module boundaries

### UI layer

- `mobile_code/src/screens/`
- `mobile_code/src/components/`
- `mobile_code/src/app/AppShell.tsx`

### API client boundary

- `mobile_code/src/api/client.ts`
- `mobile_code/src/api/types.ts`

All backend calls are isolated here.

### QR boundary

- `mobile_code/src/features/qr/QRScannerPanel.tsx`
- `mobile_code/src/features/qr/useQrScanner.ts`

QR decode happens on-device here. Business logic only receives decoded text.

### Manual chemical selection boundary

- `mobile_code/src/features/catalog/ChemicalPicker.tsx`

### Response mapping boundary

- `mobile_code/src/mappers/responseMapper.ts`

Raw backend payloads are converted into app-safe view models before reaching screen code.

### State / view-model boundary

- `mobile_code/src/state/AppSessionContext.tsx`
- `mobile_code/src/models/viewModels.ts`

### Config boundary

- `mobile_code/src/config/env.ts`
- `mobile_code/.env.example`

## Backend assumptions

- backend base URL: `http://20.242.52.182:8080`
- routes used:
  - `GET /health`
  - `GET /api/catalog`
  - `POST /api/resolve-qr`
  - `POST /api/respond`
