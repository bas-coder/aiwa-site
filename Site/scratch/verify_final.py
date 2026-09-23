from playwright.sync_api import sync_playwright
import pprint

viewports = [
    ("desktop", 1440, 900),
    ("tablet", 810, 900),
    ("mobile", 390, 844)
]

artifacts_dir = r"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0"

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)

    summary_results = {}

    for vp_name, w, h in viewports:
        print(f"\n=================== VERIFYING {vp_name.upper()} ({w}x{h}) ===================")
        summary_results[vp_name] = {}

        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto("http://localhost:8000")
        page.wait_for_timeout(2000)

        # 1. Dark Mode Verification
        dark_metrics = page.evaluate("""() => {
            function getMetrics(sel) {
                const el = document.querySelector(sel);
                if (!el) return null;
                const r = el.getBoundingClientRect();
                const imgBox = el.querySelector('.framer-1kvuw5w');
                const ir = imgBox ? imgBox.getBoundingClientRect() : null;
                return {
                    totalW: Math.round(r.width),
                    totalH: Math.round(r.height),
                    imgW: ir ? Math.round(ir.width) : null,
                    imgH: ir ? Math.round(ir.height) : null
                };
            }
            return {
                header: getMetrics('.framer-1gc919f-container a.framer-udF2j, [data-framer-name="Frame 17"] a.framer-udF2j'),
                why: getMetrics('[data-framer-name="Why Header Ornament"] a.framer-udF2j'),
                madeWith: getMetrics('[data-framer-name="Made With Header Ornament"] a.framer-udF2j')
            };
        }""")
        summary_results[vp_name]["dark"] = dark_metrics
        print("Dark Mode Metrics:")
        pprint.pprint(dark_metrics)

        # Screenshot header in dark mode
        page.screenshot(path=f"{artifacts_dir}\\{vp_name}_dark_header.png", clip={"x": 0, "y": 0, "width": w, "height": 80})

        # Scroll to Why and screenshot
        page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); if (el) el.scrollIntoView({block: 'center'}); }")
        page.wait_for_timeout(600)
        why_rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
        if why_rect:
            page.screenshot(path=f"{artifacts_dir}\\{vp_name}_dark_why.png", clip={"x": max(0, why_rect['x'] - 20), "y": max(0, why_rect['y'] - 15), "width": min(w, why_rect['width'] + 40), "height": why_rect['height'] + 30})

        # Scroll to Made With and screenshot
        page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); if (el) el.scrollIntoView({block: 'center'}); }")
        page.wait_for_timeout(600)
        made_rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
        if made_rect:
            page.screenshot(path=f"{artifacts_dir}\\{vp_name}_dark_madewith.png", clip={"x": max(0, made_rect['x'] - 20), "y": max(0, made_rect['y'] - 15), "width": min(w, made_rect['width'] + 40), "height": made_rect['height'] + 30})

        # 2. Switch to Light Mode via theme toggle button
        page.evaluate("() => window.scrollTo(0, 0)")
        page.wait_for_timeout(500)
        page.evaluate("""() => {
            const btn = document.querySelector('.framer-wNkKq [data-code-component-plugin-id] > div') || document.querySelector('.framer-wNkKq');
            if (btn) btn.click();
            else {
                document.documentElement.setAttribute('toggle-theme', 'light');
                document.body.setAttribute('toggle-theme', 'light');
                document.documentElement.classList.add('light');
                document.body.classList.add('light');
            }
        }""")
        page.wait_for_timeout(1000)

        # Ensure light mode is active
        page.evaluate("""() => {
            if (document.documentElement.getAttribute('toggle-theme') !== 'light') {
                document.documentElement.setAttribute('toggle-theme', 'light');
                document.body.setAttribute('toggle-theme', 'light');
                document.documentElement.classList.add('light');
                document.body.classList.add('light');
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('dark');
                if (typeof updateBrandLogos === 'function') updateBrandLogos(false);
            }
        }""")
        page.wait_for_timeout(500)

        # Measure Light Mode
        light_metrics = page.evaluate("""() => {
            function getMetrics(sel) {
                const el = document.querySelector(sel);
                if (!el) return null;
                const r = el.getBoundingClientRect();
                const imgBox = el.querySelector('.framer-1kvuw5w');
                const ir = imgBox ? imgBox.getBoundingClientRect() : null;
                return {
                    totalW: Math.round(r.width),
                    totalH: Math.round(r.height),
                    imgW: ir ? Math.round(ir.width) : null,
                    imgH: ir ? Math.round(ir.height) : null
                };
            }
            return {
                header: getMetrics('.framer-1gc919f-container a.framer-udF2j, [data-framer-name="Frame 17"] a.framer-udF2j'),
                why: getMetrics('[data-framer-name="Why Header Ornament"] a.framer-udF2j'),
                madeWith: getMetrics('[data-framer-name="Made With Header Ornament"] a.framer-udF2j')
            };
        }""")
        summary_results[vp_name]["light"] = light_metrics
        print("Light Mode Metrics:")
        pprint.pprint(light_metrics)

        # Screenshot header in light mode
        page.screenshot(path=f"{artifacts_dir}\\{vp_name}_light_header.png", clip={"x": 0, "y": 0, "width": w, "height": 80})

        # Scroll to Why and screenshot in light mode
        page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); if (el) el.scrollIntoView({block: 'center'}); }")
        page.wait_for_timeout(600)
        why_rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Why Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
        if why_rect:
            page.screenshot(path=f"{artifacts_dir}\\{vp_name}_light_why.png", clip={"x": max(0, why_rect['x'] - 20), "y": max(0, why_rect['y'] - 15), "width": min(w, why_rect['width'] + 40), "height": why_rect['height'] + 30})

        # Scroll to Made With and screenshot in light mode
        page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); if (el) el.scrollIntoView({block: 'center'}); }")
        page.wait_for_timeout(600)
        made_rect = page.evaluate("() => { const el = document.querySelector('[data-framer-name=\"Made With Header Ornament\"]'); return el ? el.getBoundingClientRect() : null; }")
        if made_rect:
            page.screenshot(path=f"{artifacts_dir}\\{vp_name}_light_madewith.png", clip={"x": max(0, made_rect['x'] - 20), "y": max(0, made_rect['y'] - 15), "width": min(w, made_rect['width'] + 40), "height": made_rect['height'] + 30})

        page.close()

    browser.close()

    print("\n=================== VERIFICATION SUMMARY ===================")
    all_passed = True
    for vp, data in summary_results.items():
        print(f"\nViewport: {vp}")
        dh = data["dark"]["header"]["totalH"]
        lh = data["light"]["header"]["totalH"]
        dw = data["dark"]["why"]["totalH"]
        lw = data["light"]["why"]["totalH"]
        dm = data["dark"]["madeWith"]["totalH"]
        lm = data["light"]["madeWith"]["totalH"]

        h_match = abs(dh - lh) <= 1
        w_match = abs(dw - lw) <= 1
        m_match = abs(dm - lm) <= 1

        print(f"  Header Logo Height:    Dark={dh}px, Light={lh}px -> {'PASS' if h_match else 'FAIL'}")
        print(f"  Why Ornament Height:   Dark={dw}px, Light={lw}px -> {'PASS' if w_match else 'FAIL'}")
        print(f"  Made With Ornament H:  Dark={dm}px, Light={lm}px -> {'PASS' if m_match else 'FAIL'}")

        if not (h_match and w_match and m_match):
            all_passed = False

    print(f"\nOVERALL RESULT: {'ALL CHECKS PASSED!' if all_passed else 'SOME CHECKS FAILED'}")
