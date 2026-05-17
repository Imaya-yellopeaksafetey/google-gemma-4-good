# Offline Backup Runtime Target Note

The runtime-ready installed folder target remains:

- `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`

Important truth:

- the downloaded `gemma-4-e2b-it-pack.tar.zst` file is not runtime-ready by itself
- the app only treats offline backup as available after unpack/install completes into the canonical folder above
- readiness is then confirmed through the same local runtime checks already used by the app
