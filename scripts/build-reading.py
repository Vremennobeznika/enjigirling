#!/usr/bin/env python3
"""Build static reading editions and EPUB 3 from the generated knowledge packs."""
from pathlib import Path
from html import escape
from io import BytesIO
import hashlib
import json
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
CHECK = '--check' in sys.argv
TITLE = 'ENJIGIRLING — инженерный справочник'
NOTE = 'Редакционный справочник, не нормативная база. Проверяйте числа, формулы и требования по первоисточникам. Ссылки на внешние источники требуют интернета.'
CSS = '''html{color-scheme:light dark}body{font:1.125em/1.7 system-ui,sans-serif;margin:0 auto;padding:1.2rem;max-width:74ch;overflow-wrap:anywhere;background:#fafaf8;color:#202124}a{color:#075da8}h1,h2,h3{line-height:1.25}h1{font-size:2rem}h2{margin-top:2.6rem}h3{margin-top:1.8rem}p{margin:.65em 0}li{margin:.35em 0}dl{margin:.6em 0}dt{font-weight:650;margin-top:.7em}dd{margin-left:1rem}article{border-top:1px solid #bbb;padding-top:1rem;margin-top:2rem}nav a{display:inline-block;padding:.25em 0}.note{font-size:.9em;color:#555}header{margin-bottom:2rem}pre{white-space:pre-wrap}article:target{outline:2px solid currentColor;outline-offset:6px}@media(prefers-color-scheme:dark){body{background:#171818;color:#eee}a{color:#a6d1ff}.note{color:#bbb}}@media print{body{font-size:11pt;background:#fff;color:#000}a{color:inherit}nav{break-after:page}}'''
LABELS = dict(shortDesc='Чем занимается', education='Подготовка', requirements='Базовые знания', courses='Инструменты и темы', careerGrowth='Возможные направления роста', easy='Особенности работы', hard='Сложности', term='Термин', definition='Определение', def_='Определение', description='Описание', desc='Описание', detail='Описание', title='Название', name='Название', family='Семейство', group='Группа', uses='Применение', process='Связанные процессы', materials='Материалы', profession='Профессия', steps='Этапы', checks='Контроль', note='Примечание', sources='Источники', source='Источник', sourceUrl='Источник', url='Ссылка', link='Ссылка', site='Сайт', evidence='Границы проверки', verifiedClaim='Проверенный тезис', reviewScope='Пределы проверки', checkedAt='Дата проверки', category='Категория', industry='Отрасль', industries='Отрасли', city='Город', district='Округ', focus='Направления', profile='Профиль', type='Тип', aliases='Также называют', rule='Правило даты', month='Месяц', ids='Профессии', kind='Тип даты', formula='Формула', outputUnit='Единица результата', limits='Допущения и ограничения', inputs='Исходные данные', label='Параметр', example='Пример значения', min='Минимум', max='Максимум', sourceLabel='Издатель копии', order='Приказ', assessment='Применимость', documents='Нормативные документы', effectiveFrom='Начало действия', effectiveUntil='Окончание действия', displayLabel='Показатель', metric='Что означает показатель', region='Регион', program='Программа', programs='Программы', verifiedPrograms='Проверенные программы', verifiedScope='Границы подтверждения', sourceStatus='Статус источника')
LABELS['def'] = LABELS.pop('def_')
LABELS.update(reviewDate='Дата редакционной проверки', weekday='День недели', nth='Номер недели', day='Число', code='Код программы', verifiedPrograms='Проверенные программы')
LABELS.update(topic='Тема', year='Учебный год', basis='Форма обучения', sourceType='Тип источника', tags='Метки', duration='Продолжительность', budgetPlaces='Бюджетные места', paidPlaces='Платные места', admission='Условия поступления', tuitionAnnualRub='Стоимость за год, ₽', tuitionSemesterRub='Стоимость за семестр, ₽', admissionSourceUrl='Источник условий поступления', since='Начиная с года', inputRules='Требования к вводу', allowedValues='Допустимые значения', format='Формат')
ENUM = {'source_located':'Источник найден', 'claim_checked':'Проверен отдельный тезис', 'unverified':'Не подтверждено', 'university':'Вуз', 'college':'Колледж', 'forming':'Формообразование', 'joining':'Соединение', 'treatment':'Обработка', 'inspection':'Контроль', 'metals':'Металлы и машиностроение', 'electronics':'Электроника', 'polymers':'Полимеры', 'food':'Пищевая промышленность', 'textiles':'Текстиль', 'wood':'Деревообработка', 'chemicals':'Химическое производство', 'general':'Межотраслевые процессы', 'composites':'Композиты', 'construction':'Строительство', 'energy':'Энергетика', 'water':'Водоподготовка', 'ceramics':'Керамика и стекло', 'pharma':'Фармацевтическое производство', 'printing':'Полиграфия', 'mining':'Горное производство'}
SKIP = {'id', 'knowledgeMeta', 'sourceHtml', 'reviewedTextSha256', 'sourceFetchStatus', 'siteFetchStatus', 'sourceFetchCheckedAt', 'siteFetchCheckedAt', 'reviewMethod', 'reviewStatus', 'verificationStatus', 'legalObligationStatus', 'evidenceStatus', 'periodStatus', 'linkCheckedAt', 'parentId', 'group', 'groupTitle', 'status', 'calculatorId', 'trigger', 'reference', 'researchSource', 'positive', 'integer', 'signed', 'list', 'matrix', 'text', 'key', 'pattern', 'choices'}
ENUM['institution_home'] = 'Сайт учебного заведения'
index = json.loads((ROOT/'knowledge/sections/index.json').read_text())
packs = [json.loads((ROOT/entry['json']).read_text()) for entry in index['sections']]
# Human names for linked records; preserve source links and exact text.
names = {}
for filename in ['professions','materials','processes']:
    for row in json.loads((ROOT/f'knowledge/{filename}.json').read_text())['items']:
        names[row['id']] = row.get('title', row.get('name', row['id']))

def text(value):
    return escape(str(value), quote=True)

def value_html(value):
    if isinstance(value, dict):
        return fields(value)
    if isinstance(value, list):
        return '<ul>'+''.join('<li>'+value_html(item)+'</li>' for item in value if item is not None)+'</ul>'
    if isinstance(value, bool):
        return 'Да' if value else 'Нет'
    value = str(value)
    if re.match(r'^https?://[^\s]+$', value):
        return '<a href="'+text(value)+'">'+text(value)+'</a>'
    return text(names.get(value, ENUM.get(value,value))).replace('\n','<br/>')

def input_record(field):
    """Keep the form's value constraints in the human reading editions."""
    result = {key:field[key] for key in ['label','example'] if key in field}
    rules = []
    if field.get('text'):
        formats = {
            r'^(?:0|[1-9]\d*)$':'Ноль или целое положительное число без ведущих нулей.',
            r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$':'Дата и время UTC: ГГГГ-ММ-ДДTчч:мм:ссZ.',
            r'^\d{3}$':'Ровно три цифры.',
            r'^\d{1,3}(?:\.\d{1,3}){3}$':'Четыре группы из 1–3 цифр, разделённые точками.',
            r'^[0-9A-Fa-f:]+$':'Шестнадцатеричные цифры и двоеточия.',
            r'^(?:[0-9A-Fa-f]{2}\s*)+$':'Пары шестнадцатеричных цифр; между парами допустимы пробелы.',
            r'^[\s\S]+$':'Непустой текст.', r'^[01]+$':'Непустая последовательность нулей и единиц.',
            r'^\d{3,4}$':'Три или четыре цифры.'}
        result['format'] = 'Текст, не более 256 символов. '+formats.get(field['pattern'],'Шаблон ввода: '+field['pattern'])
    else:
        result['min'] = field.get('min') if field.get('min') is not None else (-10**12 if field.get('signed') else 0)
        result['max'] = field.get('max') if field.get('max') is not None else 10**12
        if field.get('positive'): rules.append('Ноль недопустим.')
        if field.get('integer'): rules.append('Только целые числа.')
        if field.get('choices') is not None: result['allowedValues'] = field['choices']
        if field.get('matrix'):
            result['format'] = 'От 2 до 50 строк; значения в строке через точку с запятой. Всего не более 10 000 чисел; исходный текст не более 200 000 символов.'
            rules.append('Числовые ограничения относятся к каждому элементу матрицы.')
        elif field.get('list'):
            result['format'] = 'От 1 до 10 000 чисел через точку с запятой или с новой строки; исходный текст не более 200 000 символов.'
            rules.append('Числовые ограничения относятся к каждому элементу списка.')
    if rules: result['inputRules'] = rules
    return result

def fields(row):
    return '<dl>'+''.join('<dt>'+text(LABELS.get(key,key))+'</dt><dd>'+value_html(value)+'</dd>' for key,value in row.items() if key not in SKIP and value is not None and value != [] and value != '')+'</dl>'

def record(row, number):
    row = dict(row)
    title = row.get('title') or row.get('name') or row.get('term') or row.get('date') or f'Запись {number}'
    for key in ['title','name','term']: row.pop(key,None)
    return '<article id="record-'+str(number)+'"><h2>'+text(title)+'</h2>'+fields(row)+'</article>'

def chapter(pack):
    slug = pack['sectionId']
    rows = pack['records']
    intro = ''
    if slug == 'calculators':
        rows = []
        for item in json.loads((ROOT/'knowledge/atlas-implementation-matrix.json').read_text())['items']:
            rows.append(dict(title=item['groupTitle']+' — '+item['topic'], formula=item['formula'], outputUnit=item['outputUnit'], inputs=[input_record(field) for field in item['inputs']], limits=item['limits'], source=item.get('researchSource'), url='https://enjigirling.ru/'+item['href']))
        intro = '<p>Здесь приведены формулы и ограничения 734 реализованных моделей. Для выполнения расчёта откройте ссылку на соответствующий инструмент.</p>'
    if slug == 'compare':
        rows = []
        intro = '<p>Профили профессий приведены в главе «Профессии», без повторения их в этой главе. Для сравнения двух–четырёх специальностей откройте <a href="https://enjigirling.ru/compare.html">интерактивный инструмент</a>.</p>'
    if slug == 'dictionary':
        rows = sorted(rows,key=lambda r: (0 if not r['term'][:1].isalpha() else 1 if 'а' <= r['term'][:1].casefold() <= 'я' or r['term'][:1].casefold() == 'ё' else 2, r['term'].casefold().replace('ё','е')))
    if slug == 'ai-code-library':
        intro = '<p>Подборка ссылок и описаний. Полные тексты сторонних учебников в книгу не включены.</p>'
    if not rows and not intro:
        intro += '<p>'+text(pack['staticPageText'])+'</p>'
    return '<header><h1>'+text(pack['title'])+'</h1><p class="note">'+text(NOTE)+'</p>'+intro+'</header>'+''.join(record(row,i+1) for i,row in enumerate(rows))

def html_page(title, body, navigation='', xhtml=False):
    attrs = ' xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru"' if xhtml else ''
    return '<!DOCTYPE html><html lang="ru"'+attrs+'><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>'+text(title)+'</title><style>'+CSS+'</style></head><body>'+navigation+'<main>'+body+'</main></body></html>'

contents = {pack['sectionId']:chapter(pack) for pack in packs}

def epub(selected, title):
    files = {}
    nav = '<nav xmlns:epub="http://www.idpf.org/2007/ops" epub:type="toc" id="toc"><h1>Оглавление</h1><ol>'+''.join('<li><a href="'+p['sectionId']+'.xhtml">'+text(p['title'])+'</a></li>' for p in selected)+'</ol></nav>'
    files['EPUB/nav.xhtml'] = html_page('Оглавление',nav,xhtml=True)
    for p in selected:
        files['EPUB/'+p['sectionId']+'.xhtml'] = html_page(p['title'],contents[p['sectionId']],xhtml=True)
    digest = hashlib.sha256(''.join(files.values()).encode()).hexdigest()
    items = '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>'+''.join('<item id="c'+str(i)+'" href="'+p['sectionId']+'.xhtml" media-type="application/xhtml+xml"/>' for i,p in enumerate(selected))
    spine = '<itemref idref="nav"/>'+''.join('<itemref idref="c'+str(i)+'"/>' for i in range(len(selected)))
    files['EPUB/content.opf'] = '<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">urn:enjigirling:'+digest+'</dc:identifier><dc:title>'+text(title)+'</dc:title><dc:language>ru</dc:language><dc:creator>Редакция ENJIGIRLING</dc:creator><dc:description>'+text(NOTE)+'</dc:description><meta property="dcterms:modified">2026-10-27T00:00:00Z</meta></metadata><manifest>'+items+'</manifest><spine>'+spine+'</spine></package>'
    files['META-INF/container.xml'] = '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
    output = BytesIO()
    with zipfile.ZipFile(output,'w') as archive:
        for name,data in [('mimetype','application/epub+zip'), *files.items()]:
            info = zipfile.ZipInfo(name,date_time=(2000,1,1,0,0,0))
            info.compress_type = zipfile.ZIP_STORED if name=='mimetype' else zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info,data.encode('utf-8'))
    return output.getvalue()

outputs = {}
for pack in packs:
    slug = pack['sectionId']
    nav = '<nav aria-label="Книга"><a href="index.html">← Оглавление</a> · <a href="'+slug+'.epub" download="">Скачать EPUB</a> · <a href="'+slug+'.html" download="">Скачать HTML</a></nav>'
    outputs[slug+'.html'] = html_page(pack['title'],contents[slug],nav).encode()
    outputs[slug+'.epub'] = epub([pack],pack['title'])
links = '<ol>'+''.join('<li><a href="'+p['sectionId']+'.html">'+text(p['title'])+'</a> · <a href="'+p['sectionId']+'.epub" download="">EPUB</a></li>' for p in packs)+'</ol>'
body = '<header><h1>'+text(TITLE)+'</h1><p>Читать по главам в браузере или скачать книгу для читалки. Размер шрифта и перенос строк подстраиваются под экран.</p><p class="note">'+text(NOTE)+'</p><p><a href="all.epub" download="">Скачать всю книгу — EPUB</a></p></header><nav aria-label="Оглавление"><h2>Оглавление</h2>'+links+'</nav>'
outputs['index.html'] = html_page(TITLE,body,'<nav><a href="../../ai.html">← Для ИИ</a></nav>').encode()
outputs['all.epub'] = epub(packs,TITLE)
for name,data in outputs.items():
    path = ROOT/'knowledge/reading'/name
    if CHECK:
        if not path.exists() or path.read_bytes()!=data: raise SystemExit('Stale reading edition: '+name)
    else:
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_bytes(data)
print(f'Reading editions: {len(packs)} sections, HTML + EPUB, {len(outputs)} files'+(' current' if CHECK else ' generated'))
