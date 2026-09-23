from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    print("--- In Dark Mode ---")
    logo_dark = page.query_selector('.framer-19231uw') or page.query_selector('.framer-1gc919f-container')
    if logo_dark:
        print("Dark header logo HTML:\n", logo_dark.evaluate("e => e.outerHTML"))
        print("Visible?", logo_dark.is_visible())
        print("Bounding box:", logo_dark.bounding_box())

    # Click theme toggle
    theme_btn = page.query_selector('.framer-wNkKq')
    if theme_btn:
        theme_btn.click()
        page.wait_for_timeout(1000)

    print("\n--- In Light Mode ---")
    logo_light = page.query_selector('.framer-19231uw') or page.query_selector('.framer-1gc919f-container')
    if logo_light:
        print("Light header logo HTML:\n", logo_light.evaluate("e => e.outerHTML"))
        print("Visible?", logo_light.is_visible())
        print("Bounding box:", logo_light.bounding_box())
    else:
        print("No logo container found in Light Mode!")

    browser.close()
