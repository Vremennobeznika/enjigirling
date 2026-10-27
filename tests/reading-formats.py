#!/usr/bin/env python3
"""Check source preservation and offline book integrity without the generator."""
import json
import posixpath
import zipfile
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
READING = ROOT/'knowledge/reading'
sections = json.loads((ROOT/'knowledge/sections/index.json').read_text())['sections']
matrix = json.loads((ROOT/'knowledge/atlas-implementation-matrix.json').read_text())['items']

def plain(node):
    return (node.text or '')+''.join(('\n' if child.tag.split('}')[-1]=='br' else plain(child))+(child.tail or '') for child in node)

def pairs(node):
    return {plain(dt):dd for dt,dd in zip(list(node)[::2],list(node)[1::2])}

chapters = {}
for section in sections:
    slug = section['id']
    root = ET.fromstring((READING/(slug+'.html')).read_bytes())
    articles = root.findall('.//article')
    expected = len(matrix) if slug=='calculators' else 0 if slug=='compare' else section['records']
    assert len(articles)==expected, (slug,len(articles),expected)
    assert not root.findall('.//script'), slug
    assert not root.findall('.//link'), slug
    assert not root.findall('.//img'), slug
    assert root.get('lang')=='ru', slug
    chapters[slug] = articles

for article,item in zip(chapters['calculators'],matrix):
    values = pairs(article.find('dl'))
    assert plain(values['Формула'])==item['formula'], item['id']
    assert plain(values['Допущения и ограничения'])==item['limits'], item['id']
    assert values['Ссылка'].find('a').get('href')=='https://enjigirling.ru/'+item['href']
    inputs = values['Исходные данные'].findall('./ul/li/dl')
    assert len(inputs)==len(item['inputs']), item['id']
    for node,field in zip(inputs,item['inputs']):
        fields = pairs(node)
        assert plain(fields['Параметр'])==field['label']
        assert plain(fields['Пример значения'])==str(field['example'])
        rules = plain(fields.get('Требования к вводу',ET.Element('empty')))
        if field.get('text'):
            assert '256' in plain(fields['Формат'])
        else:
            minimum = field.get('min') if field.get('min') is not None else (-10**12 if field.get('signed') else 0)
            maximum = field.get('max') if field.get('max') is not None else 10**12
            assert float(plain(fields['Минимум']))==minimum
            assert float(plain(fields['Максимум']))==maximum
            if field.get('positive'): assert 'Ноль недопустим.' in rules
            if field.get('integer'): assert 'Только целые числа.' in rules
            if field.get('choices') is not None:
                assert [plain(li) for li in fields['Допустимые значения'].findall('./ul/li')]==list(map(str,field['choices']))
            if field.get('matrix'):
                assert '2 до 50' in plain(fields['Формат']) and '10 000' in plain(fields['Формат'])
                assert 'каждому элементу матрицы' in rules
            elif field.get('list'):
                assert '1 до 10 000' in plain(fields['Формат']) and '200 000' in plain(fields['Формат'])
                assert 'каждому элементу списка' in rules

epubs = sorted(READING.glob('*.epub'))
assert len(epubs)==len(sections)+1
for filename in epubs:
    with zipfile.ZipFile(filename) as book:
        assert book.testzip() is None, filename
        first = book.infolist()[0]
        assert first.filename=='mimetype' and first.compress_type==zipfile.ZIP_STORED
        assert book.read('mimetype')==b'application/epub+zip'
        documents = {name:ET.fromstring(book.read(name)) for name in book.namelist() if name.endswith(('.xml','.opf','.xhtml'))}
        for name,root in documents.items():
            ids = [node.get('id') for node in root.iter() if node.get('id')]
            assert len(ids)==len(set(ids)), (filename,name)
            for node in root.iter():
                for attribute in ['href','src','full-path']:
                    href = node.get(attribute)
                    if not href or urlsplit(href).scheme: continue
                    target = urlsplit(href)
                    path = posixpath.normpath(posixpath.join('' if attribute=='full-path' else posixpath.dirname(name),unquote(target.path))) if target.path else name
                    assert path in book.namelist(), (filename,name,href)
                    if target.fragment:
                        assert any(n.get('id')==unquote(target.fragment) for n in documents[path].iter())
        ns = {'p':'http://www.idpf.org/2007/opf','h':'http://www.w3.org/1999/xhtml'}
        opf = documents['EPUB/content.opf']
        manifest = {node.get('id') for node in opf.findall('p:manifest/p:item',ns)}
        assert all(node.get('idref') in manifest for node in opf.findall('p:spine/p:itemref',ns))
        for name,root in documents.items():
            slug = Path(name).stem
            if name.endswith('.xhtml') and slug!='nav':
                articles = root.findall('.//h:article',ns)
                assert [plain(a) for a in articles]==[plain(a) for a in chapters[slug]], (filename,slug)

print(f'Reading QA: {len(sections)} chapters, {len(matrix)} complete calculator models, {len(epubs)} valid offline EPUB structures; HTML/EPUB content matches.')
