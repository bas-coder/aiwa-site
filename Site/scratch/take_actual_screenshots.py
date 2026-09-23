from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    # 1. Dark mode screenshots
    # Header logo
    header_logo = page.locator('.framer-19231uw a.framer-udF2j').first
    if header_logo:
        header_logo.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_header_logo_actual.png")
    
    # Also screenshot the entire header navigation bar to see how it looks
    header_bar = page.locator('header, .framer-jX2W6, .framer-1ui6j5n').first
    if header_bar:
        header_bar.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_header_bar.png")

    # Why Ornament
    why_ornament = page.locator('[data-framer-name="Why Header Ornament"] a.framer-udF2j').first
    if why_ornament:
        why_ornament.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_why_ornament_actual.png")

    # Made With Ornament
    made_ornament = page.locator('[data-framer-name="Made With Header Ornament"] a.framer-udF2j').first
    if made_ornament:
        made_ornament.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\dark_made_ornament_actual.png")

    # 2. Switch to Light Mode
    theme_btn = page.query_selector('.framer-wNkKq')
    if theme_btn:
        theme_btn.click()
        page.wait_for_timeout(1000)

    # Light mode screenshots
    if header_logo:
        header_logo.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_header_logo_actual.png")
    if header_bar:
        header_bar.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_header_bar.png")
    if why_ornament:
        why_ornament.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_why_ornament_actual.png")
    if made_ornament:
        made_ornament.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\light_made_ornament_actual.png")

    browser.close()
    print("Screenshots taken successfully!")
