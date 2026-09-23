#!/usr/bin/env python3
"""Local preview server with clean URL support.
Usage: python3 serve.py
"""
import http.server, os

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Drop Range header so .framercms CMS data files load correctly.
        # Python's SimpleHTTPRequestHandler returns 206 with the wrong
        # Content-Type for multi-range requests, breaking Framer's SDK.
        if 'Range' in self.headers:
            del self.headers['Range']
        if 'range' in self.headers:
            del self.headers['range']
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not self.path.endswith('/'):
            html = path + '.html'
            if os.path.exists(html):
                self.path = self.path + '.html'
        super().do_GET()

if __name__ == '__main__':
    print('Serving at http://localhost:8000')
    print('Press Ctrl+C to stop.')
    http.server.ThreadingHTTPServer(('', 8000), Handler).serve_forever()
