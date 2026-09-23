with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
m = re.search(r'width="1169" height="1346"[^>]+src="([^"]+)"', html)
if m:
    print('Found src:', m.group(1))

# Also search shared-lib
with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

m2 = re.search(r'1169.*?src:[\'"]([^\'"]+)', js)
if m2:
    print('Found in js:', m2.group(1))
