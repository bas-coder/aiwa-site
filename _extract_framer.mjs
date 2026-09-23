import fs from 'fs';

const html = fs.readFileSync('C:/Projects/BJCRUMBS/Site/index.html', 'utf8');
const i = html.toLowerCase().indexOf('<body');
const body = html.slice(i);

const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const skipTags = new Set(['script','style','noscript']);

const names = [];
const texts = [];
const stack = [];
let skip = 0;
let pos = 0;

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

while (pos < body.length) {
  if (body[pos] === '<') {
    if (body.startsWith('<!--', pos)) {
      const end = body.indexOf('-->', pos);
      pos = end === -1 ? body.length : end + 3;
      continue;
    }
    const end = body.indexOf('>', pos);
    if (end === -1) break;
    const raw = body.slice(pos + 1, end);
    pos = end + 1;
    const closing = raw.startsWith('/');
    const selfClose = raw.endsWith('/');
    const tagBody = (closing ? raw.slice(1) : raw).replace(/\/$/, '').trim();
    const space = tagBody.search(/\s/);
    const tag = (space === -1 ? tagBody : tagBody.slice(0, space)).toLowerCase();
    if (!tag || tag.startsWith('!') || tag.startsWith('?')) continue;

    if (closing) {
      if (skipTags.has(tag) && skip > 0) skip -= 1;
      else if (stack.length) stack.pop();
      continue;
    }

    const attrs = {};
    const attrRe = /([:@\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let m;
    const attrSrc = space === -1 ? '' : tagBody.slice(space);
    while ((m = attrRe.exec(attrSrc))) {
      attrs[m[1]] = decode(m[2] ?? m[3] ?? m[4] ?? '');
    }

    if (skipTags.has(tag)) {
      skip += 1;
      continue;
    }
    if (skip) continue;

    const name = attrs['data-framer-name'];
    if (name) names.push(name);
    if (!selfClose && !voidTags.has(tag)) {
      stack.push(name || null);
    }

    if (tag === 'img' && attrs.src) {
      const anc = [...stack].reverse().find(Boolean) || name || '';
      texts.push({ anc, t: `[IMG ${attrs.alt || ''} ${attrs.src.slice(0, 120)}]` });
    }
  } else {
    const end = body.indexOf('<', pos);
    const chunk = body.slice(pos, end === -1 ? body.length : end);
    pos = end === -1 ? body.length : end;
    if (skip) continue;
    const t = decode(chunk).replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const anc = [...stack].reverse().find(Boolean) || '';
    texts.push({ anc, t });
  }
}

const seen = new Set();
const unique = [];
for (const n of names) {
  if (!seen.has(n)) {
    seen.add(n);
    unique.push(n);
  }
}

fs.writeFileSync('C:/Projects/bjproper/_framer_names.txt', unique.join('\n'));
fs.writeFileSync(
  'C:/Projects/bjproper/_framer_text.txt',
  texts.map((x) => `[${x.anc}] ${x.t}`).join('\n')
);
console.log('unique names', unique.length, 'texts', texts.length);
