from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    def inspect_logos(mode):
        print(f"\n=================== {mode} ===================")
        logos = page.evaluate("""() => {
            const logoEls = document.querySelectorAll('.framer-udF2j, [data-framer-name="Logo"], a[href="./"]');
            // Deduplicate
            const unique = Array.from(new Set(logoEls));
            return unique.map((el, i) => {
                const textEl = el.querySelector('h2') || el.querySelector('.framer-1296na6') || el;
                const imgEl = el.querySelector('img') || el.querySelector('.framer-1kvuw5w');
                const textStyle = textEl ? window.getComputedStyle(textEl) : null;
                const imgStyle = imgEl ? window.getComputedStyle(imgEl) : null;
                const elStyle = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();

                // Find section / parent container
                let parent = el.parentElement;
                let sectionName = '';
                while (parent && parent !== document.body) {
                    const name = parent.getAttribute('data-framer-name') || parent.id || parent.className;
                    if (name && (name.includes('Nav') || name.includes('Header') || name.includes('Footer') || name.includes('Why') || name.includes('Hero') || name.includes('framer-'))) {
                        sectionName = name;
                        break;
                    }
                    parent = parent.parentElement;
                }

                return {
                    index: i,
                    classes: el.className,
                    dataFramerName: el.getAttribute('data-framer-name'),
                    section: sectionName,
                    rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
                    containerHeight: elStyle.height,
                    fontSize: textStyle ? textStyle.fontSize : null,
                    lineHeight: textStyle ? textStyle.lineHeight : null,
                    imgWidth: imgStyle ? imgStyle.width : null,
                    imgHeight: imgStyle ? imgStyle.height : null,
                    text: el.innerText.trim().replace(/\\n/g, ' ')
                };
            });
        }""")
        for l in logos:
            print(f"Logo {l['index']} [{l['dataFramerName']}] in '{l['section']}':")
            print(f"  Pos: ({l['rect']['x']}, {l['rect']['y']}), Size: {l['rect']['width']}x{l['rect']['height']}")
            print(f"  Container height: {l['containerHeight']}, Font-size: {l['fontSize']}, Img: {l['imgWidth']}x{l['imgHeight']}")
            print(f"  Classes: {l['classes']}")
            print(f"  Text: {l['text']}")

    inspect_logos("DARK MODE (DEFAULT)")

    # Switch to light mode
    page.evaluate("""() => {
        document.documentElement.setAttribute('toggle-theme', 'light');
        document.body.setAttribute('toggle-theme', 'light');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }""")
    page.wait_for_timeout(1000)

    inspect_logos("LIGHT MODE")

    browser.close()
