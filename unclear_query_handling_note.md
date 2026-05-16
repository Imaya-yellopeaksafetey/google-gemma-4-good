# Unclear Query Handling Note

Added a minimal unclear-query fallback in [app/services/controller_service.py](/Users/imayabharathi/Imaya/Imaya/hackathon/gemma4_hackathon/app/services/controller_service.py).

## Behavior

If a query cannot be safely routed to:

- emergency incident handling
- preventive handling guidance

the backend now returns:

- `response_kind = clarify_query`
- `response_mode = clarify_needed`
- a short clarification prompt
- a small option list:
  - eye exposure
  - skin exposure
  - inhaled spray
  - chemical in the mouth
  - PPE / handling

## Why this is safer

Previously, an underspecified query could only be forced into the emergency controller or fail awkwardly.

Now the system can:

- avoid false confidence
- keep the worker in a narrow supported flow
- prompt for just one more routing detail

## Frontend impact

The mobile response screen now renders this clarification response directly without redesigning the main flow.
