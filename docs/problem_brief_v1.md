# Problem Brief v1

## One-sentence problem
Workers handling plantation chemicals need a fast offline way to get first-aid steps in their own language during exposure incidents, without relying on memory, internet access, or an ungrounded chatbot.

## User and setting
- Primary users: plantation workers and supervisors in Malaysian oil-palm estates
- Priority worker-facing languages: Bahasa Indonesia and Bangla
- Supporting languages for benchmark and demo: Malay and English
- Operating context: field use, time pressure, low-connectivity environments, uneven literacy

## Product promise
The system answers a narrow question well:

> "Given a known chemical exposure incident, what should the worker do right now, what must they avoid, and when should they escalate?"

## Why this is narrow
- It is not a general medical assistant.
- It is not a safety training platform.
- It is not a broad worker-help chatbot.
- It focuses on SDS-groundable first-aid actions only.

## Success condition for the kickoff benchmark
- One structured action plan per scenario family
- Natural prompts per language that still map to one action plan
- Response renderings that preserve action order and escalation semantics
- No language variant drifts from the grounded source truth
