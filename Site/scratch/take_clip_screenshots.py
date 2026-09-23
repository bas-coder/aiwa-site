from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(3000)

    # Dark mode: screenshot top nav
    page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_nav_full.png", clip={"x": 0, "y": 0, "width": 1440, "height": 120})

    # Scroll to Why section
    page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); if (el) el.scrollIntoView(); }")
    page.wait_for_timeout(1000)
    rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
    if rect:
        page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_why_box.png", clip={"x": max(0, rect['x'] - 20), "y": max(0, rect['y'] - 20), "width": rect['width'] + 40, "height": rect['height'] + 40})

    # Scroll to Made With section
    page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); if (el) el.scrollIntoView(); }")
    page.wait_for_timeout(1000)
    rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
    if rect:
        page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_made_box.png", clip={"x": max(0, rect['x'] - 20), "y": max(0, rect['y'] - 20), "width": rect['width'] + 40, "height": rect['height'] + 40})

    # Switch to light mode
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(500)
    theme_btn = page.query_selector('.framer-wNkKq')
    if theme_btn:
        theme_btn.click()
        page.wait_for_timeout(1500)

    # Light mode: screenshot top nav
    page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_nav_full.png", clip={"x": 0, "y": 0, "width": 1440, "height": 120})

    # Scroll to Why section in Light Mode
    page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); if (el) el.scrollIntoView(); }")
    page.wait_for_timeout(1000)
    rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
    if rect:
        page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_why_box.png", clip={"x": max(0, rect['x'] - 20), "y": max(0, rect['y'] - 20), "width": rect['width'] + 40, "height": rect['height'] + 40})

    # Scroll to Made With section in Light Mode
    page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); if (el) el.scrollIntoView(); }")
    page.wait_for_timeout(1000)
    rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
    if rect:
        page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_made_box.png", clip={"x": max(0, rect['x'] - 20), "y": max(0, rect['y'] - 20), "width": rect['width'] + 40, "height": rect['height'] + 40})

    browser.close()
    print("Done taking visual screenshots!")
