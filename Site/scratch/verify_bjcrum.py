import asyncio
import os
import re
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("Navigating to http://localhost:8000...")
        await page.goto("http://localhost:8000", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 1. Check console errors
        print(f"Console errors: {len(console_errors)}")
        if console_errors:
            print("Errors:", console_errors)

        # 2. Check for any visible or DOM text containing BJCRUMB
        dom_text = await page.evaluate("""() => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            const matches = [];
            while (node = walker.nextNode()) {
                const text = node.textContent;
                if (/bjcrumb[s]?/i.test(text)) {
                    matches.push({
                        text: text.trim(),
                        parentTag: node.parentElement ? node.parentElement.tagName : 'NONE',
                        parentId: node.parentElement ? node.parentElement.id : '',
                        parentClass: node.parentElement ? node.parentElement.className : ''
                    });
                }
            }
            return matches;
        }""")

        print(f"DOM text matches for 'bjcrumb' (should be 0): {len(dom_text)}")
        for m in dom_text:
            print("  Found:", m)

        # 3. Check for occurrences of BJCRUM (should be present!)
        bjcrum_matches = await page.evaluate("""() => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            const matches = [];
            while (node = walker.nextNode()) {
                const text = node.textContent;
                if (/bjcrum/i.test(text)) {
                    matches.push({
                        text: text.trim(),
                        parentTag: node.parentElement ? node.parentElement.tagName : 'NONE',
                        parentClass: node.parentElement ? (node.parentElement.className || '') : ''
                    });
                }
            }
            return matches;
        }""")

        print(f"DOM text matches for 'bjcrum': {len(bjcrum_matches)}")
        for m in bjcrum_matches:
            print("  BJCRUM match:", m["text"][:80], "in <" + m["parentTag"] + ">")

        # 4. Take screenshots of Dark Mode key sections
        os.makedirs(r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0", exist_ok=True)
        
        # Header / Nav
        header = page.locator("header").first
        if await header.count() > 0:
            await header.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_dark_nav.png")
            print("Saved verify_dark_nav.png")

        # Full page top
        await page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_dark_hero.png", clip={"x": 0, "y": 0, "width": 1440, "height": 800})
        print("Saved verify_dark_hero.png")

        # Quote section
        quote = page.locator("text=doesn’t just generate code").first
        if await quote.count() > 0:
            quote_box = await quote.bounding_box()
            if quote_box:
                await page.screenshot(
                    path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_dark_quote.png",
                    clip={"x": 0, "y": max(0, quote_box["y"] - 100), "width": 1440, "height": 400}
                )
                print("Saved verify_dark_quote.png")

        # Footer
        footer = page.locator("footer").first
        if await footer.count() > 0:
            await footer.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await footer.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_dark_footer.png")
            print("Saved verify_dark_footer.png")

        # 5. Switch to Light Mode
        print("Switching to Light Mode...")
        # Click theme toggle button
        theme_btn = page.locator("button:has-text('Toggle Theme'), [data-framer-name='Dark'], [data-framer-name='Light']").first
        if await theme_btn.count() > 0:
            await theme_btn.click()
            await page.wait_for_timeout(1000)
        else:
            await page.evaluate("() => document.documentElement.classList.add('light')")
            await page.wait_for_timeout(1000)

        # Check Light Mode text
        light_dom_text = await page.evaluate("""() => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            const matches = [];
            while (node = walker.nextNode()) {
                const text = node.textContent;
                if (/bjcrumb[s]?/i.test(text)) {
                    matches.push(text.trim());
                }
            }
            return matches;
        }""")
        print(f"Light mode DOM text matches for 'bjcrumb' (should be 0): {len(light_dom_text)}")

        # Screenshots in light mode
        await page.evaluate("() => window.scrollTo(0, 0)")
        await page.wait_for_timeout(500)
        await page.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_light_hero.png", clip={"x": 0, "y": 0, "width": 1440, "height": 800})
        print("Saved verify_light_hero.png")

        # Light mode header
        if await header.count() > 0:
            await header.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_light_nav.png")
            print("Saved verify_light_nav.png")

        # Light mode footer
        if await footer.count() > 0:
            await footer.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await footer.screenshot(path=r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\verify_light_footer.png")
            print("Saved verify_light_footer.png")

        await browser.close()
        print("Verification complete!")

asyncio.run(verify())
