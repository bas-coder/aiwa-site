from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    print("Before click:")
    print("html class:", page.evaluate("() => document.documentElement.className"))
    print("body class:", page.evaluate("() => document.body.className"))
    print("html attrs:", page.evaluate("() => Array.from(document.documentElement.attributes).map(a => `${a.name}=${a.value}`)"))
    print("body attrs:", page.evaluate("() => Array.from(document.body.attributes).map(a => `${a.name}=${a.value}`)"))

    theme_btn = page.query_selector('.framer-wNkKq')
    if theme_btn:
        print("Clicking theme toggle button...")
        theme_btn.click()
        page.wait_for_timeout(1000)

        print("\nAfter click:")
        print("html class:", page.evaluate("() => document.documentElement.className"))
        print("body class:", page.evaluate("() => document.body.className"))
        print("html attrs:", page.evaluate("() => Array.from(document.documentElement.attributes).map(a => `${a.name}=${a.value}`)"))
        print("body attrs:", page.evaluate("() => Array.from(document.body.attributes).map(a => `${a.name}=${a.value}`)"))

        # Inspect all logos again!
        logos = page.evaluate("""() => {
            const logoEls = document.querySelectorAll('.framer-udF2j, [data-framer-name="Logo"], [data-framer-name="Default"], [data-framer-name="Large"]');
            return Array.from(logoEls).filter(e => e.innerText.includes('BJCRUMB')).map(el => {
                const textEl = el.querySelector('h2') || el.querySelector('.framer-1296na6') || el;
                const imgEl = el.querySelector('img') || el.querySelector('.framer-1kvuw5w');
                const textStyle = textEl ? window.getComputedStyle(textEl) : null;
                const imgStyle = imgEl ? window.getComputedStyle(imgEl) : null;
                const elStyle = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();

                let parent = el.parentElement;
                let sectionName = '';
                while (parent && parent !== document.body) {
                    const name = parent.getAttribute('data-framer-name') || parent.id || parent.className;
                    if (name && (name.includes('Nav') || name.includes('Header') || name.includes('Footer') || name.includes('Why') || name.includes('Ornament') || name.includes('Made'))) {
                        sectionName = name;
                        break;
                    }
                    parent = parent.parentElement;
                }

                return {
                    name: el.getAttribute('data-framer-name'),
                    section: sectionName,
                    fontSize: textStyle ? textStyle.fontSize : null,
                    fontFamily: textStyle ? textStyle.fontFamily : null,
                    lineHeight: textStyle ? textStyle.lineHeight : null,
                    imgWidth: imgStyle ? imgStyle.width : null,
                    imgHeight: imgStyle ? imgStyle.height : null,
                    containerHeight: elStyle.height,
                    color: textStyle ? textStyle.color : null,
                    textFill: textStyle ? textStyle.webkitTextFillColor : null,
                    outerHtml: el.outerHTML.slice(0, 150)
                };
            });
        }""")
        import pprint
        print("\nLogos after clicking theme toggle to Light Mode:")
        pprint.pprint(logos)

    browser.close()
