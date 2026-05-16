**Cactus Track Requirements**

Official/public sources reviewed on May 16, 2026:
- [Cactus GitHub README](https://github.com/cactus-compute/cactus)
- [Cactus documentation](https://docs.cactuscompute.com/latest/)
- local repository files from a fresh clone in `/private/tmp/cactus_shallow`

What the official material clearly supports:
- Cactus is positioned as a low-latency AI engine for mobile devices and wearables.
- The stack is intended for local inference, with optional cloud fallback.
- Supported surfaces include CLI, Python, Android/KMP, Flutter, and React Native.

Reasonable interpretation of “local-first mobile or wearable” for this task:
- meaningful work must happen on-device
- the product must still do something useful when the network is weak or unavailable
- cloud can enhance or complete work, but cannot be the only intelligent path

Reasonable interpretation of “intelligently routes tasks between models” for this task:
- there must be at least one real local model route and one real cloud model route
- route choice must depend on task type and/or runtime conditions
- routing cannot be a wording trick around one cloud model endpoint

Whether Cactus requires a specific tool:
- The official materials present Cactus as the intended runtime stack.
- The track requirement appears to be a technical pattern, but using Cactus is the clearest supported path for a truthful claim.

Relevant official capability signals:
- cloud fallback is explicitly supported
- Android support exists in the repository
- React Native support exists through `cactus-react-native`
- supported model list includes `google/gemma-4-E2B-it`

Constraint that matters for this project:
- “local-first” must be technically real, not just QR-local or UI-local.
- The app must route meaningful tasks between a local model path and a cloud model path to qualify credibly.
