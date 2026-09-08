#!/usr/bin/env python3
"""Capture National Rail searches through its visible browser interface.

The collector deliberately does not parse result text or select an itinerary.
It fills the public form, makes the recorded searches, and saves screenshots
and accessibility snapshots for a reviewer to transcribe.  It never calls a
planner endpoint, inspects browser network traffic, or constructs result URLs.
"""
import argparse
import json
import re
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path


PLANNER = 'https://www.nationalrail.co.uk/journey-planner/'
DEFAULT_SEARCH_TIMES = ('10:00', '11:00', '12:00', '13:00')


def javascript(value):
    return json.dumps(value)


def visible_query(option):
    """Remove only a trailing CRS suffix before entering the visible search box."""
    if option == 'London (All Stations)':
        return 'London'
    return re.sub(r' \([A-Z0-9]{3}\)$', '', option)


def run_cli(wrapper, session, command, *arguments, cwd):
    result = subprocess.run(
        ['bash', str(wrapper), '--session', session, command, *arguments],
        cwd=cwd, text=True, capture_output=True, check=False,
    )
    if result.returncode:
        raise RuntimeError(f'playwright-cli {command} failed:\n{result.stdout}\n{result.stderr}')
    return result.stdout


def save_snapshot(wrapper, session, output, label):
    output.write_text(run_cli(wrapper, session, 'snapshot', cwd=output.parent), encoding='utf-8')
    return output


def capture_screenshot(wrapper, session, output_dir, destination):
    """Use the CLI screenshot command so its browser-side artifact is retained."""
    response = run_cli(wrapper, session, 'screenshot', cwd=output_dir)
    match = re.search(r'\[Screenshot(?: of viewport)?\]\(([^)]+)\)', response)
    if not match:
        raise RuntimeError(f'playwright-cli did not report a screenshot path:\n{response}')
    source = output_dir / match.group(1)
    if not source.is_file():
        raise RuntimeError(f'playwright-cli screenshot is missing: {source}')
    if destination.exists():
        raise ValueError(f'Refusing to overwrite retained capture: {destination}')
    shutil.move(source, destination)
    return destination


def prepare_form_code(origin_label, destination_label, measurement_date, hour):
    # All locators refer to controls exposed by the rendered Journey Planner UI.
    return f'''async page => {{
const origin = {javascript(origin_label)};
const destination = {javascript(destination_label)};
const rejectCookies = page.getByRole('button', {{name: 'Reject All'}});
if (await rejectCookies.count() && await rejectCookies.isVisible()) await rejectCookies.click();
await page.getByRole('button', {{name: 'Plan a Journey'}}).click();
await page.getByRole('combobox', {{name: 'Departing from'}}).fill({javascript(visible_query(origin_label))});
await page.getByRole('option', {{name: origin, exact: true}}).click();
await page.getByRole('combobox', {{name: 'Going to'}}).fill({javascript(visible_query(destination_label))});
await page.getByRole('option', {{name: destination, exact: true}}).click();
await page.getByRole('textbox', {{name: 'Choose leaving date'}}).fill({javascript(measurement_date)});
await page.keyboard.press('Escape');
await page.getByRole('combobox', {{name: 'Choose leaving hour'}}).selectOption({javascript(hour)});
await page.getByRole('combobox', {{name: 'Choose leaving minutes'}}).selectOption('00');
const hotel = page.getByRole('checkbox', {{name: 'Booking.com'}});
if (await hotel.isChecked()) await hotel.uncheck();
}}'''


def submit_code():
    return '''async page => {
await page.getByRole('button', {{name: 'Get times and prices'}}).click();
await page.waitForTimeout(2500);
}'''.replace('{{', '{').replace('}}', '}')


def expand_details_code(duration_label, result_index=None):
    locator = (f"page.getByRole('button', {{name: {javascript(duration_label)}, exact: true}}).nth({result_index - 1})"
               if result_index is not None else
               f"page.getByRole('button', {{name: {javascript(duration_label)}, exact: true}})")
    return f'''async page => {{
await {locator}.click();
await page.waitForTimeout(500);
}}'''


def write_metadata(output_dir, origin_label, destination_label, measurement_date, records):
    metadata = {
        'origin_visible_option': origin_label,
        'destination_visible_option': destination_label,
        'measurement_date': measurement_date,
        'searches': records,
        'limitations': ('UI-only capture. A reviewer must inspect screenshots, select the shortest suitable '
                        'displayed itinerary, capture expanded details, and prepare the manifest/transcription.'),
    }
    (output_dir / 'capture-metadata.json').write_text(
        json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    return metadata


def recover_record(search_time, result_capture, results_snapshot):
    """Recover an interrupted run from retained evidence without re-querying it."""
    if not results_snapshot.is_file():
        raise ValueError(f'Cannot recover {search_time}: missing retained result snapshot')
    url = next((line.partition(': ')[2] for line in results_snapshot.read_text(encoding='utf-8').splitlines()
                if line.startswith('- Page URL: ')), '')
    if not url:
        raise ValueError(f'Cannot recover {search_time}: result snapshot has no visible result URL')
    return {
        'search_time_local': search_time,
        'result_capture': result_capture.name,
        'visible_result_url': url,
        'retrieved_at_utc': datetime.fromtimestamp(result_capture.stat().st_mtime, timezone.utc).isoformat(timespec='seconds'),
    }


def capture_details(wrapper, session, output_dir, origin_label, destination_label, measurement_date,
                    search_time, duration_label, result_index=None):
    """Use a reviewer-supplied visible duration control to retain journey details.

    ``result_index`` is the one-based result-card position chosen during visual
    review when several cards expose the same duration label.
    """
    output_dir = Path(output_dir).resolve()
    hour, minute = search_time.split(':', 1)
    if minute != '00' or hour not in {f'{value:02d}' for value in range(24)}:
        raise ValueError(f'Unsupported visible-form search time: {search_time}')
    destination = output_dir / f'details-{hour}.png'
    if destination.exists():
        raise ValueError(f'Refusing to overwrite retained capture: {destination}')
    run_cli(wrapper, session, 'open', PLANNER, cwd=output_dir)
    run_cli(wrapper, session, 'run-code',
            prepare_form_code(origin_label, destination_label, measurement_date, hour), cwd=output_dir)
    run_cli(wrapper, session, 'run-code', submit_code(), cwd=output_dir)
    run_cli(wrapper, session, 'run-code', expand_details_code(duration_label, result_index), cwd=output_dir)
    details_snapshot = output_dir / f'details-{hour}.txt'
    save_snapshot(wrapper, session, details_snapshot, f'details-{hour}')
    capture_screenshot(wrapper, session, output_dir, destination)
    return destination


def collect(wrapper, session, output_dir, origin_label, destination_label, measurement_date, search_times):
    output_dir = Path(output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = output_dir / 'capture-metadata.json'
    if metadata_path.exists():
        existing = json.loads(metadata_path.read_text(encoding='utf-8'))
        if any(existing[field] != value for field, value in (
                ('origin_visible_option', origin_label),
                ('destination_visible_option', destination_label),
                ('measurement_date', measurement_date))):
            raise ValueError('Existing capture metadata is for a different route or measurement date')
        records = existing['searches']
    else:
        records = []
    completed = {record['search_time_local'] for record in records}
    for search_time in search_times:
        hour, minute = search_time.split(':', 1)
        if minute != '00' or hour not in {f'{value:02d}' for value in range(24)}:
            raise ValueError(f'Unsupported visible-form search time: {search_time}')
        if search_time in completed:
            continue
        result_capture = output_dir / f'results-{hour}.png'
        results_snapshot = output_dir / f'results-{hour}.txt'
        if result_capture.is_file():
            records.append(recover_record(search_time, result_capture, results_snapshot))
            completed.add(search_time)
            write_metadata(output_dir, origin_label, destination_label, measurement_date, records)
            continue
        run_cli(wrapper, session, 'open', PLANNER, cwd=output_dir)
        save_snapshot(wrapper, session, output_dir / f'form-open-{hour}.txt', f'form-open-{hour}')
        run_cli(wrapper, session, 'run-code',
                prepare_form_code(origin_label, destination_label, measurement_date, hour), cwd=output_dir)
        save_snapshot(wrapper, session, output_dir / f'form-selected-{hour}.txt', f'form-selected-{hour}')
        run_cli(wrapper, session, 'run-code', submit_code(), cwd=output_dir)
        save_snapshot(wrapper, session, results_snapshot, f'results-{hour}')
        capture_screenshot(wrapper, session, output_dir, result_capture)
        url = next((line.partition(': ')[2] for line in results_snapshot.read_text(encoding='utf-8').splitlines()
                    if line.startswith('- Page URL: ')), '')
        records.append({
            'search_time_local': search_time,
            'result_capture': result_capture.name,
            'visible_result_url': url,
            'retrieved_at_utc': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        })
        write_metadata(output_dir, origin_label, destination_label, measurement_date, records)
    return write_metadata(output_dir, origin_label, destination_label, measurement_date, records)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--wrapper', type=Path,
                        default=Path.home() / '.codex/skills/playwright/scripts/playwright_cli.sh')
    parser.add_argument('--session', required=True)
    parser.add_argument('--out-dir', type=Path, required=True)
    parser.add_argument('--origin-option', required=True,
                        help='Exact visible CRS-labelled origin option, e.g. Barnsley (BNY).')
    parser.add_argument('--destination-option', required=True,
                        help='Exact visible endpoint option, e.g. London (All Stations).')
    parser.add_argument('--measurement-date', default='11 Sep 2026',
                        help='Date in the visible form format.')
    parser.add_argument('--search-time', action='append', dest='search_times')
    parser.add_argument('--detail-search-time', help='Search time for one reviewer-selected itinerary.')
    parser.add_argument('--detail-duration-label',
                        help='Exact accessible label of the visible itinerary duration button.')
    parser.add_argument('--detail-result-index', type=int,
                        help='One-based visible result-card position when the duration label is repeated.')
    args = parser.parse_args()
    if bool(args.detail_search_time) != bool(args.detail_duration_label):
        parser.error('--detail-search-time and --detail-duration-label must be supplied together')
    if args.detail_result_index is not None and not args.detail_search_time:
        parser.error('--detail-result-index requires detail capture arguments')
    if args.detail_result_index is not None and args.detail_result_index < 1:
        parser.error('--detail-result-index must be a positive whole number')
    if args.detail_search_time:
        capture_details(args.wrapper, args.session, args.out_dir, args.origin_option, args.destination_option,
                        args.measurement_date, args.detail_search_time, args.detail_duration_label,
                        args.detail_result_index)
    else:
        collect(args.wrapper, args.session, args.out_dir, args.origin_option, args.destination_option,
                args.measurement_date, tuple(args.search_times or DEFAULT_SEARCH_TIMES))


if __name__ == '__main__':
    main()
