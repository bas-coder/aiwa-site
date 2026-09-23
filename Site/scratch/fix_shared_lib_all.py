file_path = r'c:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs'

with open(file_path, 'r', encoding='utf-8') as f:
    js = f.read()

print("Original length:", len(js))

replacements = [
    ("children:`BJCRUMB`", "children:`BJCRUM`"),
    ("BJCRUMB. All rights reserved.", "BJCRUM. All rights reserved."),
    ("Use BJCRUMB to make real apps", "Use BJCRUM to make real apps"),
    ("Use BJCRUMBS to make real apps", "Use BJCRUM to make real apps"),
    ("Build an App with BJCRUMB", "Build an App with BJCRUM"),
    ("Build an App with BJCRUMBS", "Build an App with BJCRUM"),
    ("BJCRUMB doesn’t just generate code", "BJCRUM doesn’t just generate code"),
    ("BJCRUMB doesn't just generate code", "BJCRUM doesn't just generate code"),
    ("BJCRUMB doesn\\’t just generate code", "BJCRUM doesn\\’t just generate code"),
    ("BJCRUMB doesn\\'t just generate code", "BJCRUM doesn\\'t just generate code"),
    ("ACuya9u94:`BJCRUMB Launch`", "ACuya9u94:`BJCRUM Launch`"),
    ("ACuya9u94:`BJCRUMB", "ACuya9u94:`BJCRUM")
]

for old, new in replacements:
    c = js.count(old)
    if c > 0:
        js = js.replace(old, new)
        print(f"Replaced {c} occurrences of {old[:30]}")

# Also any remaining BJCRUMB in template strings or literals
import re
# check remaining
cleaned = re.sub(r'bjcrumbs-white-label-pricing|bjcrumbs-pricing|__bjcrumbsPricingHTML', '', js)
rem = list(re.finditer(r'bjcrumb[s]?', cleaned, re.IGNORECASE))
print(f"Remaining non-pricing matches in shared-lib: {len(rem)}")
for m in rem:
    print(" ", repr(cleaned[m.start()-20:m.end()+20]))

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Saved shared-lib.DfYf3cHC.mjs successfully!")
