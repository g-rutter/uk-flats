#!/usr/bin/env python3
"""Read and fail-closed validate retained raw-release manifests."""
import csv
import hashlib
from pathlib import Path

REQUIRED_COLUMNS = (
    'relative_path', 'original_url', 'request_query', 'retrieved_at',
    'data_period', 'sha256', 'mime_type', 'publisher', 'licence_or_terms',
    'coverage_limitations',
)


def read_csv(path):
    with path.open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(REQUIRED_COLUMNS) - set(reader.fieldnames):
            raise ValueError(f'{path}: invalid release manifest columns')
        rows = list(reader)
    if any(None in row or None in row.values() for row in rows):
        raise ValueError(f'{path}: malformed CSV row')
    return rows


def load(release_dir):
    """Return manifest rows keyed by safe relative path after hash verification."""
    release_dir = Path(release_dir)
    rows = read_csv(release_dir / 'manifest.csv')
    result = {}
    for row in rows:
        path = Path(row['relative_path'])
        if not row['relative_path'] or path.is_absolute() or '..' in path.parts or path in result:
            raise ValueError('Release manifest has unsafe or duplicate relative_path')
        if len(row['sha256']) != 64 or any(c not in '0123456789abcdef' for c in row['sha256']):
            raise ValueError(f'Release manifest has invalid SHA-256 for {path}')
        artifact = release_dir / path
        if not artifact.is_file():
            raise ValueError(f'Release manifest artifact missing: {path}')
        if 'byte_size' in row:
            if not row['byte_size'].isdigit() or int(row['byte_size']) != artifact.stat().st_size:
                raise ValueError(f'Release manifest size mismatch: {path}')
        if hashlib.sha256(artifact.read_bytes()).hexdigest() != row['sha256']:
            raise ValueError(f'Release manifest hash mismatch: {path}')
        result[path.as_posix()] = row
    return result
