import csv
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from residential_environment import METHOD_VERSION, percentile_for, score_for, weighted_cutpoints


def read_csv(path):
    with path.open(newline='', encoding='utf-8-sig') as source:
        return list(csv.DictReader(source))


class ResidentialEnvironmentTests(unittest.TestCase):
    def test_v2_green_release_has_complete_national_and_candidate_coverage(self):
        raw = ROOT / 'data/raw/environment/2026-09-09'
        manifest_names = {row['relative_path'] for row in read_csv(raw / 'manifest.csv')}
        self.assertTrue({'os-open-greenspace-product.json',
                         'os-open-greenspace-gb.gpkg.zip'} <= manifest_names)
        self.assertFalse({'ons-public-green-space-corrected.xlsx',
                          'oa11-oa21-change-lookup.csv',
                          'oa11-lsoa11-msoa11-lookup.csv',
                          'census2011-ks101ew-oa.zip'} & manifest_names)

        locations = read_csv(ROOT / 'data/inputs/locations.csv')
        candidates = read_csv(ROOT / 'data/inputs/residential_environment.csv')
        audit = read_csv(ROOT / 'data/derived/residential_environment_bua_audit.csv')
        release = read_csv(ROOT / 'data/inputs/residential_environment_release.csv')
        self.assertEqual({row['id'] for row in locations},
                         {row['location_id'] for row in candidates})
        self.assertEqual(len(release), 1)
        self.assertEqual(release[0]['method_version'], METHOD_VERSION)
        self.assertEqual(int(release[0]['reference_bua_count']), len(audit))
        self.assertEqual(release[0]['green_unmatched_origin_count'], '0')
        proximity_distribution = [
            (float(row['green_within_300m_pct']), int(row['population_expected']))
            for row in audit
        ]
        area_distribution = [
            (float(row['green_area_within_1000m_m2']), int(row['population_expected']))
            for row in audit
        ]
        for row in candidates + audit:
            for pillar in ('air', 'quiet', 'green', 'housing_environment'):
                self.assertEqual(row[f'{pillar}_population_covered'], row['population_expected'])
            self.assertEqual(row['method_version'], METHOD_VERSION)
        for row in candidates:
            reproduced = (
                percentile_for(float(row['green_within_300m_pct']), proximity_distribution) +
                percentile_for(float(row['green_area_within_1000m_m2']), area_distribution)
            ) / 2
            # Published raw values are rounded, so a reproduced percentile can
            # move by the population of a BUA at a rounded boundary.
            self.assertAlmostEqual(float(row['green_percentile']), reproduced, delta=0.03)

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
