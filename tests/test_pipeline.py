import csv
import hashlib
import io
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build import compile_data, build
from crime import compile_crime, read as read_crime
from crime_residuals import audit as audit_residuals
from crime_outliers import audit as audit_outliers
from composite import ASSESSMENT_SCORES, assessment_score, compile_composite
from prepare_locations import prepare
from release_audit import audit as release_audit
from rehydrate_raw import rehydrate


class PipelineTests(unittest.TestCase):
    def test_build_is_deterministic_and_calculates_composite_scores(self):
        outputs = [ROOT / 'data/derived/broad_screen.csv', ROOT / 'web/data.js',
                   ROOT / 'data/derived/crime_research.csv',
                   ROOT / 'data/derived/crime_boundary_audit.csv',
                   ROOT / 'data/derived/crime_coverage.csv',
                   ROOT / 'data/derived/crime_residual_audit.csv',
                   ROOT / 'data/derived/crime_outlier_audit.csv',
                   ROOT / 'data/derived/release_audit.csv'] + sorted(
                       (ROOT / 'data/derived/crime_source_tables').glob('*.csv'))
        build()
        first = [p.read_bytes() for p in outputs]
        build()
        self.assertEqual(first, [p.read_bytes() for p in outputs])
        self.assertNotIn(b'violenceSexualIndicator', first[1])
        payload = json.loads(first[1].decode('utf-8').split(' = ', 1)[1].rstrip(';\n'))
        for category in ('violence_against_person', 'sexual_offences'):
            rows = [r for r in payload['crimeResearch'] if r['category'] == category]
            self.assertEqual(sum(bool(r['rate_per_1000']) for r in rows), 63)
        self.assertEqual(len(compile_data(ROOT / 'data/inputs')['locations']), 63)
        self.assertEqual(payload['composite']['weights']['safety'], 15)
        self.assertTrue(all(payload['composite']['results'][location['id']]['tenures']['buy']['score'] is not None
                            for location in payload['locations']))
        for tenure in ('buy', 'rent'):
            bands = payload['composite']['score_bands'][tenure]
            self.assertEqual(sum(bands[band]['count'] for band in ('low', 'mid', 'high')) + bands['unknown'], 63)
            self.assertTrue(all(bands[band]['count'] for band in ('low', 'mid', 'high')))
            band_by_score = {}
            for location in payload['locations']:
                result = payload['composite']['results'][location['id']]['tenures'][tenure]
                band_by_score.setdefault(result['score'], result['band'])
                self.assertEqual(band_by_score[result['score']], result['band'])
        with (ROOT / 'data/derived/release_audit.csv').open(newline='') as source:
            release_rows = list(csv.DictReader(source))
        self.assertEqual(len(release_rows), 63 * 8)
        self.assertEqual({row['status'] for row in release_rows if row['topic'] == 'crime'}, {'ready'})
        self.assertEqual({row['status'] for row in release_rows if row['topic'] == 'buy'}, {'review-required'})

    def test_registry_rejects_unretained_or_unresolved_accepted_mapping(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            raw = root / 'raw' / '2027-03-15'
            raw.mkdir(parents=True)
            lookup = raw / 'geography.csv'
            lookup.write_text('code,name\nE22000001,Example\n', encoding='utf-8')
            digest = hashlib.sha256(lookup.read_bytes()).hexdigest()
            (raw / 'manifest.csv').write_text(
                'relative_path,original_url,request_query,retrieved_at,data_period,sha256,mime_type,publisher,licence_or_terms,coverage_limitations\n'
                f'geography.csv,https://example.com,query,2027-03-15T00:00:00Z,2027-03,{digest},text/csv,Example,terms,none\n',
                encoding='utf-8')
            registry = root / 'registry.csv'
            fields = ('location_id', 'status', 'release_id', 'display_name', 'country', 'lat', 'lon',
                      'centroid_source', 'centroid_query', 'local_authority_code', 'local_authority_name',
                      'price_query_field', 'price_query_value', 'rent_la_code', 'csp_code', 'csp_name',
                      'portal_resolver_query', 'portal_region_id', 'lookup_artifact', 'lookup_edition',
                      'exception_rationale', 'missing_data_reason')
            row = dict.fromkeys(fields, 'x')
            row.update(location_id='example-place', status='accepted', release_id='2027-03-15',
                       display_name='Example Place', country='England', lat='51', lon='-1',
                       csp_code='E22000001', csp_name='Example', lookup_artifact='geography.csv',
                       lookup_edition='2027', exception_rationale='Direct reviewed mapping.',
                       missing_data_reason='')
            with registry.open('w', newline='', encoding='utf-8') as target:
                writer = csv.DictWriter(target, fieldnames=fields)
                writer.writeheader()
                writer.writerow(row)
            locations, crime = root / 'locations.csv', root / 'crime.csv'
            prepare(registry, root / 'raw', locations, crime)
            with locations.open(newline='') as source:
                self.assertEqual(list(csv.DictReader(source))[0]['id'], 'example-place')
            row['lookup_artifact'] = 'not-retained.csv'
            with registry.open('w', newline='', encoding='utf-8') as target:
                writer = csv.DictWriter(target, fieldnames=fields)
                writer.writeheader()
                writer.writerow(row)
            with self.assertRaisesRegex(ValueError, 'not retained'):
                prepare(registry, root / 'raw', locations, crime)

    def test_rehydrate_restores_missing_manifest_artifact_and_rejects_changed_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            payload = b'retained source bytes'
            digest = hashlib.sha256(payload).hexdigest()
            (directory / 'manifest.csv').write_text(
                'file,month,url,retrieved_at,sha256,size_bytes\n'
                f'archive.zip,2026-03,https://example.test/archive,2026-09-05T00:00:00Z,{digest},{len(payload)}\n',
                encoding='utf-8')
            self.assertEqual(rehydrate(directory, lambda url, timeout: io.BytesIO(payload)), ['archive.zip'])
            self.assertEqual((directory / 'archive.zip').read_bytes(), payload)
            (directory / 'archive.zip').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'local SHA-256'):
                rehydrate(directory, lambda url, timeout: io.BytesIO(payload))

    def test_release_audit_marks_missing_addition_without_zero_filling(self):
        with tempfile.TemporaryDirectory() as tmp:
            inputs = Path(tmp) / 'inputs'
            shutil.copytree(ROOT / 'data/inputs', inputs)
            with (inputs / 'locations.csv').open('a', newline='') as target:
                csv.writer(target).writerow(['test-place', 'Test Place', 'England', '', '', ''])
            rows = [row for row in release_audit(inputs) if row['location_id'] == 'test-place']
            self.assertEqual(len(rows), 8)
            self.assertTrue(all(row['status'] == 'missing' for row in rows))

    def test_validation_probe_is_predeclared_and_records_completed_quantitative_results(self):
        with (ROOT / 'data/registry/validation_probe.csv').open(newline='') as source:
            rows = list(csv.DictReader(source))
        ids = {row['id'] for row in compile_data(ROOT / 'data/inputs')['locations']}
        self.assertEqual(len(rows), 12)
        self.assertEqual(len({row['location_id'] for row in rows}), len(rows))
        self.assertTrue(all(row['location_id'] in ids for row in rows))
        self.assertTrue(all(row[field] == 'match' for row in rows
                            for field in ('rent_result', 'buy_result')))
        self.assertTrue(all(not row[field].strip() for row in rows
                            for field in ('crime_result', 'stock_result', 'transport_result')))

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

    def test_explicit_assessments_are_validated_and_reasons_do_not_score(self):
        self.assertEqual(assessment_score('localTransport', 'dense_multimodal'), 5)
        self.assertEqual(assessment_score('localTransport', 'useful_bus_rail'), 4)
        self.assertEqual(assessment_score('localTransport', 'basic_bus_rail'), 3)
        self.assertEqual(assessment_score('condition', 'highest'), 5)
        self.assertEqual(assessment_score('condition', 'favourable'), 4)
        self.assertEqual(assessment_score('condition', 'mixed'), 2)
        self.assertEqual(assessment_score('quiet', 'persistent_noise'), 2)
        self.assertEqual(assessment_score('quiet', 'mixed_exposure'), 3)
        self.assertEqual(assessment_score('quiet', 'lower_intensity'), 4)
        self.assertIsNone(assessment_score('quiet', ''))
        self.assertEqual(set(ASSESSMENT_SCORES), {'localTransport', 'condition', 'quiet'})
        baseline_data = compile_data(ROOT / 'data/inputs')
        baseline_crime = compile_crime(ROOT / 'data/inputs', baseline_data['locations'], baseline_data['evidence'])
        baseline_score = compile_composite(baseline_data['locations'], baseline_crime)['results']['barnsley']['tenures']['buy']['score']
        with tempfile.TemporaryDirectory() as tmp:
            inputs = Path(tmp) / 'inputs'
            shutil.copytree(ROOT / 'data/inputs', inputs)
            with (inputs / 'quiet.csv').open(newline='') as f:
                rows = list(csv.DictReader(f))
            original_assessment = rows[0]['assessment']
            rows[0]['reason'] = 'Completely rewritten evidence text.'
            with (inputs / 'quiet.csv').open('w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
            data = compile_data(inputs)
            self.assertEqual(data['locations'][0]['quiet']['assessment'], original_assessment)
            changed_crime = compile_crime(inputs, data['locations'], data['evidence'])
            changed_score = compile_composite(data['locations'], changed_crime)['results']['barnsley']['tenures']['buy']['score']
            self.assertEqual(changed_score, baseline_score)
            rows[0]['assessment'] = 'synonymous_but_invalid'
            with (inputs / 'quiet.csv').open('w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
            with self.assertRaisesRegex(ValueError, 'invalid assessment'):
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

    def test_outlier_audit_is_bounded_and_review_only(self):
        rows = audit_outliers(read_crime(ROOT / 'data/inputs/crime_observations.csv'))
        self.assertEqual(len(rows), 12)
        self.assertEqual({r['direction'] for r in rows}, {'lowest', 'highest'})
        self.assertTrue(all('no safety interpretation' in r['review_status'] for r in rows))


if __name__ == '__main__':
    unittest.main()
