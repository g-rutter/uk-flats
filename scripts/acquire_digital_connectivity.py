#!/usr/bin/env python3
"""Acquire one dated Ofcom fixed-broadband release without transforming it."""
import argparse
import hashlib
import mimetypes
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from csv_io import write_csv


SOURCES = (
    (
        'fixed-coverage-output-areas.zip',
        'https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/'
        'multi-sector/infrastructure-research/connect-nations-spring-2025/data-downloads/'
        'fixed-coverage-output-areas.zip?v=396497',
        'Connected Nations Spring 2025 fixed coverage: Output Areas',
        ('application/zip', 'application/x-zip-compressed'),
    ),
    (
        'about-this-data-fixed-coverage.pdf',
        'https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/'
        'multi-sector/infrastructure-research/connect-nations-spring-2025/data-downloads/'
        'about-this-data---fixed-coverage-and-full-fibre-take-up.pdf?v=396500',
        'Connected Nations Spring 2025 fixed-coverage data dictionary',
        ('application/pdf',),
    ),
)


def acquire(destination):
    destination.mkdir(parents=True, exist_ok=False)
    rows = []
    for name, url, description, expected_types in SOURCES:
        request = Request(url, headers={'User-Agent': 'uk-flats-research/1.0'})
        with urlopen(request, timeout=180) as response:
            payload = response.read()
            content_type = response.headers.get_content_type()
        if content_type not in expected_types:
            raise ValueError(f'{name}: expected {expected_types}, received {content_type}')
        (destination / name).write_bytes(payload)
        rows.append({
            'relative_path': name,
            'original_url': url,
            'request_query': 'GET published download',
            'retrieved_at': datetime.now(timezone.utc).isoformat(),
            'data_period': 'January 2025 availability snapshot',
            'sha256': hashlib.sha256(payload).hexdigest(),
            'byte_size': str(len(payload)),
            'mime_type': content_type or mimetypes.guess_type(name)[0],
            'publisher': 'Ofcom',
            'licence_or_terms': 'Open Government Licence',
            'coverage_limitations': (
                f'{description}. Provider-reported availability is not observed speed, take-up, '
                'price, reliability or in-home performance.'
            ),
        })
    write_csv(destination / 'manifest.csv', rows, rows[0])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='New snapshot directory (must not exist)')
    acquire(parser.parse_args().destination)
