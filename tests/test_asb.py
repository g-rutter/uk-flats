from pathlib import Path
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
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


if __name__ == "__main__":
    unittest.main()
