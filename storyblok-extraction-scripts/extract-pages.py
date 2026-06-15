#!/usr/bin/env python3
"""Extract Storyblok pages → apps/labs/page/<slug>.yml + queue page assets.

One file per page. Each block becomes a {type, ...props} entry. Rich text is
rendered to Markdown. Asset URLs are rewritten to local paths and appended to
the shared asset manifest for download.
"""

import json
from glob import glob
from pathlib import Path

try:
    import yaml
except ImportError:
    raise SystemExit(
        "PyYAML is required. Install with:\n"
        "  python3 -m pip install pyyaml --break-system-packages"
    )

PAGE_DIR = Path("apps/labs/page")
DUMP_GLOB = "storyblok-dump/stories-page-*.json"
ASSET_MANIFEST = Path("storyblok-dump/asset-manifest.tsv")
ASSET_SUBDIR = "images/page-assets"

SKIP_PAGES = {"test"}  # empty body, dev artifact


# Multi-line strings as YAML block literals — much nicer for markdown
def _str_presenter(dumper, data):
    style = "|" if "\n" in data else None
    return dumper.represent_scalar("tag:yaml.org,2002:str", data, style=style)


yaml.add_representer(str, _str_presenter)


# --- Rich text (TipTap) → Markdown -----------------------------------------

def _text_with_marks(node):
    text = node.get("text", "")
    for mark in node.get("marks", []):
        t = mark.get("type")
        attrs = mark.get("attrs", {})
        if t == "bold":
            text = f"**{text}**"
        elif t == "italic":
            text = f"*{text}*"
        elif t == "code":
            text = f"`{text}`"
        elif t == "link":
            href = attrs.get("href", "") or ""
            if attrs.get("linktype") == "email" and not href.startswith("mailto:"):
                href = f"mailto:{href}"
            text = f"[{text}]({href})"
        # textStyle (color noise from the editor): stripped intentionally
    return text


def _render_inline(content):
    parts = []
    for node in content or []:
        t = node.get("type")
        if t == "text":
            parts.append(_text_with_marks(node))
        elif t == "hard_break":
            parts.append("  \n")
    return "".join(parts)


def _render_block(node):
    t = node.get("type")
    if t == "paragraph":
        return _render_inline(node.get("content", []))
    if t == "heading":
        level = node.get("attrs", {}).get("level", 1)
        return "#" * level + " " + _render_inline(node.get("content", []))
    if t == "bullet_list":
        return "\n".join(
            "- " + _render_inline(item.get("content", [{}])[0].get("content", []))
            for item in node.get("content", [])
        )
    if t == "ordered_list":
        return "\n".join(
            f"{i+1}. " + _render_inline(item.get("content", [{}])[0].get("content", []))
            for i, item in enumerate(node.get("content", []))
        )
    if t == "horizontal_rule":
        return "---"
    if t == "code_block":
        body = "".join(c.get("text", "") for c in node.get("content", []))
        lang = (node.get("attrs", {}) or {}).get("class", "") or ""
        return f"```{lang}\n{body}\n```"
    # fallback: just render whatever inline content exists
    return _render_inline(node.get("content", []))


def richtext_to_markdown(rich):
    if not isinstance(rich, dict) or rich.get("type") != "doc":
        return ""
    out = []
    for block in rich.get("content", []):
        rendered = _render_block(block)
        if rendered:
            out.append(rendered)
    return "\n\n".join(out).strip()


# --- URL + asset helpers ---------------------------------------------------

def resolve_link(field):
    if not isinstance(field, dict):
        return ""
    cached = field.get("cached_url", "") or ""
    if not cached:
        return ""
    linktype = field.get("linktype")
    if linktype == "email":
        return cached if cached.startswith("mailto:") else f"mailto:{cached}"
    if linktype == "url":
        # auto-prepend https:// if obviously missing protocol
        if not cached.startswith(("http://", "https://", "mailto:", "tel:", "/")):
            if "." in cached:
                cached = "https://" + cached  # fixes: github.com/conda-forge → https://...
        return cached
    # internal story link
    if cached in ("home", "/"):
        return "/"
    return f"/{cached}"


def asset_to_local(asset, collected):
    if not isinstance(asset, dict):
        return None, ""
    url = asset.get("filename", "") or ""
    if not url:
        return None, ""
    filename = url.rsplit("/", 1)[-1]
    local = f"/{ASSET_SUBDIR}/{filename}"
    collected.append((url, local))
    return local, asset.get("alt", "") or ""


# --- Block converters (one per top-level block type) -----------------------

def _hero(b, a):
    src, alt = asset_to_local(b.get("image"), a)
    return {
        "type": "hero",
        "image": src,
        "imageAlt": alt,
        "title": b.get("title", ""),
        "subTitle": b.get("subTitle", ""),
        "variant": b.get("variant", ""),
        "objectFit": b.get("objectFit", ""),
    }


def _statute(b, a):
    return {
        "type": "statute",
        "title": b.get("title", ""),
        "sections": [
            {"title": s.get("title", ""), "text": richtext_to_markdown(s.get("text"))}
            for s in b.get("sections", [])
        ],
    }


def _team(b, a):
    return {
        "type": "team",
        "role": b.get("role", ""),
        "header": b.get("header", ""),
        "variant": b.get("variant", ""),
        "imagesShape": b.get("imagesShape", ""),
    }


def _column_article(b, a):
    src, alt = asset_to_local(b.get("image"), a)
    return {
        "type": "column-article",
        "header": b.get("header", ""),
        "image": src,
        "imageAlt": alt,
        "leftColumn": richtext_to_markdown(b.get("leftColumn")),
        "rightColumn": richtext_to_markdown(b.get("rightColumn")),
        "final": richtext_to_markdown(b.get("final")),
    }


def _teaser(b, a):
    src, alt = asset_to_local(b.get("image"), a)
    return {
        "type": "teaser",
        "title": b.get("title", ""),
        "text": b.get("text", ""),
        "color": b.get("color", ""),
        "image": src,
        "imageAlt": alt,
        "link": resolve_link(b.get("link")),
        "buttonText": b.get("buttonText", ""),
    }


def _logos(b, a):
    grid = []
    for img in b.get("grid", []):
        src, alt = asset_to_local(img, a)
        if src:
            grid.append({"src": src, "alt": alt})
    return {
        "type": "logos",
        "title": b.get("title", ""),
        "colorVariant": b.get("colorVariant", ""),
        "linkUrl": resolve_link(b.get("linkUrl")),
        "linkTitle": b.get("linkTitle", ""),
        "grid": grid,
    }


def _page_heading(b, a):
    return {
        "type": "page-heading",
        "title": b.get("title", ""),
        "description": b.get("description", ""),
    }


def _projects(b, a):
    items = []
    for item in b.get("projects", []):
        src, alt = asset_to_local(item.get("image"), a)
        items.append({
            "title": item.get("title", ""),
            "image": src,
            "imageAlt": alt,
            "link": resolve_link(item.get("projectLink")),
            "linkText": item.get("linkText", ""),
            "shortDescription": richtext_to_markdown(item.get("shortDescription")),
            "longDescription": richtext_to_markdown(item.get("longDescription")),
        })
    return {"type": "projects", "items": items}


CONVERTERS = {
    "hero": _hero,
    "statute": _statute,
    "team": _team,
    "column-article": _column_article,
    "teaser": _teaser,
    "logos": _logos,
    "page-heading": _page_heading,
    "projects": _projects,
}


def main():
    PAGE_DIR.mkdir(parents=True, exist_ok=True)
    assets = []
    seen_filenames = {}  # local path → first source URL (collision detection)
    written = 0
    skipped = 0
    unknown = set()

    for path in sorted(glob(DUMP_GLOB)):
        for story in json.loads(Path(path).read_text())["stories"]:
            if story["content"].get("component") != "page":
                continue

            slug = story["full_slug"].split("/")[-1]
            if slug in SKIP_PAGES:
                print(f"  SKIP {slug} (in skip list)")
                skipped += 1
                continue
            body = story["content"].get("body") or []
            if not body:
                print(f"  SKIP {slug} (empty body)")
                skipped += 1
                continue

            blocks = []
            for raw in body:
                comp = raw.get("component")
                conv = CONVERTERS.get(comp)
                if not conv:
                    print(f"  WARN  unknown block {comp!r} on page {slug!r}")
                    unknown.add(comp)
                    continue
                blocks.append(conv(raw, assets))

            page = {"slug": slug, "blocks": blocks}
            out = PAGE_DIR / f"{slug}.yml"
            out.write_text(
                "# Generated from Storyblok export. Edit freely.\n"
                + yaml.dump(page, sort_keys=False, allow_unicode=True, width=100)
            )
            print(f"  wrote {out}")
            written += 1

    # asset collision detection
    collisions = []
    for url, local in assets:
        prev = seen_filenames.get(local)
        if prev and prev != url:
            collisions.append((local, prev, url))
        else:
            seen_filenames[local] = url
    if collisions:
        print("\nERROR: filename collisions detected — multiple Storyblok assets")
        print("would write to the same local path. Disambiguate before downloading.")
        for local, a, b in collisions:
            print(f"  {local}:\n    {a}\n    {b}")
        raise SystemExit(1)

    # append unique assets to manifest
    with ASSET_MANIFEST.open("a") as f:
        for url, local in dict((url, local) for url, local in assets).items():
            f.write(f"{url}\t.{local}\n")

    print()
    print(f"Pages written:  {written}")
    print(f"Pages skipped:  {skipped}")
    print(f"Assets queued:  {len(set(u for u, _ in assets))} unique")
    if unknown:
        print(f"Unknown block types encountered: {sorted(unknown)}")
    print()
    print("Next: download new assets")
    print("  python3 scripts/download-assets.py --out-dir apps/labs/public")


if __name__ == "__main__":
    main()
