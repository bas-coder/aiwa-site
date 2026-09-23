with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = list(re.finditer(r'566csQkwAzFmNqUmvFdjzVkalo', html))
print(f"Total occurrences in index.html: {len(matches)}")
for i, m in enumerate(matches):
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 300)
    print(f"--- Occurrence {i} at {m.start()} ---")
    print(html[start:end])
    print()
