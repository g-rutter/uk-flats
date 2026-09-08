"""Small, standard-library CSV helpers shared by pipeline scripts."""
import csv


def read_rows(path):
    """Return UTF-8 CSV rows, preserving blank fields."""
    with path.open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def write_csv(path, rows, fields=None):
    """Write UTF-8, LF-delimited dictionary rows, creating parent directories."""
    rows = list(rows)
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = fields or list(dict.fromkeys(key for row in rows for key in row))
    with path.open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
