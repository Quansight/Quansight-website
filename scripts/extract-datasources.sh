#!/usr/bin/env bash
set -euo pipefail

OUT_DIR=apps/labs/content/data
mkdir -p "$OUT_DIR"

# person-roles → simple JSON array, preserve order
jq '[.datasource_entries[].value]' \
  storyblok-dump/datasource-person-roles.json \
  > "$OUT_DIR/person-roles.json"

# projects → sorted alphabetically for readability
jq '[.datasource_entries[].value] | sort' \
  storyblok-dump/datasource-projects.json \
  > "$OUT_DIR/projects.json"

echo "Wrote:"
echo "  person-roles.json ($(jq length "$OUT_DIR/person-roles.json") entries)"
echo "  projects.json    ($(jq length "$OUT_DIR/projects.json") entries)"
