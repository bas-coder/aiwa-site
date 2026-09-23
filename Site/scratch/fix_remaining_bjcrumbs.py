import re

with open(r'c:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("Original length:", len(html))

# 1. Fix ensureBrandLogos
old_fn = """      var logoTexts = document.querySelectorAll('.framer-1296na6 span, .framer-1296na6 h2');
      for (var j = 0; j < logoTexts.length; j++) {
        if (logoTexts[j].textContent.trim() === 'BJCRUM') {
          logoTexts[j].textContent = 'BJCRUMB';
        }
      }"""

new_fn = """      var logoTexts = document.querySelectorAll('.framer-1296na6 span, .framer-1296na6 h2');
      for (var j = 0; j < logoTexts.length; j++) {
        if (logoTexts[j].textContent.trim() === 'BJCRUMB') {
          logoTexts[j].textContent = 'BJCRUM';
        }
      }"""

if old_fn in html:
    html = html.replace(old_fn, new_fn)
    print("Fixed ensureBrandLogos successfully!")
else:
    print("WARNING: old_fn not found in html!")

# 2. Replace all >BJCRUMB</span></h2> with >BJCRUM</span></h2>
c2 = html.count('>BJCRUMB</span></h2>')
print(f"Found {c2} occurrences of >BJCRUMB</span></h2>")
html = html.replace('>BJCRUMB</span></h2>', '>BJCRUM</span></h2>')

# 3. Animated quote spans
# Find the animated letter spans for BJCRUMB
# The last span is letter B after M
pattern = r'(<span style="white-space:nowrap"><span style="[^"]*">B</span><span style="[^"]*">J</span><span style="[^"]*">C</span><span style="[^"]*">R</span><span style="[^"]*">U</span><span style="[^"]*">M</span>)(<span style="[^"]*">B</span>)(</span>)'

def repl(m):
    print("Matched animated quote span!")
    return m.group(1) + m.group(3)

html, c3 = re.subn(pattern, repl, html)
print(f"Replaced {c3} animated quote spans")

# Check all remaining occurrences of BJCRUMB (case-insensitive) in html
matches = list(re.finditer(r'bjcrumb[s]?', html, re.IGNORECASE))
print(f"Total remaining matches of bjcrumb: {len(matches)}")
for m in matches:
    sub = html[max(0, m.start()-25):min(len(html), m.end()+25)]
    # filter out internal technical ids
    if 'bjcrumbs-white-label-pricing' not in sub and 'bjcrumbs-pricing' not in sub and '__bjcrumbsPricingHTML' not in sub:
        print(f"  Unexpected match at {m.start()}: {sub!r}")

with open(r'c:\Projects\BJCRUMBS\Site\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved updated index.html successfully!")
