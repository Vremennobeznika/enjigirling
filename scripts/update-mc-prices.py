#!/usr/bin/env python3
"""Import dated, actual-tonne quotes from the official MC ZIP. Never replace good data on failure."""
import argparse
from datetime import datetime, timezone, timedelta
from decimal import Decimal, InvalidOperation
import hashlib
import io
import json
from pathlib import Path
import re
import sys
import urllib.request
import zipfile

import xlrd

ROOT = Path(__file__).resolve().parents[1]
URLS = ('http://mc.ru:8080/prices/metserv.zip', 'http://en.mc.ru/prices/metserv.zip')
FILES = ('listovojprokat.xls', 'sortovojprokat.xls', 'kachestvst.xls', 'truby.xls')
MOSCOW = timezone(timedelta(hours=3))
MAX_AGE_HOURS = 72

def clean(value):
    return re.sub(r'\s+', ' ', str(value)).strip()

def parse_archive(data, source_url, now=None):
    now = now or datetime.now(timezone.utc)
    records, documents, skipped = [], [], {}
    if len(data) > 8_000_000:
        raise ValueError('Archive exceeds size limit')
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        members = archive.infolist()
        if len(members) > 40 or sum(m.file_size for m in members) > 30_000_000:
            raise ValueError('Unexpected archive expansion')
        if len({m.filename for m in members}) != len(members):
            raise ValueError('Duplicate archive members')
        for filename in FILES:
            if filename not in archive.namelist():
                raise ValueError('Missing expected workbook: '+filename)
            raw = archive.read(filename)
            book = xlrd.open_workbook(file_contents=raw, formatting_info=True)
            if book.nsheets != 1:
                raise ValueError('Unexpected worksheet count')
            sheet = book.sheet_by_index(0)
            if sheet.ncols != 10 or not 10 <= sheet.nrows <= 15000:
                raise ValueError('Unexpected worksheet layout')
            if clean(sheet.cell_value(5,2))!='Ед.изм' or clean(sheet.cell_value(5,3))!='Цена':
                raise ValueError('Supplier price columns changed')
            header = ' '.join(clean(sheet.cell_value(r,c)) for r in range(4) for c in range(10))
            date = re.search(r'Прайс-лист\s+от\s+(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})',header)
            if not date or 'mc.ru' not in header:
                raise ValueError('Missing supplier/date header')
            published = datetime.strptime(' '.join(date.groups()), '%d.%m.%Y %H:%M').replace(tzinfo=MOSCOW)
            if not -3600 <= (now-published).total_seconds() <= MAX_AGE_HOURS*3600:
                raise ValueError('Supplier workbook is stale or future-dated: '+filename)
            title = clean(sheet.cell_value(3,0))
            minimum = re.search(r'цена\s+от\s+(\d+(?:[.,]\d+)?)\s*т',title,re.I)
            min_tonnes = float(minimum.group(1).replace(',','.')) if minimum else None
            merged = {}
            sections = {}
            for r0,r1,c0,c1 in sheet.merged_cells:
                if r1-r0>100 or c1-c0>10:
                    raise ValueError('Unexpected merged range')
                if c0 in (0,5) and c1-c0==4 and r0>=4:
                    sections[(r0,c0)] = clean(sheet.cell_value(r0,c0))
                if c1-c0==1:
                    for r in range(r0,r1):
                        merged[(r,c0)] = sheet.cell_value(r0,c0)
            document = {'file':filename,'title':title,'publishedAt':published.isoformat(),
                        'sha256':hashlib.sha256(raw).hexdigest(),'minTonnes':min_tonnes,
                        'sourceUrl':source_url.rsplit('/',1)[0]+'/'+filename.replace('.xls','.zip')}
            documents.append(document)
            count=0
            for offset in (0,5):
                section = ''
                for row in range(4,sheet.nrows):
                    if (row,offset) in sections:
                        section=sections[(row,offset)]
                        continue
                    cells=[clean(merged.get((row,c),sheet.cell_value(row,c))) for c in range(offset,offset+4)]
                    description,sizes,unit,price=cells
                    # A theoretical tonne, kg, metre or piece is not an actual tonne.
                    if unit!='т':
                        if unit and unit not in ('Ед.изм','Ед.изм.'):
                            skipped[unit]=skipped.get(unit,0)+1
                        continue
                    if not description or not sizes or not section:
                        skipped['missing_identity_or_section']=skipped.get('missing_identity_or_section',0)+1
                        continue
                    try:
                        amount=Decimal(price.replace(' ','').replace(',','.'))
                    except InvalidOperation:
                        raise ValueError('Unparseable tonne price in '+filename)
                    if not amount.is_finite() or not Decimal('0')<amount<Decimal('100000000'):
                        raise ValueError('Invalid price in '+filename)
                    identity=f'{filename}:{row+1}:{offset+1}'
                    records.append({'id':identity,'document':filename,'section':section,'description':description,
                                    'sizes':sizes,'unit':'т','priceRUBPerTonne':float(amount),
                                    'sourceRow':row+1,'sourceColumn':offset+1})
                    count+=1
            if count<5:
                raise ValueError('Insufficient parsed rows in '+filename)
    if not 50 <= len(records) <= 20000:
        raise ValueError('Unexpected quote count')
    return {'schemaVersion':1,'supplier':'МЕТАЛЛСЕРВИС','region':'Москва — общий прайс',
            'retrievedAt':now.isoformat(),'maxAgeHours':MAX_AGE_HOURS,'vatIncluded':True,
            'sourceUrl':source_url,'archiveSha256':hashlib.sha256(data).hexdigest(),
            'limitations':'Общий московский прайс. Склад, остаток и полный типоразмер не указаны; одинаковые строки не объединены. Цена для оценки, не подтверждённое предложение на поставку. Только фактические тонны; теоретические тонны, метры и штуки исключены.',
            'documents':documents,'skippedUnits':skipped,'items':records}

def download(url):
    request=urllib.request.Request(url,headers={'User-Agent':'ENJIGIRLING-price-updater/1.0'})
    with urllib.request.urlopen(request,timeout=35) as response:
        if response.url.split('/')[2] not in ('mc.ru:8080','en.mc.ru'):
            raise ValueError('Unexpected supplier redirect')
        data=response.read(8_000_001)
    return data

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=ROOT/'mc-prices.json')
    parser.add_argument('--archive',type=Path,help='Local supplier archive for reproducible validation')
    args=parser.parse_args()
    errors=[]
    snapshot=None
    for url in URLS:
        try:
            data=args.archive.read_bytes() if args.archive else download(url)
            snapshot=parse_archive(data,url)
            break
        except Exception as error:
            errors.append({'source':url,'error':str(error)[:250]})
    if snapshot is None:
        print(json.dumps({'updated':False,'retainedPrevious':args.output.exists(),'errors':errors},ensure_ascii=False))
        return 1
    if args.output.exists():
        old=json.loads(args.output.read_text())
        dates={d['file']:d['publishedAt'] for d in old.get('documents',[])}
        if any(d['file'] in dates and d['publishedAt']<dates[d['file']] for d in snapshot['documents']):
            raise ValueError('Refusing supplier date rollback')
    text=json.dumps(snapshot,ensure_ascii=False,separators=(',',':'))+'\n'
    temp=args.output.with_suffix('.tmp')
    temp.write_text(text)
    temp.replace(args.output)
    print(json.dumps({'updated':True,'quotes':len(snapshot['items']),'source':snapshot['sourceUrl'],
                      'documents':snapshot['documents'],'skipped':snapshot['skippedUnits']},ensure_ascii=False))
    return 0

if __name__=='__main__':
    sys.exit(main())
