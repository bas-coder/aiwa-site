with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('token-f93817ba')
print("Position:", pos)
print(html[pos-100:pos+150])
