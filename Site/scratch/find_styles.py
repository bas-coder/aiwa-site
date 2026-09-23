with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
links = re.findall(r'<link[^>]+>', html)
for l in links:
    if 'stylesheet' in l or 'css' in l:
        print(l)

styles = re.findall(r'<style[^>]*>', html)
print(f"Total <style> tags: {len(styles)}")
for s in styles:
    print("  ", s)
