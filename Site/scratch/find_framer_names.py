with open(r'c:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines, 1):
    if 'data-framer-name="Default"' in l or 'data-framer-name="Large"' in l:
        print(f"{i}: {l.strip()[:100]}")
