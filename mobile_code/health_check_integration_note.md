# Health Check Integration Note

## Integration

- The app now calls `GET /health` before treating the backend as ready.
- `src/api/types.ts` now includes a typed `HealthResponseDto`.
- `src/api/client.ts` exposes `getHealth(): Promise<HealthResponseDto>`.
- `src/app/AppShell.tsx` treats startup as healthy only when:
  - `status === "ok"`
  - `gateway === "ok"`
  - `vllm === "ok"`

## Worker-facing behavior

- While startup is running, the app shows a loading state instead of assuming the backend is ready.
- If health fails, the worker sees a clear error state instead of an empty catalog.
- `Retry` re-runs the health check.

## Live backend confirmation

Live backend health response observed during this pass:

```json
{"status":"ok","gateway":"ok","vllm":"ok","model":"google/gemma-4-31B-it","controller_version":"demo-current"}
```

## Runtime validation

The health-gated startup path was exercised with an intentionally failed first `/health` request using:

- `scripts/validate_startup_recovery.mjs`

Evidence:

- `validation_artifacts/startup_health_error.png`
- `validation_artifacts/startup_health_recovered.png`
