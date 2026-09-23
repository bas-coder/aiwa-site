import re

def inspect_file(filepath):
    print(f"\n==================== {filepath} ====================")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = list(re.finditer(r'bjcrumb[s]?', content, re.IGNORECASE))
    print(f"Total: {len(matches)}")
    for i, m in enumerate(matches):
        start = max(0, m.start() - 50)
        end = min(len(content), m.end() + 50)
        print(f"[{i+1}] {m.group(0)} at {m.start()}: {content[start:end]!r}")

inspect_file(r"C:\Projects\BJCRUMBS\Site\index.html")
inspect_file(r"C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs")
