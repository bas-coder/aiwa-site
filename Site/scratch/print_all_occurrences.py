import os, re

search_dir = r"C:\Projects\BJCRUMBS\Site"
exclude_dirs = {"scratch", ".git", "node_modules"}

for root, dirs, files in os.walk(search_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.glb', '.woff', '.woff2', '.ttf', '.eot', '.pyc')):
            continue
        filepath = os.path.join(root, file)
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        matches = list(re.finditer(r'bjcrumb[s]?', content, re.IGNORECASE))
        if matches:
            print(f"==================== {filepath} ({len(matches)} matches) ====================")
            for i, m in enumerate(matches):
                start = max(0, m.start() - 100)
                end = min(len(content), m.end() + 100)
                snip = content[start:end].replace('\n', ' ')
                print(f"[{i+1}] ({m.start()}) matched '{m.group(0)}':")
                print(f"    ...{snip}...")
            print()
