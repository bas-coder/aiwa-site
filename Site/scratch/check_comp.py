with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

pos = js.find('OA8qvyNKp')
if pos != -1:
    print(js[max(0, pos-200):min(len(js), pos+400)])
