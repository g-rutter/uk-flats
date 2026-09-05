"""Read cached OOXML values using only the Python standard library."""
import posixpath
import re
import xml.etree.ElementTree as ET
import zipfile

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def sheets(path):
    with zipfile.ZipFile(path) as archive:
        strings = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            strings = [''.join(t.text or '' for t in item.findall('.//s:t', NS))
                       for item in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
        rels = {r.get('Id'): r.get('Target') for r in
                ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))}
        for sheet in ET.fromstring(archive.read('xl/workbook.xml')).find('s:sheets', NS):
            target = rels[sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')]
            target = target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/' + target)
            rows = []
            for row in ET.fromstring(archive.read(target)).findall('.//s:sheetData/s:row', NS):
                while len(rows) < int(row.get('r')):
                    rows.append({})
                for cell in row:
                    col = re.match('[A-Z]+', cell.get('r'))[0]
                    value = cell.find('s:v', NS)
                    value = value.text if value is not None else ''
                    if cell.get('t') == 's':
                        value = strings[int(value)]
                    elif cell.get('t') == 'inlineStr':
                        value = ''.join(t.text or '' for t in cell.findall('.//s:t', NS))
                    elif not value and cell.find('s:f', NS) is not None:
                        raise ValueError(f'Uncached formula: {sheet.get("name")} {cell.get("r")}')
                    rows[-1][col] = value
            yield sheet.get('name').strip(), rows
