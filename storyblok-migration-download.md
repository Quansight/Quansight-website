# Storyblok → Repo Migration Playbook

Step-by-step record of how we extracted all Quansight Labs content from
Storyblok into the git repo. Reproducible end-to-end: someone with the
preview token and `scripts/` could re-run this in under an hour.

Companion document: `migration-plan.md` (full strategy, data quality
findings, future maintenance).

## Result

| Output | Path | Count |
|---|---|---|
| Person records | `apps/labs/people/*.md` | 106 |
| Person photos | `apps/labs/public/images/people/*` | 106 |
| Datasources | `apps/labs/data/{person-roles,projects}.json` | 2 |
| Header singleton | `apps/labs/data/header.yml` + logo | 1 + 1 |
| Footer singleton | `apps/labs/data/footer.yml` + logos & icons | 1 + 5 |
| Pages | `apps/labs/page/*.yml` | 6 |
| Page assets | `apps/labs/public/images/page-assets/*` | ~30 |
| Logos & icons | `apps/labs/public/images/{logos,icons}/*` | ~7 |

## Prerequisites

- Storyblok preview token. Already present in `apps/labs/.env` as
  `NEXT_PUBLIC_STORYBLOK_TOKEN` (or similar). The extraction script auto-loads
  it from there.
- `python3` (with stdlib only for most scripts; **PyYAML** required for
  `extract-pages.py`):
- `jq`, `curl`, `bash`. All standard on macOS/Linux.

## Steps

Run from repo root. Each step is independent and idempotent — safe to re-run.

### 1. Dump everything from Storyblok

```bash
./scripts/extract-storyblok.sh
```

Pulls all stories (paginated), both datasources, and prints a top-level
inventory. Output: `storyblok-dump/*.json`. Expected: 115 stories, 2
datasources, inventory of `106 person / 7 page / 1 header / 1 footer`.

### 2. Extract people → markdown

```bash
python3 scripts/extract-people.py
```

One file per person at `apps/labs/people/<slug>.md` with YAML frontmatter
(firstName, lastName, role, image path, githubNick, projects, etc.).
Also writes the initial `storyblok-dump/asset-manifest.tsv` (106 entries).

### 3. Extract datasources → JSON

```bash
./scripts/extract-datasources.sh
```

`apps/labs/data/person-roles.json` (2 entries) and `projects.json`
(59 entries, sorted alphabetically). Both are flat JSON arrays.

### 4. Extract header → YAML

```bash
python3 scripts/extract-header.py
```

`apps/labs/data/header.yml`. Appends header logo URL to the asset manifest.

### 5. Extract footer → YAML

```bash
python3 scripts/extract-footer.py
```

`apps/labs/data/footer.yml` with logo (4 responsive variants), contact
section, navigation, and social-media links. Appends 6 asset URLs to the
manifest.

Note one of the footer images is missing.

### 6. Extract pages → YAML

```bash
python3 scripts/extract-pages.py
```

`apps/labs/page/<slug>.yml` for each of the 6 user-facing pages (the empty
`test` page is skipped). Each block becomes a `{type, ...props}` entry;
rich text is rendered to Markdown. ~30 page assets queued in the manifest.

### 7. Download all assets

```bash
python3 scripts/download-assets.py --out-dir apps/labs/public
```

Reads `asset-manifest.tsv`, downloads everything to
`apps/labs/public/images/{people,logos,icons,page-assets}/`. Idempotent —
re-runs skip already-downloaded files. Uses 8 parallel workers.

## Integrity checks

Run these to confirm the extracted content is internally consistent:

```bash
# every project name referenced by a person exists in the projects allow-list
comm -23 \
  <(grep -h '^  - ' apps/labs/people/*.md | sed 's/^  - "\(.*\)"$/\1/' | sort -u) \
  <(jq -r '.[]' apps/labs/data/projects.json | sort -u)
# (should be empty)

# every role used by a person exists in the role allow-list
comm -23 \
  <(grep -h '^role: ' apps/labs/people/*.md | sed 's/^role: "\(.*\)"$/\1/' | sort -u) \
  <(jq -r '.[]' apps/labs/data/person-roles.json | sort -u)
# (should be empty)

# every asset path referenced in YAML/MD content exists on disk
grep -rohE '/images/[^" ]+' apps/labs/page apps/labs/data apps/labs/people \
  | sort -u | while read p; do
    [ -f "apps/labs/public$p" ] || echo "MISSING: $p"
  done
```

## Data quality fixes applied during extraction

See `migration-plan.md` § 1.7 for the full table. Summary:

- `Napari` → `napari` (case normalization in one person record).
- `labs-logo-footer.png`: original Storyblok asset returns 403 (S3 object
  deleted). Substituted `srcTablet` variant (same 226×62 dimensions) as `src`.
- Footer schema typo `logoMogile` (duplicate of `logoMobile`) dropped.
- Footer email link normalized to `mailto:connect@quansight.com` (was missing
  scheme).
- conda-forge project link `github.com/conda-forge` auto-prepended with
  `https://` during extraction.
- Editor noise in rich text (default-black `textStyle` color marks) stripped.
- `test` page (empty body, dev artifact) excluded.

Content typos and authoring issues (preserved verbatim, flagged in
`migration-plan.md` for editorial review): `"Sampel description"`,
`"diffrent"` ×4, `"technTology"`, `"illustarion"` (filename), `"hero
placeholder"` alt text, whole-sentence link on home page, empty alt on
decorative logos.

