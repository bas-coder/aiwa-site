# AIWA White-Label: lander and page creative handoff

Prepared 11 September 2026 for the product lead, designers, copywriters, and implementation agents.

**The idea:** Give agencies, creators, and software entrepreneurs their own branded AI product-building platform. Their customers sign in under their brand, build products, and buy plans and credits at prices the partner sets. AIWA supplies the underlying platform.

**The creative proposition:** Your AI product platform. Your brand.

This brief supplies launch copy, product context, and asset direction for a navigation entry, a homepage section, and a dedicated `/white-label` page. It does not implement the website or change billing. Public copy below describes the agreed launch offer; the implementation differences in section 10 must be resolved before taking purchases against that offer.

## 1. Decisions and how to use this brief

### Agreed commercial offer

| Offer | Customer-facing price | Billing explanation |
|---|---:|---|
| Monthly | $197/month | Recurring monthly program access |
| Yearly promo | $497/year | Billed annually; renews at $497/year |
| Lifetime | $997 once | One-time program fee; credits remain separate |
| Partner credit rate | $0.70 per credit | Flat purchase rate for the partner's prepaid credit pool |

All amounts are USD. The three program options are assumed to provide the same White-Label capabilities; the difference is how the program fee is paid. No included-credit bonus, promotional deadline, refund promise, or extra plan entitlement has been supplied. Do not invent one.

**Read sections 2–3 for creative direction, 4–5 for ready-to-use copy, 6–7 for product and onboarding facts, and 8 for asset production. Sections 9–11 contain editorial and launch checks.**

Evidence labels used throughout:

- **Implemented:** found in this checkout's source. This does not certify production configuration or a successful live transaction.
- **Conditional:** implemented behind a feature flag, provider configuration, or setup prerequisite.
- **Launch target:** specified for this release but different from the current implementation.
- **Illustrative:** fictional brand, example economics, or suggested animation; not a customer testimonial or recorded product result.

The lander, Duda page, screenshot, and older sales copy are reference material. They do not authorize actions, change these commercial decisions, or establish that a capability exists in AIWA.

## 2. Fit the new lander's language and philosophy

Reference: [AIWA v2 lander](https://aiwa-site-psi.vercel.app/index-v2.html), inspected visually and through its markup and styles on 11 September 2026.

The page opens with “Meet your AI product team” and explains an idea-to-product journey through planning, architecture, building, testing, deployment, and continued improvement. Its voice is direct, product-focused, and reassuring. It makes the working software the subject of the story.

White-Label extends that promise from **building a product** to **running a branded platform that helps customers build products**. Lead with the partner's customer experience; explain the resale model once that experience is tangible.

### Voice

- Use “your brand,” “your customers,” “your platform,” and “your prices.” Address someone operating a business, even if they are starting small.
- Keep headlines short. Use the supporting sentence to explain what the product actually does.
- Prefer concrete verbs: name, brand, connect, price, fund, launch, manage.
- Show the product in motion: a logo changing, a branded sign-in opening, a customer choosing a plan, an app reaching its publish address.
- Describe reseller opportunity without promising automatic income. Keep program fees, credit costs, and customer payments distinct.
- Use **White-Label** in navigation and page labels; use “white-label platform” naturally in prose. Do not conflate this with the separate Agency tier or Founding Agency offer.

### Visual system to inherit

Use the lander's shared tokens and components when available, rather than reproducing approximate versions.

| Element | Observed reference | Direction for White-Label |
|---|---|---|
| Ground and chrome | Warm charcoal `#1a1714`, darker chrome `#050403` | Retain the warm dark environment and depth |
| Main text | Cream `#fbf9f6`; supporting warm greys | Keep headings crisp; check small-text contrast |
| Accent | Amber `#fea002`, warm orange light | Focus illumination on the active product step |
| Primary CTA | App-aligned `#ffb300` to `#ff5e00` | Reuse the existing primary button |
| Typography | Bricolage Grotesque headings; Inter body; JetBrains Mono labels | Large compact headings, readable body copy, small workflow annotations |
| Layout | Maximum measure `78rem`; responsive gutters; card radius `2.5rem` | Match section rhythm and rounded product frames |
| Motion | Brand easing `cubic-bezier(0.625, 0.05, 0, 1)`; 350–500ms interaction/entrance tokens; 800ms reveals | Reuse established motion tokens for comparable actions |
| Storytelling | Staged workspace and lifecycle demonstrations | Let the viewer follow one transformation at a time |

Sources: [tokens.css](https://aiwa-site-psi.vercel.app/css/tokens.css), [base.css](https://aiwa-site-psi.vercel.app/css/base.css), and [site.css](https://aiwa-site-psi.vercel.app/css/site.css). The reference uses GSAP/ScrollTrigger, SplitText, and Lenis; a new animation stack is not required by this brief.

The marketing page keeps AIWA's amber identity. Inside the demo frames, the fictional partner's palette takes over. That change makes the White-Label capability visible without changing the entire marketing site into the example brand.

## 3. What to learn from Duda

Reference: [Duda White Label Website Builder](https://www.duda.co/website-builder/white-label), inspected 11 September 2026. The supplied screenshot separately shows Duda's product navigation with domain, branding, workspace, and invitation entries beside a visual preview.

Borrow the communication pattern: make brand ownership concrete by showing the customer touchpoints. A branded sign-in, builder, dashboard, and email convey more than a generic reseller badge. Pair each benefit with a recognisable interface and a short explanation. Use the screenshot's compact feature-plus-preview composition as inspiration for the homepage section or page feature explorer.

For AIWA, demonstrate platform identity, the two domain roles, customer pricing, credit funding, and the operating console. Preserve AIWA's dark, warm visual language. Duda's workspace controls, support resources, permissions, and commercial terms are not evidence that AIWA has equivalent features. Do not transplant their claims, screenshots, testimonials, or pricing.

## 4. Navigation and homepage section

### Navigation handoff

| Surface | Label | Destination | Behaviour |
|---|---|---|---|
| Desktop navigation | White-Label | `/white-label` | Place after Features; use the current nav styling |
| Mobile navigation | White-Label | `/white-label` | Same prominence as other primary links; close menu after navigation |
| Footer, Pages group | White-Label | `/white-label` | Persistent discovery link |
| Homepage section CTA | Explore White-Label | `/white-label` | Navigate to the dedicated page |

A direct link is the default. The supplied Duda menu is creative inspiration, not a requirement to introduce a mega-menu.

### Placement

Insert the section after the existing QA section and before AIWA's core pricing section. The reader has seen the product work; this section introduces another way to offer it. Give it its own White-Label eyebrow and clear program wording so the following Solo/Agency pricing is not mistaken for reseller pricing.

### Ready-to-use homepage copy

**Eyebrow:** AIWA WHITE-LABEL

**Headline:** Your AI product platform. Your brand.

**Body:** Give your customers an AI product team under your own name. Brand the platform, connect your domains, and set what your customers pay for plans and credits. AIWA powers the technology. You build the customer relationship.

**Feature captions:**

- **Make it yours.** Your name, logo, and colours across the platform experience.
- **Put it on your domains.** One address for building. Another for the apps your customers publish.
- **Set your prices.** Sell plans and credit top-ups through your connected Stripe account.

**CTA:** Explore White-Label

**Optional commercial caption:** Monthly, yearly, or lifetime access. Credits purchased separately at $0.70 each.

**Visual:** A compact brand editor beside a product preview. Change a neutral sample identity to **Northstar Studio**, then reveal its sign-in, home screen, and customer pricing. Northstar Studio is a fictional demonstration brand, not a customer or endorsed business.

## 5. Dedicated `/white-label` page: drafted copy

### A. Hero — the platform under their brand

**Eyebrow:** AIWA WHITE-LABEL

**H1:** Your AI product platform. Your brand.

**Subheadline:** Launch a branded platform where your customers turn ideas into working software. Bring your name, logo, domains, and prices. Give them AIWA's product-building capabilities through an experience that feels like yours.

**Primary CTA:** Launch your platform → `#wl-pricing`

**Secondary CTA:** See how setup works → `#wl-setup`

**Supporting line:** Choose monthly, yearly, or lifetime program access. Credits are purchased separately at $0.70 each.

**Visual:** Brand transformation storyboard in section 8. The initial hero should make sense before the animation plays.

### B. Branded customer experience

**Heading:** Give every customer a place that feels like yours.

**Body:** From the first sign-in to the next product they build, your identity leads the experience. Bring your brand into the platform and give customers a clear path from joining to creating.

| Card | Draft copy | What to show |
|---|---|---|
| Your identity | Add your name, logo, and colours. Preview the experience as you make it yours. | Logo and palette changing in the setup preview |
| Your platform address | Let customers sign in and build on your platform domain. | `app.northstar.example` in a browser frame |
| Their published apps, your domain | Set a separate apps domain for the products your customers publish. | `launch.northstar-apps.example` as an illustrative app address |
| Your customer communication | Connect your own email sender and link your documentation to carry your brand beyond the workspace. | Branded email and a Help link, with “Sender configured” annotation |

Use `.example` addresses in fictional assets. They are illustrations, not DNS instructions or live services. Email setup conditions are explained in the FAQ.

### C. Product capabilities

**Heading:** Give your customers a team to build with.

**Body:** Help them move from an idea to a working product, then keep improving it. The platform brings planning, building, testing, and publishing into a connected workflow.

**Capability captions:**

- **Plan the product.** Turn an idea into a clearer brief and a practical next step.
- **Build the experience.** Create interfaces and the application systems behind them.
- **Test and improve.** Work through changes and keep refining the product.
- **Publish and continue.** Put the product online and return to the workspace for its next version.

**Operator bridge:** And when customers arrive, you have a console for the business around their builds: customers, projects, prices, and the credit pool that funds their usage.

**Editorial note:** Show capabilities supported by the current product and the customer's entitlement. Do not turn this lifecycle into a guarantee of flawless output, a fixed build time, or every feature on every customer plan. Treat the lander's existing product claims as positioning references to validate, not proof by repetition.

### D. Guided setup

Section ID: `wl-setup`.

**Heading:** Build your brand into the platform.

**Body:** Start with a guided studio. See your identity take shape in a live preview, connect the services your business uses, and track what is ready as you work towards launch.

1. **Choose your program.** Pick monthly, yearly, or lifetime access and complete checkout.
2. **Make it yours.** Add your name and logo, choose your colours, and preview the customer experience.
3. **Set up how you sell.** Connect Stripe and choose the customer prices for your plans and credit top-ups.
4. **Connect your domains.** Set the address where customers build and the separate domain where their published apps live.
5. **Fund the first builds.** Purchase credits for your pool, then allocate them through customer plans, top-ups, or supported manual grants.
6. **Complete the experience.** Connect your sender, link your docs, and use the console to manage the platform as customers join.

**Supporting line:** Setup tracks your progress. Domain activation and payment readiness depend on completing the relevant provider checks.

**Visual:** A truthful condensed version of the actual studio, detailed in section 7. These six editorial steps are not six required checkboxes in the product.

### E. Resale economics

**Heading:** You set the price. Your customers pay you.

**Body:** Buy credits from AIWA at a flat $0.70 each. Package them into your customer offers and set your resale prices within the platform's supported pricing limits. Customer payments go through your connected Stripe account.

**Example card title:** A simple resale example

| Item | Illustrative amount |
|---|---:|
| Credits included in your customer offer | 200 |
| Your credit cost: 200 × $0.70 | $140 |
| Price you charge the customer | $200 |
| Difference before other expenses | $60 |

**Caption:** Illustrative pricing, not a preset plan or earnings guarantee. The $60 difference is before your program fee, payment fees, refunds, taxes, support, and other expenses. Actual results depend on your offer and costs.

**Supporting copy:** Your credit pool funds customer allocations. Keep it funded so purchases and renewals can receive their credits. Any supported free credit allowance is funded by you too.

**Internal note:** This is a 200-credit customer allowance illustration, not permission to buy a 200-credit wholesale pool block. The current pool minimum and launch decision are covered in section 10. A revenue animation must keep the full $200 customer payment separate from the $60 difference; it must not label $60 as a payout or net profit.

### F. Program pricing

Section ID: `wl-pricing`.

**Heading:** Choose how you start.

**Intro:** The same White-Label platform, with three ways to pay for program access. Credits are separate at $0.70 each.

| Card | Price and suffix | Supporting copy | CTA | Label |
|---|---|---|---|---|
| Monthly | $197 / month | Start with monthly billing for your White-Label platform. | Start monthly | No badge |
| Yearly | $497 / year | Get the yearly promo. Billed $497 annually and renews at $497/year. | Get yearly access | Yearly promo |
| Lifetime | $997 once | Pay the program fee once. Keep buying credits as your platform grows. | Get lifetime access | One-time program fee |

**Shared inclusions:** Brand customisation; platform and published-apps domain setup; partner console; customer pricing and connected Stripe billing; prepaid credit pool management; own-sender and documentation configuration.

**Pricing footnote:** All prices in USD. Program access does not include a credit allowance. Lifetime applies to the program fee; credits and your external service costs remain separate.

Give the yearly promotion visual emphasis with a restrained amber border. Keep all three offers visible; no fabricated scarcity, countdown, crossed-out price, “most popular” claim, or default paid selection.

**Purchase routing handoff:** Use the app's authenticated `/partner` purchase funnel. Monthly and lifetime currently use `https://app.aiwa.codes/partner?checkout=monthly` and `https://app.aiwa.codes/partner?checkout=lifetime`. The intended yearly route is `https://app.aiwa.codes/partner?checkout=annual`, but it is a **launch target**, not a working current offer. Engineering must support and verify it before the yearly CTA goes live. Verify all three end-to-end against the published prices. Preserve offer intent across login; do not link a marketing-domain `/partner` unless that host actually serves or redirects the application route.

### G. FAQ — ready-to-use answers

**What is AIWA White-Label?**

It lets you offer a branded AI product-building platform to your own customers. You configure its identity, connect your domains, and choose customer pricing. AIWA provides the underlying platform.

**Who is it for?**

Agencies, creators, consultants, and software entrepreneurs who want to offer customers a place to build products under their brand. You can combine platform access with services such as onboarding, training, or implementation that you choose to provide.

**How is this different from an Agency plan?**

White-Label is the program for operating a branded platform and selling access to your customers. Solo and Agency are product entitlement families. A White-Label program fee is separate from the customer plans and credits you sell.

**What can I customise?**

Your platform name, logo, colours, support contact, documentation link, platform domain, and published-apps domain. You can also configure customer pricing and connect your own email sender. The guided studio previews your brand on loading, sign-in, and home screens.

**Why are there two domains?**

Your platform domain is where customers sign in and build. Your apps domain is where their published products receive addresses. They serve different purposes and have separate setup steps.

**How do credits and resale work?**

Credits fund AI usage. You buy them at $0.70 each for your pool and set customer prices for supported plans and top-ups. Allocating customer credits draws from your pool. The amount left after credit cost must also cover your program fee and other business expenses.

**Are credits included in the program price?**

No credit allowance is included in these offers. Credits are purchased separately, including credits for your own building activity under the White-Label program.

**What does lifetime cover?**

The $997 payment covers the White-Label program fee as a one-time purchase. It does not provide unlimited credits, transfer ownership of AIWA's platform software, or pay for services you obtain from other providers.

**Does the yearly promo renew at the same price?**

Yes. The yearly offer is billed at $497 per year and renews at $497 per year.

**Who collects payments from my customers?**

Customer plan and top-up payments are processed through your connected Stripe account. You separately pay AIWA for your program and credit pool. Stripe connection and payment enablement are required before accepting those customer payments.

**Will my customers see AIWA branding?**

The platform supports your name, logo, colours, and domains across the customer experience. Email needs additional care: connect and verify your own sender for customer messages. Without that setup, messages can carry your brand while using an AIWA sender address, and delivery fallback may also use that address. Password-reset emails require separate authentication-provider sender configuration. White-Label does not promise that the underlying technology is impossible to identify.

**Can I give customers free credits?**

Supported manual allocations draw from your prepaid pool. Where configurable free offers are enabled, their credit allowances are partner-funded as well. AIWA's own free-plan credits are not automatically included for your customers.

**What happens if my pool runs low?**

The console shows funding information. Customer credit allocations that the pool cannot cover can wait for funding; replenishing the pool allows pending allocations to be processed. Keep sufficient credits available for purchases and renewals.

**How quickly can I launch?**

The studio guides you through setup and shows your progress. Timing depends on your branding assets, domain configuration, provider verification, payment readiness, and credit funding. There is no fixed launch-time guarantee.

**Where can I ask a question before buying?**

Email [hello@aiwa.codes](mailto:hello@aiwa.codes).

Do not add cancellation, refund, or post-cancellation access promises until their release terms are confirmed. Link the site's existing legal pages in the shared footer.

### H. Final CTA and search metadata

**Heading:** Put your name on what comes next.

**Body:** Give your customers a branded place to turn ideas into products. Choose your program and start shaping the platform around your business.

**CTA:** Launch your platform → `#wl-pricing`

**Support link:** Questions before you start? → `mailto:hello@aiwa.codes`

**Title:** AIWA White-Label | Your AI Platform, Your Brand

**Meta description:** Launch your own branded AI product-building platform with AIWA White-Label. Set your prices, connect your domains, and sell credits to your customers.

Use one H1. Make `/white-label` the marketing page's canonical path on the production marketing origin. Coordinate the existing application-host sales page's canonical or redirect during deployment to avoid two competing sales pages; retain authenticated `/partner` as the application funnel.

## 6. Feature matrix: benefits, evidence, and availability

The references below are repository-relative for portability. See the linked source appendix for the files. These findings describe the reviewed checkout, not a production audit.

| Capability | Partner/customer benefit | Evidence | Availability and boundary |
|---|---|---|---|
| Platform identity | A recognisable branded experience | S1, S2, S3 | Implemented: name, logo, three colour roles, support contact, attribution preference, and docs URL. Not arbitrary workspace layout, menu, toolbar, or typography editing |
| Live brand preview | See changes before saving | S1, S2 | Implemented: loading, sign-in, and home; desktop/mobile preview. Sign-in and home are styled preview representations, not interactive embedded production sessions |
| AI-assisted brand tools | Help develop a logo or palette | S2, S4 | Conditional: generate/adapt logo and palette help depend on deployment capabilities. Manual branding remains the baseline |
| Platform domain | Customers access the builder through the partner | S3, S5 | Implemented; DNS, domain activation, and auth setup must succeed |
| Published-apps domain | Customer products publish under the partner's domain | S5, S6 | Implemented as a distinct setup. Do not imply existing published apps are automatically migrated |
| Customer Stripe billing | Customer charges go through the partner's connected account | S7 | Implemented; Stripe connection and charges enablement required. Do not promise every country, payment method, or fee-free processing |
| Customer plan and top-up pricing | Partner controls commercial packaging within supported limits | S8, S9 | Implemented baseline pricing. Flexible offer names/allowances and free offers are conditional on `WL_FLEXIBLE_PRICING=1` and rollout readiness |
| Credit pool and ledger | Prepay and track customer credit allocations | S10 | Implemented; insufficient funds can queue allocations. $0.70 is the launch target rate, not this checkout's current rate |
| Customer administration | Manage customers and their access | S11 | Implemented: create/search users, inspect account/plan/credits/projects, supported plan and credit adjustments, password-reset initiation, and account deactivation. Stripe-managed plans have their own lifecycle constraints |
| Project administration | See customer projects and intervene operationally | S12 | Implemented project listing, live links, and suspension/resumption controls. This does not establish general impersonation or arbitrary editing rights |
| Partner console | Operate the service from one place | S10, S11, S12 | Implemented overview, users, projects, credits, pricing, branding, domain, and billing areas |
| Own email sender | Brand customer communications beyond the UI | S13 | Conditional: partner Resend account and verified sender. Platform fallback exists; auth password resets need separate configuration |
| Documentation link | Send customers to the partner's help content | S2, S3 | Implemented link configuration; blank hides docs affordances. AIWA does not thereby supply a branded knowledge base, video library, or support team |
| Partner's own workspace | Build alongside operating the platform | S14 | Implemented Agency-level capability grant with zero included credits. Existing independently paid/AppSumo workspaces may require reconciliation |
| Customer building workflow | Customers use the underlying product under the partner brand | S6, S15, S16 | Existing product capabilities remain subject to customer entitlements and release verification. Do not describe WL access as source-code ownership of AIWA itself |

## 7. The rich onboarding experience: accurate production guidance

The product contains a setup studio with a step rail, one active editor, and a persistent preview. On narrower layouts the areas stack; the smallest layout offers Setup/Preview switching. Brand edits stay in the preview until saved. Completion rewards use the partner's colours. Returning partners can revisit setup from the console.

### Actual rail and dependencies

| Rail step | What the partner does | Required by current completion gate? | Visual/proof point |
|---|---|---|---|
| Make it yours | Set name/logo/colours and save | Yes | Live preview changes; saved state distinguishes draft from applied brand |
| Program | View confirmed program payment | Yes | Paid monthly/lifetime state today; yearly needs implementation |
| Connect your Stripe | Connect the account for customer payments | No | Payment readiness after provider confirmation |
| Set your prices | Configure supported plans/top-ups | No | Customer pricing preview and cost context |
| Point your platform domain | Configure where customers sign in/build | Yes | Domain pending/active status |
| Point your apps domain | Configure where customer apps publish | Yes | Separate domain status and example published address |
| Fund your credit pool | Purchase wholesale credits | Yes | Confirmed pool balance |
| Connect your email | Configure Resend sender | No | Sender validation/test result |
| Add your docs | Set partner documentation URL | No | Customer help link points to partner content |

There are **five required completion items**, including the already-paid program. The actual rail order is branding, program, Stripe, pricing, platform domain, apps domain, pool, email, docs. Purchase precedes entry into the paid setup flow.

**“Optional in the completion gate” does not mean “unnecessary for a ready-to-sell platform.”** Stripe and valid prices are needed for customer purchases. An own sender is needed to present the partner's email address on the relevant messages. Docs are useful only when the partner has a destination to link.

For the marketing animation, condense this into the six editorial stages in section 5D while retaining the separate domain roles. Show the preview on loading/sign-in/home; use separate illustrative scenes for pricing, build, and publish rather than pretending those are additional studio preview tabs.

**Suggested milestone captions:** “Your brand is saved.” → “Your platform address is active.” → “Your apps domain is active.” → “Your credit pool is funded.” → “Open your console.” Captions are proposed marketing text, not exact transcriptions of every toast.

Include pending states when explaining setup. DNS activation, sender verification, and Stripe readiness must not appear to be guaranteed by a single decorative click. Do not animate a purchase confirmation before the corresponding successful payment event.

## 8. Asset production briefs

Create reusable scenes with editable text and a clean static poster for each. Timings below are creative suggestions; they are not measurements of real setup or build time. Use fictional data throughout, with no real customer emails, balances, keys, or transaction identifiers.

### Asset 1 — Brand transformation

**Placement/purpose:** Homepage section and page hero; explain what “your brand” means immediately.

**Suggested sequence, 8–12 seconds:**

1. Show a neutral sample sign-in beside a compact name/logo/colour editor.
2. Enter “Northstar Studio”; introduce its fictional logo and a coherent partner palette.
3. Repaint the preview's identity, key controls, and glow. Display “Preview your brand.”
4. Show “Save brand,” then a saved state. Advance through Loading → Sign in → Home.
5. Hold on the finished frame with the caption “Your platform. Your brand.”

**Truth constraint:** Colour changes preview immediately; publication follows save. AI logo generation is an optional cut only if enabled for launch. The marketing page itself retains AIWA's branding.

**Mobile:** Stack editor above preview, reduce fields to the current action, retain readable labels. **Reduced motion:** Finished sign-in poster plus static name/logo/palette callouts. **Alt text:** “Example platform branded as Northstar Studio with its own name, logo, and colours.”

### Asset 2 — Guided setup studio

**Placement/purpose:** Setup section; show that configuration has structure and feedback.

**Suggested sequence, 15–20 seconds:**

1. Begin after program payment with the brand editor and progress rail.
2. Show brand saved and a small celebration using the partner palette.
3. Move through Stripe and pricing with concise readiness indicators.
4. Show platform domain and apps domain as two separate steps; cut from “Checking” to “Active” with “After verification” on the scene.
5. Show confirmed pool funding, optional sender/docs completion, and the console handoff.

**Labels:** “Make it yours,” “Platform domain,” “Apps domain,” “Credit pool,” “Setup progress.” Do not show a fabricated “live in 30 seconds” timer. Do not display five completed items before their actual required states are satisfied.

**Mobile:** One step at a time with a short progress rail. **Reduced motion:** Numbered static setup panels and a clear two-domain explanation. **Alt text:** “Guided setup covering branding, payments, separate platform and apps domains, and credit funding.”

### Asset 3 — Customer journey

**Placement/purpose:** Customer-experience and capabilities sections; connect branding to a useful product.

**Suggested sequence, 12–16 seconds:**

1. Open the fictional partner sign-in at `app.northstar.example`.
2. Reveal the branded home and a sample prompt: “Build a client booking portal.”
3. Show a concise plan, then a representative workspace and product preview.
4. Show a publish action and a finished example at `launch.northstar-apps.example`.
5. End with the partner's project list, tying customer activity back to the business console.

**Truth constraint:** Label it an illustrative workflow. A short animation is not a benchmark for build speed. Use eligible customer capabilities; do not invent a drag-and-drop editor, a Duda-style permissions panel, or guaranteed test results.

**Mobile:** Use cropped readable scenes rather than shrinking a full desktop into illegibility. **Reduced motion:** Sign in → Build → Publish stills with captions. **Alt text:** “Illustrative customer journey from branded sign-in to building and publishing a booking portal.”

### Asset 4 — Credit economics

**Placement/purpose:** Economics section; clarify who buys what and where money moves.

**Suggested sequence, 8–10 seconds:**

1. Introduce the partner pool with “Your credit rate: $0.70 each.”
2. Mark an illustrative 200-credit customer allocation with “Your credit cost: $140.”
3. Show the customer choosing the example $200 offer; payment arrow ends at “Your Stripe.”
4. Resolve a separate equation: `$200 − $140 = $60 before other expenses`.
5. Hold all labels and the illustrative-pricing caption on screen long enough to read.

**Truth constraint:** Do not imply a 200-credit wholesale purchase is currently supported, make the $60 look like a payout, or call it net profit. Program payment, wholesale purchase, and customer payment are three different transactions.

**Mobile:** Vertical flow and a persistent static equation. **Reduced motion:** The table in section 5E. **Alt text:** “Example: 200 credits cost the partner $140; a $200 customer price leaves $60 before other expenses.”

### Shared motion and accessibility requirements

- Keep headlines, prices, terms, and CTA labels as selectable HTML text outside rasterised/video-only content.
- Provide play/pause for continuing animation and avoid trapping the reader in a long scroll sequence. Do not autoplay audio.
- Under `prefers-reduced-motion`, remove parallax, long pinned sequences, and large transformations; show complete static content.
- Match the lander's component styling and comparable motion tokens. Defer heavy scenes below the fold and pause work when off-screen.
- Reserve asset space to avoid layout shifts. Provide mobile compositions and optimised posters; essential information must survive a failed asset load.
- Check keyboard access, focus visibility, text contrast, touch targets, and horizontal overflow. Use real buttons for interactive demos; decorative mock controls should not create misleading keyboard stops.
- Deliver scene source, web-ready exports, desktop/mobile variants, posters, captions, alt text, and any fonts/assets with appropriate usage rights. Keep illustrative overlays editable for future pricing changes.

## 9. Claims to avoid, and better wording

| Avoid | Use instead / reason |
|---|---|
| “Guaranteed profits” or “passive income on autopilot” | Explain resale pricing and the difference before other expenses |
| “100% profit” or “keep every dollar” | Customer payments go through their Stripe; credit costs and other expenses remain |
| “Unlimited credits included” | Program fee and credit purchases are separate |
| “Own AIWA's software” or “buy the platform outright” | Operate a branded platform; lifetime covers the program fee |
| “Customers can never identify AIWA” | Describe supported customer branding and the sender/auth/fallback limitations |
| “Live instantly” or “guaranteed same-day launch” | Guided setup, subject to domain, provider, payment, and funding readiness |
| “Set any price with no limits” | Set prices within supported pricing limits; launch safeguards must match the new rate |
| “Free credits for every customer” | Any supported free allowance is funded by the partner |
| “White-label support portal and training library included” | Link the partner's own docs and support contact; those services are not established by this implementation |
| “Customise every menu, permission, and toolbar” | Describe the actual identity/domain/pricing controls |
| “Native multi-currency checkout” | Current currency conversion is for display; checkout charges remain USD |
| “No AIWA traces anywhere” | Branding is not a forensic anonymity promise; infrastructure and metadata are separate concerns |
| Copied Duda functionality or proof | Use only verified AIWA functionality and approved AIWA evidence |
| Existing lander user counts as WL adoption proof | Use no White-Label customer count or testimonial without specific evidence |
| Unconditional code export/mobile/hosting promises | Validate the capability, entitlement, and release configuration before adding it to the page |
| Unconfirmed cancellation/refund/continuity guarantees | Link confirmed release terms once supplied; do not infer them from old sales copy |

## 10. Launch dependencies: current code versus the agreed offer

This section is for the product lead and engineers, not public page copy. No billing changes, flag changes, migrations, or deployments were performed to create this brief.

| Area | Current checkout evidence | Required follow-on before launch |
|---|---|---|
| Program prices | `WL.monthlyUsd = 197`, `WL.lifetimeUsd = 297` | Keep monthly at $197; align lifetime to $997 across display, API, Stripe checkout, emails, and metadata |
| Yearly program | Public offer type supports monthly/lifetime; `/subscribe` explicitly rejects `annual` | Reinstate annual end-to-end at $497 recurring yearly, including offer selection, login return, checkout, webhook entitlement, renewal, console labels, and tests. An existing annual Stripe variable is not proof its price matches |
| Wholesale credits | `WL.wholesaleCentsPerCredit = 10` | Align credit purchases, calculations, display, ledger unit prices, and emails with 70 cents for the new launch rate |
| Resale safeguards | Legacy plan floor 11c; top-up floor 20c; advisory 50c; ceiling 100c | Review validation and advice against 70c wholesale, including flexible offers. Do not silently keep below-cost defaults or invent a new approved floor in this brief |
| Customer grid defaults | Based on AIWA's direct pricing and old credit costs | Supply coherent partner examples/defaults. Even 200 credits cost $140 at the launch rate, so a $29 customer plan with that allowance would not cover credits |
| Pool purchase minimum | 1,000 credits; chips 1,500 / 3,500 / 7,000 | Confirm launch minimum and presets. If retained, the minimum costs $700 and presets cost $1,050 / $2,450 / $4,900. These amounts are consequences, not newly approved purchase requirements |
| Customer flexible/free offers | Controlled by `WL_FLEXIBLE_PRICING`; migration and rollout documented | Confirm production enablement before showing this as universally available. Use baseline supported pricing otherwise |
| Branding AI | Provider capability flags | Confirm logo/palette services before including those actions in public demos |
| Email | Own sender needs Resend setup; platform fallback and separate password-reset sender exist | Test sender identity across welcome, verification, reset, and fallback paths; qualify claims accordingly |
| Existing accounts | Historical subscriptions, credit purchases, and assignments already exist | Determine treatment of existing customers separately. This brief does not authorise repricing old subscriptions, changing past ledgers, or removing entitlements |
| Sales-page routing | App already has `/white-label` and an authenticated `/partner` funnel | Integrate the marketing page, canonical/redirect policy, and cross-origin purchase links; test direct loads and authentication return |

Do not launch a page advertising these new offers while its buttons still charge the old prices or reject yearly purchases. Keep technical release dependencies in this handoff; give customers accurate prices and clear purchase behaviour.

## 11. Acceptance and handoff checklist

### Editorial and product

- [ ] Navigation, homepage section, and dedicated page all use the same White-Label naming and proposition.
- [ ] $197/month, $497/year renewing at $497, $997 once, and $0.70/credit are consistent across public copy and assets.
- [ ] Program access and credit usage are clearly separate, including on lifetime.
- [ ] The 200-credit example shows $140 cost, $200 illustrative resale, and $60 before other expenses.
- [ ] Fictional UI, example prices, and proposed animations are labelled appropriately; no invented customer proof appears.
- [ ] Required setup and customer-payment prerequisites match the actual product; platform and apps domains remain distinct.
- [ ] Feature flags, email limitations, and customer entitlements are reflected in final claims.
- [ ] No unsupported guarantee, bonus, promotional deadline, refund term, or cancellation consequence has been added.

### Design and implementation follow-on

- [ ] Desktop/mobile navigation and footer reach `/white-label`; homepage CTA reaches the same page.
- [ ] The homepage section sits after QA and before core pricing without confusing the two offers.
- [ ] Hero/setup/pricing anchors work; yearly is not routed to a retired checkout.
- [ ] Each offer survives sign-in and reaches the correct amount and billing cadence in a test checkout.
- [ ] Payment success, cancellation, provider error, and return-to-app paths have been exercised before launch.
- [ ] New wholesale pricing, defaults, safeguards, pool minimum, and existing-account treatment are resolved by their owners.
- [ ] Assets match the lander, stay readable on mobile, and have static/reduced-motion alternatives.
- [ ] Keyboard navigation, contrast, focus, semantic headings, FAQ controls, loading failures, and overflow have been checked.
- [ ] Search metadata, canonical handling, direct route loads, and production-host links are verified.
- [ ] Product lead signs off the creative; engineering confirms release readiness; commercial owner confirms remaining launch terms.

## 12. Source appendix

Repository links are relative to this document so the handoff works in a checkout or repository viewer. Inspect implementations rather than trusting comments or old marketing prose when they disagree. Local implementation was inspected; production secrets, live customer records, and live purchases were not used.

| ID | Sources | Used for |
|---|---|---|
| S1 | [BrandStudio](../../apps/web/src/components/partner/BrandStudio.tsx), [BrandPreview](../../apps/web/src/components/partner/BrandPreview.tsx) | Required steps, rail order, rewards, responsive studio, preview screens |
| S2 | [BrandEditor](../../apps/web/src/components/partner/BrandEditor.tsx), [useBrandDraft](../../apps/web/src/components/partner/useBrandDraft.ts) | Brand controls, live drafts, save behaviour, AI capability checks, docs field |
| S3 | [Partner API](../../apps/api/src/routes/wl-partner.ts), [Partner service](../../apps/api/src/services/wl-partners.ts) | Partner configuration, checklist, program checkout, domain and theme settings |
| S4 | [Brand AI service](../../apps/api/src/services/wl-brand-ai.ts) | AI-assisted brand generation implementation |
| S5 | [Setup editors](../../apps/web/src/components/partner/steps.tsx), [Platform domain service](../../apps/api/src/services/wl-domain.ts), [Apps domain service](../../apps/api/src/services/wl-apps-domain.ts) | Stripe/prices/pool/domain setup and distinct domain roles |
| S6 | [Publish domain helpers](../../packages/shared/src/publish-domain.ts), [Publish target service](../../apps/api/src/services/publish-target.ts), [Brand resolution](../../apps/api/src/lib/brand-resolve.ts) | Published address selection and product brand resolution |
| S7 | [Customer billing](../../apps/api/src/routes/wl-billing.ts) | Connected-account checkout, purchase prerequisites, display-currency limitations |
| S8 | [Shared constants](../../packages/shared/src/constants.ts), [Offer editor](../../apps/web/src/components/partner/OfferEditor.tsx) | Current program/rate/floor/minimum values and offer UI |
| S9 | [Flexible pricing rollout](../wl-flexible-pricing.md), [Offer service](../../apps/api/src/services/wl-offers.ts), [Free service](../../apps/api/src/services/wl-free.ts) | Conditional pricing/free offers and funding behaviour |
| S10 | [Partner console](../../apps/web/src/routes/partner.tsx), [Credit pool service](../../apps/api/src/services/wl-credits.ts), [Pending grants](../../apps/api/src/services/wl-pending.ts) | Console sections, pool ledger, funding and queued allocations |
| S11 | [Customer list](../../apps/web/src/components/partner/PartnerUsersTab.tsx), [Customer drawer](../../apps/web/src/components/partner/PartnerUserDrawer.tsx), [Create customer](../../apps/web/src/components/partner/PartnerCreateUserDialog.tsx) | Customer management and supported actions |
| S12 | [Project management](../../apps/web/src/components/partner/PartnerProjectsTab.tsx), [Operations service](../../apps/api/src/services/wl-operations.ts) | Customer projects and operational controls |
| S13 | [Email settings](../../apps/web/src/components/partner/PartnerEmailSection.tsx), [Partner email service](../../apps/api/src/services/email/wl-partner.ts) | Own sender, fallback, authentication sender limitations |
| S14 | [Included workspace grant](../../apps/api/src/services/wl-partners.ts), [Customer plan rules](../../packages/shared/src/wl-plan.ts) | Own Agency capability, zero included credits, existing-account exceptions |
| S15 | [Existing WL sales page](../../apps/web/src/routes/white-label.tsx), [Offer purchase component](../../apps/web/src/components/partner/PartnerOffer.tsx), [Application routes](../../apps/web/src/App.tsx) | Existing sales and authenticated purchase funnel; old claims/prices require correction |
| S16 | [Brand-aware SEO](../../packages/shared/src/seo.ts), [Route metadata](../../packages/shared/src/route-meta.ts) | Public WL entry, brand metadata, distinction from the partner console |

External references: [AIWA v2 lander](https://aiwa-site-psi.vercel.app/index-v2.html), [visual/motion tokens](https://aiwa-site-psi.vercel.app/css/tokens.css), [base styles](https://aiwa-site-psi.vercel.app/css/base.css), [site styles](https://aiwa-site-psi.vercel.app/css/site.css), and [Duda's White-Label presentation](https://www.duda.co/website-builder/white-label). The supplied Duda menu screenshot was used as visual context; this brief describes the relevant pattern so the temporary clipboard image is not required to understand the handoff.
