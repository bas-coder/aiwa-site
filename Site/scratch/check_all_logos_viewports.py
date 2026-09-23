from playwright.sync_api import sync_playwright
import pprint

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
                        document.documentElement.classList.add('light');
                        document.documentElement.classList.remove('dark');
                        document.body.classList.add('light');
                        document.body.classList.remove('dark');
                    }
                }""")
                page.wait_for_timeout(1000)

            print(f"\n--- {theme} MODE ---")
            info = page.evaluate("""() => {
                const links = document.querySelectorAll('a.framer-udF2j');
                return Array.from(links).map((link, idx) => {
                    const img = link.querySelector('img') || link.querySelector('.framer-1kvuw5w');
                    const textEl = link.querySelector('h2') || link.querySelector('.framer-1296na6');
                    const isVisible = link.offsetParent !== null && window.getComputedStyle(link).display !== 'none';
                    
                    const linkRect = link.getBoundingClientRect();
                    const imgRect = img ? img.getBoundingClientRect() : null;
                    const textRect = textEl ? textEl.getBoundingClientRect() : null;

                    let p = link;
                    let section = '';
                    while (p && p !== document.body) {
                        const name = p.getAttribute('data-framer-name') || p.id || p.className;
                        if (name && (name.includes('Header') || name.includes('Nav') || name.includes('Footer') || name.includes('Why') || name.includes('Made') || name.includes('Quote') || name.includes('Frame 17'))) {
                            section = name;
                            break;
                        }
                        p = p.parentElement;
                    }

                    return {
                        idx,
                        section,
                        variant: link.getAttribute('data-framer-name'),
                        isVisible,
                        linkSize: `${Math.round(linkRect.width)}x${Math.round(linkRect.height)}`,
                        imgSrc: img && img.tagName === 'IMG' ? img.src : null,
                        imgSize: imgRect ? `${Math.round(imgRect.width)}x${Math.round(imgRect.height)}` : null,
                        textDisplay: textEl ? window.getComputedStyle(textEl).display : null,
                        fontSize: textEl ? window.getComputedStyle(textEl).fontSize : null,
                        lineHeight: textEl ? window.getComputedStyle(textEl).lineHeight : null,
                        textRect: textRect ? `${Math.round(textRect.width)}x${Math.round(textRect.height)}` : null,
                    };
                });
            }""")
            for item in info:
                if item['isVisible']:
                    print(f"  VISIBLE: [{item['variant']}] in '{item['section']}': LinkSize={item['linkSize']}, ImgSize={item['imgSize']}, TextDisplay={item['textDisplay']}, FontSize={item['fontSize']}")
                else:
                    print(f"  HIDDEN:  [{item['variant']}] in '{item['section']}': LinkSize={item['linkSize']}")
        page.close()
    browser.close()
