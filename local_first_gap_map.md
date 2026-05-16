**Local-First Gap Map**

The current system cannot be called local-first for the following concrete reasons.

1. Cloud-only inference dependency
- All meaningful guidance generation still depends on the backend.
- No on-device Gemma path exists in the current shipped app.

2. No offline emergency response mode
- If the network is unavailable, the current app cannot produce a real emergency response locally.
- There is no local guarded fallback today.

3. No true model routing
- The current system routes between backend paths, not between a local model and a cloud model.
- That is not enough for a truthful Cactus claim.

4. Startup and backend dependence
- App bootstrap currently depends on backend health and catalog availability.
- The app can fail before the worker even reaches incident submission.

5. No local SDS/cache policy
- The app has no meaningful local chemical guidance cache beyond UI-level catalog data.
- There are no local quick cards or bounded emergency fallback materials.

6. No local model availability checks
- The app does not know whether a local model exists, can load, or has failed.
- There is no runtime route state for local vs cloud execution.

7. No network-aware response upgrading
- The current UX does not support a local guarded answer followed by cloud enhancement.

8. No proof instrumentation
- The current app cannot show which model handled a task or why a route was chosen.

Bottom line:
- The current main-track app is mobile-first, but not local-first.
- A truthful Cactus variant requires real on-device model work plus explicit model-routing behavior.
