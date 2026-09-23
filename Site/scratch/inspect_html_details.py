with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = list(re.finditer(r'566csQkwAzFmNqUmvFdjzVkalo', html))
for i in [3, 4, 5, 6, 7, 8]:
    m = matches[i]
    start = max(0, m.start() - 800)
    end = min(len(html), m.end() + 400)
    print(f'=== OCCURRENCE {i} ===')
    chunk = html[start:end]
    names = re.findall(r'data-framer-name="([^"]+)"', chunk)
    classes = re.findall(r'class="([^"]+)"', chunk)
    print('Names:', names)
    print('Classes:', classes)
    print('Snippet:\n', chunk[400:1000])
    print('='*40)
