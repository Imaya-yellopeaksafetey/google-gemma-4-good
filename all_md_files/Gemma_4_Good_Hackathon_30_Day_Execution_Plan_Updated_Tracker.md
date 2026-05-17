# Gemma 4 Good Hackathon — 30-Day Execution Plan (Updated Tracker)

## 1) Project identity

**Project name:** Gemma 4 Good  
**Goal:** Build a judge-winning, worker-facing chemical emergency guidance system for plantation use cases.  
**Core positioning:** Gemma is used as a **family-aware, safety-gated emergency response engine**, not a generic chatbot.

---

## 2) North star

Build a **narrow, defensible, safety-conscious** system for plantation chemical exposure where the worker can:

1. identify the chemical quickly
2. describe what happened
3. receive structured first-aid guidance
4. see guarded fallback behavior when the system should not over-answer

This project is **not** positioned as:
- a general medical assistant
- a broad workplace safety assistant
- a generic SDS Q&A bot
- a PPE recommendation engine
- a general “ask anything” chatbot

---

## 3) Locked strategic decisions

These decisions are now considered fixed unless a true submission blocker appears.

### Scope
- Scope remains strictly **plantation chemical exposure**.
- Demo remains constrained to chemical exposure scenarios, not broader safety workflows.

### Novelty
- Novelty is **model-side first**, product UX second.
- The memorable system behavior is the **controller-backed release policy**, not just “Gemma in an app”.

### Demo policy
- First judge-facing demo uses only the **strongest validated flows**.
- Weak or risky families are handled through **guarded fallback**, not hero demos.
- Do **not** present `sf_24d_inhalation_01` as a current live hero path.

### Product entry
- Do **not** rely on synthetic “pick a demo scenario” UX.
- Primary worker entry is **QR-first chemical identification**.
- Manual chemical selection is the fallback path.
- Voice input is deferred.

### Architecture
Chosen architecture:
- **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**

### Execution style
- Agent is a **workhorse**, not the strategist.
- Strategic decisions remain overseer decisions.
- Avoid scope drift, overengineering, and future-platform theater.

---

## 4) Why this problem framing matters

The worker does not need a long conversation.  
The worker needs the fastest safe path from:

**chemical identification -> incident description -> first-aid actions**

The system deliberately reduces ambiguity before response generation by binding the request to a known demo chemical first.

---

## 5) End-to-end product concept

### Worker flow
1. Choose language
2. Identify chemical by:
   - QR scan first
   - manual chemical selection fallback
3. Describe what happened
4. Receive a structured emergency response:
   - incident summary
   - immediate actions
   - do-not-do guidance
   - escalation guidance
   - response mode
   - fallback explanation when guarded
   - evidence label

### Supported languages
- English
- Malay
- Bangla
- Bahasa Indonesia

### Intended field behavior
- Fast, structured, action-oriented
- Not transcript-oriented
- Not open-ended general chat

---

## 6) Benchmark and evaluation control status

### Phase 6 status
- Evaluation control is closed.
- Official judge lineage is `strict_v6_2026-04-30`.
- Baseline and grounded were verified on the same frozen Bronze core.
- Stale row-id cache issue was fixed.
- Judge was tightened with:
  - hard-fail semantics
  - payload/rubric/model/version cache keys
  - JSON validation / retry logic

### Official headline result
- baseline average `hybrid_total_100`: `38.582`
- grounded average `hybrid_total_100`: `92.008`
- absolute gain: `+53.426`

### Meaning
The dominant performance lever was **grounding**, not base model ability alone.

---

## 7) Model-side design package completed

The model-side design package was completed and aligned around:

- novelty thesis
- candidate architectures
- architecture decision
- response control policy
- response schema
- weak-family fallback policy
- demo path design
- prompt blueprint
- architecture evaluation plan

Chosen architecture:
- **Family-Aware Dual Path with Slot Verification and Fallback Release Gate**

Why it mattered:
- visibly more novel than plain grounded chat
- preserves strong-family gains
- turns weak-family handling into a deliberate safety feature
- creates a memorable judge-facing behavior:
  - the model does **not always release a full answer**

---

## 8) What the controller is

The controller is the **safety-and-routing layer around Gemma**.

It decides:
- what incident this is
- which family the case maps to
- whether the family is strong or weak
- what required action / do-not / escalation slots must be present
- whether a full answer is safe to release
- whether the system should downgrade to guarded mode

Gemma is therefore **not** used as a freeform chatbot.

### Core controller pieces
- incident normalizer
- planner
- strong-lane composer
- guarded-lane composer
- verifier
- release selector

### Deterministic control surfaces
Planner, verifier, and selector remain deterministic.

### Release behavior
The controller can release:
- `full_guided_response`
- `guarded_minimum_response`
- `guarded_escalate_now`

This is the core safety novelty versus plain grounded chat.

---

## 9) Controller implementation progress

### Controller pass 2
Pass 2 became real, not scaffold-only.

Gemma was used for:
- incident normalizer
- strong-lane composer
- guarded-lane composer

### Strict subset result (pass 2 era)
- controller strict average was effectively flat versus prior grounded on the fixed subset
- strong-family lane was preserved overall
- weak-family guarded mode was real and product-visible

### Main remaining issues identified then
- `sf_24d_inhalation_01` regression
- Bangla weak-family failures
- verifier-triggered gating not visible enough

---

## 10) Controller pass 2.6 outcome

Controller Pass 2.6 was a **mixed but valuable** pass.

### What improved
- Bangla weak-family severe failures were materially fixed
- verifier-triggered downgrade/blocking became visibly real

### What did not improve
- `sf_24d_inhalation_01` got worse in the current controller build and therefore should **not** be used as a live hero path

### Important overseer decision
At that point, the project stopped trying to perfect the controller and moved into shipping mode:
- freeze controller direction
- ship with the current controller
- stop broad controller work
- use strongest demo-safe flows
- use guarded mode for riskier cases

---

## 11) Current truthful controller status

### True strengths
- strong-family full guided response can be excellent
- guarded mode is real and visible
- multilingual guarded behavior is credible
- verifier-triggered safety behavior is real

### Current non-hero path
- `sf_24d_inhalation_01` should not be used as a live hero path in the current build

### Current safe live demo emphasis
- English glyphosate eye full-guided flow
- Bangla glufosinate guarded ingestion flow

---

## 12) Backend design and deployment

### Final backend topology
- thin backend gateway is live at `http://20.242.52.182:8080`
- vLLM / Gemma model server runs locally behind it

### App-facing backend routes
- `GET /health`
- `GET /api/catalog`
- `POST /api/resolve-qr`
- `POST /api/respond`

### Backend role
The backend does only what the demo needs:
- health check
- chemical catalog
- QR resolution
- emergency response generation

It does **not** attempt to be:
- a general SDS ingestion platform
- a broad admin platform
- a long-term multi-tenant product backend

### Important scope truth
The backend is designed for **chemical emergency incident handling**, not broad SDS question answering.

---

## 13) What the backend does not reliably support

The backend is **not** currently positioned as a dependable answerer for questions like:
- “what PPE should be used?”
- broad preventive guidance
- general SDS policy lookup

Why:
- `/api/respond` returns an emergency-response-shaped payload
- the system is built around “what happened?” and exposure handling
- current product story is incident/exposure first aid, not full SDS assistant behavior

If PPE support is added later, it should be a separate grounded mode or endpoint, not squeezed into the current emergency-response controller.

---

## 14) Chemical catalog and QR assets

### Demo catalog chemicals
QR/demo chemicals currently include:
- `glyphosate_roundup_demo`
- `glufosinate_basta_demo`
- `24d_amine_demo`
- `fastac_demo`
- `paraquat_demo`

### QR design
- QR encodes the real `qr_value`
- Example pattern:
  - `demo://chemical/<chemical_id>`

### QR generation method
- QR assets are generated **with code**, not manually one by one
- generation script exists
- generated assets are committed as static files
- manifest maps:
  - chemical_id
  - localized display names
  - qr_value
  - generated filename

### Asset format
- SVG QR assets chosen for crisp display and printing

---

## 15) Mobile app status

### Code location
- Mobile app lives under `mobile_code/`

### Stack
- Expo React Native
- TypeScript
- on-device QR scanning with Expo camera

### Architecture boundaries
The mobile app is modularized into:
- UI layer
- API client
- request/response types
- response mapping layer
- state/view-model layer
- QR scan module
- manual chemical selection module
- config layer

### Worker-facing app behavior
- language-first startup
- QR-first entry
- manual fallback
- incident query screen
- response cards
- mode badge
- guarded explanation when applicable
- loading / error / retry states

---

## 16) Mobile hardening status

The mobile app went through a real hardening pass.

### What was fixed
- startup retry now re-runs actual network work
- backend health is checked before app readiness
- key worker-facing UI is localized
- timeout increased from `20000ms` to `45000ms` after live latency exposed a real need

### What was validated before final human phone test
- live backend health
- live catalog load
- live manual chemical selection
- one full guided response render
- one guarded response render
- startup recovery after forced `/health` failure
- startup recovery after forced `/api/catalog` failure
- QR resolution contract

### Limitation that remained at that stage
- native on-device QR proof had not yet been completed in that environment

---

## 17) Final human Android QR smoke proof — completed

This is the major final milestone.

### Human-run real phone validation completed
A real Android phone was used to:
- open the app
- scan the QR
- resolve and lock the chemical
- ask the question
- receive the expected response

### Proven path
- language: English
- chemical: `Roundup / Glyphosate`
- query: `spray went in my eye`
- observed mode: **Full guided response**

### Meaning
This closes the last major technical proof gap:
- **QR-first Android proof is now real**
- manual fallback was already validated
- now both the intended path and fallback path are proven

### Current truthful claim after this proof
- QR-first claim is now justified for the demonstrated Android flow
- manual fallback remains validated and safe
- the system can truthfully claim:
  - QR scan -> chemical lock -> incident query -> full guided response

---

## 18) Mobile runtime warnings observed during final Android test

These were observed during the final Android run:

### Warning 1
- React Native new architecture warning in Expo Go
- suggested action:
  - set `"newArchEnabled": true` in `mobile_code/app.json`

### Warning 2
- `VirtualizedLists should never be nested inside plain ScrollViews...`
- likely from the manual chemical list flow
- this is the one warning worth fixing with a small UI cleanup if time permits

### Warning 3
- touch warning:
  - `Cannot record touch end without a touch start`
- since the app still worked and the QR flow succeeded, this is **not a submission blocker** unless it causes a visible input bug

### Current interpretation
- none of these warnings blocked the successful QR-first proof
- only the VirtualizedList nesting warning is worth a small cleanup if time remains

---

## 19) Demo-safe live flows

### Primary hero flow
**English full-guided flow**
- language: English
- chemical: `Roundup / Glyphosate`
- query: `spray went in my eye`
- expected mode: `full_guided_response`

### Secondary proof flow
**Bangla guarded flow**
- language: Bangla
- chemical: `Basta / Glufosinate`
- query: `মুখে গেছে`
- expected mode: guarded response

### Why these are the best flows
- both are validated
- together they show:
  - full guided response
  - guarded response
  - multilingual capability
  - controller release behavior

### Do not use as live hero path
- `sf_24d_inhalation_01`

---

## 20) Demo operator truth

### Best current spoken truth
- QR-first is the intended worker path
- manual selection is the validated fallback
- strong cases can receive full guided response
- weaker/riskier cases deliberately fall back to guarded response
- the value is not only that Gemma can answer, but that the system constrains how Gemma answers

---

## 21) Submission preparation artifacts completed

The repo now contains:
- QR asset manifest
- demo operator guide
- demo rehearsal pack
- native QR smoke checklist
- final demo storyline
- final submission note
- submission week checklist
- write-up source pack
- merged Kaggle write-up draft

### Write-up source docs available
- problem and entry
- controller and safety
- app and backend flow
- evaluation and validation
- merged Kaggle draft

---

## 22) Kaggle write-up positioning

### Recommended framing
This is:
- a narrow
- grounded
- safety-conscious
- controller-backed
- multilingual
chemical emergency assistant for plantation workers

### Not recommended framing
Do **not** frame it as:
- broad SDS assistant
- general safety copilot
- full workplace compliance product
- universal medical assistant

### Key write-up claims that are now safe
- grounded guidance beats baseline strongly
- controller makes release behavior explicit
- QR-first worker entry reduces ambiguity
- manual fallback is validated
- Android QR-first path has now been proven on a real phone
- guarded release is a deliberate safety feature, not a failure

---

## 23) What evaluators should and should not be expected to do

### Do not expect
- judges/evaluators to install Expo Go and scan dev QR for the project bundle

### Better evaluation paths
- live demo
- recorded demo/video
- repo + write-up
- optionally Android APK, if packaged

### Android
- Android APK is the practical direct-install option if we choose to distribute a runnable build

### iOS
- iOS direct sideload for unknown evaluators is not practical unless using TestFlight / Apple-supported flows
- iOS packaging is not currently the main submission requirement

### Current honest position
- Android live proof exists
- Expo Go was used for development/runtime validation
- production packaging can be added, but submission should not depend on evaluators reproducing Expo Go setup

---

## 24) What remains vs what is done

### Core system status
**Done enough for submission/demo**
- evaluation control
- grounded-vs-baseline proof
- controller novelty and release policy
- thin backend
- mobile app
- manual flow validation
- QR asset generation
- write-up source pack
- Android QR-first proof

### Optional polish remaining
- set `newArchEnabled: true`
- fix nested VirtualizedList warning
- convert absolute local markdown links to relative repo links
- build Android APK if desired
- do final write-up tone polish
- capture final screen recording if desired

### Not required for truthful submission
- voice input
- iOS distribution
- general PPE/SDS question mode
- more controller redesign
- more benchmark work

---

## 25) Final truthful system statement

**Gemma 4 Good is a QR-first, controller-backed chemical emergency guidance system for plantation workers.**  
It is grounded to known demo chemicals, uses a safety-gated release policy rather than generic chat behavior, supports multilingual worker interaction, has a validated manual fallback path, and now has a confirmed Android QR-first scan-to-response proof on a real phone.

---

## 26) Suggested final demo order

1. Open app
2. Choose English
3. Scan QR for `glyphosate_roundup_demo`
4. Confirm chemical locks as `Roundup / Glyphosate`
5. Enter: `spray went in my eye`
6. Show:
   - Full guided response
   - immediate actions
   - do-not-do
   - escalation
   - evidence basis
7. Switch to Bangla
8. Use manual fallback for `Basta / Glufosinate`
9. Enter: `মুখে গেছে`
10. Show:
   - guarded response
   - fallback explanation
   - escalation
   - multilingual UI / response content
11. Close by explaining:
   - the system does not always answer in one mode
   - guarded release is deliberate safety control

---

## 27) Suggested final write-up outline

1. Problem
2. Why generic chat is risky here
3. Narrow plantation chemical scope
4. QR-first worker entry
5. Manual fallback
6. Controller novelty
7. Three release modes
8. Thin backend + mobile app flow
9. Baseline vs grounded evidence
10. Controller / guarded release evidence
11. Mobile validation evidence
12. Android QR-first proof
13. Honest limitations
14. Why this is safer than plain grounded chat

---

## 28) Final submission readiness call

### Current submission state
**Submission-ready**, subject only to final polish.

### Strong truth claims now available
- baseline vs grounded delta is strong
- controller novelty is real
- manual path is validated
- Android QR-first path is validated
- guarded response is visible and meaningful
- demo-safe story is coherent

### Biggest strengths now
- narrow, believable problem framing
- real model-side novelty
- real mobile UX
- QR-first realism
- multilingual demonstration
- honest documentation

### Biggest caution
Do not over-claim beyond the validated scope:
- do not present it as a full SDS/PPE assistant
- do not use `sf_24d_inhalation_01` as live hero path
- do not imply iOS distribution is ready unless actually packaged

---

## 29) Final overseer status

We are no longer in build mode.  
We are in **submission and polish mode**.

Best use of time now:
- polish write-up
- collect final demo screenshots/video
- optional micro-fixes only
- optional Android APK packaging if desired
- submit

---

## 30) Final active product split

This is the final active product truth and should override older experimental narratives.

- online:
  - direct cloud full-response path
- offline:
  - local guarded emergency fallback path

Important truth:

- the APK and the local model remain separate artifacts
- the local model is optional for offline/demo testing
- the earlier online local-first quick-card experiment existed, but it is **not** the active product behavior now

---

## 31) Final Cactus status

### What is proven

- local harness GO still stands
- Android in-app local route is proven
- offline guarded worker-facing response works in the emulator
- local model import/runtime path works on Android

### Current narrow honest claim

- online active path is cloud-direct
- offline active path is local guarded fallback
- the local model remains separate from the APK

### What is not the active current claim

- the earlier online local-first quick-card plus cloud-upgrade experiment is not the active product behavior now

---

## 32) Release and distribution status

### Measured artifact sizes

- release APK: about `84 MB`
- local model runtime folder: about `6.3 GB`

### Recommended release strategy

- publish APK through GitHub Releases
- publish the offline local-model pack separately as an optional asset
- keep the normal judge install path online-first
- treat offline/local-model testing as optional advanced setup

### One-time local model import

- helper script:
  - `mobile_code/scripts/prepare_cactus_internal_model.sh`
- canonical Android runtime model path:
  - `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`

### Honest distribution truth

- do not bundle the model into the APK
- do not hide the separate import requirement for offline use

---

## 33) Multilingual QA final status

### Supported languages tested

- English
- Malay
- Bangla
- Bahasa Indonesia

### What was tested

For each language:

- one offline guarded flow
- one online flow

### Current in-session localization truth

- visible mode/status banner changes with selected language
- readiness/status wording changes with selected language
- response labels change with selected language
- error/loading wording changes with selected language

### Remaining notable localization defect

- selected language does not persist across a full app relaunch

---

## 34) Final remaining defects and caveats

These remain open and should not be hidden.

- offline local latency is still high in the emulator
- selected language does not persist across full relaunch
- offline setup is more complex because the local model import is a separate step
- multilingual quality is meaningful and usable, but not equally polished across all four languages
- online path is strongest and should remain the primary judge demo path

---

## 35) Final submission state

### Submission-ready now

- online cloud-backed app demo
- QR-first story with manual fallback
- multilingual in-session UI and response behavior
- separate APK distribution
- optional offline guarded fallback demonstration with separate model import

### Optional advanced testing

- offline guarded fallback after importing the local model
- judge/operator verification of the separate model pack flow

### Still imperfect but acceptable

- slower offline local response in emulator
- language reset after full app relaunch
- offline setup complexity because the model is separate from the APK

### Intentionally out of scope

- bundling the model into the APK
- TTS
- voice input
- reopening the online local-first hybrid experiment
- broad SDS/PPE assistant behavior
