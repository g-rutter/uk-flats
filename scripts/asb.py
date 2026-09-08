"""Inspect Police.uk crime/ASB archives without inferring coverage."""
import argparse
import csv
from datetime import datetime
import hashlib
import io
import re
from pathlib import Path
import zipfile

from csv_io import write_csv


ASB_CATEGORY = "Anti-social behaviour"


def archive_month(name, rows):
    """Return the sole month in a CSV, or fail if rows mix months."""
    months = {row.get("Month", "").strip() for row in rows if row.get("Month", "").strip()}
    if len(months) != 1 or not re.fullmatch(r"20\d{2}-\d{2}", next(iter(months), "")):
        raise ValueError(f"{name}: expected one YYYY-MM Month value")
    month = next(iter(months))
    datetime.strptime(month, "%Y-%m")
    return month


def inspect_archive(path):
    """Aggregate ASB records by force and source month; omit missing files.

    Results show archived data, not complete force submissions.
    """
    results = {}
    with zipfile.ZipFile(path) as archive:
        names = [name for name in archive.namelist()
                 if name.lower().endswith(".csv") and not name.endswith("/")]
        if not names:
            raise ValueError(f"{path}: no CSV files")
        for name in names:
            with archive.open(name) as raw:
                text = io.TextIOWrapper(raw, encoding="utf-8-sig", newline="")
                reader = csv.DictReader(text)
                required = {"Month", "Crime type", "Reported by", "LSOA code"}
                if not reader.fieldnames or not required <= set(reader.fieldnames):
                    continue
                rows = list(reader)
            month = archive_month(name, rows)
            asb = [row for row in rows if row["Crime type"].strip() == ASB_CATEGORY]
            if not asb:
                continue
            forces = {row["Reported by"].strip() for row in asb}
            if len(forces) != 1 or not next(iter(forces), ""):
                raise ValueError(f"{name}: ASB rows have missing or mixed forces")
            force = next(iter(forces))
            key = force, month
            result = results.setdefault(key, {
                "force_name": force,
                "month": month,
                "asb_count": 0,
                "asb_missing_lsoa": 0,
                "source_files": [],
            })
            result["asb_count"] += len(asb)
            result["asb_missing_lsoa"] += sum(not row["LSOA code"].strip() for row in asb)
            result["source_files"].append(name)
    for result in results.values():
        result["source_files"] = " | ".join(sorted(result["source_files"]))
        result["coverage_status"] = "Observed; completeness requires external review"
        result["asb_completeness"] = "Unknown"
    return [results[key] for key in sorted(results)]


def export_archive(path, output):
    path = Path(path)
    rows = inspect_archive(path)
    source_sha256 = hashlib.sha256(path.read_bytes()).hexdigest()
    for row in rows:
        row["source_archive"] = path.name
        row["source_sha256"] = source_sha256
    write_csv(output, rows)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help="Retained Police.uk ZIP snapshot")
    parser.add_argument("output", type=Path, help="CSV audit output")
    args = parser.parse_args()
    export_archive(args.archive, args.output)
