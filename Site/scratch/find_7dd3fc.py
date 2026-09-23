import os, re

for root, dirs, files in os.walk(r'C:\Projects\BJCRUMBS\Site'):
    for f in files:
        if f.endswith(('.html', '.js', '.mjs', '.css')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                matches = list(re.finditer(r'7DD3FC', txt, re.IGNORECASE))
                if matches:
                    print(f"File {f}: {len(matches)} occurrences")
                    for m in matches:
                        print("  ", txt[max(0, m.start()-60):min(len(txt), m.end()+60)])
