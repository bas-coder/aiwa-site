with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ';--token-f93817ba-f159-43a7-a6cf-8984be46815b:#f8f8f7;'
replacement = ';--token-f93817ba-f159-43a7-a6cf-8984be46815b:#000000;'

if target in html:
    html = html.replace(target, replacement, 1)
    with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully updated token in index.html!")
else:
    print("Target string not found in index.html")
