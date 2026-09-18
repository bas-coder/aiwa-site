import {readFileSync, writeFileSync} from 'node:fs';
const path='public/white-label/index.html';
let html=readFileSync(path,'utf8');
const replace=(a,b)=>{if(!html.includes(a)) throw Error(`Missing target: ${a.slice(0,80)}`);html=html.replace(a,b)};
const section=(id,fn)=>{const re=new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?<\\/section>`);if(!re.test(html))throw Error(id);html=html.replace(re,fn)};
const trust='<img class="wl-trust-strip" src="/images/trust.svg" alt="Purchase reassurance" width="218" height="23" loading="lazy" />';
const cta=(label='Launch My AI Platform')=>`<div class="wl-cta-stack"><a class="btn btn--primary btn--large" href="#wl-pricing"><span class="btn__label">${label}</span><span class="btn__arrow"><span><i class="ph ph-arrow-right" aria-hidden="true"></i><i class="ph ph-arrow-right" aria-hidden="true"></i></span></span></a>${trust}</div>`;
replace('<link rel="stylesheet" href="/css/page.css" />','<link rel="stylesheet" href="/css/page.css" />\n<link rel="stylesheet" href="/css/white-label-sales.css" />');
replace('<p class="wl-sticky__title">Launch Your AI Platform</p>','<p class="wl-sticky__title">Launch Your AI Platform</p>\n      <p class="wl-sticky__sub">$997 one-time or $497/year</p>');
section('wl-idea',s=>s.replace(/<figure class="wl-home__visual"[\s\S]*?<\/figure>/,'<figure class="wl-project-shot"><img src="/images/wl/Projects.png" alt="Projects in the AIWA Partner Console" loading="lazy" decoding="async" /></figure>'));
replace('Illustrative Gross Spread','Illustrative Gross Profit');
section('wl-pain',s=>s.replaceAll('icon ph ph-x"','icon ph ph-x-circle"'));
section('wl-console',s=>s.replace('<ul class="wl-cap-grid"',`<figure class="wl-console-overview" data-blur-in><img src="/images/wl/overview.png" alt="White Label business overview" loading="lazy" decoding="async" /></figure>\n    <ul class="wl-cap-grid"`).replace(/<span>\d{2}<\/span>/g,'<i class="ph ph-check" aria-hidden="true"></i>'));
section('wl-difference',()=> '');
const descriptions=[
 'Launch your own branded AI app-building platform with a White Label license.',
 'Carry your identity across the experience your customers see, from sign-in to their workspace.',
 'Show your company name throughout your customer-facing platform.',
 'Bring your logo into the loading screen, sign-in page and workspace.',
 'Set the brand colors that make the platform feel like your product.',
 'Welcome customers at your own platform address, such as app.yourcompany.com.',
 'Let customer projects publish through your branded domain ecosystem.',
 'Keep customer accounts, access and credit balances together in the Partner Console.',
 'View customer projects and manage your platform from one place.',
 'Create the plans, prices and credit allocations that fit your offer.',
 'Connect your Stripe account so customer payments go to your business.',
 'Offer extra credits at the top-up price you choose.',
 'Buy additional credits at the current partner rate of $0.08 per credit.',
 'Connect your sender so customer emails come from your business.',
 'Point help links to your own documentation site. You provide and maintain the content.',
 'Give customers access to the app-building technology that powers AIWA.',
 'Use your platform to deliver client projects and sell access to your customers.'
];
section('wl-included',s=>s.replace(/<ul class="wl-include-grid"[\s\S]*?<\/ul>/,old=>{
const titles=[...old.matchAll(/<\/i>([^<]+)<\/li>/g)].map(m=>m[1]);if(titles.length!==descriptions.length)throw Error('Included count');
return `<div class="wl-included-rows">${titles.map((title,i)=>`<article class="wl-included-row" data-blur-in><div class="wl-included-row__copy"><h3 class="t-h3">${title}</h3><p class="t-body">${descriptions[i]}</p></div><div class="wl-image-placeholder" role="img" aria-label="Image placeholder: ${title}"><i class="ph ph-image" aria-hidden="true"></i><span>${title}</span><small>Product image coming soon</small></div></article>`).join('\n')}</div>`;
}));
section('wl-bonuses',s=>{s=s.replace(/<article class="wl-bonus"[^>]*>\s*<div class="wl-bonus__top"><span>03<\/span>[\s\S]*?<\/article>/,'').replace('Six launch bonuses','Five launch bonuses');return s.replace(/(<div class="wl-bonus__top"><span>)(0[4-6])(<\/span>)/g,(_,a,n,b)=>a+String(Number(n)-1).padStart(2,'0')+b)});
html=html.replace(/\s*<li>Documentation template<\/li>/g,'');
section('wl-pricing',s=>s.replace('<li>No annual White Label license payment</li>','<li>No annual White Label license payment</li>\n          <li>VIP Support</li>').replace('    <p class="t-small wl-disclaimer"',`    <div class="wl-pricing-trust">${trust}</div>\n    <p class="t-small wl-disclaimer"`));
section('wl-launch',s=>s.replace('</ol>','</ol>\n    <div class="wl-section-cta">'+cta()+'</div>'));
html=html.replace(/<section class="wl-mid-cta"[\s\S]*?<\/section>/,'');
html=html.replace(/\s*<div class="wl-offer-hero__price"[^>]*>[\s\S]*?<\/div>/g,'');
html=html.replace(/\s*<li><i class="wl-final-bonuses__check[^>]*><\/i>White Label Docs Template<\/li>/,'');
html=html.replace(/<div class="accordion__item"[^>]*>\s*<button[^>]*><span>Do you build the documentation site for me\?[\s\S]*?<\/div><\/div>\s*<\/div>/,'');
// Apply one shared large-CTA treatment inside main only. Pricing has its combined strip.
html=html.replace(/<main([\s\S]*?)<\/main>/,main=>main.replace(/<a class="btn btn--(primary|ghost)([^"]*)"([^>]*)>[\s\S]*?<\/a>/g,(a,kind,classes,attrs)=>{
 if(a.includes('btn--large'))return a;
 a=a.replace(`btn btn--${kind}${classes}`,`btn btn--${kind}${classes} btn--large`);
 if(attrs.includes('checkout='))return a;
 return `<div class="wl-cta-stack">${a}${trust}</div>`;
}));
// Existing footer retains its copyright and wordmark, but drops the upper navigation.
html=html.replace(/<footer class="footer" data-footer>[\s\S]*?<\/footer>/,s=>s.replace('class="footer"','class="footer footer--sales"').replace(/      <div class="footer__top">[\s\S]*?(?=      <div class="footer__meta">)/,''));
writeFileSync(path,html);
