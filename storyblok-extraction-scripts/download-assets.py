#!/usr/bin/env python3
"""Download Storyblok assets per asset-manifest.tsv."""

import argparse
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

UA = "Mozilla/5.0 (compatible; storyblok-export)"


def download(url, dest, force=False):
    if dest.exists() and dest.stat().st_size > 0 and not force:
        return ("SKIP", "exists", dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        dest.write_bytes(data)
        return ("OK", f"{len(data):,} bytes", dest)
    except Exception as e:
        if dest.exists():
            dest.unlink()
        return ("FAIL", str(e), dest)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", default="storyblok-dump/asset-manifest.tsv")
    ap.add_argument("--out-dir", default="public", help="destination root")
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    out_dir = Path(args.out_dir)
    entries = []
    for line in Path(args.manifest).read_text().strip().splitlines():
        url, rel = line.split("\t", 1)
        rel = rel.lstrip("./").lstrip("/")  # normalize "./img/..." or "/img/..."
        entries.append((url, out_dir / rel))

    print(f"Downloading {len(entries)} assets → {out_dir}/ ({args.workers} workers)")

    counts = {"OK": 0, "SKIP": 0, "FAIL": 0}
    failures = []

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futs = [pool.submit(download, u, p, args.force) for u, p in entries]
        for i, fut in enumerate(as_completed(futs), 1):
            status, detail, dest = fut.result()
            counts[status] += 1
            if status == "FAIL":
                failures.append((dest, detail))
            if i % 10 == 0 or i == len(entries):
                print(f"  {i}/{len(entries)} "
                      f"(OK={counts['OK']} SKIP={counts['SKIP']} FAIL={counts['FAIL']})")

    print(f"\nOK: {counts['OK']}   SKIP: {counts['SKIP']}   FAIL: {counts['FAIL']}")

    if failures:
        print("\nFailures:")
        for d, msg in failures:
            print(f"  {d}: {msg}")
        sys.exit(1)


if __name__ == "__main__":
    main()
