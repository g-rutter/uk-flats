import csv
import hashlib
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build import compile_data, build
from crime import read as read_crime
from crime_residuals import audit as audit_residuals


class PipelineTests(unittest.TestCase):
    def test_build_is_deterministic_and_excludes_safety(self):
        outputs = [ROOT / 'data/derived/broad_screen.csv', ROOT / 'web/data.js',
                   ROOT / 'data/derived/crime_research.csv',
                   ROOT / 'data/derived/crime_boundary_audit.csv',
                   ROOT / 'data/derived/crime_coverage.csv',
                   ROOT / 'data/derived/crime_residual_audit.csv'] + sorted(
                       (ROOT / 'data/derived/crime_source_tables').glob('*.csv'))
        build()
        first = [p.read_bytes() for p in outputs]
        build()
        self.assertEqual(first, [p.read_bytes() for p in outputs])
        self.assertNotIn(b'violenceSexualIndicator', first[1])
        self.assertNotIn(b'screenScore', first[1])
        self.assertEqual(len(compile_data(ROOT / 'data/inputs')['locations']), 63)

    def test_new_location_can_have_unknown_metrics_and_orphans_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            inputs = Path(tmp) / 'inputs'
            shutil.copytree(ROOT / 'data/inputs', inputs)
            with (inputs / 'locations.csv').open('a', newline='') as f:
                csv.writer(f).writerow(['test-place', 'Test Place', 'England', '', '', ''])
            data = compile_data(inputs)
            self.assertEqual(data['locations'][-1]['buy'], {})
            self.assertIsNone(data['locations'][-1]['lat'])
            with (inputs / 'sources.csv').open('a', newline='') as f:
                csv.writer(f).writerow(['nonexistent', 'buy', 'https://example.com'])
            with self.assertRaises(ValueError):
                compile_data(inputs)

    def test_original_artifact_hashes(self):
        with (ROOT / 'data/archive/manifest.csv').open(newline='') as f:
            for row in csv.DictReader(f):
                self.assertEqual(hashlib.sha256((ROOT / row['path']).read_bytes()).hexdigest(), row['sha256'])

    def test_residual_audit_marks_material_for_review(self):
        rows = audit_residuals(read_crime(ROOT / 'data/inputs/crime_observations.csv'))
        humberside = [r for r in rows if r['force_code'] == 'E23000012']
        self.assertEqual({r['review_status'] for r in humberside}, {'Material; investigate before comparison'})
        self.assertEqual(len(rows), len({(r['force_code'], r['category']) for r in rows}))


if __name__ == '__main__':
    unittest.main()
