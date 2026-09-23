from playwright.sync_api import sync_playwright
import pprint

test_css = """
/* Brand Logo in Light Mode */
html.light .framer-1kvuw5w,
html.light .framer-v-6x5437 .framer-1kvuw5w,
html.light [data-framer-name="Default"] .framer-1kvuw5w,
html.light [data-framer-name="Frame 17"] .framer-1kvuw5w,
body[toggle-theme="light"] .framer-1kvuw5w,
body[toggle-theme="light"] .framer-v-6x5437 .framer-1kvuw5w,
body[toggle-theme="light"] [data-framer-name="Default"] .framer-1kvuw5w,
body[toggle-theme="light"] [data-framer-name="Frame 17"] .framer-1kvuw5w {
  content: url('/images/Light@3x.png') !important;
  aspect-ratio: 543 / 150 !important;
  width: auto !important;
  height: 28px !important;
  max-height: 100% !important;
  display: block !important;
}

/* Large Variant (Section Header Ornaments: Why & Made With) */
html.light .framer-v-si03es .framer-1kvuw5w,
html.light [data-framer-name="Large"] .framer-1kvuw5w,
html.light [data-framer-name="Why Header Ornament"] .framer-1kvuw5w,
html.light [data-framer-name="Made With Header Ornament"] .framer-1kvuw5w,
body[toggle-theme="light"] .framer-v-si03es .framer-1kvuw5w,
body[toggle-theme="light"] [data-framer-name="Large"] .framer-1kvuw5w,
body[toggle-theme="light"] [data-framer-name="Why Header Ornament"] .framer-1kvuw5w,
body[toggle-theme="light"] [data-framer-name="Made With Header Ornament"] .framer-1kvuw5w {
  height: 38px !important;
}

/* Mobile responsive sizing for Section Header Ornaments */
@media (max-width: 809px) {
  html.light .framer-v-si03es .framer-1kvuw5w,
  html.light [data-framer-name="Large"] .framer-1kvuw5w,
  html.light [data-framer-name="Why Header Ornament"] .framer-1kvuw5w,
  html.light [data-framer-name="Made With Header Ornament"] .framer-1kvuw5w,
  body[toggle-theme="light"] .framer-v-si03es .framer-1kvuw5w,
  body[toggle-theme="light"] [data-framer-name="Large"] .framer-1kvuw5w,
  body[toggle-theme="light"] [data-framer-name="Why Header Ornament"] .framer-1kvuw5w,
  body[toggle-theme="light"] [data-framer-name="Made With Header Ornament"] .framer-1kvuw5w {
    height: 32px !important;
  }
}

html.light .framer-1296na6,
body[toggle-theme="light"] .framer-1296na6 {
  display: none !important;
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)

    for vp_name, width in [("Desktop 1440", 1440), ("Tablet 810", 810), ("Mobile 390", 390)]:
        print(f"\n=================== {vp_name} ===================")
        page = browser.new_page(viewport={"width": width, "height": 900})
        page.goto("http://localhost:8000")
        page.wait_for_timeout(2000)

        # 1. Measure Dark Mode
        dark_data = page.evaluate("""() => {
            const targets = [
                { label: 'Header Nav', sel: '.framer-1gc919f-container a.framer-udF2j, [data-framer-name="Frame 17"] a.framer-udF2j' },
                { label: 'Why Ornament', sel: '[data-framer-name="Why Header Ornament"] a.framer-udF2j' },
                { label: 'Made With Ornament', sel: '[data-framer-name="Made With Header Ornament"] a.framer-udF2j' }
            ];
            return targets.map(t => {
                const el = document.querySelector(t.sel);
                if (!el) return { label: t.label, rect: null };
                const r = el.getBoundingClientRect();
                return { label: t.label, w: Math.round(r.width), h: Math.round(r.height) };
            });
        }""")

        # 2. Inject proposed CSS & toggle light mode
        page.evaluate(f"""() => {{
            let s = document.getElementById('test-logo-css');
            if (!s) {{
                s = document.createElement('style');
                s.id = 'test-logo-css';
                document.head.appendChild(s);
            }}
            s.textContent = `{test_css}`;
            
            // Switch to light mode
            document.documentElement.setAttribute('toggle-theme', 'light');
            document.body.setAttribute('toggle-theme', 'light');
            document.documentElement.classList.add('light');
            document.body.classList.add('light');
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            
            // Update brand logos
            const logoImgs = document.querySelectorAll('.framer-1kvuw5w img');
            for (let img of logoImgs) {{
                img.src = '/images/Light@3x.png';
            }}
        }}""")
        page.wait_for_timeout(1000)

        # 3. Measure Light Mode
        light_data = page.evaluate("""() => {
            const targets = [
                { label: 'Header Nav', sel: '.framer-1gc919f-container a.framer-udF2j, [data-framer-name="Frame 17"] a.framer-udF2j' },
                { label: 'Why Ornament', sel: '[data-framer-name="Why Header Ornament"] a.framer-udF2j' },
                { label: 'Made With Ornament', sel: '[data-framer-name="Made With Header Ornament"] a.framer-udF2j' }
            ];
            return targets.map(t => {
                const el = document.querySelector(t.sel);
                if (!el) return { label: t.label, rect: null };
                const imgBox = el.querySelector('.framer-1kvuw5w');
                const r = el.getBoundingClientRect();
                const ir = imgBox ? imgBox.getBoundingClientRect() : null;
                return {
                    label: t.label,
                    totalW: Math.round(r.width),
                    totalH: Math.round(r.height),
                    imgBoxW: ir ? Math.round(ir.width) : null,
                    imgBoxH: ir ? Math.round(ir.height) : null
                };
            });
        }""")

        print("Dark Mode:")
        pprint.pprint(dark_data)
        print("Light Mode:")
        pprint.pprint(light_data)

        # Take screenshots
        page.screenshot(path=rf"C:\Users\Abbas\.gemini\antigravity\brain\b8a4234c-7c20-4704-a391-d6eb4973c3d0\test_light_{width}_nav.png", clip={"x": 0, "y": 0, "width": width, "height": 80})

        page.close()
    browser.close()
