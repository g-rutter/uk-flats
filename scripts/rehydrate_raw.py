#!/usr/bin/env python3
"""Restore missing retained raw artifacts and verify their committed hashes.

This never updates a manifest. It is for a clone where large artifacts were
excluded from Git because a hosting limit prevents committing them.
"""
import argparse
import csv
import hashlib
from pathlib import Path
from urllib.request import urlopen


def manifest_rows(directory):
    directory = Path(directory)
    with (directory / 'manifest.csv').open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        rows = list(reader)
    fields = set(reader.fieldnames or ())
    if {'relative_path', 'original_url', 'sha256'} <= fields:
        return [(row['relative_path'], row['original_url'], row['sha256'], '') for row in rows]
    if {'file', 'url', 'sha256', 'size_bytes'} <= fields:
        return [(row['file'], row['url'], row['sha256'], row['size_bytes']) for row in rows]
    raise ValueError(f'{directory / "manifest.csv"}: unsupported manifest schema')


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def rehydrate(directory, opener=urlopen):
    """Restore only missing artifacts; fail if any retained content disagrees."""
    directory = Path(directory)
    restored = []
    for relative, url, expected_hash, expected_size in manifest_rows(directory):
        path = Path(relative)
        if not relative or path.is_absolute() or '..' in path.parts:
            raise ValueError(f'Unsafe manifest artifact path: {relative}')
        artifact = directory / path
        if artifact.is_file():
            payload = artifact.read_bytes()
        else:
            with opener(url, timeout=300) as response:
                payload = response.read()
            if digest(payload) != expected_hash:
                raise ValueError(f'{relative}: downloaded SHA-256 differs from committed manifest')
            if expected_size and len(payload) != int(expected_size):
                raise ValueError(f'{relative}: downloaded size differs from committed manifest')
            artifact.parent.mkdir(parents=True, exist_ok=True)
            artifact.write_bytes(payload)
            restored.append(path.as_posix())
        if digest(payload) != expected_hash:
            raise ValueError(f'{relative}: local SHA-256 differs from committed manifest')
        if expected_size and len(payload) != int(expected_size):
            raise ValueError(f'{relative}: local size differs from committed manifest')
    return restored


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path, help='Directory containing a committed manifest.csv')
    args = parser.parse_args()
    restored = rehydrate(args.directory)
    print(f'Restored {len(restored)} artifact(s).')
