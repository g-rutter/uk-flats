from pathlib import Path
import csv
import sys
import tempfile
import unittest
import zipfile
import json

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from aggregate_asb import export
from asb import inspect_archive


class AsbTests(unittest.TestCase):
    def test_inspects_asb_and_retains_unknown_completeness(self):
        with tempfile.TemporaryDirectory() as tmp:
            archive = Path(tmp) / "snapshot.zip"
            with zipfile.ZipFile(archive, "w") as output:
                output.writestr("2025-04-test-crime.csv", "Month,Crime type,Reported by,LSOA code\n"
                                "2025-04,Anti-social behaviour,Test Police,E01000001\n"
                                "2025-04,Anti-social behaviour,Test Police,\n"
                                "2025-04,Burglary,Test Police,E01000001\n")
            rows = inspect_archive(archive)
            self.assertEqual(rows[0]["asb_count"], 2)
            self.assertEqual(rows[0]["asb_missing_lsoa"], 1)
            self.assertEqual(rows[0]["asb_completeness"], "Unknown")

    def test_ignores_non_crime_csvs_and_rejects_mixed_months(self):
        with tempfile.TemporaryDirectory() as tmp:
            archive = Path(tmp) / "snapshot.zip"
            with zipfile.ZipFile(archive, "w") as output:
                output.writestr("README.csv", "description\nignored\n")
                output.writestr("crime.csv", "Month,Crime type,Reported by,LSOA code\n"
                                "2025-04,Anti-social behaviour,Test Police,E01000001\n"
                                "2025-05,Anti-social behaviour,Test Police,E01000001\n")
            with self.assertRaises(ValueError):
                inspect_archive(archive)

    def test_aggregate_writes_mixed_summary_and_lsoa_review_rows(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            archive = root / "snapshot.zip"
            with zipfile.ZipFile(archive, "w") as output:
                output.writestr("2025-04-test-street.csv",
                                "Month,Crime type,Reported by,LSOA code\n"
                                "2025-04,Anti-social behaviour,Test Police,E01000001\n")
            lsoa_lad = root / "lsoa.csv"
            lsoa_lad.write_text("LSOA21CD,LAD22CD\nE01000001,E06000001\n")
            lookup = root / "lookup.json"
            lookup.write_text(json.dumps({"features": [{"attributes": {
                "LAD25CD": "E06000001", "CSP25CD": "E22000001",
                "CSP25NM": "Test CSP", "PFA25CD": "E23000001"}}]}))
            output = root / "asb.csv"
            export(type("Args", (), {"archive": archive, "start": "2025-04",
                                      "end": "2025-04", "lsoa_lad": lsoa_lad,
                                      "csp_lookup": lookup, "output": output})())
            with output.with_name("asb_review.csv").open(newline="") as stream:
                rows = list(csv.DictReader(stream))
            self.assertEqual(rows[0]["metric"], "assigned_records")
            self.assertEqual(rows[-1]["lsoa_code"], "E01000001")

    def test_aggregate_accepts_explicit_lad_code_translation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            archive = root / "snapshot.zip"
            with zipfile.ZipFile(archive, "w") as output:
                output.writestr("2025-04-test-street.csv",
                                "Month,Crime type,Reported by,LSOA code\n"
                                "2025-04,Anti-social behaviour,Test Police,E01000001\n")
            lsoa_lad = root / "lsoa.csv"
            lsoa_lad.write_text("LSOA21CD,LAD22CD\nE01000001,OLD\n")
            lookup = root / "lookup.json"
            lookup.write_text(json.dumps({"features": [{"attributes": {
                "LAD25CD": "NEW", "CSP25CD": "E22000001",
                "CSP25NM": "Test CSP", "PFA25CD": "E23000001"}}]}))
            output = root / "asb.csv"
            export(type("Args", (), {"archive": archive, "start": "2025-04",
                                      "end": "2025-04", "lsoa_lad": lsoa_lad,
                                      "csp_lookup": lookup, "output": output,
                                      "lad_code_map": ["OLD=NEW"]})())
            with output.open(newline="") as stream:
                self.assertEqual(next(csv.DictReader(stream))["asb_count"], "1")


if __name__ == "__main__":
    unittest.main()
