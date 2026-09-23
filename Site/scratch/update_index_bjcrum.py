with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Comment
html = html.replace('/* Why BJCRUMB 4 Cards', '/* Why BJCRUM 4 Cards')

# 2. Meta tags
html = html.replace('Use BJCRUMBS to make real apps', 'Use BJCRUM to make real apps')
html = html.replace('Build an App with BJCRUMBS', 'Build an App with BJCRUM')

# 3. Logo text in HTML
# In index.html, logo text appears as:
# >BJCRUMB</span></h2>
html = html.replace('>BJCRUMB</span></h2>', '>BJCRUM</span></h2>')

# 4. Launch card text
html = html.replace('>BJCRUMB Launch</p>', '>BJCRUM Launch</p>')

# 5. Footer copyright text
html = html.replace(' 2026 BJCRUMB. All rights reserved.', ' 2026 BJCRUM. All rights reserved.')

# 6. Quote Statement
html = html.replace('BJCRUMB doesn’t just generate code. It manages your entire product lifecycle',
                    'BJCRUM doesn’t just generate code. It manages your entire product lifecycle')
html = html.replace('BJCRUMB doesn&#8217;t just generate code. It manages your entire product lifecycle',
                    'BJCRUM doesn&#8217;t just generate code. It manages your entire product lifecycle')
html = html.replace('BJCRUMB doesn\'t just generate code. It manages your entire product lifecycle',
                    'BJCRUM doesn\'t just generate code. It manages your entire product lifecycle')

with open(r'C:\Projects\BJCRUMBS\Site\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated index.html successfully')
