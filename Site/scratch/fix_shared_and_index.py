with open(r'c:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'r', encoding='utf-8') as f:
    js = f.read()

count_js = js.count('children:`BJCRUMB`')
print(f"shared-lib: found {count_js} occurrences of children:`BJCRUMB`")
js = js.replace('children:`BJCRUMB`', 'children:`BJCRUM`')

with open(r'c:\Projects\BJCRUMBS\Site\js\shared-lib.DfYf3cHC.mjs', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated shared-lib.DfYf3cHC.mjs successfully!")

with open(r'c:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_script = """      var logoTexts = document.querySelectorAll('.framer-1296na6 span, .framer-1296na6 h2');
      for (var j = 0; j < logoTexts.length; j++) {
        if (logoTexts[j].textContent.trim() !== 'BJCRUMB') {
          logoTexts[j].textContent = 'BJCRUMB';
        }
      }"""

new_script = """      var logoTexts = document.querySelectorAll('.framer-1296na6 span, .framer-1296na6 h2');
      for (var j = 0; j < logoTexts.length; j++) {
        if (logoTexts[j].textContent.trim() !== 'BJCRUM') {
          logoTexts[j].textContent = 'BJCRUM';
        }
      }"""

if old_script in html:
    html = html.replace(old_script, new_script)
    print("Updated index.html ensureBrandLogos successfully!")
else:
    print("Warning: old_script not found exactly!")

with open(r'c:\Projects\BJCRUMBS\Site\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved index.html successfully!")
