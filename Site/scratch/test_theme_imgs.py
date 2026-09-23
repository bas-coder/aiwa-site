from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:8000')
    page.wait_for_timeout(2000)

    print('Initial imgs:')
    print(page.evaluate('() => Array.from(document.querySelectorAll(".framer-1kvuw5w img")).map(i => i.src)'))

    # click theme button
    theme_btn = page.query_selector('.framer-wNkKq')
    print('Theme btn found?', bool(theme_btn))
    if theme_btn:
        theme_btn.click()
        page.wait_for_timeout(1000)
        print('After click theme attribute:', page.evaluate('() => document.documentElement.getAttribute("toggle-theme")'))
        print('After click html classes:', page.evaluate('() => document.documentElement.className'))
        print('After click imgs:')
        print(page.evaluate('() => Array.from(document.querySelectorAll(".framer-1kvuw5w img")).map(i => i.src)'))

    browser.close()
