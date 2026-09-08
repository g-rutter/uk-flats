"""Conservative Police.uk fallback audit; never certifies ASB completeness."""
from datetime import datetime
import hashlib
from html.parser import HTMLParser
import json
import re

from crime import read
from csv_io import write_csv


def force_key(name):
    return re.sub(r'\s+(police|constabulary)$', '', name.strip().lower())


class Notices(HTMLParser):
    def __init__(self):
        super().__init__()
        self.section = ''
        self.tag = None
        self.parts = []
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag in ('h2', 'li'):
            self.tag, self.parts = tag, []

    def handle_data(self, data):
        if self.tag:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag != self.tag:
            return
        value = ' '.join(''.join(self.parts).split())
        self.tag = None
        if tag == 'h2':
            try:
                self.section = datetime.strptime(value, '%B %Y').strftime('%Y-%m')
            except ValueError:
                self.section = 'Known Issues' if value == 'Known Issues' else ''
        elif self.section and ':' in value:
            force, detail = value.split(':', 1)
            if ('stop and search' in detail.lower()
                    and not re.search(r'\b(ASB|crime data|no crime)\b', detail, re.I)):
                return
            if re.search(r'\b(crime|crimes|ASB)\b', detail, re.I):
                self.rows.append(dict(section=self.section, force_key=force_key(force), notice=value))


def audit(snapshot, observations):
    metadata = {r['file']: r for r in read(snapshot / 'manifest.csv')}
    for name in ('changelog.html', 'availability.json'):
        if hashlib.sha256((snapshot / name).read_bytes()).hexdigest() != metadata[name]['sha256']:
            raise ValueError('Coverage snapshot hash mismatch')
    parser = Notices()
    parser.feed((snapshot / 'changelog.html').read_text())
    if not any(r['section'] == 'Known Issues' for r in parser.rows):
        raise ValueError('Unrecognised changelog layout')
    availability = json.loads((snapshot / 'availability.json').read_text())
    dates = [r['date'] for r in availability]
    if len(dates) != len(set(dates)) or any(not re.fullmatch(r'\d{4}-\d{2}', d) for d in dates):
        raise ValueError('Invalid availability dates')
    forces = {r['force_code']: r['force_name'].strip() for r in observations}
    forces['BTP'] = 'British Transport Police'  # Cross-cutting ASB omission; not a CSP.
    months = [f'2025-{m:02}' for m in range(4, 13)] + [f'2026-{m:02}' for m in range(1, 4)]
    results = []
    for code, name in sorted(forces.items()):
        relevant = [r for r in parser.rows if r['force_key'] == force_key(name)]
        for month in months:
            current = [r['notice'] for r in relevant if r['section'] == month]
            known = [r['notice'] for r in relevant if r['section'] == 'Known Issues']
            later = [r['section'] + ': ' + r['notice'] for r in relevant
                     if r['section'] != 'Known Issues' and r['section'] > month]
            results.append(dict(force_code=code, force_name=name, month=month,
                dataset_month_listed='yes' if month in dates else 'no',
                coverage_status='Review required' if current or known else 'Unknown; no notice is not proof of completeness',
                month_notices=' | '.join(current), known_issues=' | '.join(known),
                later_notices_for_review=' | '.join(later),
                asb_completeness='Unknown',
                source_url=metadata['changelog.html']['url'],
                retrieved_at=metadata['changelog.html']['retrieved_at'],
                source_sha256=metadata['changelog.html']['sha256'],
                availability_source_url=metadata['availability.json']['url'],
                availability_retrieved_at=metadata['availability.json']['retrieved_at'],
                availability_sha256=metadata['availability.json']['sha256']))
    return results


def export_coverage(root):
    rows = audit(root / 'data/raw/crime/coverage-2026-09-05',
                 read(root / 'data/inputs/crime_observations.csv'))
    write_csv(root / 'data/derived/crime_coverage.csv', rows)
