#!/usr/bin/env python3
"""Build public text editions of the two user-supplied PDFs (not byte-identical copies)."""
from pathlib import Path
from html import escape
import re
import zipfile
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCES = (
    ('library-docs/llm-guide.txt', 'ai-llm-guide.pdf', 'Практическое руководство по работе с LLM'),
    ('library-docs/qa-engineering.txt', 'ai-qa-engineering.pdf', 'Базовый промпт: инженерия и контроль качества'),
)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
pdfmetrics.registerFont(TTFont('LibraryMono', FONT))
WIDTH, HEIGHT = A4
LEFT, RIGHT, TOP, BOTTOM = 42, 42, 44, 45
LINE_HEIGHT, FONT_SIZE = 10.5, 8.35

READER_CSS = '''html{color-scheme:light dark}body{margin:0;background:#fafaf8;color:#202124;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}main{max-width:72ch;margin:auto;padding:20px clamp(12px,4vw,28px) 50px;overflow-wrap:anywhere}a{color:inherit;text-underline-offset:3px}nav{display:flex;gap:8px 20px;flex-wrap:wrap;margin-bottom:20px}nav a,summary{padding:10px 0}h1{font-size:clamp(1.5rem,5vw,2rem);line-height:1.25}article{font-size:1.125rem;line-height:1.7}h2{font-size:1.35em;line-height:1.3;margin-top:2em;scroll-margin-top:1em}h3{font-size:1.12em;line-height:1.4;margin-top:1.7em}p{margin:.8em 0}li{margin:.45em 0}ul,ol{padding-left:1.5em}.toc{margin:1em 0;border-block:1px solid #aaa}.toc nav{display:block}.toc a{display:block;padding:.3em 0}summary{cursor:pointer;font-weight:700}.note{font-size:1rem}table{width:100%;table-layout:fixed;border-collapse:collapse;margin:1em 0;font-size:inherit}th,td{text-align:left;vertical-align:top;padding:.65em;border:1px solid #aaa}a:focus-visible,summary:focus-visible{outline:2px solid currentColor;outline-offset:3px}@media(prefers-color-scheme:dark){body{background:#171818;color:#eee}}@media(max-width:640px){table,tbody,tr,td{display:block}thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}tr{border:1px solid #aaa;margin:1em 0;padding:.5em .8em}td{border:0;padding:.45em 0}td::before{content:attr(data-label);display:block;font-weight:700}}@media print{body{background:white;color:black}nav,.toc{display:none}article{font-size:11pt}h2,h3{break-after:avoid}tr{break-inside:avoid}}'''


def reader_lines(source):
    pages = source.read_text(encoding='utf-8').split('\f')
    is_guide = source.name == 'llm-guide.txt'
    cleaned = []
    for index, page in enumerate(pages):
        if is_guide and index == 1:  # Replaced by the linked, generated contents.
            continue
        lines = [line.rstrip() for line in page.splitlines() if not (is_guide and (
            line.strip() in {'ПРАКТИЧЕСКОЕ РУКОВОДСТВО', 'ПО РАБОТЕ С LLM', 'ПРАКТИЧЕСКОЕ РУКОВОДСТВО ПО РАБОТЕ С LLM'} or
            re.fullmatch(r'Практическое руководство по работе с LLM · \d+', line.strip()))) ]
        while lines and not lines[0].strip(): lines.pop(0)
        while lines and not lines[-1].strip(): lines.pop()
        cleaned.extend(lines)
    return cleaned


def render_html(source, target, label):
    lines = reader_lines(source)
    out, headings, paragraph = [], [], []
    def flush():
        if paragraph:
            out.append('<p>'+escape(' '.join(paragraph))+'</p>')
            paragraph.clear()
    def columns(line):
        if not re.match(r'^ {2,}\S', line): return []
        return list(re.finditer(r'\S.*?(?= {3,}|$)', line))
    i = 0
    while i < len(lines):
        line, stripped = lines[i], lines[i].strip()
        heading = re.match(r'^(\d+(?:\.\d+)*)\.\s+(.+)', line)
        cols = columns(line)
        if heading:
            flush()
            number, title = heading.groups()
            level, anchor = (3 if '.' in number else 2), 'section-'+number.replace('.','-')
            out.append(f'<h{level} id="{anchor}">'+escape(stripped)+f'</h{level}>')
            if level == 2: headings.append((anchor, stripped))
            i += 1
        elif len(cols) >= 2:
            flush()
            headers = [m.group().strip() for m in cols]
            block, i = [], i+1
            while i < len(lines):
                next_line = lines[i]
                if next_line.strip() and (not next_line.startswith('  ') or [m.group().strip() for m in columns(next_line)] == headers): break
                block.append(next_line)
                i += 1
            starts = [m.start() for m in cols]
            # PDF layout rounds column positions; use the leftmost aligned text.
            for cell in range(1,len(starts)):
                candidates = [m.start() for row in block for m in re.finditer(r'\S.*?(?= {3,}|$)',row) if abs(m.start()-starts[cell])<=3]
                if candidates: starts[cell] = min(candidates)
            rows, row = [], ['']*len(starts)
            for entry in [*block, '']:
                if not entry.strip():
                    if any(row): rows.append(row)
                    row = ['']*len(starts)
                    continue
                for col,start in enumerate(starts):
                    value = entry[start:starts[col+1] if col+1<len(starts) else None].strip()
                    if value: row[col] = (row[col]+' '+value).strip()
            out.append('<table><thead><tr>'+''.join('<th scope="col">'+escape(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td data-label="'+escape(h,quote=True)+'">'+escape(v)+'</td>' for h,v in zip(headers,row))+'</tr>' for row in rows)+'</tbody></table>')
        elif re.match(r'^\s*(?:[•—]|\d+\.)\s+',line):
            flush()
            marker = re.match(r'^\s*([•—]|\d+\.)\s+(.*)',line)
            ordered = marker[1][0].isdigit()
            tag = 'ol' if ordered else 'ul'
            start = ' start="'+marker[1][:-1]+'"' if ordered else ''
            items = []
            while i<len(lines):
                match = re.match(r'^\s*([•—]|\d+\.)\s+(.*)',lines[i])
                if not match or match[1][0].isdigit()!=ordered: break
                item = [match[2]]
                i += 1
                while i<len(lines) and lines[i].startswith(' ') and lines[i].strip() and not re.match(r'^\s*(?:[•—]|\d+\.)\s+',lines[i]) and len(columns(lines[i]))<2:
                    item.append(lines[i].strip())
                    i += 1
                items.append('<li>'+escape(' '.join(item))+'</li>')
            out.append('<'+tag+start+'>'+''.join(items)+'</'+tag+'>')
        else:
            if stripped:
                if paragraph and len(' '.join(paragraph))>350 and re.search(r'[.!?]$',paragraph[-1]): flush()
                paragraph.append(stripped)
            else: flush()
            i += 1
    flush()
    toc = '<details class="toc"><summary>Содержание</summary><nav aria-label="Содержание документа"><ol>'+''.join('<li><a href="#'+anchor+'">'+escape(re.sub(r'^\d+\.\s+','',title))+'</a></li>' for anchor,title in headings)+'</ol></nav></details>'
    document = '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(label)+' — ENJIGIRLING</title><style>'+READER_CSS+'</style></head><body><main><nav><a href="../coding.html">← Кодинг</a><a href="'+target.with_suffix('.pdf').name+'" download="">Скачать PDF</a><a href="'+target.name+'" download="">Сохранить HTML</a></nav><h1>'+escape(label)+'</h1><p class="note">Текст подстраивается под экран. Размер шрифта можно увеличить в браузере; HTML можно сохранить для чтения без сети.</p>'+toc+'<article>'+''.join(out)+'</article></main></body></html>'
    target.write_text(document,encoding='utf-8')
    print(f'{target.name}: {target.stat().st_size} bytes, {len(headings)} sections')

def render(source, target, label):
    pages = source.read_text(encoding='utf-8').split('\f')
    if not pages or not pages[0].strip():
        raise ValueError(f'Empty source: {source}')
    pdf = canvas.Canvas(str(target), pagesize=A4, pageCompression=1, invariant=1)
    pdf.setCreator("ENJIGIRLING reference document builder")
    pdf.setTitle(label)
    pdf.setAuthor('ENJIGIRLING — текстовая редакция пользовательского документа')
    count, y = 0, 0
    def start_page():
        nonlocal count, y
        count += 1
        pdf.setFont('LibraryMono', 7)
        pdf.drawString(LEFT, HEIGHT-29, label[:80])
        pdf.line(LEFT, HEIGHT-34, WIDTH-RIGHT, HEIGHT-34)
        y = HEIGHT-TOP-10
    def end_page():
        pdf.setFont('LibraryMono', 7)
        pdf.line(LEFT, BOTTOM-11, WIDTH-RIGHT, BOTTOM-11)
        pdf.drawRightString(WIDTH-RIGHT, BOTTOM-24, str(count))
        pdf.showPage()
    def put_line(line):
        nonlocal y
        if y < BOTTOM:
            end_page()
            start_page()
        pdf.setFont('LibraryMono', FONT_SIZE)
        pdf.drawString(LEFT, y, line)
        y -= LINE_HEIGHT
    start_page()
    max_width = WIDTH-LEFT-RIGHT
    for idx, part in enumerate(pages):
        if idx:
            end_page()
            start_page()
        for row in part.splitlines():
            row = row.replace('\t','    ').rstrip('\r\n')
            while row and pdfmetrics.stringWidth(row, 'LibraryMono', FONT_SIZE)>max_width:
                end=len(row)
                while end>1 and pdfmetrics.stringWidth(row[:end],'LibraryMono',FONT_SIZE)>max_width:
                    end-=1
                space=row.rfind(' ',0,end+1)
                if space>18:
                    end=space+1
                put_line(row[:end].rstrip())
                row='  '+row[end:].lstrip()
            put_line(row)
    end_page()
    pdf.save()
    if target.stat().st_size<2500 or target.read_bytes()[:5]!=b'%PDF-':
        raise RuntimeError(f'Invalid PDF: {target}')
    return count

def main():
    dest=ROOT/'downloads'
    dest.mkdir(exist_ok=True)
    built=[]
    for src,name,title in SOURCES:
        out=dest/name
        pages=render(ROOT/src,out,title)
        render_html(ROOT/src,out.with_suffix('.html'),title)
        print(f'{name}: {out.stat().st_size} bytes, {pages} pages')
        built.append(out)
    archive=dest/'ai-library-documents.zip'
    with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as zf:
        for file in built:
            info=zipfile.ZipInfo(file.name, date_time=(2000,1,1,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            info.external_attr=0o644 << 16
            zf.writestr(info,file.read_bytes())
    with zipfile.ZipFile(archive) as zf:
        assert zf.testzip() is None
        assert sorted(zf.namelist())==sorted(p.name for p in built)
    print(f'ZIP: {archive.stat().st_size} bytes')

if __name__=='__main__':
    main()
