/**
 * Static server for the lander reference build.
 *
 * Dependency-free, like apps/marquee's - a dependency here would put this
 * package on the root lockfile and couple its deploy to the api+web image for
 * no gain. There is no bundler either: public/ is authored as final bytes, so
 * dev and prod serve byte-identical output and there is no build step that can
 * disagree with what you reviewed.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../public', import.meta.url)));
const PORT = Number(process.env.PORT) || 4300;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Resolve a URL path to a file, or null.
 *
 * Three shapes, in this order, and the order is the whole design:
 *
 *   /css/site.css        an exact file
 *   /legal/terms         + '.html'        -> public/legal/terms.html
 *   /docs  or  /docs/    + '/index.html'  -> public/docs/index.html
 *
 * The extensionless forms exist because the generated pages LINK to them:
 * scripts/build-pages.mjs writes /legal/terms, not /legal/terms.html, so the
 * published URLs match apps/marquee's and a link that works in production is
 * not a 404 under `pnpm dev`. A request that already carries an extension is
 * never rewritten - a missing .js must 404 rather than quietly answer with a
 * page, which is the failure mode that makes a broken import look like a
 * runtime error.
 */
const HAS_EXTENSION = /\.[a-z0-9]+$/i;

function resolveFile(path) {
  // normalize() collapses ../ before we join, so a crafted URL cannot escape
  // ROOT; the startsWith check below is the belt to that braces.
  const base = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''));
  if (!base.startsWith(ROOT)) return null;

  const isFile = (f) => existsSync(f) && statSync(f).isFile();
  const indexIn = (dir) => {
    const i = join(dir, 'index.html');
    return isFile(i) ? i : null;
  };

  if (path.endsWith('/')) return indexIn(base);
  if (existsSync(base)) {
    const s = statSync(base);
    if (s.isFile()) return base;
    if (s.isDirectory()) return indexIn(base);
  }
  if (HAS_EXTENSION.test(path)) return null;
  return isFile(`${base}.html`) ? `${base}.html` : indexIn(base);
}

createServer((req, res) => {
  const path = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = resolveFile(path);

  if (!file) {
    /* The 404 page is generated with the same chrome as every other page, so a
       wrong URL still has the nav and the footer on it - which is the only
       thing that makes a 404 useful. Served WITH a 404 status, never a 200: a
       soft 404 gets the page indexed. */
    const page = join(ROOT, '404.html');
    if (existsSync(page)) {
      res.writeHead(404, { 'content-type': MIME['.html'], 'cache-control': 'no-cache' });
      return createReadStream(page).pipe(res);
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('404');
  }

  const ext = extname(file);
  // Fonts and images are content-stable here; HTML and JS must revalidate so a
  // redeploy cannot leave stale markup paired with fresh modules.
  const immutable = ext === '.woff2' || ext === '.png' || ext === '.jpg' || ext === '.webp';
  res.writeHead(200, {
    'content-type': MIME[ext] || 'application/octet-stream',
    'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`lander → http://localhost:${PORT}`);
});
