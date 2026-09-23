from playwright.sync_api import sync_playwright
import pprint

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:8000')
    page.wait_for_timeout(2000)

    res = page.evaluate("""() => {
        function getHierarchy(sel) {
            let el = document.querySelector(sel);
            let tree = [];
            while (el && el !== document.body) {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                tree.push({
                    name: el.getAttribute('data-framer-name') || el.className.split(' ')[0],
                    w: Math.round(rect.width),
                    h: Math.round(rect.height),
                    cssW: style.width,
                    cssH: style.height,
                    transform: style.transform,
                    zoom: style.zoom
                });
                el = el.parentElement;
            }
            return tree;
        }
        return {
            why: getHierarchy('[data-framer-name="Why Header Ornament"] a.framer-udF2j'),
            made: getHierarchy('[data-framer-name="Made With Header Ornament"] a.framer-udF2j')
        };
    }""")
    pprint.pprint(res)
    browser.close()
