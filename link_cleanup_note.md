# Link Cleanup Note

This pass was limited to GitHub usability cleanup for the final submission pack.

What was normalized:

- submission-facing markdown links use repo-relative paths
- `all_md_files/` documents link back to root-level docs and assets with correct relative paths
- implementation-note docs link to `mobile_code/` files using repo-relative paths

What was intentionally not converted into markdown links:

- local build-output paths such as `mobile_code/android/app/build/outputs/apk/release/app-release.apk`

Why:

- they are truthful workspace facts
- they are not stable GitHub asset locations
- judges should use the GitHub Release asset path described in the release docs instead

This cleanup did not change product behavior, architecture claims, or the active submission story.
