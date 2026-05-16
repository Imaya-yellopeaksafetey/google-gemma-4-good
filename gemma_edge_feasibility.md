**Gemma Edge Feasibility**

Question:
- Can `google/gemma-4-E2B-it` realistically serve as the first local model path for this plantation emergency product?

Official support signals:
- `models.json` in the official Cactus repository includes `google/gemma-4-E2B-it`.
- The Cactus Hugging Face repo `Cactus-Compute/gemma-4-E2B-it` exists and exposes INT4 artifacts.
- The downloaded artifact for the Apple path was:
  - about `4.4 GB` in Hugging Face cache
  - about `6.3 GB` extracted into Cactus weights

What that implies:
- this is not a tiny edge model
- but it is still materially smaller and more targeted than the larger cloud Gemma 4 models already used elsewhere in the project

Runtime observations from the local harness:
- model loaded successfully through the native Cactus runtime
- initialization time was about `5.24 s`
- routing and short-output tasks completed successfully
- reported RAM use was about `2.0–2.1 GB`
- first-token latency for short tasks was about `190–304 ms`
- total runtime for the short guarded fallback case was about `2.23 s`

Android relevance:
- `adb` reports the active emulator ABI as `arm64-v8a`
- that is a plausible target for a native Android path
- but the current app is Expo-based and does not yet have native Cactus integration

Feasibility conclusion:
- `google/gemma-4-E2B-it` is feasible for narrow local tasks:
  - query routing
  - incident canonicalization
  - short clarification
  - short guarded fallback
- It is not yet proven here for:
  - full local SDS-grounded emergency completion
  - production-grade real-device Android performance
  - frictionless Expo integration without native changes

Most important limitation:
- this feasibility signal comes from a real local native harness on macOS, not yet from a full Android on-device app integration.
