from pathlib import Path
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from crime import read
from crime_coverage import Notices, audit


class CoverageTests(unittest.TestCase):
    def test_notices_keep_refresh_and_ignore_stop_search(self):
        parser = Notices()
        parser.feed('<h2>March 2026</h2><ul>'
                    '<li>Gwent Police: Crime data not provided.</li>'
                    '<li>Gwent Police: Stop and search data not provided.</li></ul>'
                    '<li>Humberside Police: New crime recording system; unable to provide stop and search data.</li>'
                    '<h2>May 2026</h2><li>Gwent Police: Crime data refresh from September 2025 to April 2026.</li>')
        self.assertEqual(len(parser.rows), 2)
        self.assertEqual(parser.rows[1]['section'], '2026-05')
        self.assertEqual(parser.rows[0]['force_key'], 'gwent')

    def test_snapshot_preserves_unknown_and_cross_cutting_gap(self):
        observations = read(ROOT / 'data/inputs/crime_observations.csv')
        rows = audit(ROOT / 'data/raw/crime/coverage-2026-09-05', observations)
        self.assertEqual(len(rows), (len({r['force_code'] for r in observations}) + 1) * 12)
        self.assertTrue(all(r['asb_completeness'] == 'Unknown' for r in rows))
        btp = next(r for r in rows if r['force_code'] == 'BTP')
        self.assertIn('April 2016', btp['known_issues'])
        gwent = next(r for r in rows if r['force_name'] == 'Gwent' and r['month'] == '2026-03')
        self.assertIn('not provided', gwent['month_notices'])
        self.assertIn('September 2025 to April 2026', gwent['later_notices_for_review'])

    def test_hash_mismatch_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / 'snapshot'
            shutil.copytree(ROOT / 'data/raw/crime/coverage-2026-09-05', target)
            (target / 'availability.json').write_text('[]')
            with self.assertRaisesRegex(ValueError, 'hash mismatch'):
                audit(target, [])
