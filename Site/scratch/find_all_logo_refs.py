with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

import re
matches = [m.start() for m in re.finditer(r'name:[`"\'][^`"\']*logo', js, re.IGNORECASE)]
print(f"Found {len(matches)} name containing 'logo'")
for pos in matches[:20]:
    print("--- AT POS", pos, "---")
    print(js[max(0, pos-100):min(len(js), pos+200)])

matches_data = [m.start() for m in re.finditer(r'data-framer-name:[`"\'][^`"\']*logo', js, re.IGNORECASE)]
print(f"\nFound {len(matches_data)} data-framer-name containing 'logo'")
for pos in matches_data[:20]:
    print("--- AT POS", pos, "---")
    print(js[max(0, pos-100):min(len(js), pos+200)])
