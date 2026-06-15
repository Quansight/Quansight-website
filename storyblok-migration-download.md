# Storyblok content extraction

One-time export of all Quansight Labs content from Storyblok into this repo.
The extracted files are committed; the scripts are kept in
`storyblok-extraction-scripts/` for reference and reproducibility.

Companion document: `migration-plan.md` (full strategy, data quality findings,
future maintenance).

## What was extracted

| Output               | Path                                          |
| -------------------- | --------------------------------------------- |
| Person records       | `apps/labs/people/*.md`                       |
| Person photos        | `apps/labs/public/images/people/`             |
| Datasources          | `apps/labs/data/{person-roles,projects}.json` |
| Header               | `apps/labs/data/header.yml`                   |
| Footer               | `apps/labs/data/footer.yml`                   |
| Pages                | `apps/labs/page/*.yml`                        |
| Page and site assets | `apps/labs/public/images/`                    |

## Scripts

All scripts run from the repo root and require a Storyblok preview token in
`apps/labs/.env`.

| Script                   | What it does                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `extract-storyblok.sh`   | Dumps all stories and datasources from the Storyblok API into `storyblok-dump/`                   |
| `extract-people.py`      | Converts person stories → `people/*.md` with YAML frontmatter; builds the asset download manifest |
| `extract-datasources.sh` | Converts datasources → `data/person-roles.json` and `data/projects.json`                          |
| `extract-header.py`      | Converts the header singleton → `data/header.yml`                                                 |
| `extract-footer.py`      | Converts the footer singleton → `data/footer.yml`                                                 |
| `extract-pages.py`       | Converts page stories → `page/*.yml`; rich text is rendered to Markdown                           |
| `download-assets.py`     | Downloads all images from the asset manifest into `public/images/`; idempotent                    |
| `featured-svg-to-png.py` | Converts featured SVG images to PNG for social media preview cards                                |

Data quality issues found during extraction are documented in `migration-plan.md` § 1.7.
