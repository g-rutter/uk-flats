import csv
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from residential_environment import percentile_for, score_for, weighted_cutpoints


def read_csv(path):
    with path.open(newline='', encoding='utf-8-sig') as source:
        return list(csv.DictReader(source))


class ResidentialEnvironmentTests(unittest.TestCase):
    def test_welsh_2025_indicators_cover_current_lsoa21_codes(self):
        raw = ROOT / 'data/raw/environment/2026-09-09'
        welsh_lsoas = {
            row['LSOA21CD']
            for row in read_csv(raw / 'oa21-lsoa21-msoa21-lookup.csv')
            if row['OA21CD'].startswith('W')
        }
        noise_lsoas = {
            row['Area code_reference']
            for row in read_csv(raw / 'wimd2025-physical-environment.csv')
            if row['Indicator_reference'] == 'nopu' and row['Data values'] not in ('', '[x]')
        }
        epc_lsoas = {
            row['Area code_reference']
            for row in read_csv(raw / 'wimd2025-housing.csv')
            if row['Indicator_reference'] == 'epc' and row['Data values'] not in ('', '[x]')
        }
        self.assertEqual(welsh_lsoas, noise_lsoas)
        self.assertTrue(welsh_lsoas <= epc_lsoas)
        self.assertTrue({'W01001981', 'W01001982', 'W01001983', 'W01001984'} <= welsh_lsoas)

    def test_population_weighted_boundaries_are_inclusive(self):
        observations = [(10, 1), (20, 1), (30, 1), (40, 1), (50, 1)]
        cutpoints = weighted_cutpoints(observations)
        self.assertEqual(cutpoints, [10, 20, 30, 40])
        self.assertEqual(score_for(20, cutpoints), 3)
        self.assertEqual(percentile_for(30, observations), 60)
        self.assertEqual(percentile_for(30, observations, lower_is_better=True), 60)


if __name__ == '__main__':
    unittest.main()
