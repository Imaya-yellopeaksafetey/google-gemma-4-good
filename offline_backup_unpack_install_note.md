# Offline Backup Unpack Install Note

The app unpacks the `tar.zst` artifact natively on Android.

Implementation details:

- `zstd-jni` is used to read the compressed stream
- `commons-compress` is used to read the tar archive
- unpack target is a temporary install folder:
  - `.../no_backup/cactus/gemma-4-e2b-it-installing`
- after extraction and shape check, the temporary folder is promoted to:
  - `/data/user/0/com.imaya.gemmasoteria/no_backup/cactus/gemma-4-e2b-it`

Install safeguards:

- archive paths are normalized to prevent path traversal
- `config.txt` must exist before promotion
- the archive is not treated as runtime-ready

Current validation truth:

- install code compiled successfully into the release APK
- full unpack completion was not observed end-to-end in the emulator during this sprint
