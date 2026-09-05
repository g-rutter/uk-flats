#!/usr/bin/env python3
"""Extract supplied handover offline; no claims of fresh source verification."""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
LEGACY = ROOT / 'UK flats (attempt 2)'
ARCHIVE = ROOT / 'data/archive'
INPUTS = ROOT / 'data/inputs'


def write_csv(path, rows, fields=None):
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = fields or list(dict.fromkeys(k for row in rows for k in row))
    with path.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


def extract(initialize=False):
    if initialize and list(INPUTS.glob('*.csv')):
        raise SystemExit('Input CSVs already exist; refusing to overwrite edits.')
    path = LEGACY / 'uk-flat-stage1-visualisation/locations.js'
    text = path.read_text(encoding='utf-8')
    data = json.loads(text[text.index('{'):].strip().removesuffix(';'))
    tables = {'locations': [], 'sources': [], 'evidence': data['evidence']}
    for location in data['locations']:
        tables['locations'].append({k: v for k, v in location.items() if not isinstance(v, dict)})
        for group, value in location.items():
            if group == 'sources':
                for topic, urls in value.items():
                    for url in urls:
                        tables['sources'].append(dict(location_id=location['id'], topic=topic, url=url))
            elif isinstance(value, dict):
                tables.setdefault(group, []).append(dict(location_id=location['id'], **value))
    for name, rows in tables.items():
        write_csv(ARCHIVE / 'locations' / f'{name}.csv', rows)
    (ARCHIVE / 'metadata.json').write_text(json.dumps(data['meta'], indent=2) + '\n')
    # Preserve every worksheet, including historical rankings. Read OOXML without
    # third-party dependencies. Formula expressions are retained if no cache exists.
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    with zipfile.ZipFile(LEGACY / 'UK_flat_location_research_Stages_0_2.xlsx') as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml'))]
        rels = {r.attrib['Id']: r.attrib['Target'] for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
        workbook = ET.fromstring(z.read('xl/workbook.xml'))
        for sheet in workbook.find('s:sheets', ns):
            target = rels[sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']]
            target = target.lstrip('/') if target.startswith('/') else 'xl/' + target
            rows = []
            for row in ET.fromstring(z.read(target)).findall('.//s:sheetData/s:row', ns):
                while len(rows) < int(row.attrib['r']):
                    rows.append([])
                values = rows[-1]
                for cell in row:
                    col = 0
                    for char in re.match('[A-Z]+', cell.attrib['r'])[0]:
                        col = col * 26 + ord(char) - 64
                    values.extend([''] * (col - len(values)))
                    v = cell.find('s:v', ns)
                    value = v.text if v is not None else ''
                    if cell.attrib.get('t') == 's':
                        value = strings[int(value)]
                    elif cell.attrib.get('t') == 'inlineStr':
                        value = ''.join(n.text or '' for n in cell.findall('.//s:t', ns))
                    elif not value and cell.find('s:f', ns) is not None:
                        value = '=' + cell.find('s:f', ns).text
                    values[col - 1] = value
            dest = ARCHIVE / 'workbook' / (re.sub(r'[^a-z0-9]+', '_', sheet.attrib['name'].lower()).strip('_') + '.csv')
            dest.parent.mkdir(parents=True, exist_ok=True)
            with dest.open('w', newline='', encoding='utf-8') as f:
                csv.writer(f, lineterminator='\n').writerows(rows)
    write_csv(ARCHIVE / 'manifest.csv', [dict(path=str(p.relative_to(ROOT)), sha256=hashlib.sha256(p.read_bytes()).hexdigest(), role='supplied legacy artifact; not independently verified') for p in sorted(LEGACY.rglob('*')) if p.is_file()])
    if initialize:
        # Keep observations/reasons, but remove inherited scores and decisions.
        excluded = {'safety'}
        for name, rows in tables.items():
            if name in excluded:
                continue
            clean = [{k: v for k, v in row.items() if not any(term in k.lower() for term in ('score', 'unknowns', 'weakness', 'composite'))} for row in rows]
            write_csv(INPUTS / f'{name}.csv', clean)
    print(f'Extracted {len(data["locations"])} locations and {len(workbook.find("s:sheets", ns))} worksheets.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--initialize', action='store_true')
    extract(parser.parse_args().initialize)
