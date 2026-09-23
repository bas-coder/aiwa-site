import os

for root, dirs, files in os.walk(r'C:\Projects\BJCRUMBS\Site'):
    for f in files:
        if f.endswith(('.html', '.js', '.mjs', '.css', '.jsx')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                if '1296na6' in txt or 'udF2j' in txt:
                    print(f"Found in {f}: 1296na6={txt.count('1296na6')}, udF2j={txt.count('udF2j')}")
