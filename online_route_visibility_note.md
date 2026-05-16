## Online Route Visibility

The response screen now exposes route state more clearly.

Visible elements:

- response mode badge
- route status card
- route proof card

What the user/judges should be able to infer:

- whether the first-pass content is still local and limited
- whether fuller grounded guidance is still pending
- whether cloud grounded guidance replaced the local card
- whether the local card was kept because cloud failed

Current limitation:

- this visibility is implemented in the UI code
- full user-visible proof of the local quick card appearing before cloud completion is not yet fully captured in emulator validation
