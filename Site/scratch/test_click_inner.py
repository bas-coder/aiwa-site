from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:8000')
    page.wait_for_timeout(2000)

    print('Initial theme attr:', page.evaluate('() => document.documentElement.getAttribute("toggle-theme")'))
    
    # Click the inner div
    btn = page.query_selector('.framer-wNkKq [data-code-component-plugin-id] > div')
    if btn:
        print('Clicking inner div...')
        btn.click()
        page.wait_for_timeout(1000)
        print('After click theme attr:', page.evaluate('() => document.documentElement.getAttribute("toggle-theme")'))
        print('After click html classes:', page.evaluate('() => document.documentElement.className'))
        print('After click body classes:', page.evaluate('() => document.body.className'))
        print('After click imgs:', page.evaluate('() => Array.from(document.querySelectorAll(".framer-1kvuw5w img")).map(i => i.src)'))
    browser.close()
