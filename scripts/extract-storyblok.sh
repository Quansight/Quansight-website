#!/usr/bin/env bash
set -euo pipefail

: "${STORYBLOK_TOKEN:?Set STORYBLOK_TOKEN in your environment}"
DUMP_DIR="storyblok-dump"
mkdir -p "$DUMP_DIR"

# how many pages do we need?
TOTAL=$(curl -sI "https://api.storyblok.com/v2/cdn/stories?token=$STORYBLOK_TOKEN&per_page=100&version=draft" \
  | awk '/^[Tt]otal:/ {print $2}' | tr -d '\r')
PAGES=$(( (TOTAL + 99) / 100 ))
echo "Total stories: $TOTAL → fetching $PAGES page(s)"

# fetch each page
for page in $(seq 1 "$PAGES"); do
  echo "  page $page..."
  curl -s "https://api.storyblok.com/v2/cdn/stories?token=$STORYBLOK_TOKEN&per_page=100&page=$page&version=draft" \
    > "$DUMP_DIR/stories-page-$page.json"
done

# datasources
echo "Fetching datasources..."
curl -s "https://api.storyblok.com/v2/cdn/datasources?token=$STORYBLOK_TOKEN" \
  > "$DUMP_DIR/datasources.json"

jq -r '.datasources[].slug' "$DUMP_DIR/datasources.json" | while read -r slug; do
  echo "  datasource: $slug"
  curl -s "https://api.storyblok.com/v2/cdn/datasource_entries?token=$STORYBLOK_TOKEN&datasource=$slug&per_page=1000" \
    > "$DUMP_DIR/datasource-$slug.json"
done

# quick sanity check
echo
echo "=== Inventory ==="
jq -r '.stories[].content.component' "$DUMP_DIR"/stories-page-*.json | sort | uniq -c | sort -rn
