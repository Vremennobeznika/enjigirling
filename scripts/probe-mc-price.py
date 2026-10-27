#!/usr/bin/env python3
"""Probe official public MC endpoints from the deployment runner, without credentials."""
import concurrent.futures
import json
from pathlib import Path
import urllib.error
import urllib.request

URLS = [
    'http://mc.ru/robots.txt',
    'http://mc.ru/',
    'http://www.mc.ru/',
    'http://mc.ru/index.asp/multiprice/msk',
    'http://www.mc.ru/index.asp/multiprice/msk',
    'http://mc.ru/page.asp?q=subscr_go',
    'https://mc.ru/robots.txt',
    'https://mc.ru/',
    'https://www.mc.ru/',
    'https://mc.ru/index.asp/multiprice/msk',
    'https://www.mc.ru/index.asp/multiprice/msk',
    'https://mc.ru/page.asp?q=subscr_go',
]
OUT = Path('mc-probe')
OUT.mkdir(exist_ok=True)

def probe(pair):
    index, url = pair
    request = urllib.request.Request(url, headers={'User-Agent': 'ENJIGIRLING-price-updater/1.0'})
    try:
        response = urllib.request.urlopen(request, timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    except Exception as error:
        return {'url': url, 'error': str(error)}
    with response:
        data = response.read(8_000_001)
        if len(data) > 8_000_000:
            return {'url': url, 'error': 'response_too_large'}
        filename = f'{index}.html'
        (OUT/filename).write_bytes(data)
        return {'url': url, 'status': response.status, 'finalUrl': response.url,
                'contentType': response.headers.get('Content-Type'), 'bytes': len(data), 'file': filename}

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(probe, enumerate(URLS)))
(OUT/'results.json').write_text(json.dumps(results, indent=2)+'\n')
print(json.dumps(results, indent=2))
