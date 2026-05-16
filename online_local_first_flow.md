## Online Local-First Flow

Historical design note only.

The current app no longer uses this flow as the active product behavior.

Current online behavior:

1. The worker identifies the chemical through QR or manual selection.
2. On incident submit, the app checks backend reachability.
3. If the backend is reachable, the app sends the request directly to the cloud controller path.
4. The cloud response is rendered as the primary response.

Current offline behavior:

1. If the backend is not reachable, the app uses the local guarded fallback path.
2. The local model provides only the minimum signal needed for safe worker-facing guarded guidance.
3. The app renders deterministic worker-facing sections:
   - `Immediate actions`
   - `Do not do`
   - `Escalate now`
