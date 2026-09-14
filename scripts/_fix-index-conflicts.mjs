import fs from 'node:fs';

const path = new URL('../public/index.html', import.meta.url);
let html = fs.readFileSync(path, 'utf8');

const passSection = `<!-- ==========================================================================
     WHITE LABEL PASS · hang-tag on a thin cord (DesignCode-inspired swing).
     ======================================================================= -->
<section class="section wl-pass" id="white-label-pass" aria-label="White label partner access">
  <div class="wl-pass__frame">
    <div class="wl-pass__stage" aria-hidden="true">
      <div class="wl-pass__grid"></div>
      <div class="wl-pass__hang" data-wl-swing="pass">
        <svg class="wl-pass__cord" viewBox="0 0 40 120" preserveAspectRatio="none" aria-hidden="true">
          <path class="wl-pass__cord-twist" d="M20 0 C16 18 24 36 18 54 C14 66 26 78 20 96 C18 104 22 112 20 120" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
          <path class="wl-pass__cord-twist wl-pass__cord-twist--b" d="M20 0 C24 18 16 36 22 54 C26 66 14 78 20 96 C22 104 18 112 20 120" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>
        </svg>
        <span class="wl-pass__knot" aria-hidden="true"></span>
        <div class="wl-pass__card">
          <div class="wl-pass__heat"></div>
          <header class="wl-pass__card-head">
            <img class="wl-pass__mark" src="/aiwa-favicon.svg" alt="" width="28" height="28" decoding="async" />
            <span class="wl-pass__serial">WL 0001</span>
          </header>
          <p class="wl-pass__line">WHITE LABEL · PARTNER ACCESS</p>
          <p class="wl-pass__display">YOUR BRAND</p>
          <div class="wl-pass__meta">
            <span>HOST: YOU</span>
            <span>TRACK: YOUR CUSTOMERS</span>
          </div>
          <span class="wl-pass__badge">RESELL</span>
          <div class="wl-pass__ticket">
            <span class="wl-pass__barcode" aria-hidden="true"></span>
            <span class="wl-pass__admit">ADMIT ONE</span>
          </div>
          <p class="wl-pass__footer">CUSTOMERS NEVER SEE AIWA</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

// Resolve each conflict: keep HEAD for copy; keep icons; reorder WL sections.
html = html.replace(
  /<<<<<<< HEAD\n  <object class="hero__glow-obj"[\s\S]*?>>>>>>> [^\n]+\n/,
  '  <object class="hero__glow-obj" data="/images/glow.svg" type="image/svg+xml" tabindex="-1"></object>\n'
);

html = html.replace(
  /<<<<<<< HEAD\n=======\n  <symbol id="icon-coins"[\s\S]*?>>>>>>> [^\n]+\n/,
  `  <symbol id="icon-coins" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></g></symbol>
  <symbol id="icon-north-star" viewBox="0 0 256 256"><path fill="currentColor" d="M240,128a15.79,15.79,0,0,1-10.5,15l-63.44,23.07L143,229.5a16,16,0,0,1-30,0L89.94,166.06,26.5,143a16,16,0,0,1,0-30L89.94,89.94,113,26.5a16,16,0,0,1,30,0l23.07,63.44L229.5,113A15.79,15.79,0,0,1,240,128Z"/></symbol>
`
);

html = html.replace(
  /<<<<<<< HEAD\n      <a href="\/white-label"><span class="nav__flip"><span>White-Label<\/span><span aria-hidden="true">White-Label<\/span><\/span><\/a>\n=======\n      <a href="\/white-label"><span class="nav__flip"><span>White Label<\/span><span aria-hidden="true">White Label<\/span><\/span><\/a>\n>>>>>>> [^\n]+\n/,
  '      <a href="/white-label"><span class="nav__flip"><span>White-Label</span><span aria-hidden="true">White-Label</span></span></a>\n'
);

html = html.replace(
  /<<<<<<< HEAD\n      <h2 class="t-h2" data-blur-child data-grad>Build\. Test\. Ship\.<br \/>Evolve in one place<\/h2>\n=======\n      <h2 class="t-h2" data-blur-child data-grad>Build, test, ship<br \/>Evolve in one place<\/h2>\n>>>>>>> [^\n]+\n/,
  '      <h2 class="t-h2" data-blur-child data-grad>Build. Test. Ship.<br />Evolve in one place</h2>\n'
);

html = html.replace(
  /<<<<<<< HEAD\n    <h2 class="t-h2 arc__h2" data-grad>Describe it\.<br \/>Ship it\.<br \/>Evolve it<\/h2>\n=======\n    <h2 class="t-h2 arc__h2" data-grad>Describe it<br \/>Ship it<br \/>Evolve it<\/h2>\n>>>>>>> [^\n]+\n/,
  '    <h2 class="t-h2 arc__h2" data-grad>Describe it.<br />Ship it.<br />Evolve it</h2>\n'
);

html = html.replace(
  /<<<<<<< HEAD\n      <h2 class="t-h2" data-blur-child data-grad>Don't just build apps\.<br \/>Build opportunities\.<\/h2>\n=======\n      <h2 class="t-h2" data-blur-child data-grad>Don't just build apps<br \/>Build opportunities<\/h2>\n>>>>>>> [^\n]+\n/,
  `      <h2 class="t-h2" data-blur-child data-grad>Don't just build apps.<br />Build opportunities.</h2>\n`
);

// Big white-label conflict: drop pass from middle, keep WL comment + section, append pass after WL section.
html = html.replace(
  /<!-- ==========================================================================\n<<<<<<< HEAD\n[\s\S]*?>>>>>>> [^\n]+\n     ======================================================================= -->\n<section class="section wl-home" id="white-label">([\s\S]*?)<\/section>\n\n\n/,
  `<!-- ==========================================================================
     WHITE-LABEL · program teaser, after product proof and before Solo/Agency
     pricing so the two offers cannot be read as the same thing.
     ======================================================================= -->
<section class="section wl-home" id="white-label">$1</section>


${passSection}
`
);

html = html.replace(
  /<<<<<<< HEAD\n      <div><span class="footer__col-name">Pages<\/span><a href="\/features">Features<\/a><a href="\/white-label">White-Label<\/a><a href="\/#engine">Workflow<\/a><a href="\/#gallery">Made with AIWA<\/a><a href="\/#pricing">Pricing<\/a><a href="\/#faq">FAQ<\/a><a href="\/aiwa22">aiwa22<\/a><\/div>\n=======\n      <div><span class="footer__col-name">Pages<\/span><a href="\/features">Features<\/a><a href="\/white-label">White Label<\/a><a href="\/#engine">Workflow<\/a><a href="\/#gallery">Made with AIWA<\/a><a href="\/#pricing">Pricing<\/a><a href="\/#faq">FAQ<\/a><a href="\/aiwa22">aiwa22<\/a><\/div>\n>>>>>>> [^\n]+\n/,
  '      <div><span class="footer__col-name">Pages</span><a href="/features">Features</a><a href="/white-label">White-Label</a><a href="/#engine">Workflow</a><a href="/#gallery">Made with AIWA</a><a href="/#pricing">Pricing</a><a href="/#faq">FAQ</a><a href="/aiwa22">aiwa22</a></div>\n'
);

const left = (html.match(/<<<<<<</g) || []).length;
fs.writeFileSync(path, html);
console.log('conflicts remaining:', left);
console.log('has white-label:', html.includes('id="white-label"'));
console.log('has white-label-pass:', html.includes('id="white-label-pass"'));
console.log('pass after wl:', html.indexOf('id="white-label-pass"') > html.indexOf('id="white-label"'));
