from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)

    for vp_name, width in [("Desktop", 1440), ("Tablet", 810), ("Mobile", 390)]:
        page = browser.new_page(viewport={"width": width, "height": 900})
        page.goto("http://localhost:8000")
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const targets = [
                { label: 'Header Nav Logo', sel: '.framer-1gc919f-container a.framer-udF2j, [data-framer-name="Frame 17"] a.framer-udF2j' },
                { label: 'Why Header Ornament Logo', sel: '[data-framer-name="Why Header Ornament"] a.framer-udF2j' },
                { label: 'Made With Header Ornament Logo', sel: '[data-framer-name="Made With Header Ornament"] a.framer-udF2j' }
            ];

            return targets.map(t => {
                const el = document.querySelector(t.sel);
                if (!el) return { label: t.label, found: false };

                const imgBox = el.querySelector('.framer-1kvuw5w');
                const img = el.querySelector('img');
                const text = el.querySelector('h2') || el.querySelector('.framer-1296na6');

                const elRect = el.getBoundingClientRect();
                const imgBoxRect = imgBox ? imgBox.getBoundingClientRect() : null;
                const textRect = text ? text.getBoundingClientRect() : null;

                const elStyle = window.getComputedStyle(el);
                const imgBoxStyle = imgBox ? window.getComputedStyle(imgBox) : null;
                const textStyle = text ? window.getComputedStyle(text) : null;

                // Parent container sizing
                const parent = el.parentElement;
                const parentRect = parent ? parent.getBoundingClientRect() : null;
                const parentStyle = parent ? window.getComputedStyle(parent) : null;

                return {
                    label: t.label,
                    found: true,
                    variant: el.getAttribute('data-framer-name'),
                    classes: el.className,
                    totalRect: { w: Math.round(elRect.width), h: Math.round(elRect.height) },
                    containerHeight: elStyle.height,
                    containerGap: elStyle.gap,
                    imgBox: {
                        w: imgBoxRect ? Math.round(imgBoxRect.width) : null,
                        h: imgBoxRect ? Math.round(imgBoxRect.height) : null,
                        cssW: imgBoxStyle ? imgBoxStyle.width : null,
                        cssH: imgBoxStyle ? imgBoxStyle.height : null,
                    },
                    text: {
                        w: textRect ? Math.round(textRect.width) : null,
                        h: textRect ? Math.round(textRect.height) : null,
                        fontSize: textStyle ? textStyle.fontSize : null,
                        lineHeight: textStyle ? textStyle.lineHeight : null,
                    },
                    parent: {
                        name: parent ? (parent.getAttribute('data-framer-name') || parent.className) : null,
                        w: parentRect ? Math.round(parentRect.width) : null,
                        h: parentRect ? Math.round(parentRect.height) : null,
                        cssH: parentStyle ? parentStyle.height : null,
                    }
                };
            });
        }""")

        print(f"\n=================== {vp_name} (width: {width}px) ===================")
        import pprint
        pprint.pprint(data)

        page.close()
    browser.close()
