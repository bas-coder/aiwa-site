from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    # Click theme toggle to Light mode
    theme_btn = page.query_selector('.framer-wNkKq')
    if theme_btn:
        theme_btn.click()
        page.wait_for_timeout(1000)

    # Find the header element
    header = page.query_selector('.framer-jX2W6')
    if header:
        print("Header innerText in Light Mode:\n", header.inner_text())
        print("\nHeader HTML in Light Mode:\n", header.evaluate("e => e.outerHTML"))

    # Also let's check Why Header Ornament
    why_ornament = page.query_selector('[data-framer-name="Why Header Ornament"]')
    if why_ornament:
        print("\nWhy Header Ornament innerText:\n", why_ornament.inner_text())
        print("Why Header Ornament HTML:\n", why_ornament.evaluate("e => e.outerHTML"))

    # Also Made With Header Ornament
    made_ornament = page.query_selector('[data-framer-name="Made With Header Ornament"]')
    if made_ornament:
        print("\nMade With Header Ornament innerText:\n", made_ornament.inner_text())
        print("Made With Header Ornament HTML:\n", made_ornament.evaluate("e => e.outerHTML"))

    browser.close()
