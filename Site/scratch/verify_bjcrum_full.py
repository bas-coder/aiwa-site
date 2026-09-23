import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACTS_DIR = r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0"

async def run_full_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("Navigating to http://localhost:8000...")
        await page.goto("http://localhost:8000", wait_until="networkidle")
        await page.wait_for_timeout(2500)

        # 1. Console Errors check
        print(f"Total console errors: {len(console_errors)}")
        for err in console_errors:
            print("  Console Error:", err)

        # Helper to search DOM text
        async def check_dom_texts(label):
            return await page.evaluate("""() => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                let node;
                const bjcrumbMatches = [];
                const bjcrumMatches = [];
                while (node = walker.nextNode()) {
                    const text = node.textContent.trim();
                    if (!text) continue;
                    // Check parent to avoid <script> / <style> text
                    const tag = node.parentElement ? node.parentElement.tagName : '';
                    if (tag === 'SCRIPT' || tag === 'STYLE') continue;

                    if (/bjcrumb/i.test(text)) {
                        bjcrumbMatches.push({
                            text: text,
                            tag: tag,
                            class: node.parentElement ? (node.parentElement.className || '') : '',
                            id: node.parentElement ? (node.parentElement.id || '') : ''
                        });
                    }
                    if (/bjcrum/i.test(text)) {
                        bjcrumMatches.push({
                            text: text,
                            tag: tag
                        });
                    }
                }
                return { bjcrumbMatches, bjcrumMatches };
            }""")

        # 2. Dark Mode Checks
        print("\n=== DARK MODE VERIFICATION ===")
        res_dark = await check_dom_texts("Dark Mode")
        print(f"Dark mode 'bjcrumb' matches: {len(res_dark['bjcrumbMatches'])} (EXPECTED: 0)")
        for m in res_dark['bjcrumbMatches']:
            print("  FAIL:", m)
        print(f"Dark mode 'bjcrum' matches: {len(res_dark['bjcrumMatches'])} (EXPECTED: > 0)")
        for m in res_dark['bjcrumMatches'][:10]:
            print(f"  OK: <{m['tag']}> {m['text'][:80]}")

        # Screenshot Hero & Nav
        await page.screenshot(
            path=os.path.join(ARTIFACTS_DIR, "verify_final_dark_hero.png"),
            clip={"x": 0, "y": 0, "width": 1440, "height": 700}
        )
        print("Captured verify_final_dark_hero.png")

        # Screenshot Quote
        quote_el = page.locator("#mockup, [data-framer-name='Quote']").first
        if await quote_el.count() > 0:
            await quote_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await quote_el.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify_final_dark_quote.png"))
            print("Captured verify_final_dark_quote.png")

        # Screenshot Why section ornament
        why_el = page.locator("#why, [data-framer-name='Why']").first
        if await why_el.count() > 0:
            await why_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await page.screenshot(
                path=os.path.join(ARTIFACTS_DIR, "verify_final_dark_why.png"),
                clip={"x": 0, "y": (await why_el.bounding_box())["y"], "width": 1440, "height": 300}
            )
            print("Captured verify_final_dark_why.png")

        # Screenshot Pricing
        pricing_el = page.locator("#pricing").first
        if await pricing_el.count() > 0:
            await pricing_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await pricing_el.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify_final_dark_pricing.png"))
            print("Captured verify_final_dark_pricing.png")

        # Screenshot Footer
        footer_el = page.locator("[data-framer-name='Footer'], footer, .framer-189fcma").first
        if await footer_el.count() > 0:
            await footer_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await footer_el.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify_final_dark_footer.png"))
            print("Captured verify_final_dark_footer.png")

        # 3. Light Mode Checks
        print("\n=== LIGHT MODE VERIFICATION ===")
        # Click Theme Toggle Button
        theme_btn = page.locator(".framer-wNkKq, [data-framer-name='Theme Toggle']").first
        if await theme_btn.count() > 0:
            print("Clicking theme toggle button...")
            await theme_btn.click()
            await page.wait_for_timeout(1500)
        else:
            print("Theme toggle button not found, toggling via JS class...")
            await page.evaluate("() => { document.documentElement.classList.add('light'); document.documentElement.setAttribute('toggle-theme', 'light'); }")
            await page.wait_for_timeout(1500)

        res_light = await check_dom_texts("Light Mode")
        print(f"Light mode 'bjcrumb' matches: {len(res_light['bjcrumbMatches'])} (EXPECTED: 0)")
        for m in res_light['bjcrumbMatches']:
            print("  FAIL:", m)
        print(f"Light mode 'bjcrum' matches: {len(res_light['bjcrumMatches'])} (EXPECTED: > 0)")
        for m in res_light['bjcrumMatches'][:10]:
            print(f"  OK: <{m['tag']}> {m['text'][:80]}")

        # Scroll to top
        await page.evaluate("() => window.scrollTo(0, 0)")
        await page.wait_for_timeout(500)

        # Screenshot Hero & Nav in Light Mode
        await page.screenshot(
            path=os.path.join(ARTIFACTS_DIR, "verify_final_light_hero.png"),
            clip={"x": 0, "y": 0, "width": 1440, "height": 700}
        )
        print("Captured verify_final_light_hero.png")

        # Screenshot Quote in Light Mode
        if await quote_el.count() > 0:
            await quote_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await quote_el.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify_final_light_quote.png"))
            print("Captured verify_final_light_quote.png")

        # Screenshot Why section ornament in Light Mode
        if await why_el.count() > 0:
            await why_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await page.screenshot(
                path=os.path.join(ARTIFACTS_DIR, "verify_final_light_why.png"),
                clip={"x": 0, "y": (await why_el.bounding_box())["y"], "width": 1440, "height": 300}
            )
            print("Captured verify_final_light_why.png")

        # Screenshot Pricing in Light Mode
        if await pricing_el.count() > 0:
            await pricing_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await pricing_el.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify_final_light_pricing.png"))
            print("Captured verify_final_light_pricing.png")

        # Screenshot Footer in Light Mode
        if await footer_el.count() > 0:
            await footer_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await footer_el.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify_final_light_footer.png"))
            print("Captured verify_final_light_footer.png")

        # 4. Viewport Checks (Tablet 810px, Mobile 390px)
        for vp_name, vp_width, vp_height in [("tablet", 810, 1080), ("mobile", 390, 844)]:
            print(f"\n=== VIEWPORT: {vp_name.upper()} ({vp_width}x{vp_height}) ===")
            await page.set_viewport_size({"width": vp_width, "height": vp_height})
            await page.wait_for_timeout(1000)
            res_vp = await check_dom_texts(vp_name)
            print(f"{vp_name} 'bjcrumb' matches: {len(res_vp['bjcrumbMatches'])} (EXPECTED: 0)")
            for m in res_vp['bjcrumbMatches']:
                print(f"  FAIL in {vp_name}:", m)

            await page.evaluate("() => window.scrollTo(0, 0)")
            await page.wait_for_timeout(300)
            await page.screenshot(
                path=os.path.join(ARTIFACTS_DIR, f"verify_final_{vp_name}_hero.png"),
                clip={"x": 0, "y": 0, "width": vp_width, "height": 500}
            )
            print(f"Captured verify_final_{vp_name}_hero.png")

        await browser.close()
        print("\nAll verifications completed successfully!")

asyncio.run(run_full_verification())
