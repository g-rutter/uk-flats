import csv
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build import compile_data
from crime import compile_crime, read
from csv_io import write_csv
from prepare_crime import prepare, SNAPSHOT


class CrimeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.inputs = Path(self.temp.name) / 'inputs'
        shutil.copytree(ROOT / 'data/inputs', self.inputs)

    def compile(self):
        data = compile_data(self.inputs)
        return compile_crime(self.inputs, data['locations'], data['evidence'])

    def change(self, field, value):
        path = self.inputs / 'crime_observations.csv'
        rows = read(path)
        rows[0][field] = value
        write_csv(path, rows)

    def test_snapshot_reproduces_canonical_observations(self):
        original = (self.inputs / 'crime_observations.csv').read_bytes()
        prepare(SNAPSHOT, self.inputs)
        self.assertEqual(original, (self.inputs / 'crime_observations.csv').read_bytes())

    def test_rates_and_asb_unknown_for_every_location(self):
        rows = self.compile()
        locations = read(self.inputs / 'locations.csv')
        self.assertEqual(len(rows), len(locations) * 3)
        manchester = next(r for r in rows if r['location_id'] == 'manchester' and r['category'] == 'violence_against_person')
        self.assertEqual(manchester['count'], '30605')
        self.assertEqual(manchester['rate_per_1000'], '51.899')
        self.assertTrue(all(r['rate_per_1000'] == '' and r['missing_reason'] for r in rows if r['category'] == 'asb'))

    def test_missing_stays_unknown_and_zero_is_real(self):
        self.change('count', '')
        self.assertEqual(self.compile()[0]['rate_per_1000'], '')
        self.change('count', '0')
        self.change('published_rate_per_1000', '0')
        self.assertEqual(self.compile()[0]['rate_per_1000'], '0.000')
        self.change('population', '')
        self.assertEqual(self.compile()[0]['rate_per_1000'], '')

    def test_invalid_observations_fail(self):
        for field, value in [('population', '0'), ('population', '1'), ('count', '-1'),
                             ('count', '1.5'), ('count', 'NaN'), ('count', 'Infinity'),
                             ('csp_code', 'E22000000'), ('period_end', '2025-03-31'),
                             ('population_period', 'mid-2023'), ('evidence_id', 'invented'),
                             ('location_id', 'not-a-location')]:
            with self.subTest(field=field, value=value):
                shutil.copyfile(ROOT / 'data/inputs/crime_observations.csv', self.inputs / 'crime_observations.csv')
                self.change(field, value)
                with self.assertRaises(ValueError):
                    self.compile()

    def test_duplicate_observation_fails(self):
        path = self.inputs / 'crime_observations.csv'
        rows = read(path)
        write_csv(path, rows + [rows[0]])
        with self.assertRaises(ValueError):
            self.compile()

    def test_new_place_retained_without_invented_data(self):
        with (self.inputs / 'locations.csv').open('a', newline='') as f:
            csv.writer(f).writerow(['new-place', 'New Place', 'England', '', '', ''])
        rows = self.compile()[-3:]
        self.assertTrue(all(r['location_id'] == 'new-place' and r['rate_per_1000'] == '' for r in rows))

    def test_combined_and_partial_la_mappings(self):
        rows = {r['location_id']: r for r in self.compile() if r['category'] == 'violence_against_person'}
        self.assertEqual(rows['merthyr-tydfil']['csp_name'], 'Cwm Taf')
        self.assertEqual(rows['worcester']['csp_name'], 'South Worcester')
        self.assertEqual(rows['kettering']['csp_name'], 'Kettering')
        self.assertEqual(rows['kettering']['population'], '110100')


if __name__ == '__main__':
    unittest.main()
