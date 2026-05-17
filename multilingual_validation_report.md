# Multilingual Validation Report

Evaluator note:

- these are emulator-based QA findings
- language quality scores below are evaluator estimates, not formal linguistic certification

## Test Setup

- target: `emulator-5554`
- app build: release APK
- online truth: direct cloud full-response path
- offline truth: local guarded fallback path

## English

### Offline

- tested with offline guarded mode
- worker-facing banner and readiness card displayed in English
- local guarded response rendered successfully
- observed working emergency content example:
  - fresh-air / inhalation path

### Online

- tested with connected cloud path
- realistic nearby-body phrasing entered:
  - `spray went into my ear`
- cloud-backed response rendered
- status wording and response labels remained English

### Native-language usability

- offline: yes
- online: yes

### Coherence estimate

- clarity: strong
- grammar/fluency: strong
- worker usability: strong
- overall estimate: `93%`

## Malay

### Offline

- language selection and status card localized correctly
- offline guarded response rendered successfully
- observed response labels:
  - `Respons minimum berjaga-jaga`
  - `Tindakan segera`
- notable latency: high in emulator, roughly well over 1 minute before final render

### Online

- manual selection path localized correctly
- short worker-style query used:
  - `mata`
- connected cloud response rendered
- visible response labels included:
  - `Respons berpandu penuh`
  - `Ringkasan insiden`

### Native-language usability

- offline: yes, but slower than ideal
- online: yes

### Coherence estimate

- clarity: good
- grammar/fluency: good
- semantic fit: good
- worker usability: good
- overall estimate: `87%`

## Bangla

### Offline

- Bangla selection verified from the UI tree
- status banner and readiness card switched to Bangla correctly
- manual fallback, incident chips, and submit label were localized
- offline guarded response rendered successfully
- observed response labels:
  - `সতর্ক ন্যূনতম প্রতিক্রিয়া`
  - `তাৎক্ষণিক করণীয়`
- notable latency: high in emulator

### Online

- Bangla selection verified again in connected mode
- online status banner and readiness card stayed in Bangla
- manual fallback path completed
- cloud-backed response rendered with Bangla labels
- observed response included:
  - `ঘটনার সারাংশ`
  - `তাৎক্ষণিক করণীয়`
- for the tested case, the connected response still came back in a guarded-minimum lane rather than a richer full lane

### Native-language usability

- offline: yes
- online: yes, though the tested connected lane stayed relatively guarded

### Coherence estimate

- clarity: fair to good
- grammar/fluency: good enough
- semantic fit: good
- worker usability: fair to good
- overall estimate: `82%`

## Bahasa Indonesia

### Offline

- Indonesian selection verified
- mode banner and readiness card localized correctly
- offline guarded response rendered successfully
- observed response labels:
  - `Respons minimum berjaga`
  - `Tindakan segera`
- notable latency: high in emulator

### Online

- Indonesian selection verified in connected mode
- online status and readiness wording stayed Indonesian
- connected cloud response rendered successfully
- observed response labels:
  - `Respons panduan penuh`
  - `Ringkasan kejadian`

### Native-language usability

- offline: yes
- online: yes

### Coherence estimate

- clarity: good
- grammar/fluency: good
- semantic fit: good
- worker usability: good
- overall estimate: `89%`

## UI Localization Correctness

### Confirmed correct in-session behavior

Across all four languages, the following changed with the selected language during active app use:

- mode/status banner
- readiness card title and values
- incident screen heading and warning notice
- manual fallback wording
- response labels
- error/loading wording

### Confirmed issue

- after a full app relaunch, the language resets to the default English state
- this means language selection is not currently persisted across restarts

## Realistic Worker Query Coverage

Observed across the QA set:

- realistic nearby-body phrasing:
  - English online: `spray went into my ear`
- short/simple worker phrasing:
  - Malay online: `mata`
  - Bangla offline: localized eye chip
  - Bahasa Indonesia offline/online: localized eye chip
- direct emergency chip-style phrasing:
  - English offline: inhalation chip path

## Overall Multilingual Verdict

- English: strongest and cleanest
- Malay: understandable and usable; offline latency is the main weakness
- Bangla: understandable and meaningfully usable, but the weakest overall polish of the four
- Bahasa Indonesia: strong and coherent

## Key Practical Finding

The multilingual wording is now substantially language-driven in-session.

The two biggest remaining quality issues are:

- language persistence does not survive a full restart
- offline local guarded latency is still high in emulator, especially outside English
