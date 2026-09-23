with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

replacements = [
    # 1. Logo component text
    ("children:`BJCRUMB`", "children:`BJCRUM`"),
    # 2. Footer copyright
    ("BJCRUMB. All rights reserved.", "BJCRUM. All rights reserved."),
    # 3. Meta descriptions
    ("Use BJCRUMBS to make real apps", "Use BJCRUM to make real apps"),
    ("Build an App with BJCRUMBS", "Build an App with BJCRUM"),
    # 4. Quote Statement
    ("BJCRUMB doesn’t just generate code", "BJCRUM doesn’t just generate code"),
    # Handle encoded apostrophe if any
    ("BJCRUMB doesn\'t just generate code", "BJCRUM doesn\'t just generate code"),
    # 5. Launch card
    ("ACuya9u94:`BJCRUMB Launch`", "ACuya9u94:`BJCRUM Launch`")
]

for old, new in replacements:
    count = js.count(old)
    print(f"Replacing {old!r} -> {new!r}: {count} occurrences found")
    js = js.replace(old, new)

# Also check for any remaining BJCRUMB in js
import re
remaining = list(re.finditer(r'BJCRUMB', js))
print(f"Remaining exact BJCRUMB occurrences in shared-lib: {len(remaining)}")
for m in remaining:
    print(js[max(0, m.start()-50):min(len(js), m.end()+50)])

with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated shared-lib.DfYf3cHC.mjs successfully")
