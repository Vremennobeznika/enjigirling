"""Synthetic supplier-layout tests; no network and no invented production quotes."""
from datetime import datetime, timezone
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('mc_importer',ROOT/'scripts/update-mc-prices.py')
mc=importlib.util.module_from_spec(spec);spec.loader.exec_module(mc)
FIXTURE=(ROOT/'tests/fixtures/mc-synthetic.zip').read_bytes()
NOW=datetime(2026,10,27,8,tzinfo=timezone.utc)

class ImportTests(unittest.TestCase):
    def test_units_quantity_and_document_date(self):
        data=mc.parse_archive(FIXTURE,mc.URLS[0],NOW)
        self.assertEqual(len(data['items']),56)
        self.assertTrue(all(x['unit']=='т'for x in data['items']))
        self.assertEqual(data['skippedUnits']['теор.т'],4)
        self.assertEqual(data['documents'][1]['minTonnes'],5)
        self.assertEqual(data['documents'][0]['publishedAt'],'2026-10-26T13:29:00+03:00')
        self.assertEqual(data['items'][0]['priceRUBPerTonne'],50006)
        self.assertEqual(data['items'][0]['sourceRow'],7)

    def test_stale_and_future_are_not_accepted(self):
        for date in [datetime(2026,10,30,tzinfo=timezone.utc),datetime(2026,10,24,tzinfo=timezone.utc)]:
            with self.assertRaisesRegex(ValueError,'stale or future'):
                mc.parse_archive(FIXTURE,mc.URLS[0],date)

    def test_archive_error_is_not_a_zero_price(self):
        with self.assertRaises(zipfile.BadZipFile):mc.parse_archive(b'proxy error',mc.URLS[0],NOW)
        buf=io.BytesIO()
        with zipfile.ZipFile(buf,'w')as z:z.writestr('unrelated.xls',b'bad')
        with self.assertRaisesRegex(ValueError,'Missing expected'):mc.parse_archive(buf.getvalue(),mc.URLS[0],NOW)

    def test_failed_network_keeps_last_success_bytes(self):
        with tempfile.TemporaryDirectory()as tmp:
            target=Path(tmp)/'prices.json';target.write_text('{"last":"success"}\n');before=target.read_bytes()
            with patch('sys.argv',['update-mc-prices.py','--output',str(target)]),patch.object(mc,'download',side_effect=OSError('network unavailable')):
                self.assertEqual(mc.main(),1)
            self.assertEqual(target.read_bytes(),before)

if __name__=='__main__':unittest.main()
