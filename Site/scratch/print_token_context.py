with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = 0
while True:
    pos = html.find('token-f93817ba', idx)
    if pos == -1: break
    print(f"--- index.html at {pos} ---")
    print(html[max(0, pos-150):min(len(html), pos+200)])
    idx = pos + 1

with open(r'C:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

idx = 0
while True:
    pos = js.find('token-f93817ba', idx)
    if pos == -1: break
    print(f"--- shared-lib at {pos} ---")
    print(js[max(0, pos-150):min(len(js), pos+200)])
    idx = pos + 1
