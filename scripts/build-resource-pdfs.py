#!/usr/bin/env python3
"""Build public text editions of the two user-supplied PDFs (not byte-identical copies)."""
from pathlib import Path
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
