# Write-Up Source — Problem and Entry

## Problem framing

Plantation workers face acute chemical exposure risks in the field, often with poor connectivity, language variation, and time pressure. A generic chatbot is the wrong interface for this moment. The worker does not need a broad conversation. They need the fastest safe path from chemical identification to immediate next actions.

## Why this project is narrow

The scope is intentionally limited to plantation chemical exposure. That keeps the grounding source, safety logic, and demo claims defensible. The system is not presented as a general medical or workplace safety assistant.

## Why QR-first entry matters

The highest-friction failure in emergency guidance is chemical identification. If the system starts from a free-text symptom description alone, it is more likely to over-generalize. QR-first entry narrows the decision space early by binding the request to a known demo chemical before the worker describes the incident.

## Why manual selection still exists

QR-first is the intended path, but real field conditions are messy. Labels can be damaged, bottles can be dirty, and camera permissions can fail. Manual chemical selection is the deliberate fallback path, not a side feature. It lets the demo remain operational without forcing a broken scan path.

## Worker-centered interaction design

The worker flow is intentionally short:

1. choose language
2. identify chemical by QR or manual selection
3. describe what happened
4. receive an emergency response in structured sections

This avoids turning the product into a chat transcript when the user needs an action-oriented answer.
