#!/usr/bin/env python3
"""Check the deployed visitor path without credentials. Does not change storage ACLs."""
import argparse
from datetime import datetime, timezone
import json
import sys
import urllib.request
from urllib.parse import urljoin, urlsplit


def check(base, paths):
    parsed = urlsplit(base)
    if parsed.scheme != 'https' and not (parsed.scheme == 'http' and parsed.hostname in ('127.0.0.1', 'localhost')):
        raise ValueError('Use HTTPS, or a loopback HTTP test server')
    if parsed.username or parsed.password:
        raise ValueError('Public checks must not use URL credentials')
    for path in paths:
        request = urllib.request.Request(urljoin(base.rstrip('/')+'/', path), headers={'Cache-Control':'no-cache'})
        with urllib.request.urlopen(request, timeout=20) as response:
            if response.status != 200:
                raise ValueError(f'{path}: HTTP {response.status}')
            body = response.read(4_000_001)
        if len(body) > 4_000_000:
            raise ValueError(f'{path}: response exceeds limit')
        if path.endswith('.json'):
            data = json.loads(body)
            if path == 'mc-prices.json':
                if data.get('supplier') != 'МЕТАЛЛСЕРВИС' or not data.get('items') or not data.get('documents'):
                    raise ValueError('Missing official MC snapshot')
                for date in [data['retrievedAt']]+[d['publishedAt'] for d in data['documents']]:
                    age = (datetime.now(timezone.utc)-datetime.fromisoformat(date.replace('Z','+00:00'))).total_seconds()
                    if not -3600 <= age <= 72*3600:
                        raise ValueError('Public MC snapshot has expired or future dates')
        elif b'<main' not in body.lower():
            raise ValueError(f'{path}: response is not the site page')
        print(f'PUBLIC PASS: {path or "/"}, HTTP 200, {len(body)} bytes')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='https://enjigirling.ru/')
    parser.add_argument('paths', nargs='*', default=['', 'index.html', 'calculator.html', 'mc-prices.json'])
    args = parser.parse_args()
    try:
        check(args.base_url, args.paths)
    except Exception as error:
        print('PUBLIC FAIL: '+str(error), file=sys.stderr)
        sys.exit(1)
