#!/usr/bin/env python3
"""Extract Storyblok footer → apps/labs/data/footer.yml + queue assets."""

import json
from glob import glob
from pathlib import Path

OUT = Path("apps/labs/data/footer.yml")
DUMP_GLOB = "storyblok-dump/stories-page-*.json"
ASSET_MANIFEST = Path("storyblok-dump/asset-manifest.tsv")


def yaml_str(s):
    if s is None or s == "":
        return '""'
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def resolve_link(url_field):
    linktype = url_field.get("linktype")
    cached = url_field.get("cached_url", "") or ""
    if linktype == "url":
        return cached
    if linktype == "email":
        return cached if cached.startswith("mailto:") else f"mailto:{cached}"
    if cached in ("", "home", "/"):
        return "/"
    return f"/{cached}"


def local_path(url, subdir):
    return f"/{subdir}/{url.rsplit('/', 1)[-1]}"


def flatten_richtext(rich):
    """Storyblok TipTap doc → list of {text, href?, kind?}."""
    items = []
    for node in rich.get("content", []):
        if node.get("type") != "paragraph":
            continue
        for child in node.get("content", []):
            if child.get("type") != "text":
                continue
            item = {"text": child.get("text", "")}
            for mark in child.get("marks", []):
                if mark.get("type") == "link":
                    a = mark.get("attrs", {})
                    href = a.get("href", "")
                    if a.get("linktype") == "email" and not href.startswith("mailto:"):
                        href = f"mailto:{href}"
                    item["href"] = href
                    item["kind"] = a.get("linktype") or "url"
            items.append(item)
            break  # one text item per paragraph (matches current data)
    return items


def find_story(component):
    for path in sorted(glob(DUMP_GLOB)):
        for story in json.loads(Path(path).read_text())["stories"]:
            if story["content"].get("component") == component:
                return story
    raise SystemExit(f"No {component!r} story found")


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = find_story("footer")["content"]

    cols = {col.get("component"): col for col in c.get("columns", [])}
    assets = []  # (url, local)

    # logo column
    logo = cols.get("footer-logo", {})
    logo_alt = logo.get("logo", {}).get("alt", "")
    logo_paths = {}
    for key, field in [("src", "logo"), ("srcMobile", "logoMobile"),
                       ("srcTablet", "logoTablet"), ("srcDesktop", "logoDesktop")]:
        url = logo.get(field, {}).get("filename", "")
        if url:
            local = local_path(url, "images/logos")
            logo_paths[key] = local
            assets.append((url, local))

    # contact column
    contact = cols.get("footer-contact", {})
    contact_lines = flatten_richtext(contact.get("contact", {}))

    # navigation column
    nav = cols.get("footer-navigation", {})
    nav_links = [
        {"text": l["linkText"], "href": resolve_link(l["linkUrl"])}
        for l in nav.get("links", [])
    ]

    # social column
    social = cols.get("footer-social-media", {})
    social_links = []
    for l in social.get("links", []):
        item = {"text": l["linkText"], "href": resolve_link(l["linkUrl"])}
        icon_url = l.get("linkImage", {}).get("filename", "")
        if icon_url:
            icon_local = local_path(icon_url, "images/icons")
            item["icon"] = icon_local
            item["iconAlt"] = l.get("linkImage", {}).get("alt") or ""
            assets.append((icon_url, icon_local))
        social_links.append(item)

    # emit YAML
    out = ["# Generated from Storyblok export. Edit freely.", ""]
    out.append(f"copyright: {yaml_str(c.get('copyright', ''))}")
    out.append("")

    out.append("logo:")
    for k in ("src", "srcMobile", "srcTablet", "srcDesktop"):
        if k in logo_paths:
            out.append(f"  {k}: {yaml_str(logo_paths[k])}")
    out.append(f"  alt: {yaml_str(logo_alt)}")
    out.append("")

    out.append("contact:")
    out.append(f"  title: {yaml_str(contact.get('title', ''))}")
    out.append("  lines:")
    for item in contact_lines:
        out.append(f"    - text: {yaml_str(item['text'])}")
        if "href" in item:
            out.append(f"      href: {yaml_str(item['href'])}")
            out.append(f"      kind: {yaml_str(item.get('kind', 'url'))}")
    out.append("")

    out.append("navigation:")
    out.append(f"  title: {yaml_str(nav.get('title', ''))}")
    out.append("  links:")
    for l in nav_links:
        out.append(f"    - text: {yaml_str(l['text'])}")
        out.append(f"      href: {yaml_str(l['href'])}")
    out.append("")

    out.append("socialMedia:")
    out.append(f"  title: {yaml_str(social.get('title', ''))}")
    out.append("  links:")
    for l in social_links:
        out.append(f"    - text: {yaml_str(l['text'])}")
        out.append(f"      href: {yaml_str(l['href'])}")
        if "icon" in l:
            out.append(f"      icon: {yaml_str(l['icon'])}")
            out.append(f"      iconAlt: {yaml_str(l['iconAlt'])}")
    out.append("")

    OUT.write_text("\n".join(out))
    print(f"Wrote {OUT}")

    with ASSET_MANIFEST.open("a") as f:
        for url, local in assets:
            f.write(f"{url}\t.{local}\n")
    print(f"Appended {len(assets)} assets to {ASSET_MANIFEST}")


if __name__ == "__main__":
    main()
