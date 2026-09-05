#!/usr/bin/env python3
"""Acquire a dated Police.uk archive snapshot and checksum it."""
import argparse
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from urllib.request import urlopen

from extract_legacy import write_csv


BASE_URL = "https://data.police.uk/data/archive/{month}.zip"


def acquire(month, destination):
    datetime.strptime(month, "%Y-%m")
    destination.mkdir(parents=True, exist_ok=False)
    url = BASE_URL.format(month=month)
    with urlopen(url, timeout=120) as response:
        payload = response.read()
    archive = destination / f"{month}.zip"
    archive.write_bytes(payload)
    write_csv(destination / "manifest.csv", [{
        "file": archive.name,
        "month": month,
        "url": url,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "sha256": hashlib.sha256(payload).hexdigest(),
        "size_bytes": str(len(payload)),
    }])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("month", help="Archive month in YYYY-MM format")
    parser.add_argument("destination", type=Path, help="New snapshot directory (must not exist)")
    args = parser.parse_args()
    acquire(args.month, args.destination)
