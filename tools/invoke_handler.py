import importlib
import traceback
import os
import sys

print('CWD:', os.getcwd())
project_root = os.getcwd()
if project_root not in sys.path:
    sys.path.insert(0, project_root)
print('sys.path[0]:', sys.path[0])
print('sys.path contains project root?:', project_root in sys.path)

try:
    mod = importlib.import_module('api.index')
    req = {'method':'GET','path':'/','headers':{'host':'localhost:8000'},'body':b''}
    resp = mod.handler(req)
    print('STATUS', resp.get('statusCode'))
    print('HEADERS', resp.get('headers'))
    body = resp.get('body')
    if isinstance(body, str):
        print('BODY (truncated):', body[:500])
    else:
        print('BODY (bytes, truncated):', body[:500])
except Exception as e:
    traceback.print_exc()
