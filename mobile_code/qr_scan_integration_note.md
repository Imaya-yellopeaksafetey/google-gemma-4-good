# QR Scan Integration Note

QR scanning is done on-device with the phone camera using `expo-camera`.

## Flow

1. camera scans QR locally
2. QR text is decoded on-device
3. app sends only decoded `qr_value` to `POST /api/resolve-qr`
4. backend returns `chemical_id`
5. app locks the chemical and advances to the incident screen

## Failure handling

- permission denied -> show clear camera enable prompt
- invalid or unknown QR -> show app error state
- QR image itself is never uploaded to the backend

## Boundary

QR code handling stays inside:

- `src/features/qr/QRScannerPanel.tsx`
- `src/features/qr/useQrScanner.ts`
