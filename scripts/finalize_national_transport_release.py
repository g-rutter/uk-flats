#!/usr/bin/env python3
"""Hash a reviewed National Rail capture draft into a release manifest.

This is offline bookkeeping only.  It does not open a browser or infer journey
values; the draft metadata must describe captures retained from the visible UI.
"""
import argparse
import csv
import hashlib
import mimetypes
from pathlib import Path

from release_manifest import REQUIRED_COLUMNS


DRAFT_COLUMNS = tuple(column for column in REQUIRED_COLUMNS if column not in ('sha256', 'mime_type'))


def read_draft(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(DRAFT_COLUMNS) - set(reader.fieldnames):
            raise ValueError(f'{path}: missing required draft columns')
        rows = list(reader)
    if any(None in row or None in row.values() for row in rows):
        raise ValueError(f'{path}: malformed CSV row')
    return rows


def finalize(release_dir, draft_path, manifest_path, overwrite=False):
    release_dir, manifest_path = Path(release_dir), Path(manifest_path)
    if manifest_path.exists() and not overwrite:
        raise ValueError(f'{manifest_path} already exists; refusing to replace a retained manifest')
    output, seen = [], set()
    for draft in read_draft(draft_path):
        relative_path = draft['relative_path']
        artifact_path = Path(relative_path)
        if not relative_path or artifact_path.is_absolute() or '..' in artifact_path.parts or relative_path in seen:
            raise ValueError(f'Unsafe or duplicate artifact path: {relative_path!r}')
        seen.add(relative_path)
        artifact = release_dir / artifact_path
        if not artifact.is_file():
            raise ValueError(f'Retained capture is missing: {relative_path}')
        mime_type = mimetypes.guess_type(artifact.name)[0] or 'application/octet-stream'
        output.append({
            **{column: draft[column] for column in DRAFT_COLUMNS},
            'sha256': hashlib.sha256(artifact.read_bytes()).hexdigest(),
            'mime_type': mime_type,
        })
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=REQUIRED_COLUMNS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(output)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', required=True, type=Path)
    parser.add_argument('--draft', required=True, type=Path)
    parser.add_argument('--manifest', type=Path)
    parser.add_argument('--overwrite', action='store_true')
    args = parser.parse_args()
    manifest = args.manifest or args.release / 'manifest.csv'
    finalize(args.release, args.draft, manifest, args.overwrite)


if __name__ == '__main__':
    main()
