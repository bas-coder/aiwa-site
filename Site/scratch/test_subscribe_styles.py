import asyncio
from playwright.async_api import async_playwright

test_css = """
/* Fix generic logo rule so it doesn't match the button */
.framer-udF2j[data-framer-name="Default"],
a[data-framer-name="Default"] {
  width: auto !important;
}

/* Subscribe Form layout */
.framer-cwikgq {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 8px !important;
  width: 400px !important;
  max-width: 100% !important;
}

.framer-sytln7 {
  flex: 1 1 auto !important;
  min-width: 0 !important;
}

.framer-g3e2fp-container {
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 112px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
}

/* Subscribe Button Base Styling */
.framer-g3e2fp-container button,
button.framer-pevtva,
button.framer-v-pevtva,
.framer-g3e2fp-container .framer-BH1rz {
  width: auto !important;
  min-width: 112px !important;
  height: 40px !important;
  padding: 0 20px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  white-space: nowrap !important;
  border-radius: 999px !important;
  box-sizing: border-box !important;
  cursor: pointer !important;
  font-family: inherit !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  user-select: none !important;
  -webkit-user-select: none !important;
}

.framer-g3e2fp-container button .framer-685d07,
.framer-g3e2fp-container button p,
button.framer-pevtva p,
button.framer-v-pevtva p {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
  text-align: center !important;
  display: inline-block !important;
}

/* Dark Mode - Default State */
html.dark .framer-g3e2fp-container button,
html.dark button.framer-pevtva,
html.dark button.framer-v-pevtva,
body[toggle-theme="dark"] .framer-g3e2fp-container button,
body[toggle-theme="dark"] button.framer-pevtva,
body[toggle-theme="dark"] button.framer-v-pevtva {
  background: #2C2C2B !important;
  background-color: #2C2C2B !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25) !important;
  color: #FDFCFA !important;
  --framer-text-color: #FDFCFA !important;
}

html.dark .framer-g3e2fp-container button p,
html.dark button.framer-pevtva p,
html.dark button.framer-v-pevtva p,
body[toggle-theme="dark"] .framer-g3e2fp-container button p,
body[toggle-theme="dark"] button.framer-pevtva p,
body[toggle-theme="dark"] button.framer-v-pevtva p {
  color: #FDFCFA !important;
  --framer-text-color: #FDFCFA !important;
}

/* Dark Mode - Hover State */
html.dark .framer-g3e2fp-container button:hover,
html.dark button.framer-pevtva:hover,
html.dark button.framer-v-pevtva:hover,
body[toggle-theme="dark"] .framer-g3e2fp-container button:hover,
body[toggle-theme="dark"] button.framer-pevtva:hover,
body[toggle-theme="dark"] button.framer-v-pevtva:hover {
  background: rgba(252, 252, 252, 0.15) !important;
  background-color: rgba(252, 252, 252, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.28) !important;
  color: #FFFFFF !important;
  --framer-text-color: #FFFFFF !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
  transform: translateY(-0.5px) !important;
}

html.dark .framer-g3e2fp-container button:hover p,
html.dark button.framer-pevtva:hover p,
html.dark button.framer-v-pevtva:hover p,
body[toggle-theme="dark"] .framer-g3e2fp-container button:hover p,
body[toggle-theme="dark"] button.framer-pevtva:hover p,
body[toggle-theme="dark"] button.framer-v-pevtva:hover p {
  color: #FFFFFF !important;
  --framer-text-color: #FFFFFF !important;
}

/* Dark Mode - Active / Pressed State */
html.dark .framer-g3e2fp-container button:active,
html.dark button.framer-pevtva:active,
html.dark button.framer-v-pevtva:active,
body[toggle-theme="dark"] .framer-g3e2fp-container button:active,
body[toggle-theme="dark"] button.framer-pevtva:active,
body[toggle-theme="dark"] button.framer-v-pevtva:active {
  background: rgba(252, 252, 252, 0.10) !important;
  background-color: rgba(252, 252, 252, 0.10) !important;
  border-color: rgba(255, 255, 255, 0.20) !important;
  transform: scale(0.97) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.20) !important;
}

/* Dark Mode - Focus State */
html.dark .framer-g3e2fp-container button:focus-visible,
body[toggle-theme="dark"] .framer-g3e2fp-container button:focus-visible {
  outline: 2px solid #38BDF8 !important;
  outline-offset: 2px !important;
}

/* Light Mode - Default State */
html.light .framer-g3e2fp-container button,
html.light button.framer-pevtva,
html.light button.framer-v-pevtva,
body[toggle-theme="light"] .framer-g3e2fp-container button,
body[toggle-theme="light"] button.framer-pevtva,
body[toggle-theme="light"] button.framer-v-pevtva {
  background: #EAEAE7 !important;
  background-color: #EAEAE7 !important;
  border: 1px solid rgba(23, 23, 22, 0.12) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  color: #121211 !important;
  --framer-text-color: #121211 !important;
}

html.light .framer-g3e2fp-container button p,
html.light button.framer-pevtva p,
html.light button.framer-v-pevtva p,
body[toggle-theme="light"] .framer-g3e2fp-container button p,
body[toggle-theme="light"] button.framer-pevtva p,
body[toggle-theme="light"] button.framer-v-pevtva p {
  color: #121211 !important;
  --framer-text-color: #121211 !important;
}

/* Light Mode - Hover State */
html.light .framer-g3e2fp-container button:hover,
html.light button.framer-pevtva:hover,
html.light button.framer-v-pevtva:hover,
body[toggle-theme="light"] .framer-g3e2fp-container button:hover,
body[toggle-theme="light"] button.framer-pevtva:hover,
body[toggle-theme="light"] button.framer-v-pevtva:hover {
  background: #DFDFDC !important;
  background-color: #DFDFDC !important;
  border-color: rgba(23, 23, 22, 0.24) !important;
  color: #000000 !important;
  --framer-text-color: #000000 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-0.5px) !important;
}

html.light .framer-g3e2fp-container button:hover p,
html.light button.framer-pevtva:hover p,
html.light button.framer-v-pevtva:hover p,
body[toggle-theme="light"] .framer-g3e2fp-container button:hover p,
body[toggle-theme="light"] button.framer-pevtva:hover p,
body[toggle-theme="light"] button.framer-v-pevtva:hover p {
  color: #000000 !important;
  --framer-text-color: #000000 !important;
}

/* Light Mode - Active / Pressed State */
html.light .framer-g3e2fp-container button:active,
html.light button.framer-pevtva:active,
html.light button.framer-v-pevtva:active,
body[toggle-theme="light"] .framer-g3e2fp-container button:active,
body[toggle-theme="light"] button.framer-pevtva:active,
body[toggle-theme="light"] button.framer-v-pevtva:active {
  background: #D5D5D2 !important;
  background-color: #D5D5D2 !important;
  border-color: rgba(23, 23, 22, 0.28) !important;
  transform: scale(0.97) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

/* Light Mode - Focus State */
html.light .framer-g3e2fp-container button:focus-visible,
body[toggle-theme="light"] .framer-g3e2fp-container button:focus-visible {
  outline: 2px solid #0284c7 !important;
  outline-offset: 2px !important;
}

/* Disabled State */
.framer-g3e2fp-container button:disabled,
.framer-g3e2fp-container button[disabled],
.framer-g3e2fp-container button.framer-v-byf8b6 {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  transform: none !important;
}

/* Loading State */
.framer-g3e2fp-container button.framer-v-1ifrvt5 {
  opacity: 0.8 !important;
  cursor: wait !important;
  pointer-events: none !important;
}

/* Success State */
html.dark .framer-g3e2fp-container button.framer-v-408f8r {
  background-color: rgba(34, 197, 94, 0.2) !important;
  border-color: rgba(34, 197, 94, 0.4) !important;
  color: #4ade80 !important;
}
html.light .framer-g3e2fp-container button.framer-v-408f8r {
  background-color: rgba(34, 197, 94, 0.15) !important;
  border-color: rgba(34, 197, 94, 0.35) !important;
  color: #15803d !important;
}

/* Error State */
html.dark .framer-g3e2fp-container button.framer-v-1jwlduz {
  background-color: rgba(239, 68, 68, 0.2) !important;
  border-color: rgba(239, 68, 68, 0.4) !important;
  color: #f87171 !important;
}
html.light .framer-g3e2fp-container button.framer-v-1jwlduz {
  background-color: rgba(239, 68, 68, 0.15) !important;
  border-color: rgba(239, 68, 68, 0.35) !important;
  color: #b91c1c !important;
}
"""

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://localhost:8000")
        await page.wait_for_timeout(2000)

        # Inject CSS
        await page.add_style_tag(content=test_css)
        await page.wait_for_timeout(500)

        form = page.locator(".framer-cwikgq").first
        await form.scroll_into_view_if_needed()
        btn = page.locator(".framer-g3e2fp-container button").first

        # 1. Dark Mode Default
        await form.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\test_subscribe_dark_default.png")

        # 2. Dark Mode Hover
        await btn.hover()
        await page.wait_for_timeout(300)
        await form.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\test_subscribe_dark_hover.png")

        # Move mouse away
        await page.mouse.move(0, 0)
        await page.wait_for_timeout(200)

        # 3. Switch to Light Mode
        theme_btn = page.locator(".framer-wNkKq").first
        await theme_btn.click()
        await page.wait_for_timeout(1000)
        # Re-inject test CSS after theme switch
        await page.add_style_tag(content=test_css)
        await page.wait_for_timeout(500)
        await form.scroll_into_view_if_needed()

        # 4. Light Mode Default
        await form.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\test_subscribe_light_default.png")

        # 5. Light Mode Hover
        await btn.hover()
        await page.wait_for_timeout(300)
        await form.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\test_subscribe_light_hover.png")

        # Get computed box metrics
        metrics = await page.evaluate('''() => {
            const b = document.querySelector('.framer-g3e2fp-container button');
            const rect = b.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                padding: window.getComputedStyle(b).padding,
                textWidth: b.querySelector('p').getBoundingClientRect().width
            };
        }''')
        print("Computed metrics:", metrics)

        await browser.close()

asyncio.run(test())
