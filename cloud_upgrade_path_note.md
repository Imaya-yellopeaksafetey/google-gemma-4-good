## Cloud Upgrade Path

Exploratory / historical note only.

This note describes the earlier online hybrid path where a local quick card was followed by a cloud upgrade.
That is not the active product behavior now.

The cloud controller remains the richer final responder.

Preserved behavior:

- `/api/respond` still owns the full grounded response path
- mapped cloud responses still use the existing app response mapper
- existing full guided and guarded cloud response contracts remain intact

Upgrade behavior:

- after local quick card or preventive stub is shown, the app calls the cloud path
- if cloud succeeds, the app replaces the local view with the cloud-backed response
- if cloud fails, the app keeps the local view and marks the route accordingly

This preserves the main product truth:

- local = first responder
- cloud = richer grounded responder
