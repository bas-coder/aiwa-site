import os, re

search_dir = r"C:\Projects\BJCRUMBS\Site"
exclude_dirs = {"scratch", ".git", "node_modules"}

results = []

for root, dirs, files in os.walk(search_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.glb', '.woff', '.woff2', '.ttf', '.eot')):
            continue
        filepath = os.path.join(root, file)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            matches = list(re.finditer(r'bjcrumb[s]?', content, re.IGNORECASE))
            if matches:
                print(f"File: {filepath} -> {len(matches)} occurrences")
                for m in matches:
                    start = max(0, m.start() - 60)
                    end = min(len(content), m.end() + 60)
                    snippet = content[start:end].replace('\n', ' ')
                    results.append({
                        'file': filepath,
                        'match': m.group(0),
                        'snippet': snippet,
                        'pos': m.start()
                    })
        except Exception as e:
            print(f"Error reading {filepath}: {e}")

print(f"\nTotal occurrences found across all files: {len(results)}")
print("\nUnique match variations:")
from collections import Counter
counts = Counter(r['match'] for r in results)
for match_str, count in counts.items():
    print(f"  '{match_str}': {count}")
