# Voice Integration Stub Note

Voice input is intentionally deferred in v1.

## Future extension point

The future mic button should live on:

- `src/screens/IncidentScreen.tsx`

## Future connection

Speech-to-text should feed into the same state field already used by text:

- `state.incidentQuery`

That means future voice integration only needs to:

1. capture speech
2. convert to transcript
3. write transcript into the same incident query state
4. reuse the existing submit flow to `POST /api/respond`

No separate response path should be created for voice.
