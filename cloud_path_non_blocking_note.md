# Cloud Path Non-Blocking Note

The offline emergency backup download does not block the cloud path.

What changed:

- download/install runs in a native single-thread executor inside `CactusLocalModule`
- JS receives state/progress events and updates the top status card
- no full-screen setup flow was added
- the worker can continue through language selection, QR/manual entry, and the normal online path while the download continues

Observed emulator proof:

- download advanced from `1%` to `14%` while the app remained navigable
- the app advanced from language selection into QR/manual entry while the download was active
- the top card continued to show `Backend: Connected` and `Active route: Cloud full guidance`
