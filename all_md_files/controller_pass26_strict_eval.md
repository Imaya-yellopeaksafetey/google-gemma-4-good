# Controller Pass 2.6 Strict Eval

- Controller strict average hybrid_total_100: `93.022`
- Strong-family average hybrid_total_100: `93.535`
- Weak-family average hybrid_total_100: `92.510`

- `sf_24d_inhalation_01` pass2: `90.352`
- `sf_24d_inhalation_01` pass2.6: `76.680`
- `sf_24d_inhalation_01` delta: `-13.672`

## Bangla weak-family targeted before vs after

- `sf_24d_ingestion_01`: pass2 `74.844` -> pass2.6 `91.250` | grounded reference `87.031`
- `sf_glufosinate_ingestion_01`: pass2 `57.344` -> pass2.6 `91.250` | grounded reference `80.469`
- `sf_paraquat_inhalation_01`: pass2 `60.469` -> pass2.6 `93.594` | grounded reference `85.312`

## Verifier-triggered gating visibility

- activation-set downgrades: `15`
- activation-set blocked unsupported detail cases: `13`
- activation-set missing-required-slot cases: `4`
