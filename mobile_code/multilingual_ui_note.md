# Multilingual UI Note

## Scope of the pass

This pass did not add a large localization framework. It added one lightweight explicit string table:

- `src/i18n/strings.ts`

Supported worker-facing UI languages:

- English
- Malay
- Bangla
- Bahasa Indonesia

## UI text now localized

- entry guidance
- camera permission prompt
- manual fallback label
- incident heading
- incident quick chips
- incident placeholder
- submit button
- retry / reset labels
- startup loading text
- response section headings
- response mode labels

## Important control-path change

The selected language now affects:

- backend `target_language`
- catalog display names
- app UI labels
- response mode badge labels
- response section titles

Response mode localization is applied in:

- `src/mappers/responseMapper.ts`

## Live evidence

Bangla guarded response render confirms that worker-facing UI text is no longer English-only:

- `validation_artifacts/guarded_bangla.png`
