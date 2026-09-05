from pathlib import Path
import json
import hashlib
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from crime import read
from crime_boundaries import audit, load_lookup
from extract_legacy import write_csv

SNAPSHOT = ROOT / 'data/raw/crime/boundaries-2026-09-05'


class BoundaryTests(unittest.TestCase):
    def test_real_mapping_exceptions_and_unknown_location(self):
        lookup, manifest = load_lookup(SNAPSHOT)
        locations = read(ROOT / 'data/inputs/locations.csv') + [dict(id='new-place')]
        rows = audit(locations, read(ROOT / 'data/inputs/crime_geographies.csv'),
                     read(ROOT / 'data/inputs/crime_observations.csv'), lookup, manifest)
        by_id = {r['location_id']: r for r in rows}
        self.assertEqual(len(rows), len(locations))
        for place in ('barnsley', 'sheffield'):
            self.assertEqual(by_id[place]['pair_match'], 'no')
            self.assertIn('reconcile code', by_id[place]['review_reason'])
        for place in ('kettering', 'northampton'):
            self.assertEqual(by_id[place]['pair_match'], 'yes')
            self.assertEqual(by_id[place]['includes_split_la'], 'yes')
        self.assertIn('Malvern Hills', by_id['worcester']['lookup_member_la_names'])
        self.assertIn('Rhondda', by_id['merthyr-tydfil']['lookup_member_la_names'])
        self.assertEqual(by_id['new-place']['pair_match'], '')
        self.assertTrue(all(r['lsoa_to_csp_ready'] == 'no' for r in rows))

    def test_missing_force_not_treated_as_agreement(self):
        lookup, manifest = load_lookup(SNAPSHOT)
        rows = audit([dict(id='blackpool')], read(ROOT / 'data/inputs/crime_geographies.csv'),
                     [], lookup, manifest)
        self.assertIn('force missing', rows[0]['review_reason'])

    def test_rejects_corruption_truncation_and_duplicate_relationships(self):
        for mutation in ('corruption', 'truncation', 'duplicate'):
            with self.subTest(mutation=mutation), tempfile.TemporaryDirectory() as tmp:
                target = Path(tmp) / 'snapshot'
                shutil.copytree(SNAPSHOT, target)
                path = target / 'csp-lookup.json'
                payload = json.loads(path.read_text())
                if mutation == 'truncation':
                    payload['exceededTransferLimit'] = True
                else:
                    payload['features'].append(payload['features'][0])
                path.write_text(json.dumps(payload))
                if mutation != 'corruption':
                    manifest = read(target / 'manifest.csv')
                    for row in manifest:
                        if row['file'] == path.name:
                            row['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
                    write_csv(target / 'manifest.csv', manifest)
                with self.assertRaises(ValueError):
                    load_lookup(target)
