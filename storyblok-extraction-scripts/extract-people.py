#!/usr/bin/env python3
"""Extract Storyblok person records → content/people/<slug>.md + asset manifest."""

import json
from glob import glob
from pathlib import Path

PEOPLE_DIR = Path("content/people")
DUMP_GLOB = "storyblok-dump/stories-page-*.json"
MANIFEST = Path("storyblok-dump/asset-manifest.tsv")


def yaml_str(s):
    """Double-quoted YAML scalar — safe for any string."""
    if s is None:
        return '""'
    escaped = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def ext_from_url(url):
    tail = url.split("?", 1)[0].rsplit("/", 1)[-1]
    return tail.rsplit(".", 1)[1].lower() if "." in tail else "jpg"


def main():
    PEOPLE_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    count = 0

    for path in sorted(glob(DUMP_GLOB)):
        for story in json.loads(Path(path).read_text())["stories"]:
            c = story["content"]
            if c.get("component") != "person":
                continue

            slug = story["full_slug"].removeprefix("team-members/")
            image_url = c["image"]["filename"]
            local_image = f"/images/people/{slug}.{ext_from_url(image_url)}"
            projects = [p["name"] for p in c.get("projects", []) if p.get("name")]

            lines = ["---"]
            lines.append(f"firstName: {yaml_str(c['firstName'])}")
            lines.append(f"lastName: {yaml_str(c['lastName'])}")
            lines.append(f"role: {yaml_str(c['role'])}")
            lines.append(f"displayName: {yaml_str(c.get('displayName', 'full'))}")
            lines.append(f"githubNick: {yaml_str(c.get('githubNick', ''))}")
            lines.append(f"image: {yaml_str(local_image)}")
            lines.append(f"imageAlt: {yaml_str(c['image'].get('alt', ''))}")
            if projects:
                lines.append("projects:")
                for p in projects:
                    lines.append(f"  - {yaml_str(p)}")
            else:
                lines.append("projects: []")
            lines.append("---")
            lines.append("")

            (PEOPLE_DIR / f"{slug}.md").write_text("\n".join(lines) + "\n")
            manifest.append((image_url, "." + local_image))
            count += 1

    MANIFEST.write_text("\n".join(f"{u}\t{p}" for u, p in manifest) + "\n")
    print(f"Wrote {count} person files → {PEOPLE_DIR}/")
    print(f"Wrote {len(manifest)} asset entries → {MANIFEST}")


if __name__ == "__main__":
    main()
