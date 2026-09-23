from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(3000)

    for mode in ["dark", "light"]:
        if mode == "light":
            page.evaluate("""() => {
                const btn = document.querySelector('.framer-wNkKq');
                if (btn) btn.click();
                else {
                    document.documentElement.setAttribute('toggle-theme', 'light');
                    document.body.setAttribute('toggle-theme', 'light');
                }
            }""")
            page.wait_for_timeout(1000)

        print(f"\n=================== MODE: {mode.upper()} ===================")
        results = page.evaluate("""() => {
            const allElements = document.querySelectorAll('*');
            const found = [];
            allElements.forEach(el => {
                // If direct text contains BJCRUMB or img is logo
                const hasLogoImg = el.tagName === 'IMG' && el.src.includes('566csQkwAzFmNqUmvFdjzVkalo');
                const hasDirectLogoText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('BJCRUMB'));
                const isLogoLink = el.classList.contains('framer-udF2j');
                
                if (hasLogoImg || hasDirectLogoText || isLogoLink) {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    
                    // Ancestor section
                    let cur = el;
                    let path = [];
                    while (cur && cur !== document.body) {
                        const name = cur.getAttribute('data-framer-name') || cur.id || (cur.className && typeof cur.className === 'string' ? cur.className.split(' ')[0] : '');
                        if (name) path.unshift(name);
                        cur = cur.parentElement;
                    }

                    found.push({
                        tag: el.tagName,
                        classes: el.className,
                        dataName: el.getAttribute('data-framer-name'),
                        path: path.slice(-4).join(' > '),
                        rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
                        fontSize: style.fontSize,
                        lineHeight: style.lineHeight,
                        color: style.color,
                        display: style.display,
                        text: el.innerText ? el.innerText.trim().slice(0, 50) : ''
                    });
                }
            });
            return found;
        }""")
        for r in results:
            print(f"[{r['tag']}] '{r['dataName']}' in '{r['path']}':")
            print(f"  rect: {r['rect']}, font: {r['fontSize']}/{r['lineHeight']}, color: {r['color']}, display: {r['display']}")
            print(f"  classes: {r['classes']}")
            print(f"  text: {r['text']}")

    browser.close()
