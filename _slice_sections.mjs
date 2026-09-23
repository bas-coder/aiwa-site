import fs from 'fs';

const html = fs.readFileSync('C:/Projects/BJCRUMBS/Site/index.html', 'utf8');
const bodyStart = html.toLowerCase().indexOf('<body');
const body = html.slice(bodyStart);

const markers = [
  'data-framer-name="Hero"',
  'data-framer-name="Trust"',
  'data-framer-name="Demo Video"',
  'data-framer-name="Sticky"',
  'data-framer-name="Quote"',
  'data-framer-name="Why"',
  'data-framer-name="Made With"',
  'data-framer-name="Pricing"',
  'data-framer-name="FAQs"',
  'data-framer-name="Final CTA Section"',
  'data-framer-name="Footer"',
  'data-framer-name="Navigation"',
  'data-framer-name="Desktop"',
];

function findAll(needle) {
  const out = [];
  let i = 0;
  while ((i = body.indexOf(needle, i)) !== -1) {
    out.push(i);
    i += needle.length;
  }
  return out;
}

for (const m of markers) {
  const hits = findAll(m);
  console.log(m, hits.length, hits.slice(0, 6).join(','));
}

// Extract FAQ answers: look for accordion item text blocks after questions
const faqIdx = body.indexOf('data-framer-name="FAQs"');
const faqSlice = body.slice(faqIdx, faqIdx + 80000);
fs.writeFileSync('C:/Projects/bjproper/_faq_slice.html', faqSlice);

const heroIdx = body.indexOf('data-framer-name="Hero"');
fs.writeFileSync('C:/Projects/bjproper/_hero_slice.html', body.slice(heroIdx, heroIdx + 60000));

const navIdx = body.indexOf('data-framer-name="Navigation"');
fs.writeFileSync('C:/Projects/bjproper/_nav_slice.html', body.slice(Math.max(0, navIdx - 2000), navIdx + 25000));

const trustIdx = body.indexOf('data-framer-name="Trust"');
fs.writeFileSync('C:/Projects/bjproper/_trust_slice.html', body.slice(trustIdx, trustIdx + 20000));

const demoIdx = body.indexOf('data-framer-name="Demo Video"');
fs.writeFileSync('C:/Projects/bjproper/_demo_slice.html', body.slice(demoIdx, demoIdx + 25000));

const quoteIdx = body.indexOf('data-framer-name="Quote"');
fs.writeFileSync('C:/Projects/bjproper/_quote_slice.html', body.slice(quoteIdx, quoteIdx + 20000));

const whyIdx = body.indexOf('data-framer-name="Why"');
fs.writeFileSync('C:/Projects/bjproper/_why_slice.html', body.slice(whyIdx, whyIdx + 30000));

const madeIdx = body.indexOf('data-framer-name="Made With"');
fs.writeFileSync('C:/Projects/bjproper/_made_slice.html', body.slice(madeIdx, madeIdx + 25000));

const footerIdx = body.indexOf('data-framer-name="Footer"');
fs.writeFileSync('C:/Projects/bjproper/_footer_slice.html', body.slice(footerIdx, footerIdx + 30000));

const stickyIdx = body.indexOf('>Our Agentic Workflow Engine');
console.log('workflow text idx', stickyIdx);
fs.writeFileSync('C:/Projects/bjproper/_workflow_slice.html', body.slice(Math.max(0, stickyIdx - 5000), stickyIdx + 20000));

console.log('slices written');
