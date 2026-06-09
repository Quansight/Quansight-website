#!/usr/bin/env python3
"""Extract Storyblok header → apps/labs/data/header.yml + queue logo for download."""

import json
from glob import glob
from pathlib import Path

OUT = Path("apps/labs/data/header.yml")
DUMP_GLOB = "storyblok-dump/stories-page-*.json"
ASSET_MANIFEST = Path("storyblok-dump/asset-manifest.tsv")


def yaml_str(s):
    if s is None:
        return '""'
    escaped = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def resolve_url(cached_url: str) -> str:
    """Map Storyblok story slug → site path. 'home' → '/', else → '/<slug>'."""
    if cached_url in ("", "home", "/"):
        return "/"
    return f"/{cached_url}"


def find_story(component: str):
    for path in sorted(glob(DUMP_GLOB)):
        for story in json.loads(Path(path).read_text())["stories"]:
            if story["content"].get("component") == component:
                return story
    raise SystemExit(f"No {component!r} story found")


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    story = find_story("header")
    c = story["content"]

    # logo asset
    logo_url = c["logo"]["filename"]
    logo_filename = logo_url.rsplit("/", 1)[-1]
    logo_local = f"/images/logos/{logo_filename}"

    # navigation
    nav_items = [
        {"text": link["linkText"], "href": resolve_url(link["linkUrl"]["cached_url"])}
        for link in c.get("navigation", [])
    ]

    lines = [
        "# Generated from Storyblok export. Edit freely.",
        "",
        "logo:",
        f"  src: {yaml_str(logo_local)}",
        f"  alt: {yaml_str(c['logo'].get('alt', ''))}",
        "",
        "navigation:",
    ]
    for item in nav_items:
        lines.append(f"  - text: {yaml_str(item['text'])}")
        lines.append(f"    href: {yaml_str(item['href'])}")
    lines += [
        "",
        f"skipLinksText: {yaml_str(c.get('skipLinksText', ''))}",
        f"bookACallLinkText: {yaml_str(c.get('bookACallLinkText', ''))}",
        "",
    ]

    OUT.write_text("\n".join(lines))
    print(f"Wrote {OUT}")

    # append logo to existing asset manifest (idempotent — duplicates are harmless)
    with ASSET_MANIFEST.open("a") as f:
        f.write(f"{logo_url}\t.{logo_local}\n")
    print(f"Appended logo to {ASSET_MANIFEST}")


if __name__ == "__main__":
    main()
