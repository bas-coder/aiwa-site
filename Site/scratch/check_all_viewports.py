from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    
    viewports = [
        ("Desktop 1440", 1440, 900),
        ("Tablet 810", 810, 900),
        ("Mobile 390", 390, 844)
    ]

    for vp_name, w, h in viewports:
        print(f"\n=================== VIEWPORT: {vp_name} ===================")
        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto("http://localhost:8000")
        page.wait_for_timeout(2000)

        for theme in ["DARK", "LIGHT"]:
            if theme == "LIGHT":
                page.evaluate("""() => {
                    const btn = document.querySelector('.framer-wNkKq');
                    if (btn) btn.click();
                    else {
                        document.documentElement.setAttribute('toggle-theme', 'light');
                        document.body.setAttribute('toggle-theme', 'light');
                    }
                }""")
                page.wait_for_timeout(1000)

            print(f"\n--- {theme} MODE ---")
            info = page.evaluate("""() => {
                // Find all elements containing 566csQkwAzFmNqUmvFdjzVkalo (logo icon) or BJCRUMB text in logo context
                const imgs = document.querySelectorAll('img[src*="566csQkwAzFmNqUmvFdjzVkalo"]');
                return Array.from(imgs).map((img, idx) => {
                    const link = img.closest('a');
                    const textEl = link ? (link.querySelector('h2') || link.querySelector('.framer-1296na6')) : null;
                    const imgRect = img.getBoundingClientRect();
                    const linkRect = link ? link.getBoundingClientRect() : null;
                    const textRect = textEl ? textEl.getBoundingClientRect() : null;
                    
                    let p = link || img;
                    let section = '';
                    while (p && p !== document.body) {
                        const name = p.getAttribute('data-framer-name') || p.id || p.className;
                        if (name && (name.includes('Header') || name.includes('Nav') || name.includes('Footer') || name.includes('Why') || name.includes('Made') || name.includes('Quote'))) {
                            section = name;
                            break;
                        }
                        p = p.parentElement;
                    }

                    return {
                        idx,
                        section,
                        variant: link ? link.getAttribute('data-framer-name') : null,
                        linkClasses: link ? link.className : null,
                        imgVisible: img.offsetParent !== null,
                        imgSize: `${Math.round(imgRect.width)}x${Math.round(imgRect.height)}`,
                        imgPos: `(${Math.round(imgRect.x)}, ${Math.round(imgRect.y)})`,
                        linkSize: linkRect ? `${Math.round(linkRect.width)}x${Math.round(linkRect.height)}` : null,
                        fontSize: textEl ? window.getComputedStyle(textEl).fontSize : null,
                        fontFamily: textEl ? window.getComputedStyle(textEl).fontFamily : null,
                        text: textEl ? textEl.innerText.trim() : null
                    };
                });
            }""")
            import pprint
            pprint.pprint(info)
        page.close()
    browser.close()
