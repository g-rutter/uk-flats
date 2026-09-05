#!/usr/bin/env python3
"""Aggregate Police.uk ASB records to CSPs for a requested period.

The archive, LSOA/LAD lookup and LA/CSP lookup are acquired separately so each
source can be retained and reviewed. Split-LA memberships are not guessed.
"""
import argparse
import csv
from datetime import date
import json
from collections import Counter, defaultdict
import io
from pathlib import Path
import zipfile

ASB = "Anti-social behaviour"


def month(value):
    year, number = value.split("-")
    if len(year) != 4 or not 1 <= int(number) <= 12:
        raise ValueError(f"Invalid month: {value}")
    return value


def months(start, end):
    year, number = map(int, start.split("-"))
    final_year, final_number = map(int, end.split("-"))
    if (year, number) > (final_year, final_number):
        raise ValueError("Period starts after it ends")
    result = []
    while (year, number) <= (final_year, final_number):
        result.append(f"{year:04}-{number:02}")
        number += 1
        if number == 13:
            year, number = year + 1, 1
    return result


def read_lsoa_lad(path):
    result = defaultdict(set)
    with Path(path).open(newline="", encoding="utf-8-sig") as stream:
        for row in csv.DictReader(stream):
            lsoa, lad = row.get("LSOA21CD", "").strip(), row.get("LAD22CD", "").strip()
            if lsoa and lad:
                result[lsoa].add(lad)
    return result


def read_csp_lookup(path):
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    result = defaultdict(list)
    for feature in payload.get("features", []):
        row = feature.get("attributes", {})
        lad, csp = row.get("LAD25CD", ""), row.get("CSP25CD", "")
        if lad and csp:
            result[lad].append((csp, row.get("CSP25NM", ""), row.get("PFA25CD", "")))
    return result


def aggregate(archive, start, end, lsoa_lad, lad_csp):
    wanted = set(months(start, end))
    counts = Counter()
    force_months = Counter()
    lsoa_stats = Counter()
    csp_names = {}
    with zipfile.ZipFile(archive) as source:
        for name in source.namelist():
            if not name.lower().endswith("-street.csv"):
                continue
            with source.open(name) as raw:
                reader = csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8-sig", newline=""))
                for row in reader:
                    current_month = row.get("Month", "").strip()
                    if current_month not in wanted or row.get("Crime type", "").strip() != ASB:
                        continue
                    force = row.get("Reported by", "").strip()
                    force_months[(force, current_month)] += 1
                    lsoa = row.get("LSOA code", "").strip()
                    lads = lsoa_lad.get(lsoa, set())
                    csps = {(csp, name, pfa) for lad in lads for csp, name, pfa in lad_csp.get(lad, [])}
                    if len(csps) != 1:
                        lsoa_stats["unmapped_or_split"] += 1
                        continue
                    csp, csp_name, pfa = next(iter(csps))
                    counts[(csp, current_month)] += 1
                    csp_names[csp] = csp_name
                    lsoa_stats["assigned"] += 1
                    lsoa_stats[("assigned_lsoa", lsoa, csp)] += 1
                    lsoa_stats[("pfa", pfa)] += 1
    return counts, csp_names, force_months, lsoa_stats


def write_csv(path, rows):
    rows = list(rows)
    if not rows:
        raise ValueError("No rows to write")
    with Path(path).open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def export(args):
    start, end = month(args.start), month(args.end)
    period = months(start, end)
    lsoa_lad = read_lsoa_lad(args.lsoa_lad)
    lad_csp = read_csp_lookup(args.csp_lookup)
    counts, names, force_months, stats = aggregate(args.archive, start, end, lsoa_lad, lad_csp)
    rows = []
    for csp in sorted(names):
        for current_month in period:
            rows.append({"csp_code": csp, "csp_name": names[csp], "month": current_month,
                         "asb_count": counts.get((csp, current_month), ""),
                         "period_start": f"{start}-01", "period_end": f"{end}-01",
                         "assignment": "LSOA21 to single LAD25/CSP25 relationship"})
    if not rows:
        raise ValueError("No ASB rows could be assigned to a CSP")
    write_csv(args.output, rows)
    review = Path(args.output).with_name(Path(args.output).stem + "_review.csv")
    review_rows = [{"metric": "assigned_records", "value": stats["assigned"]},
                   {"metric": "unmapped_or_split_records", "value": stats["unmapped_or_split"]},
                   {"metric": "lsoa_lookup_rows", "value": len(lsoa_lad)},
                   {"metric": "la_csp_rows", "value": sum(len(rows) for rows in lad_csp.values())}]
    review_rows.extend({"metric": "assigned_lsoa", "lsoa_code": key[1], "csp_code": key[2],
                        "value": value} for key, value in sorted(stats.items(), key=str)
                       if isinstance(key, tuple) and key[0] == "assigned_lsoa")
    write_csv(review, review_rows)
    coverage = Path(args.output).with_name(Path(args.output).stem + "_force_month.csv")
    write_csv(coverage, ({"force_name": force, "month": current_month, "asb_count": value}
                         for (force, current_month), value in sorted(force_months.items())))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("lsoa_lad", type=Path)
    parser.add_argument("csp_lookup", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--start", required=True)
    parser.add_argument("--end", required=True)
    export(parser.parse_args())
