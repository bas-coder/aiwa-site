import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACTS_DIR = r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0"

async def verify_subscribe():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("Navigating to http://localhost:8000...")
        await page.goto("http://localhost:8000", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        form = page.locator(".framer-cwikgq").first
        await form.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        btn = page.locator(".framer-g3e2fp-container button").first

        # Metrics Dark Mode
        metrics_dark = await page.evaluate('''() => {
            const b = document.querySelector('.framer-g3e2fp-container button');
            const rect = b.getBoundingClientRect();
            const cs = window.getComputedStyle(b);
            const p = b.querySelector('p');
            return {
                width: rect.width,
                height: rect.height,
                padding: cs.padding,
                backgroundColor: cs.backgroundColor,
                color: cs.color,
                textWidth: p ? p.getBoundingClientRect().width : null
            };
        }''')
        print("Dark Mode metrics:", metrics_dark)

        # 1. Dark Mode Default
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_dark_default.png"))

        # 2. Dark Mode Hover
        await btn.hover()
        await page.wait_for_timeout(300)
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_dark_hover.png"))

        # 3. Dark Mode Focus
        await btn.focus()
        await page.wait_for_timeout(300)
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_dark_focus.png"))

        # Move mouse away
        await page.mouse.move(0, 0)
        await page.wait_for_timeout(200)

        # 4. Switch to Light Mode
        theme_btn = page.locator(".framer-wNkKq").first
        await theme_btn.click()
        await page.wait_for_timeout(1000)

        await form.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)

        # Metrics Light Mode
        metrics_light = await page.evaluate('''() => {
            const b = document.querySelector('.framer-g3e2fp-container button');
            const rect = b.getBoundingClientRect();
            const cs = window.getComputedStyle(b);
            const p = b.querySelector('p');
            return {
                width: rect.width,
                height: rect.height,
                padding: cs.padding,
                backgroundColor: cs.backgroundColor,
                color: cs.color,
                textWidth: p ? p.getBoundingClientRect().width : null
            };
        }''')
        print("Light Mode metrics:", metrics_light)

        # 5. Light Mode Default
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_light_default.png"))

        # 6. Light Mode Hover
        await btn.hover()
        await page.wait_for_timeout(300)
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_light_hover.png"))

        # 7. Light Mode Focus
        await btn.focus()
        await page.wait_for_timeout(300)
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_light_focus.png"))

        # 8. Mobile Viewport Test (390px)
        await page.set_viewport_size({"width": 390, "height": 844})
        await page.wait_for_timeout(500)
        await form.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await form.screenshot(path=os.path.join(ARTIFACTS_DIR, "live_subscribe_mobile_light.png"))

        print("Verification completed successfully!")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify_subscribe())
