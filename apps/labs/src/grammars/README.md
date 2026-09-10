# Vendored TextMate grammars

Shiki (via Astro's markdown pipeline) does not bundle an MLIR grammar, so we vendor
one here and register it in `astro.config.mjs` under `markdown.shikiConfig.langs`.

## mlir.tmLanguage.json

- **Source:** https://github.com/llvm/vscode-mlir — `grammar.json` (fetched from `main`)
- **License:** Apache License v2.0 with LLVM Exceptions
- **License text:** `LICENSE-mlir` in this directory, copied from
  https://github.com/llvm/vscode-mlir/blob/main/LICENSE

The file is committed verbatim. Its `name` field is `MLIR`, which Shiki would use as the
fence identifier, so `astro.config.mjs` overrides it to lowercase `mlir` at registration
time. Update by re-downloading `grammar.json` from upstream; do not hand-edit.
