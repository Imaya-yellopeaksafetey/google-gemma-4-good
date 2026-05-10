# Strong Family Recovery Report

## Target

- family: `sf_24d_inhalation_01`
- pass2 average: `90.352`
- pass2.6 average: `76.680`
- delta: `-13.672`

## What changed

- strong-lane prompt now forbids strengthening a conditional escalation into unconditional immediate escalation
- strong-lane payload now includes escalation condition and escalation mode
- verifier now blocks unconditional escalation on families whose source escalation is conditional

## By language

- `bahasa_indonesia`: pass2 `85.781` -> pass2.6 `75.000`
- `bangla`: pass2 `89.844` -> pass2.6 `97.969`
- `english`: pass2 `100.000` -> pass2.6 `66.875`
- `malay`: pass2 `85.781` -> pass2.6 `66.875`
