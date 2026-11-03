"""Check the complete document text and reconstructed tables independently of the renderer."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.words, self.cells, self.headings, self.assets = [], [], [], []
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == 'article': self.inside = True
        if tag in ('script','link','img','iframe'): self.assets.append(tag)
        if self.inside and tag == 'h2': self.headings.append(dict(attrs).get('id'))
        if self.inside and tag in ('th','td'): self.cell = []

    def handle_endtag(self, tag):
        if tag == 'article': self.inside = False
        if tag in ('th','td') and self.cell is not None:
            self.cells.append(' '.join(self.cell))
            self.cell = None

    def handle_data(self, value):
        if self.inside: self.words.append(value)
        if self.cell is not None: self.cell.append(value)


for name,count in [('llm-guide',19),('qa-engineering',16)]:
    pages = (ROOT/f'library-docs/{name}.txt').read_text().split('\f')
    expected = []
    for index,page in enumerate(pages):
        if name=='llm-guide' and index==1: continue  # Native linked contents replaces PDF contents.
        for line in page.splitlines():
            value = line.strip()
            if name=='llm-guide' and (value in {'ПРАКТИЧЕСКОЕ РУКОВОДСТВО','ПО РАБОТЕ С LLM','ПРАКТИЧЕСКОЕ РУКОВОДСТВО ПО РАБОТЕ С LLM'} or re.fullmatch(r'Практическое руководство по работе с LLM · \d+',value)): continue
            expected.append(re.sub(r'^[ \t]+\d+\.[ \t]+','',line))  # HTML ordered-list markers are native, not text nodes.
    document = Document()
    document.feed((ROOT/f'downloads/ai-{name}.html').read_text())
    tokens = lambda value: Counter(re.findall(r'\w+',value.casefold()))
    assert tokens('\n'.join(expected)) == tokens(' '.join(document.words)), name+': source words or numbers changed'
    assert len(document.headings)==count and len(set(document.headings))==count, name
    assert not document.assets, name+': reader acquired a runtime dependency'
    if name=='llm-guide':
        assert document.cells[3:6]==['Большой набор однотипных документов','Обрабатывать одинаковыми пакетами и шаблонами','ID документа, страницы, источник каждого значения']
        assert 'Неясно, откуда взялось критичное значение' in document.cells
    print(f'PASS {name}: complete source words and numbers, {count} linked sections, no runtime assets; table cells preserved.')
