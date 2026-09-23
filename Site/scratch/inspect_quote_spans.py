with open(r'c:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = 421385
chunk = html[pos:pos+3500]
nw_start = chunk.find('style="white-space:nowrap"')
nw_end = chunk.find('</span></span>', nw_start)
print("=== Chunk at 421385 ===")
print(chunk[nw_start:nw_end+14])
