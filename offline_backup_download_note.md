# Offline Backup Download Note

The app downloads the Front Door artifact:

- `https://cactus-models-prod-fuh2hed9g7cac0gx.z01.azurefd.net/org-assets/cactus-models/gemma-4-e2b-it-pack.tar.zst`

Implementation approach:

- native Android `HttpURLConnection`
- background executor, not JS-thread download
- archive saved to app cache as a temporary file
- HTTP range resume is used when a partial archive already exists

Observed emulator proof:

- initial download started from `0%`
- after a forced interruption, the restart reused an existing partial archive:
  - `existingArchiveBytes=953090048`
- resumed progress restarted around `19%`

This is the current practical large-file path in the app.
