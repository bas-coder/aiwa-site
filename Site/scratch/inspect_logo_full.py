with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

pos = 102110
print(js[max(0, pos-2500):min(len(js), pos+3000)])
