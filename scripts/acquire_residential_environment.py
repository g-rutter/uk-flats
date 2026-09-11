#!/usr/bin/env python3
"""Acquire one dated residential-environment source release without transforming it."""
import argparse
import hashlib
import json
import mimetypes
from http.cookiejar import CookieJar
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import HTTPCookieProcessor, Request, build_opener

from csv_io import write_csv


SOURCES = (
    ('iod2025-domains-v2.xlsx', 'GET',
     'https://assets.publishing.service.gov.uk/media/691decfae39a085bda43efcd/File_2_IoD2025_Domains_of_Deprivation.xlsx', '',
     'English IoD 2025 domains, corrected v2', 'Ministry of Housing, Communities and Local Government'),
    ('iod2025-underlying-indicators-v2.xlsx', 'GET',
     'https://assets.publishing.service.gov.uk/media/691dec012c6b98ecdbc500d4/File_8_IoD2025_Underlying_Indicators.xlsx', '',
     'English IoD 2025 underlying indicators, corrected v2', 'Ministry of Housing, Communities and Local Government'),
    ('wimd2025-physical-environment.csv', 'POST',
     'https://stats.gov.wales/en-GB/2f8dfe38-bfa8-4f61-bc34-1d84d470a940/download',
     'view_type=unfiltered&format=csv&view_choice=raw&extended=yes&download_language=en-GB&selected_filter_options=[]&action=download',
     'WIMD 2025 physical-environment indicators', 'Welsh Government'),
    ('wimd2025-housing.csv', 'POST',
     'https://stats.gov.wales/en-GB/8c4e387a-d221-4a24-9fd4-50bdaacbe273/download',
     'view_type=unfiltered&format=csv&view_choice=raw&extended=yes&download_language=en-GB&selected_filter_options=[]&action=download',
     'WIMD 2025 housing indicators', 'Welsh Government'),
    ('wimd2025-domain-ranks.csv', 'POST',
     'https://stats.gov.wales/en-GB/9706edd9-73ad-4902-bb12-7ccd7038626e/download',
     'view_type=unfiltered&format=csv&view_choice=raw&extended=yes&download_language=en-GB&selected_filter_options=[]&action=download',
     'WIMD 2025 index and domain ranks', 'Welsh Government'),
    ('defra-no2-2024.csv', 'GET', 'https://uk-air.defra.gov.uk/datastore/pcm/mapno22024.csv', '',
     '2024 annual mean NO2 1 km grid', 'Department for Environment, Food & Rural Affairs'),
    ('defra-pm25-2024.csv', 'GET', 'https://uk-air.defra.gov.uk/datastore/pcm/mappm252024g.csv', '',
     '2024 annual mean PM2.5 1 km grid', 'Department for Environment, Food & Rural Affairs'),
    ('defra-pm10-2024.csv', 'GET', 'https://uk-air.defra.gov.uk/datastore/pcm/mappm102024g.csv', '',
     '2024 annual mean PM10 1 km grid', 'Department for Environment, Food & Rural Affairs'),
    ('oa21-population-weighted-centroids.csv', 'GET',
     'https://hub.arcgis.com/api/v3/datasets/558170d37ab04f34845034db91a86914_0/downloads/data?format=csv&spatialRefId=27700', '',
     'December 2021 OA population-weighted centroids v4', 'Office for National Statistics'),
    ('oa21-lsoa21-msoa21-lookup.csv', 'GET',
     'https://hub.arcgis.com/api/download/v1/items/b9ca90c10aaa4b8d9791e9859a38ca67/csv?layers=0', '',
     'December 2021 OA to LSOA/MSOA exact-fit lookup v3', 'Office for National Statistics'),
)

OS_PRODUCT_URL = 'https://api.os.uk/downloads/v1/products/OpenGreenspace'
OS_DOWNLOADS_URL = f'{OS_PRODUCT_URL}/downloads'
OS_DOWNLOAD_QUERY = 'area=GB&format=GeoPackage'


def acquire(destination):
    destination.mkdir(parents=True, exist_ok=False)
    opener = build_opener(HTTPCookieProcessor(CookieJar()))
    rows = []
    for name, method, url, query, period, publisher in SOURCES:
        body = urlencode(dict(item.split('=', 1) for item in query.split('&'))).encode() if query else None
        request = Request(url, data=body, method=method)
        with opener.open(request, timeout=180) as response:
            payload = response.read()
            content_type = response.headers.get_content_type()
        (destination / name).write_bytes(payload)
        rows.append({
            'relative_path': name, 'original_url': url, 'request_query': query,
            'retrieved_at': datetime.now(timezone.utc).isoformat(), 'data_period': period,
            'sha256': hashlib.sha256(payload).hexdigest(),
            'byte_size': str(len(payload)),
            'mime_type': content_type or mimetypes.guess_type(name)[0] or 'application/octet-stream',
            'publisher': publisher, 'licence_or_terms': 'Open Government Licence v3.0',
            'coverage_limitations': 'England and Wales source coverage; see methodology for indicator-specific limitations.',
        })
    with opener.open(Request(OS_PRODUCT_URL, method='GET'), timeout=180) as response:
        product_payload = response.read()
        product_content_type = response.headers.get_content_type()
    product = json.loads(product_payload)
    if product.get('id') != 'OpenGreenspace' or not product.get('version'):
        raise ValueError('OS Downloads API returned unexpected OpenGreenspace metadata')
    (destination / 'os-open-greenspace-product.json').write_bytes(product_payload)
    rows.append({
        'relative_path': 'os-open-greenspace-product.json', 'original_url': OS_PRODUCT_URL,
        'request_query': '', 'retrieved_at': datetime.now(timezone.utc).isoformat(),
        'data_period': f"OS Open Greenspace {product['version']}",
        'sha256': hashlib.sha256(product_payload).hexdigest(),
        'byte_size': str(len(product_payload)),
        'mime_type': product_content_type or 'application/json', 'publisher': 'Ordnance Survey',
        'licence_or_terms': 'Open Government Licence v3.0',
        'coverage_limitations': 'Product metadata captured with the selected national bulk snapshot.',
    })
    with opener.open(f'{OS_DOWNLOADS_URL}?{OS_DOWNLOAD_QUERY}', timeout=180) as response:
        downloads = json.load(response)
    matches = [item for item in downloads if item.get('area') == 'GB' and item.get('format') == 'GeoPackage']
    if len(matches) != 1 or matches[0].get('fileName') != 'opgrsp_gpkg_gb.zip':
        raise ValueError('OS Downloads API did not return exactly one GB GeoPackage')
    with opener.open(matches[0]['url'], timeout=300) as response:
        payload = response.read()
        content_type = response.headers.get_content_type()
    if matches[0].get('size') != len(payload):
        raise ValueError('OS Open Greenspace payload size differs from API metadata')
    name = 'os-open-greenspace-gb.gpkg.zip'
    (destination / name).write_bytes(payload)
    rows.append({
        'relative_path': name, 'original_url': OS_DOWNLOADS_URL,
        'request_query': OS_DOWNLOAD_QUERY, 'retrieved_at': datetime.now(timezone.utc).isoformat(),
        'data_period': f"OS Open Greenspace {product['version']}",
        'sha256': hashlib.sha256(payload).hexdigest(),
        'byte_size': str(len(payload)),
        'mime_type': content_type or 'application/zip', 'publisher': 'Ordnance Survey',
        'licence_or_terms': 'Open Government Licence v3.0',
        'coverage_limitations': ('Product inclusion does not guarantee unrestricted public access; '
                                 'only Public Park Or Garden and Playing Field are used.'),
    })
    write_csv(destination / 'manifest.csv', rows, rows[0])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='New snapshot directory (must not exist)')
    acquire(parser.parse_args().destination)
