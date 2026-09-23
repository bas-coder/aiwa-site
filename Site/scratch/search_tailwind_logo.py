with open(r'C:\Projects\BJCRUMBS\Site\tailwind.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'logo' in line.lower() or 'brand' in line.lower() or '1296na6' in line or 'udf2j' in line.lower() or '6x5437' in line:
        print(f"Line {idx+1}: {line.strip()}")
