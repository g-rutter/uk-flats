#!/usr/bin/env python3
"""Compare prepared probe values to imported baseline values without changing either."""
import argparse
import csv
from pathlib import Path

from csv_io import write_csv


def read(path, key='location_id'):
    with Path(path).open(newline='', encoding='utf-8') as source:
        rows = list(csv.DictReader(source))
    return {row[key]: row for row in rows}


def compare(probe_csv, baseline_buy, prepared_buy, baseline_rent, prepared_rent, output):
    probe = read(probe_csv)
    buy_base, buy_new = read(baseline_buy), read(prepared_buy)
    rent_base, rent_new = read(baseline_rent), read(prepared_rent)
    rows = []
    for ident in sorted(probe):
        def result(old, new, fields):
            if ident not in new:
                return 'not-prepared'
            return 'match' if all(old[ident].get(key, '') == new[ident].get(key, '') for key in fields) else 'mismatch'
        rows.append(dict(location_id=ident, buy_result=result(buy_base, buy_new, ('proxyMedian', 'transactions')),
            rent_result=result(rent_base, rent_new, ('proxyMonthly',)),
            buy_baseline=buy_base[ident]['proxyMedian'], buy_prepared=buy_new.get(ident, {}).get('proxyMedian', ''),
            buy_transactions_baseline=buy_base[ident]['transactions'], buy_transactions_prepared=buy_new.get(ident, {}).get('transactions', ''),
            rent_baseline=rent_base[ident]['proxyMonthly'], rent_prepared=rent_new.get(ident, {}).get('proxyMonthly', '')))
    write_csv(output, rows, ('location_id', 'buy_result', 'rent_result', 'buy_baseline', 'buy_prepared',
              'buy_transactions_baseline', 'buy_transactions_prepared', 'rent_baseline', 'rent_prepared'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--probe', type=Path, required=True)
    parser.add_argument('--baseline-buy', type=Path, required=True)
    parser.add_argument('--prepared-buy', type=Path, required=True)
    parser.add_argument('--baseline-rent', type=Path, required=True)
    parser.add_argument('--prepared-rent', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    compare(args.probe, args.baseline_buy, args.prepared_buy, args.baseline_rent, args.prepared_rent, args.output)
