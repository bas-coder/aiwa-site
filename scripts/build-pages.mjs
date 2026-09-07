/**
 * Renders every page of this site that is not the home page.
 *
 *     packages/shared/src/legal.ts    (slug / title / description / date / group)
 *   + apps/web/src/content/legal.ts   (the markdown body per slug)
 *   + scripts/content/pages.mjs       (the builder, docs and resources copy)
 *   ->  public/legal/index.html + public/legal/<slug>.html
 *       public/ai-{website,saas,crm,app}-builder.html
 *       public/docs/index.html
 *       public/resources/index.html
 *       public/404.html
 *       public/index.html             (its nav and footer regions only)
 *
 * WHY A GENERATOR, IN A PACKAGE WHOSE README SAYS "NO BUILD STEP".
 *
 * Two reasons, and neither is "it was less typing".
 *
 * 1. THE LEGAL COPY MUST NOT BE FORKED. It is ~900 lines of versioned legal text
 *    that already exists in one place, and app.aiwa.codes renders those same
 *    bytes. Hand-transcribing it here would fork the wording the day someone
 *    edits one side, and a policy that says two different things on two hosts is
 *    the one kind of drift that actually matters. apps/marquee reached the same
 *    conclusion and its scripts/build-legal.mjs is this script's direct ancestor.
 *
 * 2. THE NAV AND THE FOOTER APPEAR ON FOURTEEN PAGES. A footer link inventory
 *    maintained by hand in fourteen files is an inventory that is wrong in at
 *    least one of them. NAV and FOOTER_COLS below are the only definition, and
 *    that is why this script also writes into public/index.html: the home page
 *    is hand-authored everywhere except its nav and footer regions, which are
 *    fenced by sentinel comments and owned here.
 *
 * The output contract is unchanged, which is the part that matters: public/ is
 * still final bytes, still committed, still served without a build step. Nothing
 * runs at request time and nothing runs at deploy time. This script runs when
 * the copy changes, and `--check` in `pnpm lint` fails if the committed output
 * has drifted from its sources.
 *
 *     node scripts/build-pages.mjs           # write the pages
 *     node scripts/build-pages.mjs --check   # fail if committed output is stale
 *
 * Dependency-free, like the rest of the package: the markdown subset the legal
 * documents actually use (h2/h3, bullet lists, GFM tables, bold/italic, links)
 * is rendered by the ~90 lines in section 3 rather than by putting a parser on a
 * lockfile this package does not have.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUILDERS, DOCS, RESOURCES } from './content/pages.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = join(HERE, '..');
const REPO = join(PKG, '..', '..');
const PUBLIC = join(PKG, 'public');
const META_SRC = join(REPO, 'packages/shared/src/legal.ts');
const BODY_SRC = join(REPO, 'apps/web/src/content/legal.ts');

const CHECK = process.argv.includes('--check');
const ORIGIN = 'https://aiwa.codes';

const fail = (msg) => { console.error(`\nBUILD-PAGES FAILED\n\n${msg}\n`); process.exit(1); };

/* ===========================================================================
   1. The legal sources, read as data.

   Both files are plain object/array literals with no interpolation and no
   imports inside the slice taken, so slicing the literal out and evaluating it
   is exact - and it FAILS LOUDLY if the shape ever changes, which a regex
   scrape of the same text would not.
   ======================================================================== */
function literalAfter(src, file, opener, closer) {
  const at = src.indexOf(opener);
  if (at < 0) fail(`could not find ${JSON.stringify(opener)} in ${file}.\nThe legal source changed shape; re-point scripts/build-pages.mjs at it.`);
  const from = at + opener.length - 1;                       // keep the opening bracket
  const end = src.indexOf(closer, from);
  if (end < 0) fail(`could not find the end of ${JSON.stringify(opener)} in ${file}.`);
  return src.slice(from, end + closer.length);
}

function evalLiteral(text, file) {
  if (text.includes('${')) fail(`${file} now uses template interpolation; this script evaluates its literals verbatim and cannot.`);
  try {
    return new Function(`return (${text})`)();
  } catch (err) {
    fail(`could not evaluate the literal taken from ${file}: ${err.message}`);
  }
}

const LEGAL_DOCS = evalLiteral(
  literalAfter(readFileSync(META_SRC, 'utf8'), META_SRC, 'export const LEGAL_DOCS: LegalDoc[] = [', '\n]'),
  META_SRC
);
const LEGAL_BODIES = evalLiteral(
  literalAfter(readFileSync(BODY_SRC, 'utf8'), BODY_SRC, 'const BODIES: Record<string, string> = {', '\n}'),
  BODY_SRC
);

if (!Array.isArray(LEGAL_DOCS) || !LEGAL_DOCS.length) fail('LEGAL_DOCS came back empty.');
for (const doc of LEGAL_DOCS) {
  for (const key of ['slug', 'title', 'description', 'lastUpdated', 'group']) {
    if (!doc[key]) fail(`LEGAL_DOCS entry ${JSON.stringify(doc.slug ?? doc)} has no ${key}.`);
  }
  if (!LEGAL_BODIES[doc.slug]) fail(`no markdown body for "${doc.slug}" in ${BODY_SRC}.`);
}
const orphans = Object.keys(LEGAL_BODIES).filter((slug) => !LEGAL_DOCS.some((d) => d.slug === slug));
if (orphans.length) fail(`bodies with no LEGAL_DOCS entry: ${orphans.join(', ')}`);

/* ===========================================================================
   2. The link inventory. THE ONLY DEFINITION.

   Every nav and every footer on the site is rendered from these two constants,
   including the home page's. Add a page here and it appears in fourteen
   footers; do not add it to a page by hand.
   ======================================================================== */
/* Four items, per the client brief: Features | Pricing | Docs | Community.
   Workflow, Why AIWA, Made with and FAQ came out of the nav and are all still
   reachable from the footer, which is why dropping them here costs nothing. */
const NAV = [
  { label: 'Features', href: '/#why' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Docs', href: 'https://docs.aiwa.codes' },
  { label: 'Community', href: 'https://chat.whatsapp.com/KL6AucmDI7v8gjuKjhW58e' },
];

const SOLUTIONS = BUILDERS.map((b) => ({ label: b.navLabel, href: `/${b.slug}` }));

/* The legal column is derived, never typed: the labels and the slugs come from
   LEGAL_DOCS, so a document renamed upstream is renamed in the footer by the
   same edit. */
const LEGAL_LINKS = [
  { label: 'Legal overview', href: '/legal' },
  ...LEGAL_DOCS.map((d) => ({ label: d.title, href: `/legal/${d.slug}` })),
];

const FOOTER_COLS = [
  { name: 'Solutions', links: SOLUTIONS },
  {
    name: 'Pages',
    links: [
      { label: 'Features', href: '/#why' },
      { label: 'Workflow', href: '/#engine' },
      { label: 'Made with AIWA', href: '/#gallery' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'FAQ', href: '/#faq' },
      /* aiwa22 is a PRERENDERED page, not a generated one: it carries its own
         compiled Tailwind stylesheet and is hand-authored apart from the two
         regions this script fills. It is listed here so every page links to
         it, and it is deliberately absent from PAGES so the generator neither
         writes it nor counts it as orphan output. */
      { label: 'aiwa22', href: '/aiwa22' },
    ],
  },
  {
    name: 'Resources',
    links: [
      { label: 'Docs', href: 'https://docs.aiwa.codes' },
      { label: 'Resources', href: '/resources' },
      { label: 'Templates', href: 'https://app.aiwa.codes/templates' },
      { label: 'Connectors', href: 'https://app.aiwa.codes/connectors' },
      { label: 'Enterprise', href: 'https://app.aiwa.codes/enterprise' },
    ],
  },
  { name: 'Legal', links: LEGAL_LINKS },
  {
    name: 'Contact',
    links: [
      { label: 'hello@aiwa.codes', href: 'mailto:hello@aiwa.codes' },
      { label: 'Join the Community', href: 'https://chat.whatsapp.com/KL6AucmDI7v8gjuKjhW58e' },
      { label: 'X', href: 'https://x.com/aiwadotcodes' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aiwacodes/' },
      { label: 'Facebook', href: 'https://web.facebook.com/aiwacodes' },
    ],
  },
];

/* ===========================================================================
   3. Markdown -> HTML, for the subset the legal documents use.
   ======================================================================== */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * In-copy links were written for app.aiwa.codes, where /legal/* is same-origin.
 * They are same-origin here too, and the absolute https://aiwa.codes/... forms
 * are rewritten root-relative so they resolve under `pnpm dev` on localhost
 * instead of bouncing to production mid-document.
 */
function docHref(url) {
  if (url.startsWith(`${ORIGIN}/`)) return url.slice(ORIGIN.length);
  if (url === ORIGIN) return '/';
  return url;
}

const isExternal = (url) => /^https?:\/\//.test(url);

function inline(text) {
  let out = esc(text);
  // Bare support addresses. remark-gfm autolinks these in the app; matching it
  // here keeps a reader one click from the mailbox a clause tells them to write to.
  out = out.replace(/\b([a-z0-9._%+-]+@aiwa\.codes)\b/gi, '<a href="mailto:$1">$1</a>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const target = docHref(url);
    const attrs = isExternal(target) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${esc(target)}"${attrs}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])_([^_\n]+)_(?=$|[\s.,;:)])/g, '$1<em>$2</em>');
  return out;
}

/** Heading ids, so a clause can be linked directly. Deduped: documents repeat headings. */
function slugify(text, seen) {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
  let id = base;
  for (let n = 2; seen.has(id); n += 1) id = `${base}-${n}`;
  seen.add(id);
  return id;
}

const cells = (row) => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

/** Returns { html, toc }; toc is one entry per `##`, which is what .toc lists. */
function renderMarkdown(md, where) {
  const lines = md.split('\n');
  const seen = new Set();
  const out = [];
  const toc = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text, seen);
      if (level === 2) toc.push({ id, text });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2).trim()); i += 1; }
      out.push(`<ul>\n${items.map((t) => `  <li>${inline(t)}</li>`).join('\n')}\n</ul>`);
      continue;
    }

    // GFM table: header row, a `| --- | --- |` separator, then body rows.
    if (line.startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1] ?? '')) {
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].startsWith('|')) { body.push(cells(lines[i])); i += 1; }
      out.push(
        '<div class="table-scroll"><table>\n' +
        `  <thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>\n` +
        `  <tbody>\n${body.map((r) => `    <tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n` +
        '</table></div>'
      );
      continue;
    }

    /* Anything else is a paragraph - but only after ruling out the constructs
       this renderer does NOT handle. Without this the block falls through to
       the paragraph branch and ships as literal markdown on a legal page: no
       error, no warning, just a stray ``` or a `1.` sitting in the prose, which
       is exactly the "looks almost right" failure this package refuses. Teach
       the renderer the construct, then delete its line from here. */
    const UNSUPPORTED = [
      [/^```/, 'a code fence'],
      [/^\s*\d+\.\s/, 'an ordered list'],
      [/^>\s/, 'a blockquote'],
      [/^\s+[-*]\s/, 'a nested list'],
      [/^#{1}\s|^#{4,}\s/, 'an h1 or h4+ heading (documents start at h2; the h1 is the page title)'],
      [/^!\[/, 'an image'],
      [/^\s*(?:---|\*\*\*|___)\s*$/, 'a thematic break'],
    ];
    for (const [re, what] of UNSUPPORTED) {
      if (re.test(line)) {
        fail(
          `${where} now uses ${what}, which scripts/build-pages.mjs does not render:\n` +
          `    ${JSON.stringify(line.slice(0, 80))}\n\n` +
          `Teach renderMarkdown() that block and drop it from the UNSUPPORTED list. Rendering it as a\n` +
          `paragraph would ship the raw markdown onto a published page.`
        );
      }
    }

    const buf = [];
    while (
      i < lines.length && lines[i].trim() &&
      !/^#{2,3}\s/.test(lines[i]) && !lines[i].startsWith('- ') && !lines[i].startsWith('|')
    ) { buf.push(lines[i].trim()); i += 1; }
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  return { html: out.join('\n'), toc };
}

/* ===========================================================================
   4. Chrome: the nav, the footer, and the document around them.

   Sub-pages link the SAME three stylesheets the home page does plus page.css,
   and load the same vendored GSAP - so a primitive fixed once is fixed
   everywhere, and there is no second design system to keep in step.
   ======================================================================== */
const ARROW =
  '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" ' +
  'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const btn = (label, href, { primary = false, arrow = true } = {}) =>
  `<a class="btn${primary ? ' btn--primary' : ''}" href="${esc(href)}">
          <span class="btn__label">${esc(label)}</span>${arrow ? `
          <span class="btn__arrow"><span>
            ${ARROW}
            ${ARROW}
          </span></span>` : ''}
        </a>`;

/** aria-current on the link for the page you are on, in the nav and the footer. */
const current = (href, here) => (here && href === here ? ' aria-current="page"' : '');

function navHtml(here) {
  return `<nav class="nav" id="nav">
  <div class="nav__inner">
    <a class="nav__logo" href="/#top" aria-label="AIWA home">
      <img src="/images/aiwa-logo.webp" alt="" width="1000" height="459" />
    </a>
    <button class="nav__burger" aria-expanded="false" aria-controls="nav-links" aria-label="Menu">
      <i></i><i></i>
    </button>
    <div class="nav__links" id="nav-links">
${NAV.map((l) => `      <a href="${esc(l.href)}"${current(l.href, here)}${isExternal(l.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="nav__flip"><span>${esc(l.label)}</span><span aria-hidden="true">${esc(l.label)}</span></span></a>`).join('\n')}
    </div>
    <div class="nav__cta-wrap">
      <a class="btn btn--ghost nav__cta nav__cta--login" href="https://app.aiwa.codes">
        <span class="btn__label">Login</span>
      </a>
      <a class="btn btn--primary nav__cta nav__cta--build" href="/#pricing" tabindex="-1" aria-hidden="true">
        <span class="btn__label">Start Building</span>
        <span class="btn__arrow"><span>
          ${ARROW}
          ${ARROW}
        </span></span>
      </a>
    </div>
  </div>
</nav>`;
}

function footerHtml(here) {
  const col = (c) => `      <div><span class="footer__col-name">${esc(c.name)}</span>${c.links
    .map((l) => `<a href="${esc(l.href)}"${current(l.href, here)}${isExternal(l.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(l.label)}</a>`)
    .join('')}</div>`;

  return `<footer class="footer" data-footer>
  <div class="footer__plate">
    <div class="shell shell--wide">
      <div class="footer__top">
        <a class="footer__logo" href="/#top" aria-label="AIWA home">
          <img src="/images/aiwa-logo.webp" alt="" width="1000" height="459" />
        </a>
        <form class="footer__news" onsubmit="return false">
          <label class="sr-only" for="news">Email address</label>
          <input id="news" type="email" placeholder="Join our newsletter" />
          <button class="btn btn--ghost" type="submit"><span class="btn__label">Apply</span></button>
        </form>
      </div>
      <div class="footer__cols">
${FOOTER_COLS.map(col).join('\n')}
      </div>
      <div class="footer__meta">
        <p class="footer__legal t-small">© 2026 AIWA Codes. All rights reserved.</p>
      </div>
    </div>
    <div class="footer__wordmark-crop">
      <img class="footer__wordmark" src="/images/aiwa-logo.webp" alt="" width="1000" height="459" aria-hidden="true" decoding="async" />
    </div>
  </div>
</footer>`;
}

/**
 * A whole document.
 *
 * `wide` picks the measure: marketing pages take .shell--wide like the home
 * page's sections, documents take the narrower default because prose wants a
 * measure and a 96rem legal paragraph is unreadable.
 */
function shell({ here, title, description, body, canonical, wide = true }) {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(ORIGIN)}${esc(canonical)}" />
<link rel="icon" href="/aiwa-favicon.svg" type="image/svg+xml" />

<!-- Same two faces the home page preloads, for the same reason (§2.9): the
     heading is set in Bricolage and a low-priority font fetch is visible. -->
<link rel="preload" href="/fonts/bricolage-grotesque.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

<link rel="stylesheet" href="/css/tokens.css" />
<link rel="stylesheet" href="/css/base.css" />
<link rel="stylesheet" href="/css/site.css" />
<link rel="stylesheet" href="/css/page.css" />

<script>document.documentElement.classList.remove('no-js');</script>
</head>

<body class="page">

${navHtml(here)}

<main class="shell${wide ? ' shell--wide' : ''}">
${body}
</main>

${footerHtml(here)}

<script src="/js/vendor/gsap.min.js"></script>
<script src="/js/vendor/ScrollTrigger.min.js"></script>
<script src="/js/vendor/lenis.min.js"></script>
<script type="module" src="/js/page.js"></script>
</body>
</html>
`;
}

/* ---- shared blocks ------------------------------------------------------ */
const crumb = (label, href) => `<a class="crumb" href="${esc(href)}">${esc(label)}</a>`;

const head = (eyebrow, heading, lead, { center = false, grad = true } = {}) => `  <div class="page-section__head${center ? ' page-section__head--center' : ''}" data-blur-parent>
    <p class="eyebrow" data-blur-child>${esc(eyebrow)}</p>
    <h2 class="t-h2" data-blur-child${grad ? ' data-grad' : ''}>${heading}</h2>${lead ? `
    <p class="t-body section__lead" data-blur-child>${esc(lead)}</p>` : ''}
  </div>`;

/**
 * `lead` is the class on the first card, and it is a layout decision, not a
 * style one: .feature--hero spans three columns and .feature--wide spans two, so
 * the right one is whichever makes `items.length` fill the grid with no hole.
 * Seven features -> hero (3) + 6 = three full rows. Five agents -> wide (2) + 3.
 */
const featureGrid = (items, lead = 'feature--hero') => `  <div class="why__grid" data-blur-parent data-stagger="100">
${items.map((f, n) => `    <article class="feature${n === 0 ? ` ${lead}` : ''}" data-blur-child data-spring>${n === 0 ? `
      <svg class="feature__blob" data-blob viewBox="0 0 400 400" aria-hidden="true"></svg>` : ''}
      <div class="feature__body">
        <h3 class="t-h4">${esc(f.name)}</h3>
        <p class="t-body">${esc(f.body)}</p>
      </div>
    </article>`).join('\n')}
  </div>`;

const stepsBlock = (steps) => `  <div class="steps" data-blur-parent data-stagger="80">
${steps.map((s) => `    <div class="steps__item" data-blur-child>
      <p class="steps__idx" aria-hidden="true"></p>
      <div class="steps__body">
        <h3>${esc(s.title)}</h3>
        <p class="t-body">${esc(s.body)}</p>
      </div>
    </div>`).join('\n')}
  </div>`;

/** true -> a tick, false -> a dash, a string -> the string. */
const compareCell = (v, ours) => {
  const cls = ours ? ' class="is-ours"' : '';
  if (v === true) return `<td${cls}><i aria-hidden="true"></i><span class="sr-only">Yes</span></td>`;
  if (v === false) return `<td${cls}><s aria-hidden="true"></s><span class="sr-only">No</span></td>`;
  return `<td${cls}>${esc(v)}</td>`;
};

const compareBlock = ({ columns, rows }) => `  <div class="compare" data-blur-in>
    <table>
      <thead>
        <tr><th scope="col">Feature</th>${columns.map((c, n) => `<th scope="col"${n === 0 ? ' class="is-ours"' : ''}>${esc(c)}</th>`).join('')}</tr>
      </thead>
      <tbody>
${rows.map((r) => `        <tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((v, n) => compareCell(v, n === 0)).join('')}</tr>`).join('\n')}
      </tbody>
    </table>
  </div>`;

const casesBlock = (cases) => `  <div class="cases" data-blur-parent data-stagger="70">
${cases.map((c) => `    <article data-blur-child>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.body)}</p>
    </article>`).join('\n')}
  </div>`;

const faqBlock = (faq) => `  <div class="accordion" data-accordion data-accordion-close-siblings="true" data-blur-in>
${faq.map((f) => `    <div class="accordion__item" data-accordion-status="not-active">
      <button class="accordion__head" aria-expanded="false">
        <span>${esc(f.q)}</span>
        <span class="accordion__icon" aria-hidden="true"></span>
      </button>
      <div class="accordion__body"><div><p class="t-body">${esc(f.a)}</p></div></div>
    </div>`).join('\n')}
  </div>`;

const relatedBlock = (items) => `  <div class="related" data-blur-parent data-stagger="70">
${items.map((r) => `    <a href="${esc(r.href)}" data-blur-child>
      <h3>${esc(r.title)} <span aria-hidden="true">-&gt;</span></h3>
      <p>${esc(r.blurb)}</p>
    </a>`).join('\n')}
  </div>`;

const ctaBlock = ({ eyebrow, h2, body, label = 'Start Building', href = 'https://app.aiwa.codes' }) => `<section class="section cta">
  <svg class="cta__blob" data-blob viewBox="0 0 400 400" aria-hidden="true"></svg>
  <div class="cta__fade cta__fade--top" aria-hidden="true"></div>
  <div class="cta__fade cta__fade--bottom" aria-hidden="true"></div>
  <div class="cta__inner" data-blur-parent>
    <p class="eyebrow" data-blur-child>${esc(eyebrow)}</p>
    <h2 class="t-display cta__h2" data-blur-child data-grad>${h2}</h2>
    <p class="t-body" data-blur-child>${esc(body)}</p>
    <div class="cta__actions" data-blur-child>
      ${btn(label, href, { primary: true })}
      ${btn('See pricing', '/#pricing', { arrow: false })}
    </div>
    <p class="footer__legal t-small" data-blur-child style="border:0;padding:0">No credit card required</p>
  </div>
</section>`;

const metaBlock = (items) => `  <dl class="page-meta" data-blur-in>
${items.map((m) => `    <div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}${m.note ? `<em>${esc(m.note)}</em>` : ''}</dd></div>`).join('\n')}
  </dl>`;

const pageHero = ({ eyebrow, h1, lead, actions, note, doc = false, blob = true }) => `<section class="page-hero${doc ? ' page-hero--doc' : ''}">${blob ? `
  <svg class="page-hero__blob" data-blob viewBox="0 0 400 400" aria-hidden="true"></svg>` : ''}
  <div class="page-hero__inner" data-blur-parent>
    <p class="eyebrow" data-blur-child>${esc(eyebrow)}</p>
    <h1 class="t-h2 page-hero__h1" data-blur-child data-grad>${h1}</h1>
    <p class="t-body page-hero__lead" data-blur-child>${esc(lead)}</p>${actions ? `
    <div class="page-hero__actions" data-blur-child>
      ${actions}
    </div>` : ''}${note ? `
    <p class="page-hero__note" data-blur-child>${esc(note)}</p>` : ''}
  </div>
</section>`;

const problemBlock = (heading, paras, close) => `  <div class="page-section__head" data-blur-parent>
    <h2 class="t-h3" data-blur-child>${esc(heading)}</h2>
${paras.map((p) => `    <p class="t-body section__lead" data-blur-child>${esc(p)}</p>`).join('\n')}
    <p class="t-body section__lead" data-blur-child><strong style="color:var(--cream-050)">${esc(close)}</strong></p>
  </div>`;

/* ===========================================================================
   5. The pages.
   ======================================================================== */
const written = new Map();
const emit = (rel, html) => written.set(rel, html);

/* ---- the four builder pages -------------------------------------------- */
for (const b of BUILDERS) {
  const body = [
    pageHero({
      eyebrow: b.eyebrow,
      h1: b.h1,
      lead: b.lead,
      actions: `${btn(b.ctaLabel, 'https://app.aiwa.codes', { primary: true })}
      ${btn('See how it works', '#how', { arrow: false })}`,
      note: `Free to start · no credit card required`,
    }),
    `<section class="page-section page-section--tight">
${metaBlock(b.meta)}
</section>`,
    b.problem ? `<section class="page-section">
${problemBlock(b.problemHead, b.problem, b.problemClose)}
</section>` : '',
    `<section class="page-section" id="agents">
${head('The AIWA difference', b.agentsHead, b.agentsLead)}
${featureGrid(b.agents.map((a) => ({ name: a.name, body: a.body })), 'feature--wide')}
  <p class="t-body pricing__foot" data-blur-in>${esc(b.agentsClose)}</p>
</section>`,
    `<section class="page-section" id="how">
${head('How it works', b.stepsHead, '')}
${stepsBlock(b.steps)}
</section>`,
    `<section class="page-section" id="features">
${head('Features', b.featuresHead, '')}
${featureGrid(b.features)}
</section>`,
    `<section class="page-section" id="compare">
${head('Comparison', b.compareHead, '')}
${compareBlock(b.compare)}
</section>`,
    `<section class="page-section" id="use-cases">
${head('Use cases', b.casesHead, '')}
${casesBlock(b.cases)}
</section>`,
    `<section class="page-section faq" id="faq">
${head('FAQ', 'Questions people ask before they start', '')}
  <div class="faq__grid faq__grid--single">
${faqBlock(b.faq)}
  </div>
</section>`,
    `<section class="page-section" id="related">
${head('Explore more', 'Related solutions', '')}
${relatedBlock(b.related)}
</section>`,
    ctaBlock({ eyebrow: b.ctaEyebrow, h2: b.ctaH2, body: b.ctaBody, label: b.ctaLabel }),
  ].filter(Boolean).join('\n\n');

  emit(`${b.slug}.html`, shell({
    here: `/${b.slug}`,
    title: b.title,
    description: b.description,
    canonical: `/${b.slug}`,
    body,
  }));
}

/* ---- /docs -------------------------------------------------------------- */
{
  const d = DOCS;
  const body = [
    pageHero({ eyebrow: d.eyebrow, h1: d.h1, lead: d.lead, actions: `${btn('Open the app', 'https://app.aiwa.codes', { primary: true })}
      ${btn('Full reference', 'https://app.aiwa.codes/docs', { arrow: false })}` }),
    `<section class="page-section page-section--tight" id="quickstart">
${head('Quickstart', 'Four steps, about ten minutes', '')}
  <div class="quickstart" data-blur-in>
    <div class="quickstart__rows">
${d.quickstart.map((q) => `      <div class="quickstart__row"><b>${esc(q.n)}</b><span>${esc(q.line)}<i>${esc(q.note)}</i></span></div>`).join('\n')}
    </div>
    ${btn('Start the first one', 'https://app.aiwa.codes', { primary: true })}
  </div>
</section>`,
    `<section class="page-section" id="reference">
${head('Reference', d.sectionsHead, d.sectionsLead)}
  <div class="cards" data-blur-parent data-stagger="70">
${d.sections.map((s) => `    <article class="card" data-blur-child>
      <div class="card__head">
        <p class="card__kind">${esc(s.kind)}</p>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.body)}</p>
      </div>
      <div class="card__links">
${s.links.map((l) => `        <a href="${esc(l.href)}"${isExternal(l.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${esc(l.label)}</span><em>${esc(l.meta)}</em></a>`).join('\n')}
      </div>
    </article>`).join('\n')}
  </div>
</section>`,
    `<section class="page-section faq" id="faq">
${head('FAQ', 'About the documentation itself', '')}
  <div class="faq__grid faq__grid--single">
${faqBlock(d.faq)}
  </div>
</section>`,
    `<section class="page-section" id="related">
${head('Explore more', 'Other places to look', '')}
${relatedBlock([
      { title: 'Resources', href: '/resources', blurb: 'Guides, walkthroughs, templates, the changelog and the community.' },
      { title: 'Legal', href: '/legal', blurb: 'Terms, privacy, acceptable use, refunds and cookies.' },
    ])}
</section>`,
    ctaBlock({ eyebrow: d.ctaEyebrow, h2: d.ctaH2, body: d.ctaBody }),
  ].join('\n\n');

  emit('docs/index.html', shell({ here: '/docs', title: d.title, description: d.description, canonical: '/docs', body }));
}

/* ---- /resources --------------------------------------------------------- */
{
  const r = RESOURCES;
  const body = [
    pageHero({ eyebrow: r.eyebrow, h1: r.h1, lead: r.lead, actions: `${btn('Getting started', r.featured.href, { primary: true })}
      ${btn('Read the docs', '/docs', { arrow: false })}` }),
    `<section class="page-section page-section--tight" id="start-here">
  <article class="card" data-blur-in>
    <div class="card__head">
      <p class="card__kind">${esc(r.featured.kind)}</p>
      <h3 class="t-h3">${esc(r.featured.name)}</h3>
      <p class="t-body">${esc(r.featured.body)}</p>
    </div>
    <div class="card__cta">${btn(`${r.featured.meta}`, r.featured.href, { primary: true })}</div>
  </article>
</section>`,
    `<section class="page-section" id="groups">
${head('Resources', r.groupsHead, '')}
  <div class="cards" data-blur-parent data-stagger="70">
${r.groups.map((g) => `    <article class="card" data-blur-child>
      <div class="card__head">
        <p class="card__kind">${esc(g.kind)}</p>
        <h3>${esc(g.name)}</h3>
        <p>${esc(g.body)}</p>
      </div>
      <div class="card__links">
${g.links.map((l) => `        <a href="${esc(l.href)}"${isExternal(l.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${esc(l.label)}</span><em>${esc(l.meta)}</em></a>`).join('\n')}
      </div>
    </article>`).join('\n')}
  </div>
</section>`,
    ctaBlock({ eyebrow: r.ctaEyebrow, h2: r.ctaH2, body: r.ctaBody }),
  ].join('\n\n');

  emit('resources/index.html', shell({ here: '/resources', title: r.title, description: r.description, canonical: '/resources', body }));
}

/* ---- /legal hub --------------------------------------------------------- */
{
  const GROUPS = [
    { key: 'terms', name: 'Terms of Service' },
    { key: 'policies', name: 'Policies' },
  ];
  const unknown = LEGAL_DOCS.filter((d) => !GROUPS.some((g) => g.key === d.group));
  if (unknown.length) fail(`LEGAL_DOCS uses group(s) this script has no heading for: ${[...new Set(unknown.map((d) => d.group))].join(', ')}`);

  const body = [
    pageHero({
      eyebrow: 'Legal',
      h1: 'Terms and policies',
      lead: 'The documents that govern your use of AIWA. They are the same text app.aiwa.codes serves, rendered from the same source, so the two can never disagree.',
      doc: true,
    }),
    `<section class="page-section page-section--tight">
  <div class="hub">
${GROUPS.map((g) => {
      const docs = LEGAL_DOCS.filter((d) => d.group === g.key);
      if (!docs.length) return '';
      return `    <div class="hub__group" data-blur-parent data-stagger="60">
      <p class="hub__group-name" data-blur-child>${esc(g.name)}</p>
      <ul class="hub__list">
${docs.map((d) => `        <li data-blur-child><a href="/legal/${esc(d.slug)}">
          <span>
            <h2>${esc(d.title)}</h2>
            <p>${esc(d.description)}</p>
          </span>
          <span aria-hidden="true">-&gt;</span>
        </a></li>`).join('\n')}
      </ul>
    </div>`;
    }).filter(Boolean).join('\n')}
  </div>
  <p class="t-small" data-blur-in style="margin-top:2.5rem">Questions about any of these: <a href="mailto:legal@aiwa.codes" style="color:var(--accent)">legal@aiwa.codes</a></p>
</section>`,
  ].join('\n\n');

  emit('legal/index.html', shell({
    here: '/legal',
    title: 'Legal · AIWA',
    description: 'Terms of Service, Privacy Policy, Acceptable Use, Refund and Cookie policies for the AIWA platform.',
    canonical: '/legal',
    body,
    wide: false,
  }));
}

/* ---- /legal/<slug> ------------------------------------------------------ */
for (const doc of LEGAL_DOCS) {
  const { html, toc } = renderMarkdown(LEGAL_BODIES[doc.slug], `the "${doc.slug}" legal body`);
  if (!toc.length) fail(`the "${doc.slug}" body produced no h2 headings, so the document has no table of contents.`);

  const body = [
    `${crumb('All legal documents', '/legal')}`,
    pageHero({
      eyebrow: doc.group === 'terms' ? 'Terms of Service' : 'Policy',
      h1: esc(doc.title),
      lead: doc.description,
      doc: true,
      blob: false,
    }),
    `<section class="page-section page-section--tight">
  <div class="doc-layout">
    <article class="prose" data-blur-in>
${html}
    </article>
    <nav class="toc" data-toc aria-label="On this page">
      <p class="toc__name">On this page</p>
      <ol>
${toc.map((t) => `        <li><a href="#${esc(t.id)}">${esc(t.text)}</a></li>`).join('\n')}
      </ol>
    </nav>
  </div>
  <p class="t-small" style="margin-top:3rem">Last updated ${esc(doc.lastUpdated)} · Questions: <a href="mailto:legal@aiwa.codes" style="color:var(--accent)">legal@aiwa.codes</a></p>
</section>`,
  ].join('\n\n');

  emit(`legal/${doc.slug}.html`, shell({
    here: `/legal/${doc.slug}`,
    title: `${doc.title} · AIWA`,
    description: doc.description,
    canonical: `/legal/${doc.slug}`,
    body,
    wide: false,
  }));
}

/* ---- /404 --------------------------------------------------------------- */
emit('404.html', shell({
  here: null,
  title: 'Page not found · AIWA',
  description: 'That page does not exist. Here is the way back.',
  canonical: '/404',
  body: `<section class="notfound">
  <p class="notfound__code">404 · not found</p>
  <h1 class="t-display" data-grad>This page<br />does not exist</h1>
  <p class="t-body page-hero__lead">The link may be old, or the address may have a typo in it. Everything on this site is reachable from the footer below.</p>
  <div class="page-hero__actions">
    ${btn('Back to the home page', '/', { primary: true })}
    ${btn('Read the docs', '/docs', { arrow: false })}
  </div>
</section>`,
}));

/* ===========================================================================
   6. The home page's nav and footer.

   index.html is hand-authored and stays that way. These two regions are not:
   they are fenced by sentinel comments and rendered from the same NAV and
   FOOTER_COLS as every other page, because a footer that is right on thirteen
   pages and wrong on the fourteenth is the failure this fence prevents.
   ======================================================================== */
function replaceRegion(src, name, replacement, file) {
  const open = `<!-- ${name}:START (generated by scripts/build-pages.mjs - do not edit by hand) -->`;
  const close = `<!-- ${name}:END -->`;
  const from = src.indexOf(open);
  const to = src.indexOf(close);
  if (from < 0 || to < 0 || to < from) {
    fail(
      `could not find the ${name} region in ${file}.\n\n` +
      `It must contain, on their own lines:\n    ${open}\n    ...\n    ${close}`
    );
  }
  return `${src.slice(0, from + open.length)}\n${replacement}\n${src.slice(to)}`;
}

for (const rel of ['index.html', 'aiwa22/index.html']) {
  const file = join(PUBLIC, rel);
  let src = readFileSync(file, 'utf8');
  src = replaceRegion(src, 'NAV', navHtml('/'), `public/${rel}`);
  src = replaceRegion(src, 'FOOTER', footerHtml('/'), `public/${rel}`);
  emit(rel, src);
}

/* ===========================================================================
   7. Write, or check.

   --check compares byte for byte and lists every stale file rather than the
   first one, because "run the generator" is one action whatever the count and a
   partial list makes it look like two.
   ======================================================================== */
const stale = [];
for (const [rel, html] of written) {
  const file = join(PUBLIC, rel);
  const before = existsSync(file) ? readFileSync(file, 'utf8') : null;
  if (before === html) continue;
  if (CHECK) { stale.push(`${before === null ? 'missing' : 'stale  '}  public/${rel}`); continue; }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

/* An orphan check, so deleting a page from the sources actually deletes it.
   A stale ai-old-builder.html would still be served, still be crawled, and
   still be linked from nothing - the worst kind of live page. */
const generatedDirs = ['legal', 'docs', 'resources'];
for (const dir of generatedDirs) {
  const abs = join(PUBLIC, dir);
  if (!existsSync(abs)) continue;
  for (const name of readdirSync(abs)) {
    const rel = `${dir}/${name}`;
    if (!written.has(rel)) stale.push(`orphan   public/${rel} (no source produces it; delete it)`);
  }
}

if (CHECK) {
  if (stale.length) {
    fail(`the committed pages are out of date with their sources:\n\n${stale.map((s) => `    ${s}`).join('\n')}\n\nRun: pnpm --filter @aiwa-codes/lander pages:build`);
  }
  console.log(`build-pages --check: ${written.size} pages up to date.`);
} else {
  const orphaned = stale.filter((s) => s.startsWith('orphan'));
  console.log(`build-pages: wrote ${written.size} pages into public/`);
  for (const [rel] of written) console.log(`  public/${rel}`);
  if (orphaned.length) console.log(`\nWARNING - files no source produces:\n${orphaned.map((s) => `  ${s}`).join('\n')}`);
}
