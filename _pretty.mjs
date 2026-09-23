import fs from 'fs';
const files = process.argv.slice(2);
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const pretty = html
    .replace(/></g, '>\n<')
    .replace(/style="[^"]*"/g, (s) => (s.length > 180 ? 'style="..."' : s));
  const out = f.replace('.html', '.pretty.html');
  fs.writeFileSync(out, pretty);
  console.log(out, pretty.split('\n').length);
}
