import re

file_path = r'c:\Projects\BJCRUMBS\Site\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

print("Original length:", len(html))

# 1. CSS comments
html = html.replace('Favicon/Logo + BJCRUMB Text', 'Favicon/Logo + BJCRUM Text')
html = html.replace('Typography for BJCRUMB Text', 'Typography for BJCRUM Text')
html = html.replace('Why BJCRUMB 4 Cards', 'Why BJCRUM 4 Cards')

# 2. ensureBrandLogos script
# Replace any loop setting logoTexts to BJCRUMB or checking BJCRUMB
html = re.sub(
    r'if\s*\(\s*logoTexts\[j\]\.textContent\.trim\(\)\s*!==?\s*[\'"]BJCRUM[\'"]\s*\)\s*\{\s*logoTexts\[j\]\.textContent\s*=\s*[\'"]BJCRUMB[\'"]\s*;\s*\}',
    "if (logoTexts[j].textContent.trim() !== 'BJCRUM') { logoTexts[j].textContent = 'BJCRUM'; }",
    html
)
html = re.sub(
    r'if\s*\(\s*logoTexts\[j\]\.textContent\.trim\(\)\s*!==?\s*[\'"]BJCRUMB[\'"]\s*\)\s*\{\s*logoTexts\[j\]\.textContent\s*=\s*[\'"]BJCRUMB[\'"]\s*;\s*\}',
    "if (logoTexts[j].textContent.trim() !== 'BJCRUM') { logoTexts[j].textContent = 'BJCRUM'; }",
    html
)
html = re.sub(
    r'if\s*\(\s*logoTexts\[j\]\.textContent\.trim\(\)\s*===?\s*[\'"]BJCRUMB[\'"]\s*\)\s*\{\s*logoTexts\[j\]\.textContent\s*=\s*[\'"]BJCRUM[\'"]\s*;\s*\}',
    "if (logoTexts[j].textContent.trim() !== 'BJCRUM') { logoTexts[j].textContent = 'BJCRUM'; }",
    html
)

# 3. Meta and OG descriptions
html = html.replace('Use BJCRUMB to make real apps', 'Use BJCRUM to make real apps')
html = html.replace('Use BJCRUMBS to make real apps', 'Use BJCRUM to make real apps')
html = html.replace('Build an App with BJCRUMB', 'Build an App with BJCRUM')
html = html.replace('Build an App with BJCRUMBS', 'Build an App with BJCRUM')

# 4. Logo spans/h2
html = html.replace('>BJCRUMB</span></h2>', '>BJCRUM</span></h2>')
html = html.replace('>BJCRUMB</h2>', '>BJCRUM</h2>')
html = html.replace('>BJCRUMB Launch</p>', '>BJCRUM Launch</p>')
html = html.replace(' 2026 BJCRUMB. All rights reserved.', ' 2026 BJCRUM. All rights reserved.')
html = html.replace(' 2026 BJCRUMBS. All rights reserved.', ' 2026 BJCRUM. All rights reserved.')

# 5. Quote statement text (if not animated)
html = html.replace('BJCRUMB doesn’t just generate code', 'BJCRUM doesn’t just generate code')
html = html.replace('BJCRUMB doesn&#8217;t just generate code', 'BJCRUM doesn&#8217;t just generate code')
html = html.replace("BJCRUMB doesn't just generate code", "BJCRUM doesn't just generate code")
html = html.replace('BJCRUMBS doesn’t just generate code', 'BJCRUM doesn’t just generate code')

# 6. Animated letter spans in Quote Statement
pattern = r'(<span style="white-space:nowrap"><span style="[^"]*">B</span><span style="[^"]*">J</span><span style="[^"]*">C</span><span style="[^"]*">R</span><span style="[^"]*">U</span><span style="[^"]*">M</span>)(<span style="[^"]*">B</span>)(</span>)'
def repl_anim(m):
    return m.group(1) + m.group(3)
html, c_anim = re.subn(pattern, repl_anim, html)
print(f"Replaced {c_anim} animated quote spans")

# Check remaining
cleaned = re.sub(r'bjcrumbs-white-label-pricing|bjcrumbs-pricing|__bjcrumbsPricingHTML', '', html)
rem = list(re.finditer(r'bjcrumb[s]?', cleaned, re.IGNORECASE))
print(f"Remaining non-pricing matches in index.html: {len(rem)}")
for m in rem:
    print(" ", repr(cleaned[m.start()-20:m.end()+20]))

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved index.html successfully!")
