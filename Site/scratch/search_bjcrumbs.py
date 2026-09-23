import re

def search_in_file(filepath):
    print(f"=== Searching in {filepath} ===")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Search for BJCRUMB
    matches = list(re.finditer(r'BJCRUMB', content, re.IGNORECASE))
    print(f"Total 'BJCRUMB' occurrences: {len(matches)}")
    for i, m in enumerate(matches):
        start = max(0, m.start() - 150)
        end = min(len(content), m.end() + 150)
        print(f"--- Occurrence {i} at {m.start()} ---")
        print(content[start:end])
        print()

search_in_file(r'C:\Projects\BJCRUMBS\Site\index.html')
search_in_file(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs')
