from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    # Find the theme toggle button in header
    # Let's inspect buttons/links in header
    header_buttons = page.evaluate("""() => {
        const header = document.querySelector('header') || document.querySelector('.framer-jX2W6') || document.querySelector('.framer-a3clr1');
        if (!header) return 'No header found';
        const all = Array.from(header.querySelectorAll('button, a, div[role="button"], [tabindex="0"]'));
        return all.map(el => ({
            tagName: el.tagName,
            className: el.className,
            name: el.getAttribute('data-framer-name'),
            ariaLabel: el.getAttribute('aria-label'),
            text: el.innerText.trim(),
            rect: el.getBoundingClientRect()
        }));
    }""")
    print("Header interactive elements:")
    import pprint
    pprint.pprint(header_buttons)

    browser.close()
