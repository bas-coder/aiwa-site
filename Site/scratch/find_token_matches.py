with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
pattern = r'(--token-f93817ba-f159-43a7-a6cf-8984be46815b:\s*)(#[a-fA-F0-9]+)'
matches = list(re.finditer(pattern, html))
for m in matches:
    print(f"Match at {m.start()}: {m.group(0)}")
    # print context
    print(html[m.start()-50:m.end()+50])
