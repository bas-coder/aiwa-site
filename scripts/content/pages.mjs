/**
 * The copy for every generated page, as data.
 *
 * WHERE IT COMES FROM. The four builder pages exist on the shipping site
 * (apps/marquee/overlay/ai-*-builder.html), and the Website and SaaS pages are
 * server-rendered there, so their headline, lead, agent cards, steps, features,
 * comparison rows and use cases are LIFTED FROM THE LIVE COPY rather than
 * rewritten. Same rule the rest of this package follows: nothing here is
 * invented brand.
 *
 * The CRM and App builder pages on the live site are client-rendered SPA shells
 * (~38KB of loader, no prose in the HTML), so there was no copy to lift beyond
 * their <title>, their meta description and the two-line summaries the Website
 * and SaaS pages already publish about them in "Related solutions". Those two
 * pages' bodies are therefore written here, from those summaries outward, in the
 * voice of the two that exist. They are marked `authored: true` so a reader of
 * this file can tell at a glance which words came off the live site and which
 * did not.
 *
 * /docs and /resources have no counterpart at all - the live site links both
 * straight out to app.aiwa.codes. They are written here as the landing pages
 * those links deserve, and every card that would need product content we do not
 * have hands off to the app rather than faking an article.
 *
 * FAQ ANSWERS. The live builder pages ship their FAQs inside a collapsed
 * accordion that the static export does not contain, so the questions are real
 * and the answers are written to the same facts the home page's FAQ states: 45
 * welcome credits on Launchpad, 130 on Solo, 790 on Agency, roughly 65 for a
 * full app, GitHub sync, full source export, bring-your-own keys.
 */

/* The credit and plan numbers every page quotes. One definition, because a
   pricing number that disagrees with the home page is the one factual error a
   marketing site cannot afford. */
export const FACTS = {
  builders: '14,000+',
  welcomeCredits: '45',
  /* 50, from the client's FAQ copy of Sep 2026 ("a typical full app build uses
     around 50 credits"). It was 65 here, which is why this is a constant: the
     figure appears on the home page, the four builder pages and /docs, and a
     pricing number that disagrees with itself across a site is the one factual
     error a marketing site cannot afford. */
  appCost: '50',
  editCost: '10',
  models: 'Claude Opus · Sonnet · GPT-4o · Gemini 2.5 Pro',
};

const RELATED = {
  website: { title: 'AI Website Builder', href: '/ai-website-builder', blurb: 'Build a site, deploy it live, and let SEO and CRO agents keep improving it.' },
  saas: { title: 'AI SaaS Builder', href: '/ai-saas-builder', blurb: 'Ship a production-ready SaaS: frontend, backend, auth and Stripe payments, from a prompt.' },
  crm: { title: 'AI CRM Builder', href: '/ai-crm-builder', blurb: 'Build a custom CRM around exactly how your team sells: fields, pipelines, automations, reports.' },
  app: { title: 'AI App Builder', href: '/ai-app-builder', blurb: 'Build, deploy and evolve full-stack web and mobile apps with a team of AI agents.' },
};

export const BUILDERS = [
  /* ---------------------------------------------------------------------- */
  {
    slug: 'ai-website-builder',
    navLabel: 'Website Builder',
    title: 'AI Website Builder, Build, Launch & Evolve Your Website | AIWA',
    description:
      'AIWA is the AI website builder that does not just generate pages. It plans your site, builds it, tests it, and continuously improves it with a team of dedicated AI agents. No code. No agency.',
    eyebrow: 'AIWA Website Builder',
    h1: 'The AI website builder that builds, launches,<br />and keeps improving your site',
    lead:
      'Most AI website builders generate a page and stop there. AIWA builds your website, deploys it live, then keeps a team of AI agents watching it, improving your SEO, fixing conversion gaps, and evolving your site as your business grows.',
    ctaLabel: 'Build My Website Free',
    meta: [
      { label: 'Time to live', value: 'Minutes', note: 'not weeks' },
      { label: 'Agents on your site', value: 'Five', note: 'PM · SEO · build · CRO · QA' },
      { label: 'Builders shipping', value: FACTS.builders, note: 'founders and agencies' },
      { label: 'Starting cost', value: 'Free', note: `${FACTS.welcomeCredits} welcome credits` },
    ],
    agentsHead: 'AIWA is your AI product team, not just a page generator',
    agentsLead:
      'AIWA approaches your website the way a full team of professionals would: planning, building, testing and improving it, so you never have to.',
    agents: [
      { name: 'AI Product Manager', body: 'Thinks through your goals, your audience and your site structure before a single line of code is written.' },
      { name: 'AI SEO Agent', body: 'Monitors your search rankings continuously. When traffic drops, it surfaces the fix and, with your approval, implements it.' },
      { name: 'AI Builder', body: 'Generates every page, section and component with full context of your brand, your business and your users.' },
      { name: 'AI CRO Agent', body: 'Watches how visitors behave on your site. When conversion dips, it flags the cause and proposes changes to fix it.' },
      { name: 'AI Testing Agent', body: 'Checks every page before it goes live. Layout issues, broken links and mobile responsiveness caught automatically.' },
    ],
    agentsClose: 'This is the difference between a tool that generates a website and a team that runs one.',
    stepsHead: 'From idea to live website in minutes, then it gets better every week',
    steps: [
      { title: 'Tell AIWA what you need', body: 'Describe your business, your goals and who your site is for. No forms, no templates: just talk to AIWA like you would talk to a designer.' },
      { title: 'Your AI team plans the site', body: "AIWA's planning agent maps out your site architecture, page hierarchy and content strategy before building anything." },
      { title: 'AIWA builds and deploys', body: 'A full website: design, copy, mobile layout, and a live backend if you need one, published to your custom domain in one click.' },
      { title: 'Your AI agents take over', body: 'SEO monitors rankings, CRO watches conversions, testing checks for issues. You get a weekly report, approve changes, and AIWA ships them.' },
    ],
    featuresHead: 'Everything you need to build and run a high-performing website',
    features: [
      { name: 'Multi-model AI generation', body: 'Choose Claude Opus, GPT-4o or Gemini 2.5 Pro. The AI that builds your site is not locked to one model: use the best model for the job.' },
      { name: 'Custom domain + one-click deploy', body: 'Connect your domain and AIWA handles SSL, CDN and deployment. Your site is live in seconds.' },
      { name: 'Export to mobile', body: 'Turn your website into a native mobile app. Export a signed APK for Android or IPA for iOS, ready for the app stores.' },
      { name: 'Full website generation', body: 'Complete site architecture: landing, about, pricing, blog and legal pages, with consistent design and copy throughout.' },
      { name: 'Mobile-first by default', body: 'Every website AIWA builds is fully responsive. The testing agent verifies mobile layout before anything goes live.' },
      { name: 'Live database backend', body: 'Need a contact form, member portal or dynamic content? AIWA provisions a database automatically. You never touch a config.' },
      { name: 'Continuous SEO monitoring', body: 'Your SEO agent tracks keyword rankings, flags drops, and implements approved fixes: meta tags, content, schema and internal links.' },
    ],
    compareHead: 'AIWA vs other AI website builders',
    compare: {
      columns: ['AIWA', 'Wix ADI', 'Squarespace AI', 'Framer AI'],
      rows: [
        ['Full site generation from prompt', true, 'Limited', true, true],
        ['Persistent context that evolves without breaking', true, false, false, false],
        ['Autonomous SEO agent', true, false, false, false],
        ['CRO monitoring agent', true, false, false, false],
        ['Mobile app export (APK + iOS)', true, false, false, false],
        ['Custom domain + deploy', true, true, true, true],
      ],
    },
    casesHead: 'Built for founders, creators and businesses who want more than a pretty page',
    cases: [
      { name: 'Startup founders', body: "Launch a professional website before you write a line of code. Let AIWA's agents keep it converting while you focus on the product." },
      { name: 'Agencies', body: 'Build client websites faster. Deliver sites that come with ongoing AI-powered maintenance built in.' },
      { name: 'Coaches and consultants', body: 'Build a site that books clients, sends emails, and improves its own conversion rate automatically.' },
      { name: 'SaaS founders', body: 'Start with a marketing site. Add a full web app and backend when you are ready, all inside AIWA.' },
      { name: 'E-commerce brands', body: 'Launch a storefront with a real database backend, product pages, and a CRO agent watching every funnel step.' },
    ],
    faq: [
      { q: 'Is AIWA really free to start?', a: `Yes. Every account opens with ${FACTS.welcomeCredits} welcome credits and no card. A full site costs roughly ${FACTS.appCost} credits to build, so the free allowance covers a real site rather than a demo.` },
      { q: 'Can I use my own domain?', a: 'Yes. Point your domain at AIWA and it handles SSL, the CDN and the build pipeline. There is no separate hosting bill and no DNS work beyond the one record.' },
      { q: 'What if I want to change my website later?', a: 'Project Brain™ holds every decision behind the site that exists, so a change in month six is fitted to it rather than regenerated from scratch. Every build is versioned and restorable in one click.' },
      { q: 'Do I need to know how to code?', a: 'No. You describe what you want in plain English and review what comes back. The code is there if you want it, and you can export the full source at any time.' },
      { q: 'Can I export my website?', a: 'Yes. Sync to GitHub or export the full source, including the backend schema. Nothing AIWA builds is locked to us.' },
      { q: 'How does the SEO agent work?', a: 'It tracks your keyword rankings continuously. When a ranking drops it identifies the cause, writes the fix, and shows it to you: meta tags, copy, schema, internal links. You approve, it ships.' },
    ],
    ctaEyebrow: 'Stop starting over',
    ctaH2: 'Stop rebuilding your website<br />from scratch every year',
    ctaBody: 'Build it once with AIWA. Let your AI team keep it performing.',
    related: [RELATED.app, RELATED.saas],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: 'ai-saas-builder',
    navLabel: 'SaaS Builder',
    title: 'AI SaaS Builder, Build a Production-Ready SaaS App Without Code | AIWA',
    description:
      'AIWA builds complete SaaS applications from a prompt: frontend, backend, database, auth and payments. Then a team of AI agents monitors your product, improves conversions, and evolves your codebase as you grow.',
    eyebrow: 'AIWA SaaS Builder',
    h1: 'Build a production-ready SaaS with AI,<br />then let your AI team run it',
    lead:
      'AIWA generates your full SaaS application, frontend, backend, database, auth and Stripe payments, from a plain English description. Then dedicated AI agents monitor your MRR, improve onboarding, and evolve your product based on what users actually do.',
    ctaLabel: 'Build My SaaS Free',
    meta: [
      { label: 'Generated together', value: 'Full stack', note: 'front, back, auth, billing' },
      { label: 'Database', value: 'Postgres', note: 'provisioned, zero config' },
      { label: 'Payments', value: 'Stripe', note: 'tiers, trials, webhooks' },
      { label: 'Founders building', value: FACTS.builders, note: 'and shipping' },
    ],
    problemHead: 'Building a SaaS has never been faster. Running one is still just as hard.',
    problem: [
      'AI builders made the first version easy. But that is only 10% of the job.',
      'After launch, your SaaS needs to onboard users without friction. Retain them past month one. Convert trials to paid. Reduce churn. Add features without breaking existing ones.',
      'Every AI tool today stops at "generate." Nobody is helping you run and grow what you built.',
    ],
    problemClose: 'AIWA is the only AI SaaS builder that ships your product and keeps it running.',
    agentsHead: 'Your AI product team, from idea to growing SaaS',
    agentsLead: 'Every AIWA SaaS is planned, built, tested and grown by a team of specialised AI agents.',
    agents: [
      { name: 'AI Product Manager', body: 'Plans your SaaS architecture, user flows, data model and feature roadmap before building begins, and keeps context across every update.' },
      { name: 'AI Builder', body: 'Generates production-ready frontend, backend and database code. Full file trees, not snippets. Backend provisioned invisibly, Stripe integrated on request.' },
      { name: 'AI Testing Agent', body: 'Runs automated tests on every change before it ships. Catches regressions, broken auth flows and UI issues before your users do.' },
      { name: 'AI CRO Agent', body: 'Monitors your onboarding flow, trial conversion and user behaviour. Surfaces friction points with fixes and implements approved changes.' },
      { name: 'Revenue Agent', body: 'Watches your MRR signals: churn risk, upgrade opportunities, revenue drops, and sends a weekly brief with context and suggested actions.' },
    ],
    agentsClose: 'This is the difference between a tool that generates a SaaS and a team that grows one.',
    stepsHead: 'From idea to live SaaS, without a dev team',
    steps: [
      { title: 'Describe your SaaS idea', body: 'Tell AIWA what your product does, who it is for and how it makes money. No wireframes, no technical specs.' },
      { title: 'AIWA plans the product', body: 'Your AI Product Manager defines the data model, user roles, core features and subscription tiers before a line of code is written.' },
      { title: 'Full stack generated and deployed', body: 'Frontend, backend, database, auth and Stripe billing, all generated together, connected, and deployed to your custom domain.' },
      { title: 'AI agents take over operations', body: 'CRO watches onboarding, Revenue monitors MRR, Testing validates every feature. You approve changes, not manage code.' },
    ],
    featuresHead: 'Everything a SaaS needs, built in, not bolted on',
    features: [
      { name: 'Multi-model code generation', body: 'Claude Opus for complex logic, Sonnet for fast iterations, GPT-4o as an alternative. Pick the model, pay in credits, switch any time.' },
      { name: 'Invisible managed backend', body: 'Every SaaS gets a dedicated Postgres database, row-level security, auth and real-time subscriptions. Provisioned automatically. Zero configuration.' },
      { name: 'Stripe payments built in', body: 'Tell AIWA your pricing model and it generates subscription tiers, trial logic, upgrade flows and webhook handling, production-ready.' },
      { name: 'Persistent app context', body: 'AIWA remembers every architectural decision, data model change and feature. Come back six months later to add a feature, and nothing breaks.' },
      { name: 'One-click deploy + custom domain', body: 'Ship your SaaS to a live URL from the editor. Connect your own domain. AIWA handles the build pipeline, SSL and CDN.' },
      { name: 'Mobile app export', body: 'Turn your SaaS into a native mobile app. Export a signed APK for Android or IPA for iOS with one click, ready for app store submission.' },
    ],
    compareHead: 'AIWA vs other AI SaaS builders',
    compare: {
      columns: ['AIWA', 'Lovable', 'Bolt.new', 'Base44'],
      rows: [
        ['Full stack generation', true, true, true, true],
        ['Persistent context (no breakage on edits)', true, 'Partial', 'Manual', 'Partial'],
        ['Revenue monitoring agent', true, false, false, false],
        ['CRO + onboarding agent', true, false, false, false],
        ['Mobile export (APK + iOS)', true, false, false, false],
      ],
    },
    casesHead: 'What founders are building with AIWA',
    cases: [
      { name: 'Micro-SaaS products', body: 'Solo founders shipping niche tools in days, not months. From idea to paying customers without touching a terminal.' },
      { name: 'Internal SaaS tools', body: 'Teams replacing expensive software subscriptions with custom tools built specifically for how they work.' },
      { name: 'Agency client portals', body: 'Agencies delivering branded client dashboards and reporting tools in hours.' },
      { name: 'Vertical SaaS', body: 'Industry-specific software for real estate, legal, healthcare and finance teams, built without a technical co-founder.' },
      { name: 'MVP validation', body: 'Founders testing ideas with working software before raising a round or quitting their job.' },
    ],
    faq: [
      { q: 'Can AIWA build a multi-tenant SaaS?', a: 'Yes. Tell it your tenancy model and the AI Product Manager designs the data model and row-level security around it before the build starts, rather than bolting isolation on afterwards.' },
      { q: 'Does AIWA handle Stripe subscriptions?', a: 'Yes. Describe your pricing and AIWA generates the tiers, trial logic, upgrade and downgrade flows, and the webhook handlers, wired to your own Stripe account and keys.' },
      { q: 'What happens when I need to add a new feature?', a: 'Project Brain™ still holds the architecture, the data model and every prior decision, so the new feature is fitted to the product that exists. That is the difference between month one and month twelve feeling the same.' },
      { q: 'Can I own the code?', a: 'Yes. Sync to GitHub or export the full source and database schema at any time. AIWA connects to the AI providers, database, payment and email services you already pay for, using your keys.' },
      { q: 'Is this really production-ready?', a: 'The testing agent exercises every change in a real browser before it ships, and each build is versioned and restorable in one click. You deploy when the tests pass, not when the generator finishes.' },
    ],
    ctaEyebrow: 'One conversation away',
    ctaH2: 'Your SaaS is<br />one conversation away',
    ctaBody: 'Describe your idea. AIWA builds the product. Your AI team grows it.',
    related: [RELATED.app, RELATED.crm],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: 'ai-crm-builder',
    navLabel: 'CRM Builder',
    authored: true,
    title: 'AI CRM Builder, Build a Custom CRM With AI in Minutes | AIWA',
    description:
      'AIWA builds a CRM around exactly how your team sells: your fields, your pipelines, your automations, your reports. Generated from a description, deployed live, and evolved by AI agents as your process changes.',
    eyebrow: 'AIWA CRM Builder',
    h1: 'A CRM shaped like your pipeline,<br />not the other way round',
    lead:
      'Every CRM on the market asks your team to sell the way it was designed. AIWA builds one around exactly how your team sells: your fields, your stages, your automations, your reports. Then it keeps changing shape as your process does.',
    ctaLabel: 'Build My CRM Free',
    meta: [
      { label: 'Fields and stages', value: 'Yours', note: 'not a template' },
      { label: 'Database', value: 'Postgres', note: 'with row-level security' },
      { label: 'Seats', value: 'Unmetered', note: 'you own the deployment' },
      { label: 'Starting cost', value: 'Free', note: `${FACTS.welcomeCredits} welcome credits` },
    ],
    problemHead: 'The CRM is never the problem. The fit is.',
    problem: [
      'Every team ends up with the same three workarounds: a custom field that means something different to each rep, a spreadsheet beside the CRM for the part it cannot model, and a report nobody trusts.',
      'That is not a discipline problem. It is what happens when a process meets software that was designed for a different one, and the only way to close the gap is a consultant and a six-week configuration project.',
      "Describing your pipeline is faster than configuring somebody else's.",
    ],
    problemClose: 'AIWA builds the CRM your process already implies, then changes it when the process changes.',
    agentsHead: 'The agents that build it, and the ones that keep it honest',
    agentsLead: 'A CRM lives or dies on data quality and on whether anyone looks at it. Two of the five agents exist for exactly that.',
    agents: [
      { name: 'AI Product Manager', body: 'Turns how you describe your sales process into an object model: entities, stages, ownership, permissions and the reports that fall out of them.' },
      { name: 'AI Builder', body: 'Generates the full application: records, pipeline views, forms, activity timeline, role-based access and the Postgres schema underneath.' },
      { name: 'AI Testing Agent', body: 'Exercises every stage transition, permission rule and automation in a real browser before it reaches your team.' },
      { name: 'Data Hygiene Agent', body: 'Watches for the things that quietly kill a CRM: duplicate records, stalled deals, fields your team stopped filling in, and stages nobody uses.' },
      { name: 'Pipeline Agent', body: 'Reads the pipeline weekly and reports what changed: conversion by stage, deals ageing past their norm, and where the process is leaking.' },
    ],
    agentsClose: 'This is the difference between a database of contacts and a system that tells you something.',
    stepsHead: 'From how you sell to a live CRM, in one conversation',
    steps: [
      { title: 'Describe how your team sells', body: 'Your stages, what a deal is, who owns it, what has to be true before it moves. Plain English, in the words your team already uses on a call.' },
      { title: 'AIWA models it', body: 'The Product Manager agent turns that into entities, fields, stage rules, permissions and reports, and shows you the model before anything is built.' },
      { title: 'The CRM is generated and deployed', body: 'Records, pipeline board, forms, activity timeline, role-based access and dashboards, on a provisioned Postgres database, live on your domain.' },
      { title: 'Import, invite, and let the agents watch it', body: 'Bring your contacts in from a CSV or your old CRM, invite your team, and get a weekly brief on pipeline health and data quality.' },
    ],
    featuresHead: 'Everything a CRM needs, in your shape',
    features: [
      { name: 'Your object model', body: 'Deals, contacts, companies, tickets, properties, applications: whatever your business actually tracks, with the fields it actually needs.' },
      { name: 'Pipelines that match reality', body: 'As many pipelines as you sell through, each with its own stages, entry rules and owners. A stage exists because you use it, not because it shipped.' },
      { name: 'Automations without a builder', body: 'Describe the rule. AIWA writes it: assignment, follow-up tasks, stage-change notifications, escalation when a deal goes quiet.' },
      { name: 'Reports and dashboards', body: 'Conversion by stage, cycle time, forecast, activity by rep. Ask for a new view in a sentence and it is added to the dashboard.' },
      { name: 'Role-based access', body: "Row-level security in the database, not just hidden buttons in the UI. A rep sees their accounts because the query cannot return anyone else's." },
      { name: 'Imports and integrations', body: 'CSV import with field mapping, and connections to the email, calendar and payment services you already pay for, using your keys.' },
      { name: 'Mobile app export', body: 'Export the CRM as a signed APK for Android or IPA for iOS so the team updates a deal from the car park, not from memory.' },
    ],
    compareHead: 'AIWA vs configuring a CRM you bought',
    compare: {
      columns: ['AIWA', 'Salesforce', 'HubSpot', 'Airtable'],
      rows: [
        ['Object model built around your process', true, 'Consultant', 'Limited', true],
        ['Time to a working pipeline', 'Minutes', 'Weeks', 'Days', 'Days'],
        ['Automations written from a description', true, false, false, false],
        ['Data hygiene agent', true, false, false, false],
        ['Weekly pipeline brief', true, false, 'Add-on', false],
        ['Own the code and the database', true, false, false, false],
        ['Per-seat pricing', false, true, true, true],
      ],
    },
    casesHead: 'Teams that outgrew the template',
    cases: [
      { name: 'Sales teams', body: 'A pipeline with your stages and your qualification rules, and a weekly brief on where deals are actually stalling.' },
      { name: 'Agencies', body: 'Client, project and retainer tracked in one place, with the reporting your clients ask for already built.' },
      { name: 'Recruiters', body: 'Candidates and roles are two pipelines, not one bent into shape. Stage rules, interview scheduling and placement tracking included.' },
      { name: 'Real estate', body: 'Properties, viewings and buyers modelled as what they are, with automations for follow-up and offer deadlines.' },
      { name: 'Support teams', body: 'Tickets, SLAs and escalation paths, with the escalation rule written from a sentence rather than a workflow builder.' },
    ],
    faq: [
      { q: 'Can I import from my current CRM?', a: 'Yes. Export a CSV from your existing tool and AIWA maps the columns onto the model it built, flagging anything that does not have a home before it writes a record.' },
      { q: 'What happens when our process changes?', a: 'You describe the change. Project Brain™ holds the existing model, so a new stage or field is fitted to the CRM your team is already using, and every build is versioned and restorable in one click.' },
      { q: 'Is the data really ours?', a: 'Yes. It is your Postgres database. Export the full source and the schema at any time, sync the code to GitHub, and connect the email and payment services you already pay for using your own keys.' },
      { q: 'Do we pay per seat?', a: `No. AIWA charges credits for what it builds, not for who logs in. A full CRM costs roughly ${FACTS.appCost} credits to generate, and the ${FACTS.welcomeCredits} welcome credits on a free account cover a real one.` },
      { q: 'Can it handle permissions properly?', a: "Permissions are enforced with row-level security in the database, so a rep cannot retrieve another rep's accounts even through an API call. The testing agent exercises every rule before the build ships." },
    ],
    ctaEyebrow: 'Stop configuring',
    ctaH2: 'Stop configuring a CRM.<br />Describe yours.',
    ctaBody: 'One conversation, and the pipeline on the screen is the one in your head.',
    related: [RELATED.saas, RELATED.app],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: 'ai-app-builder',
    navLabel: 'App Builder',
    authored: true,
    title: 'AI App Builder, Build, Deploy & Evolve Web and Mobile Apps With AI | AIWA',
    description:
      'AIWA builds, deploys and evolves full-stack web and mobile apps with a team of AI agents. Frontend, backend, database and auth generated together, then tested in a real browser and shipped to a live URL or an app store.',
    eyebrow: 'AIWA App Builder',
    h1: 'Build, deploy and evolve full-stack apps<br />with a team of AI agents',
    lead:
      'One description gets you a working application: interface, backend, database, auth and a live URL. Then the agents stay on it, testing every change in a real browser, keeping context across every decision, and shipping to Android and iOS when you are ready.',
    ctaLabel: 'Build My App Free',
    meta: [
      { label: 'Generated together', value: 'Full stack', note: 'UI, API, database, auth' },
      { label: 'Ships to', value: 'Web + native', note: 'signed APK and IPA' },
      { label: 'Tested in', value: 'Real browser', note: 'before every deploy' },
      { label: 'Models', value: 'Four', note: 'switch per task' },
    ],
    problemHead: 'The first version is easy now. The second one is where projects die.',
    problem: [
      'A prompt-to-app tool will give you something that runs. The trouble starts at the first real change: the generator has forgotten why the app looks the way it does, regenerates a working screen, and quietly breaks the flow beside it.',
      'So the work becomes archaeology. You re-explain your own app to the tool every session, and the app gets worse in the places you are not looking.',
      'An app is not a one-time generation. It is a codebase that has to keep its own history.',
    ],
    problemClose: 'AIWA keeps that history, and tests it before every deploy.',
    agentsHead: 'Five agents, one codebase, no amnesia',
    agentsLead: 'Every AIWA app is planned, built, tested and evolved by the same five agents that run the rest of the platform.',
    agents: [
      { name: 'AI Product Manager', body: 'Turns your description into a plan: screens, data model, states and the order to build them in, before any code exists.' },
      { name: 'AI Architecture', body: 'Fits every feature to the codebase that already exists rather than regenerating around it, which is the whole reason change two behaves like change one.' },
      { name: 'AI Builder', body: 'Generates the frontend, the API, the database schema and the auth flows together, as a full file tree you can read and export.' },
      { name: 'Autonomous QA', body: 'Exercises the app in a real browser before deployment: routes, forms, auth, mobile layout. What it breaks, it fixes.' },
      { name: 'Evolution Agent', body: 'Keeps working after launch. Version history, restore, and a weekly report on what changed and what it recommends next.' },
    ],
    agentsClose: 'This is the difference between a tool that generates an app and a team that maintains one.',
    stepsHead: 'From a sentence to an app in the store',
    steps: [
      { title: 'Describe the app', body: 'What it does, who signs in, what it stores. One paragraph is enough; the planning agent asks about the parts you left open.' },
      { title: 'Review the plan, not the code', body: 'Screens, data model, roles and build order come back first. Change the plan while it is still a paragraph rather than a pull request.' },
      { title: 'Full stack built and deployed', body: 'Interface, API, Postgres database and auth generated together, tested in a real browser, and live on a URL you can send to someone.' },
      { title: 'Export to Android and iOS', body: 'When the web app is right, export a signed APK or IPA from the same project. One codebase, three places it runs.' },
    ],
    featuresHead: 'Everything the app needs, generated together',
    features: [
      { name: 'Web and native from one project', body: 'The same app ships to a URL and to the stores. Export a signed APK for Android or IPA for iOS without a second codebase.' },
      { name: 'Invisible managed backend', body: 'A dedicated Postgres database, auth, row-level security and real-time subscriptions, provisioned automatically. You never touch a config file.' },
      { name: 'Project Brain™', body: 'Every architectural decision, schema change and feature is remembered. Come back in six months, ask for a change, and nothing else moves.' },
      { name: 'Multi-model generation', body: `${FACTS.models}. Pick the model for the task, pay in credits, and switch whenever the job changes.` },
      { name: 'Tested before it ships', body: 'Autonomous QA drives the real app in a real browser on every change: routes, forms, auth, responsive layout. Regressions are caught before your users find them.' },
      { name: 'Live preview and one-click deploy', body: 'Watch the app build as it is generated, then publish to your custom domain. AIWA handles the pipeline, SSL and CDN.' },
      { name: 'Code export and GitHub sync', body: 'Full source, full schema, in your repository. Connect the AI providers, database, payment and email services you already pay for, with your keys.' },
    ],
    compareHead: 'AIWA vs other AI app builders',
    compare: {
      columns: ['AIWA', 'Lovable', 'Bolt.new', 'Replit Agent'],
      rows: [
        ['Full stack generation', true, true, true, true],
        ['Persistent context across sessions', true, 'Partial', 'Manual', 'Partial'],
        ['Browser-level automated QA', true, false, false, 'Partial'],
        ['Native mobile export (APK + IPA)', true, false, false, false],
        ['Managed Postgres + auth provisioned', true, true, 'Manual', true],
        ['Version history and one-click restore', true, 'Partial', false, true],
        ['Full source export and GitHub sync', true, true, true, true],
      ],
    },
    casesHead: 'What people build here',
    cases: [
      { name: 'Internal tools', body: 'The dashboard, approval queue or scheduler your team runs on, built in an afternoon instead of waiting two quarters for engineering time.' },
      { name: 'Marketplaces', body: 'Two-sided products with listings, messaging, payments and reviews, on a real database with real permissions.' },
      { name: 'Mobile-first products', body: 'Ship the web app first, validate it, then export the signed APK and IPA from the same project when the idea holds up.' },
      { name: 'Client work', body: 'Agencies delivering full applications, not prototypes, with version history and a QA pass the client can see.' },
      { name: 'MVPs before the raise', body: 'Working software to show an investor or a first customer, built and deployed before the deck is finished.' },
    ],
    faq: [
      { q: 'What kind of apps can AIWA build?', a: 'Full-stack applications with a database, authentication and real users: internal tools, marketplaces, dashboards, booking and client portals. If it needs accounts and data, it is in scope.' },
      { q: 'Will a later change break what already works?', a: 'That is what AI Architecture and Project Brain™ exist to prevent: every feature is fitted to the codebase that exists rather than regenerated around it, and Autonomous QA drives the whole app in a browser before the change deploys.' },
      { q: 'How does the mobile export work?', a: 'From the same project you export a signed APK for Android or an IPA for iOS, ready for store submission. There is no second codebase and no separate mobile build to keep in sync.' },
      { q: 'Do I get the code?', a: 'Yes. Full source and database schema, exported or synced to GitHub whenever you want. AIWA connects to the providers and services you already pay for using your own keys.' },
      { q: 'What does it cost to build one?', a: `Credits, not seats. A full app costs roughly ${FACTS.appCost} credits, and a free account starts with ${FACTS.welcomeCredits} welcome credits and no card.` },
    ],
    ctaEyebrow: 'Describe it. Ship it.',
    ctaH2: 'Describe it.<br />Ship it.',
    ctaBody: 'One paragraph in. A tested, deployed, full-stack application out.',
    related: [RELATED.saas, RELATED.crm],
  },
];

/* ===========================================================================
   /docs
   ======================================================================== */
export const DOCS = {
  title: 'Docs · AIWA',
  description:
    'How AIWA works: the five agents, Project Brain™, the managed backend, credits, deployment, mobile export and the API. Start here, then open the full reference in the app.',
  eyebrow: 'Documentation',
  h1: 'How AIWA works,<br />in the order you will need it',
  lead:
    'Everything below is written to be read once, in this order, and then used as a reference. The deep reference for each area lives in the app, where it is versioned alongside the product it documents.',
  quickstart: [
    { n: '01', line: 'Open app.aiwa.codes and describe what you want to build', note: 'One paragraph. Who signs in, what it stores, what it does.' },
    { n: '02', line: 'Review the plan the Product Manager agent returns', note: 'Screens, data model, roles and build order, before any code exists.' },
    { n: '03', line: 'Approve, and watch the full stack build in the live preview', note: `Roughly ${FACTS.appCost} credits for a full application. Your ${FACTS.welcomeCredits} welcome credits cover it.` },
    { n: '04', line: 'Deploy to a URL, then export the source or a signed APK', note: 'AIWA handles the pipeline, SSL and CDN. GitHub sync any time.' },
  ],
  sectionsHead: 'The reference, by area',
  sectionsLead: 'Each card is one area of the product. The links go to the versioned reference in the app.',
  sections: [
    {
      kind: 'Concepts',
      name: 'The five agents',
      body: 'Who plans, who architects, who builds, who tests and who keeps working after launch, and which one to talk to when something is wrong.',
      links: [
        { label: 'Agent roles and handoffs', href: 'https://app.aiwa.codes/docs', meta: '8 min' },
        { label: 'Approving and rejecting changes', href: 'https://app.aiwa.codes/docs', meta: '4 min' },
        { label: 'The weekly report', href: 'https://app.aiwa.codes/docs', meta: '3 min' },
      ],
    },
    {
      kind: 'Concepts',
      name: 'Project Brain™',
      body: 'The persistent context that makes change twelve behave like change one: what it stores, when it is consulted, and how to correct it when it has the wrong idea.',
      links: [
        { label: 'What gets remembered', href: 'https://app.aiwa.codes/docs', meta: '6 min' },
        { label: 'Correcting a decision', href: 'https://app.aiwa.codes/docs', meta: '5 min' },
        { label: 'Version history and restore', href: 'https://app.aiwa.codes/docs', meta: '4 min' },
      ],
    },
    {
      kind: 'Platform',
      name: 'The managed backend',
      body: 'Every project gets a Postgres database, auth, row-level security and real-time subscriptions, provisioned without configuration. This is what is actually running.',
      links: [
        { label: 'Database and schema', href: 'https://app.aiwa.codes/docs', meta: '9 min' },
        { label: 'Auth and row-level security', href: 'https://app.aiwa.codes/docs', meta: '7 min' },
        { label: 'Connectors and your own keys', href: 'https://app.aiwa.codes/connectors', meta: '5 min' },
      ],
    },
    {
      kind: 'Platform',
      name: 'Models and credits',
      body: `${FACTS.models}. What each is good at, what a build costs, and how the allowance on each plan is spent.`,
      links: [
        { label: 'Choosing a model per task', href: 'https://app.aiwa.codes/docs', meta: '5 min' },
        { label: 'How credits are counted', href: 'https://app.aiwa.codes/docs', meta: '4 min' },
        { label: 'Plans and allowances', href: '/#pricing', meta: 'pricing' },
      ],
    },
    {
      kind: 'Shipping',
      name: 'Deploy and domains',
      body: 'From live preview to a URL someone else can open: the build pipeline, custom domains, SSL, the CDN, and what a rollback actually does.',
      links: [
        { label: 'One-click deploy', href: 'https://app.aiwa.codes/docs', meta: '4 min' },
        { label: 'Connecting a custom domain', href: 'https://app.aiwa.codes/docs', meta: '6 min' },
        { label: 'Rolling back a deploy', href: 'https://app.aiwa.codes/docs', meta: '3 min' },
      ],
    },
    {
      kind: 'Shipping',
      name: 'Mobile export',
      body: 'Turning the same project into a native app: the signed APK for Android, the IPA for iOS, and what each store wants before it will take one.',
      links: [
        { label: 'Exporting a signed APK', href: 'https://app.aiwa.codes/docs', meta: '7 min' },
        { label: 'iOS export and submission', href: 'https://app.aiwa.codes/docs', meta: '8 min' },
        { label: 'Store review checklist', href: 'https://app.aiwa.codes/docs', meta: '5 min' },
      ],
    },
    {
      kind: 'Own it',
      name: 'Code export and GitHub',
      body: 'Nothing AIWA builds is locked to us. Full source, full schema, in your repository, on your terms.',
      links: [
        { label: 'Exporting the full source', href: 'https://app.aiwa.codes/docs', meta: '4 min' },
        { label: 'GitHub sync', href: 'https://app.aiwa.codes/docs', meta: '5 min' },
        { label: 'Running it yourself', href: 'https://app.aiwa.codes/docs', meta: '9 min' },
      ],
    },
    {
      kind: 'Build on it',
      name: 'API and templates',
      body: 'Starting from something that already works, and driving AIWA from your own tooling.',
      links: [
        { label: 'Template gallery', href: 'https://app.aiwa.codes/templates', meta: 'browse' },
        { label: 'API reference', href: 'https://app.aiwa.codes/docs', meta: 'reference' },
        { label: 'Enterprise and SSO', href: 'https://app.aiwa.codes/enterprise', meta: 'talk to us' },
      ],
    },
  ],
  faq: [
    { q: 'Where is the full API reference?', a: 'In the app, at app.aiwa.codes/docs. It is versioned with the product, which is the only place a reference can live without going stale the week after a release.' },
    { q: 'Do I need to read any of this to start?', a: 'No. The four steps at the top of this page are the whole happy path. Everything else is here for the moment you want to know why something behaved the way it did.' },
    { q: 'Is there a changelog?', a: 'Yes, on the resources page, alongside the guides and the community. Every deploy that changes behaviour is listed there.' },
  ],
  ctaEyebrow: 'Start reading by building',
  ctaH2: 'The fastest way<br />to read the docs',
  ctaBody: 'Describe something small and watch the five agents do it. Ten minutes teaches more than the reference does.',
};

/* ===========================================================================
   /resources
   ======================================================================== */
export const RESOURCES = {
  title: 'Resources · AIWA',
  description:
    'Guides, walkthroughs, templates, the changelog and the AIWA community. Everything around the product that helps you get more out of it.',
  eyebrow: 'Resources',
  h1: 'Everything around the product<br />that helps you use it',
  lead:
    'Getting started guides, worked examples, the templates other people started from, what changed this week, and the people building alongside you.',
  featured: {
    kind: 'Start here',
    name: 'Getting started with AIWA',
    body: 'The path from an empty account to a deployed, tested application, written as one sitting. It is the first thing to read and the only one that is required.',
    href: 'https://app.aiwa.codes/resources/getting-started',
    meta: '15 min read',
  },
  groupsHead: 'By what you are trying to do',
  groups: [
    {
      kind: 'Guides',
      name: 'Learn the workflow',
      body: 'The parts of AIWA that reward being understood once rather than discovered repeatedly.',
      links: [
        { label: 'Writing a first prompt that works', href: 'https://app.aiwa.codes/resources/getting-started', meta: 'guide' },
        { label: 'Reading and correcting the plan', href: 'https://app.aiwa.codes/resources/getting-started', meta: 'guide' },
        { label: 'Working with Project Brain™', href: 'https://app.aiwa.codes/docs', meta: 'guide' },
        { label: 'Approving agent changes', href: 'https://app.aiwa.codes/docs', meta: 'guide' },
      ],
    },
    {
      kind: 'Walkthroughs',
      name: 'Build something specific',
      body: 'Whole projects, start to deploy, with the prompts that produced them.',
      links: [
        { label: 'A client portal with billing', href: '/ai-saas-builder', meta: 'SaaS' },
        { label: 'A CRM around your pipeline', href: '/ai-crm-builder', meta: 'CRM' },
        { label: 'A marketing site that ranks', href: '/ai-website-builder', meta: 'Website' },
        { label: 'A web app, then an APK', href: '/ai-app-builder', meta: 'App' },
      ],
    },
    {
      kind: 'Templates',
      name: 'Start from something working',
      body: 'Projects you can open, read and change, rather than a blank prompt box.',
      links: [
        { label: 'Browse the template gallery', href: 'https://app.aiwa.codes/templates', meta: 'gallery' },
        { label: 'Invoice and billing dashboard', href: 'https://app.aiwa.codes/templates', meta: 'template' },
        { label: 'Events and RSVP', href: 'https://app.aiwa.codes/templates', meta: 'template' },
        { label: 'Connectors and integrations', href: 'https://app.aiwa.codes/connectors', meta: 'reference' },
      ],
    },
    {
      kind: 'Product',
      name: 'Keep up with changes',
      body: 'What shipped, what it changes for you, and what is coming.',
      links: [
        { label: 'Changelog', href: 'https://app.aiwa.codes/docs', meta: 'weekly' },
        { label: 'Model availability', href: 'https://app.aiwa.codes/docs', meta: 'status' },
        { label: 'Plans and pricing', href: '/#pricing', meta: 'pricing' },
        { label: 'Enterprise and SSO', href: 'https://app.aiwa.codes/enterprise', meta: 'sales' },
      ],
    },
    {
      kind: 'Community',
      name: 'Build alongside other people',
      body: `The ${FACTS.builders} builders shipping on AIWA, and the fastest way to get an answer from one of them.`,
      links: [
        { label: 'Join the community', href: 'https://chat.whatsapp.com/KL6AucmDI7v8gjuKjhW58e', meta: 'WhatsApp' },
        { label: 'AIWA on X', href: 'https://x.com/aiwadotcodes', meta: 'X' },
        { label: 'AIWA on LinkedIn', href: 'https://www.linkedin.com/company/aiwacodes/', meta: 'LinkedIn' },
        { label: 'Email the team', href: 'mailto:hello@aiwa.codes', meta: 'inbox' },
      ],
    },
    {
      kind: 'Reference',
      name: 'The documentation',
      body: 'When a guide has told you what to do and you want to know exactly how the thing behaves.',
      links: [
        { label: 'Docs overview', href: '/docs', meta: 'on this site' },
        { label: 'Full reference in the app', href: 'https://app.aiwa.codes/docs', meta: 'versioned' },
        { label: 'Legal and policies', href: '/legal', meta: 'on this site' },
      ],
    },
  ],
  ctaEyebrow: 'Nothing beats building one',
  ctaH2: 'Read one guide.<br />Then build the thing.',
  ctaBody: `A free account opens with ${FACTS.welcomeCredits} credits, which is a real application rather than a demo.`,
};

/* ===========================================================================
   /features

   A catalog of what the product actually does, written from docs.aiwa.codes
   and the home page engine, not from a competitor's feature list. Base44's
   /features is the shape (hero, jump nav, long catalog, close), AIWA is the
   content: a product team with modes, memory, a managed backend, connectors
   you bring keys for, and a path to a live URL or a signed mobile build.
   ======================================================================== */
export const FEATURES = {
  title: 'Features · AIWA, the AI product team and the platform it runs on',
  description:
    'Plan, build, test, deploy and evolve full-stack apps with AIWA. Neon Postgres, auth, connectors, custom domains, version restore and mobile export, in one workspace.',
  eyebrow: 'Features',
  h1: 'Everything your AI product team<br />can actually do',
  lead:
    'Describe the product. AIWA plans it, builds the interface and the backend, tests it in a real browser, and publishes it to a live URL. Then it keeps working on the app that already exists.',
  ctaLabel: 'Start Building',
  note: 'Free to start · no credit card required',
  meta: [
    { label: 'Workflow', value: 'Plan to evolve', note: 'six stages, one workspace' },
    { label: 'Modes', value: 'Four', note: 'Build · Plan · Explore · Debug' },
    { label: 'Database', value: 'Neon Postgres', note: 'provisioned per project' },
    { label: 'Builders shipping', value: FACTS.builders, note: 'founders and agencies' },
  ],
  jump: [
    { href: '#workflow', label: 'Workflow' },
    { href: '#modes', label: 'Modes' },
    { href: '#memory', label: 'Memory' },
    { href: '#backend', label: 'Backend' },
    { href: '#connectors', label: 'Connect' },
    { href: '#ship', label: 'Ship' },
  ],
  spots: [
    {
      id: 'workflow',
      n: '01',
      eyebrow: 'The agentic workflow',
      title: 'Plans before it builds, then keeps going',
      body: 'A chat box that dumps files is not a product team. AIWA works the way a real one does: scope the brief, design the solution, write the stack, drive the app in a browser, publish it, and come back to the same codebase tomorrow.',
      points: [
        'Turns a sentence into a scoped brief, with entities named before files',
        'Schema, routes and state decided up front, not discovered mid-build',
        'Full stack: UI, API, database, auth and jobs, streaming to a live preview',
        'Tests the flows a user would click, then publishes only what passed',
      ],
      img: '/images/visuals/plans-before-it-builds.webp',
      alt: 'AIWA planning a product before it writes code',
    },
    {
      id: 'memory',
      n: '02',
      eyebrow: 'Project Brain™',
      title: 'Change twelve behaves like change one',
      body: 'AIWA keeps a persistent record of the product: pages, data, design decisions and the reasons they were made. A prompt in month six is fitted to the app that exists, rather than regenerated around it.',
      points: [
        'New features land on the architecture you already approved',
        'Correct a decision once and later work respects the correction',
        'Version history on every build, with restore when a change goes wrong',
        'Explore the codebase in conversation before you ask it to move',
      ],
      img: '/images/visuals/reasons-through-architecture.webp',
      alt: 'AIWA reasoning through application architecture',
      flip: true,
    },
    {
      id: 'backend',
      n: '03',
      eyebrow: 'Managed backend',
      title: 'A working app, not a painted prototype',
      body: 'If the product needs users, records and rules, AIWA provisions them with the interface. Each project can get Neon Postgres, Google or email sign-in, row-level access, and the APIs the screens actually call. You describe what people should be able to do.',
      points: [
        'Postgres per project, schema described in plain language instead of SQL',
        'Google and email/password auth, with protected areas and roles',
        'Server-side logic for the actions that must not live only in the browser',
        'Infrastructure only where the product needs it. A portfolio can stay a site',
      ],
      img: '/images/visuals/designs-the-database.webp',
      alt: 'AIWA designing a Postgres schema from a product description',
    },
  ],
  modesHead: 'Four modes, because building is not one kind of thinking',
  modesLead: 'Mode tells AIWA how to approach the request. You can switch at any time. There is no penalty for changing your mind.',
  modes: [
    { name: 'Build', body: 'Create or change something. Pages, features, design, connectors, behavior. The mode you will live in once you know what you want.' },
    { name: 'Plan', body: 'Think before it writes. Requirements, flows, data, permissions and the risks, as a spec you can approve or send back.' },
    { name: 'Explore', body: 'Understand the product without moving it. How auth works today, what a team workspace would take, where onboarding stalls.' },
    { name: 'Debug', body: 'Find the cause, then fix it. Runtime errors, failed requests, auth loops, integration faults, with the reproduction you can give it.' },
  ],
  intelligenceHead: 'AIWA Min and AIWA Max',
  intelligenceLead: 'Min for execution. Max for complexity. Match intelligence to the size of the problem so credits go where reasoning actually pays.',
  intelligence: {
    columns: ['AIWA Min', 'AIWA Max'],
    rows: [
      ['Best for', 'Focused changes', 'Architecture and hard problems'],
      ['Speed', 'Faster', 'More deliberate'],
      ['Credit use', 'Lower', 'Higher'],
      ['Copy, layout, simple forms', true, 'Usually unnecessary'],
      ['Multi-tenant workspaces, roles, billing', 'Possible', true],
      ['Difficult debugging', 'Good', 'Recommended'],
      ['Plan Mode on a large feature', 'Possible', true],
    ],
  },
  connectorsHead: 'Connectors, with your keys',
  connectorsLead: 'Payments, email, SMS, media, calendars and the model behind an in-app assistant. You connect the account. AIWA writes the code that uses it, live in the preview and on the published URL.',
  connectorsNote: 'Secrets stay in the connector. They are not baked into the generated frontend.',
  connectors: [
    { name: 'Stripe', body: 'Checkout, subscriptions, upgrades, downgrades, gated features from real plan state.' },
    { name: 'Resend', body: 'Welcome, booking, order, invitation and status mail from your own sending domain.' },
    { name: 'Twilio', body: 'SMS confirmations, reminders and alerts fired by events inside the app.' },
    { name: 'Cloudinary', body: 'Upload, transform and deliver images and other media the product stores.' },
    { name: 'OpenAI', body: 'Assistants, generation, summarization, classification and extraction in the app you ship.' },
    { name: 'Anthropic', body: 'Claude for document analysis, extraction, drafting and heavier reasoning features.' },
    { name: 'Google Gemini', body: 'Assistants, generation, extraction and multimodal features on Gemini.' },
    { name: 'xAI Grok', body: 'Generation, extraction and analysis with Grok inside the same connector model.' },
    { name: 'Calendly', body: 'Demo, consultation and onboarding scheduling in the customer workflow.' },
    { name: 'Google Calendar', body: 'Create, update and cancel events from bookings, appointments and CRM activity.' },
    { name: 'Google Meet', body: 'Meeting links for bookings, demos, consultations and virtual appointments.' },
    { name: 'Google Drive', body: 'Bring project files and shared resources into the workflows the app runs.' },
  ],
  shipHead: 'From live preview to a URL, a domain, or a store listing',
  shipLead: 'The same project can be a preview, a production URL, a custom domain, or an Android and iOS export. You do not start over to leave the browser.',
  ship: [
    {
      name: 'Live preview',
      body: 'Watch the app run while it is being built. Auth, data and connectors execute against the real stack, not a drawing of one.',
      img: '/images/app-live-preview.webp',
      alt: 'AIWA workspace showing a live app preview',
    },
    {
      name: 'Publish and domains',
      body: 'One-click deploy to an AIWA URL. Supported plans connect a custom domain. SSL and the CDN are handled. Roll back a release that misbehaves.',
      img: '/images/app-releases.webp',
      alt: 'AIWA releases and publish surface',
    },
    {
      name: 'Mobile export',
      body: 'Run a mobile readiness scan, then export a signed APK for Android or the iOS build files. You submit with your own store accounts.',
      img: '/images/app-store-ready.webp',
      alt: 'AIWA mobile export ready for the app stores',
    },
  ],
  catalogHead: 'Also in the workspace',
  catalog: [
    { name: 'Version history', body: 'Every build is kept. Restore a working version when a change fails, including when repeated repairs do not land.' },
    { name: 'Production and development', body: 'Test authentication, payments and connectors on a preview before customers see the production URL.' },
    { name: 'Templates', body: 'Start from a finished full-stack app. Preview it live, remix it, and change anything in plain language.' },
    { name: 'Code export and GitHub', body: 'Download the project or sync a repo. Nothing AIWA builds is locked to the workspace you started in.' },
    { name: 'Team invites', body: 'Add editors and viewers to a project without sharing your password. Agency seats are on the plans that include them.' },
    { name: 'Client review', body: 'Share a preview for comment and sign-off. Feedback sits on the build, not in a parallel email thread.' },
    { name: 'Public share and remix', body: 'A public link so someone else can open the app, or remix it into their own workspace and keep going.' },
    { name: 'White label', body: 'Agencies can run the builder under their own brand: domain, logo, prices, their Stripe. From the white-label plan.' },
    { name: 'Multi-model building', body: `${FACTS.models}. Pick the model for the job. Switch when the task changes.` },
    { name: 'Request a connector', body: 'Need a service that is not in the catalog yet? Describe the actions and auth. The team takes requests.' },
    { name: 'Existing projects', body: 'Keep iterating an AIWA app, or bring outside code in without rebuilding the parts that already work.' },
    { name: 'Enterprise', body: 'Volume credits, contracts, onboarding and SSO. Talk to the team if the work is bigger than a single seat.' },
  ],
  faq: [
    { q: 'Is this a chat that writes a frontend?', a: 'No. AIWA is a product team in a workspace: Plan, Build, Explore and Debug, against a real Postgres database, auth, APIs and connectors. The preview is the running app.' },
    { q: 'Do I need my own API keys?', a: 'Only for connectors that call a service you already pay for: Stripe, Resend, Twilio, Cloudinary, model providers, calendars. The database, auth and hosting for an AIWA URL are provisioned with the project.' },
    { q: 'What is the difference between Min and Max?', a: 'Min is for focused execution: copy, layout, a simple form. Max is for work that spans systems: multi-tenant workspaces, billing, thorny debugging. Using Max on a headline wastes credits. Using Min on an architecture change usually under-thinks it.' },
    { q: 'Can I take the code with me?', a: 'Yes. Export the source or sync GitHub. Custom domains, mobile exports and a restore history stay available while the project lives on AIWA.' },
    { q: 'Does it keep working after the first publish?', a: 'That is the point of Project Brain™ and the Evolve stage. You add features to the app that exists. Version restore is there when a change should not have shipped.' },
  ],
  related: [RELATED.website, RELATED.saas, RELATED.crm, RELATED.app],
  ctaEyebrow: 'One conversation away',
  ctaH2: 'Describe the product.<br />Watch the team build it.',
  ctaBody: 'Open a free account and start in the workspace. The catalog above is what is already there.',
};
