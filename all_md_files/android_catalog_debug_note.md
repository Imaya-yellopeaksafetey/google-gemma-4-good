# Android Catalog Debug Note

Temporary debug logging was added only in:

- [mobile_code/src/app/AppShell.tsx](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/app/AppShell.tsx)
- [mobile_code/src/api/client.ts](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/mobile_code/src/api/client.ts)

## Where to inspect logs

Use Android runtime logs from:

- Metro / Expo terminal output
- `adb logcat` if available
- React Native device logs

## Key log prefixes

### Startup flow

- `[startup] useEffect:bootstrap`
- `[startup] bootstrap:start`
- `[startup] health:begin`
- `[startup] health:result`
- `[startup] health:invalid`
- `[startup] catalog:begin`
- `[startup] catalog:result`
- `[startup] state:setCatalog`
- `[startup] state:setReady`
- `[startup] screen:set`
- `[startup] bootstrap:success`
- `[startup] bootstrap:error`

These tell you whether the failure happened:

- before health request
- after health request but before catalog request
- after catalog response but before state transition
- inside the final catch path with an `ApiClientError` or runtime error

### HTTP client flow

- `[api] request:start`
- `[api] fetch:start`
- `[api] fetch:success`
- `[api] fetch:timeout`
- `[api] fetch:error`
- `[api] response`
- `[api] parseJson:success`
- `[api] parseJson:error`
- `[api] request:http_error`
- `[api] request:done`

These tell you whether the failure is:

- health fetch
- catalog fetch
- network error
- timeout
- malformed JSON parsing
- non-200 HTTP response

## How to interpret quickly

### If you see:

- `[startup] health:begin` but no `[startup] health:result`
  - the issue is likely inside the health request path

- `[startup] health:result` and `[startup] catalog:begin` but no `[startup] catalog:result`
  - the issue is likely inside the catalog request path

- `[api] response` followed by `[api] parseJson:error`
  - the issue is JSON parsing / malformed response

- `[startup] catalog:result` followed by `[startup] bootstrap:error`
  - the fetch succeeded and the failure is post-fetch runtime logic

## Intent

These logs are temporary and should be removed after the Android startup catalog issue is diagnosed.
