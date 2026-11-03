"""Exercise the deploy gate against a local visitor-facing HTTP server."""
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
from pathlib import Path
import threading
import urllib.error

spec = importlib.util.spec_from_file_location('public_access', Path(__file__).resolve().parents[1]/'scripts/check-public-access.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/denied.html':
            self.send_error(403)
            return
        self.send_response(200)
        self.end_headers()
        if self.path in ('/mc-prices.json', '/expired/mc-prices.json'):
            now = datetime.now(timezone.utc)
            date = (now-timedelta(hours=73) if self.path.startswith('/expired/') else now).isoformat()
            body = json.dumps({'supplier':'МЕТАЛЛСЕРВИС','items':[{}],'documents':[{'publishedAt':date}],'retrievedAt':date}).encode()
        else:
            body = b'<Error>AccessDenied</Error>' if self.path == '/error.html' else b'<main>Public page</main>'
        self.wfile.write(body)

    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
base = f'http://127.0.0.1:{server.server_port}/'
try:
    module.check(base, ['', 'index.html', 'calculator.html', 'mc-prices.json'])
    for url,paths,error in [(base,['denied.html'],urllib.error.HTTPError),(base,['error.html'],ValueError),(base+'expired/',['mc-prices.json'],ValueError)]:
        try:
            module.check(url, paths)
        except error:
            pass
        else:
            raise AssertionError('Deploy gate accepted a failed public endpoint: '+str(paths))
finally:
    server.shutdown()
    server.server_close()
print('PASS public deploy gate: public pages, fresh prices, denied objects, HTTP-200 error pages and expired prices.')
