import {readFileSync,writeFileSync} from 'node:fs';
const file='public/white-label/index.html';
let html=readFileSync(file,'utf8');
const items=[
 ['CRM','Contacts, deals and sales pipelines in one workspace.','crm.png','address-book'],
 ['Restaurant Ordering','Menus, baskets and ordering experiences for food businesses.',null,'bowl-food'],
 ['Ecommerce','Product collections, storefronts and customer checkout.','ecommerce.webp','shopping-bag'],
 ['Client Portal','A shared place for client files, progress and updates.','client-portal.png','folder-user'],
 ['AI SaaS','AI-powered tools with accounts and subscription plans.','AI Applications.webp','sparkle'],
 ['Booking Platform','Availability, appointments and scheduling in one place.','booking.png','calendar'],
 ['Membership Site','Member experiences with gated content and access plans.','membership.webp','users'],
 ['Blog','Articles, categories and a publishing workflow.',null,'article'],
 ['Admin Dashboard','Analytics and operational controls for your team.',null,'chart-line-up'],
 ['Business Websites','A home for your business, services and enquiries.','business.png','globe'],
 ['Internal Tools','Tools that support your team’s day-to-day work.','internal tools.png','kanban'],
 ['Mobile Apps','App experiences designed for smaller screens.',null,'device-mobile'],
 ['Automations','Connected steps that help recurring work run smoothly.',null,'flow-arrow']
];
const safe=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
const section=`<section class="page-section" id="wl-build"><div class="shell shell--wide">
 <div class="page-section__head page-section__head--center" data-blur-parent><h2 class="t-h2" data-blur-child data-grad>What Your Customers Can Build</h2><p class="t-body section__lead" data-blur-child>Explore the output across thirteen product categories.</p></div>
 <div class="wl-output" data-wl-output role="region" aria-label="Project showcase" aria-roledescription="carousel" tabindex="0">
  <div class="wl-output__tabs" aria-label="Project categories">${items.map(([title],i)=>`<button class="wl-output__tab" type="button" data-output-tab="${i}" aria-current="${i===0}">${title}</button>`).join('')}</div>
  <div class="wl-output__track" data-output-track>${items.map(([title,desc,img,icon],i)=>`<figure class="wl-output__slide${i===0?' is-active':''}" data-output-title="${title}" data-output-desc="${safe(desc)}"><div class="wl-output__browser"><div class="wl-output__chrome" aria-hidden="true"><i></i><i></i><i></i><span>${title} · Preview</span></div>${img?`<img src="/images/wl/gallery/${encodeURIComponent(img)}" alt="${title} project example" loading="lazy" decoding="async" />`:`<div class="wl-output__placeholder"><i class="ph ph-${icon}" aria-hidden="true"></i><span>${title}</span><small>Category image awaiting selection</small></div>`}</div></figure>`).join('')}</div>
  <div class="wl-output__caption" aria-live="polite"><h3 data-output-title>${items[0][0]}</h3><p class="t-body" data-output-desc>${items[0][1]}</p></div>
  <div class="wl-output__controls"><button type="button" data-output-prev aria-label="Previous project" disabled><i class="ph ph-arrow-left" aria-hidden="true"></i></button><span class="wl-output__count" data-output-count>01 / 13</span><button type="button" data-output-next aria-label="Next project"><i class="ph ph-arrow-right" aria-hidden="true"></i></button></div>
 </div></div></section>`;
html=html.replace(/<section\b[^>]*id="wl-build"[\s\S]*?<\/section>/,section);
html=html.replace('<script type="module" src="/js/page.js"></script>','<script type="module" src="/js/page.js"></script>\n<script type="module" src="/js/wl-output.js"></script>');
writeFileSync(file,html);
