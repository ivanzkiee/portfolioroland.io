"""
Check deployment health/readiness by calling provided base URL's /health and /ready endpoints.
Usage: python tools/check_deployment.py https://your-deployment-url.vercel.app
"""
import sys
import urllib.request
import urllib.error
import ssl
import json
from urllib.parse import urljoin


def call(path, base, timeout=10):
    url = urljoin(base, path)
    try:
        ctx = ssl.create_default_context()
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            body = resp.read().decode('utf-8', errors='replace')
            return resp.status, body
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8', errors='replace')
        except Exception:
            body = ''
        return e.code, body
    except Exception as e:
        return None, str(e)


def main():
    if len(sys.argv) < 2:
        print('Usage: python tools/check_deployment.py https://your-url')
        sys.exit(2)
    base = sys.argv[1]
    for path in ['/health', '/ready']:
        status, body = call(path, base)
        print(f'{path} -> status={status}')
        if body:
            print(body[:1000])
        print('---')

if __name__ == '__main__':
    main()
