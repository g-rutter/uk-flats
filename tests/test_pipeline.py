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
from prepare_national_transport import prepare as prepare_national_transport
from create_national_transport_queue import create_queue
from collect_national_transport_ui import expand_details_code, visible_query
from collect_national_transport_http import REQUEST_HEADERS, request_body
from collect_national_transport_station_picker import collect as collect_station_picker
from create_national_transport_manifest_draft import create as create_national_transport_manifest_draft
from create_national_transport_station_mapping_manifest_draft import create as create_station_mapping_manifest_draft
from finalize_national_transport_release import finalize as finalize_national_transport_release
from release_audit import audit as release_audit
from rehydrate_raw import rehydrate


class PipelineTests(unittest.TestCase):
    def test_national_transport_queue_blocks_unmapped_and_excludes_same_endpoint(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            locations = root / 'locations.csv'
            locations.write_text('id,name\nexample,Example\nbirmingham,Birmingham\n', encoding='utf-8')
            stations = root / 'stations.csv'
            stations.write_text(
                'location_id,station_crs,station_name,selection_reason,confidence,evidence_ids\n'
                'birmingham,BHM,Birmingham New Street,Primary station,High,TR-TEST\n', encoding='utf-8')
            rows = create_queue(locations, stations, '2026-09-11')
            self.assertEqual([(row['location_id'], row['destination_id'], row['status']) for row in rows], [
                ('example', 'london', 'blocked-mapping'), ('example', 'birmingham', 'blocked-mapping'),
                ('birmingham', 'london', 'pending'), ('birmingham', 'birmingham', 'degenerate-zero'),
            ])
            self.assertEqual(visible_query('Bangor (Gwynedd) (BNG)'), 'Bangor (Gwynedd)')
            self.assertEqual(visible_query('London (All Stations)'), 'London')
            self.assertIn('.nth(1).click()', expand_details_code('Duration: 2 hours and, Direct', 2))

    def test_national_transport_http_request_is_fixed_and_timezone_aware(self):
        body = request_body('cdf', 'bhm', '2026-09-11', '10:00')
        self.assertEqual(body['origin'], {'crs': 'CDF', 'group': False})
        self.assertEqual(body['destination'], {'crs': 'BHM', 'group': False})
        self.assertEqual(body['outwardTime'], {
            'travelTime': '2026-09-11T10:00:00+01:00', 'type': 'DEPART',
        })
        self.assertEqual(body['increasedInterchange'], 'ZERO')
        self.assertEqual(REQUEST_HEADERS['Origin'], 'https://www.nationalrail.co.uk')
        self.assertEqual(REQUEST_HEADERS['Referer'], 'https://www.nationalrail.co.uk/')
        self.assertIn('uk-flats-national-transport-collector', REQUEST_HEADERS['User-Agent'])

    def test_national_transport_finalizer_hashes_retained_draft_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            release = root / 'release'
            release.mkdir()
            (release / 'capture.png').write_bytes(b'visible browser capture')
            draft = root / 'draft.csv'
            draft.write_text(
                'relative_path,original_url,request_query,retrieved_at,data_period,publisher,licence_or_terms,coverage_limitations\n'
                'capture.png,https://www.nationalrail.co.uk/journey-planner/,Visible UI query,2026-09-08T10:00:00+01:00,2026-09-11,Rail Delivery Group,Public planner browser screenshot,Test capture\n',
                encoding='utf-8')
            rows = finalize_national_transport_release(release, draft, release / 'manifest.csv')
            self.assertEqual(rows[0]['mime_type'], 'image/png')
            self.assertEqual(len(rows[0]['sha256']), 64)
            with self.assertRaisesRegex(ValueError, 'refusing'):
                finalize_national_transport_release(release, draft, release / 'manifest.csv')

    def test_direct_transport_manifest_draft_covers_request_response_and_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            route = root / 'release' / 'transport' / 'example__london'
            route.mkdir(parents=True)
            request = {'origin': {'crs': 'EXM', 'group': False}}
            (route / 'request-10.json').write_text(json.dumps(request), encoding='utf-8')
            (route / 'response-10.json').write_text('{"outwardJourneys": []}', encoding='utf-8')
            (route / 'capture-metadata.json').write_text(json.dumps({
                'source_endpoint': 'https://jpservices.nationalrail.co.uk/journey-planner',
                'origin': {'crs': 'EXM'}, 'destination': {'crs': '182'},
                'measurement_date': '2026-09-11', 'limitations': 'Planner snapshot.',
                'searches': [{'search_time_local': '10:00', 'request': 'request-10.json',
                              'response': 'response-10.json',
                              'retrieved_at_local': '2026-09-08T10:00:00+01:00'}],
            }), encoding='utf-8')
            draft = root / 'release' / 'manifest-draft.csv'
            rows = create_national_transport_manifest_draft(root / 'release', draft)
            self.assertEqual(len(rows), 3)
            self.assertEqual({row['relative_path'] for row in rows}, {
                'transport/example__london/request-10.json',
                'transport/example__london/response-10.json',
                'transport/example__london/capture-metadata.json',
            })
            with self.assertRaisesRegex(ValueError, 'refusing'):
                create_national_transport_manifest_draft(root / 'release', draft)

    def test_station_picker_capture_and_manifest_draft_skip_existing_mappings(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            locations = root / 'locations.csv'
            locations.write_text('id,name\nexample,Example Place\nmapped,Mapped Place\n', encoding='utf-8')
            release = root / 'release'
            from unittest.mock import patch
            from io import BytesIO
            with patch('collect_national_transport_station_picker.urlopen',
                       return_value=BytesIO(b'{"payload":{"stations":[]}}')):
                metadata = collect_station_picker(locations, {'mapped'}, release,
                                                  'https://stationpicker.example')
            self.assertEqual([record['location_id'] for record in metadata['records']], ['example'])
            self.assertEqual(json.loads((release / 'example.json').read_text())['payload']['stations'], [])
            draft = release / 'manifest-draft.csv'
            rows = create_station_mapping_manifest_draft(release, draft)
            self.assertEqual({row['relative_path'] for row in rows},
                             {'example.json', 'capture-metadata.json'})

    def test_national_transport_preparer_requires_hashed_capture_and_stages_pivot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            release = root / 'release'
            release.mkdir()
            capture = release / 'london.html'
            capture.write_text('<html>Recorded planner result</html>\n', encoding='utf-8')
            digest = hashlib.sha256(capture.read_bytes()).hexdigest()
            (release / 'manifest.csv').write_text(
                'relative_path,original_url,request_query,retrieved_at,data_period,sha256,mime_type,publisher,licence_or_terms,coverage_limitations\n'
                f'london.html,https://www.nationalrail.co.uk/journey-planner/,Barnsley to London,{"2026-09-08T10:00:00+01:00"},{"2026-09-11"},{digest},text/html,Rail Delivery Group,Public browser snapshot,Example test capture\n',
                encoding='utf-8')
            stations = root / 'stations.csv'
            stations.write_text(
                'location_id,station_crs,station_name,selection_reason,confidence,evidence_ids\n'
                'barnsley,BNY,Barnsley,Primary National Rail station,High,TR-NATIONAL-TEST\n', encoding='utf-8')
            observations = root / 'observations.csv'
            observations.write_text(
                'location_id,destination_id,origin_crs,destination_crs,measurement_date,selection_window_start_local,selection_window_end_local,planner_search_times,query_timestamp_local,selected_departure_local,selected_arrival_local,elapsed_minutes,changes,frequency_window_start_local,frequency_window_end_local,usable_departures_in_window,source_url,raw_capture_path,retrieval_timestamp,confidence,evidence_id,reason\n'
                'barnsley,london,BNY,1072,2026-09-11,2026-09-11T10:00:00+01:00,2026-09-11T14:00:00+01:00,10:00,2026-09-08T10:00:00+01:00,2026-09-11T10:03:00+01:00,2026-09-11T11:31:00+01:00,88,0,,,,https://www.nationalrail.co.uk/journey-planner/,london.html,2026-09-08T10:01:00+01:00,High,TR-NATIONAL-TEST,Selected shortest suitable itinerary.\n',
                encoding='utf-8')
            reviewed, pivot = prepare_national_transport(release, stations, observations, root / 'out', '2026-09-11')
            self.assertEqual(len(reviewed), 1)
            self.assertEqual(pivot[0]['londonMinutes'], '88')
            self.assertEqual(pivot[0]['birminghamMinutes'], '')

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
        location_count = len(payload['locations'])
        for category in ('violence_against_person', 'sexual_offences'):
            rows = [r for r in payload['crimeResearch'] if r['category'] == category]
            self.assertEqual(sum(bool(r['rate_per_1000']) for r in rows), location_count)
        self.assertEqual(len(compile_data(ROOT / 'data/inputs')['locations']), location_count)
        self.assertEqual(payload['composite']['weights']['safety'], 15)
        self.assertTrue(any(payload['composite']['results'][location['id']]['tenures']['buy']['score'] is not None
                            for location in payload['locations']))
        for tenure in ('buy', 'rent'):
            bands = payload['composite']['score_bands'][tenure]
            self.assertEqual(sum(bands[band]['count'] for band in ('low', 'mid', 'high')) + bands['unknown'], location_count)
            self.assertTrue(all(bands[band]['count'] for band in ('low', 'mid', 'high')))
            band_by_score = {}
            for location in payload['locations']:
                result = payload['composite']['results'][location['id']]['tenures'][tenure]
                band_by_score.setdefault(result['score'], result['band'])
                self.assertEqual(band_by_score[result['score']], result['band'])
        with (ROOT / 'data/derived/release_audit.csv').open(newline='') as source:
            release_rows = list(csv.DictReader(source))
        self.assertEqual(len(release_rows), location_count * 8)
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
