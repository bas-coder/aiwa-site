// BJCRUM White-Label Pricing Section Controller
(function () {
  'use strict';

  // Currency State
  let currency = 'USD'; // 'USD' | 'EUR'
  const EUR_RATE = 0.905;

  function formatPrice(usd) {
    if (usd === 0) return '$0';
    if (currency === 'EUR') {
      const eur = Math.round(usd * EUR_RATE);
      return `€${eur}`;
    }
    return `$${usd}`;
  }

  // Free Tier Sub-option State
  let freeSubTier = 'monthly'; // 'monthly' | 'onetime'

  // Tier Definitions
  const soloTiers = [
    {
      id: 'free',
      name: 'Free',
      badge: 'No card required',
      credits: 60,
      priceUSD: 0,
      subText: 'Free access, no card required',
      margin: null
    },
    {
      id: 'solo-200',
      name: 'Solo 200',
      badge: null,
      credits: 200,
      priceUSD: 29,
      subText: '200 credits a month',
      margin: '+$9.00 margin'
    },
    {
      id: 'solo-515',
      name: 'Solo 515',
      badge: 'Popular',
      credits: 515,
      priceUSD: 59,
      subText: '515 credits a month',
      margin: '+$7.50 margin'
    },
    {
      id: 'solo-1030',
      name: 'Solo 1030',
      badge: null,
      credits: 1030,
      priceUSD: 99,
      subText: '1,030 credits a month',
      margin: '+$6.00 margin'
    }
  ];

  const agencyTiers = [
    {
      id: 'agency-1100',
      name: 'Agency 1100',
      badge: null,
      credits: 1100,
      priceUSD: 149,
      subText: '1,100 credits a month',
      margin: '+$39.00 margin'
    },
    {
      id: 'agency-2535',
      name: 'Agency 2535',
      badge: 'Best Value',
      credits: 2535,
      priceUSD: 299,
      subText: '2,535 credits a month',
      margin: '+$45.50 margin'
    },
    {
      id: 'agency-4455',
      name: 'Agency 4455',
      badge: 'High Velocity',
      credits: 4455,
      priceUSD: 549,
      subText: '4,455 credits a month',
      margin: '+$103.50 margin'
    }
  ];

  let selectedSoloIdx = 2; // Solo 515 default
  let selectedAgencyIdx = 1; // Agency 2535 default

  const soloFeatures = [
    { text: 'The full AI builder with live preview', isNew: false },
    { text: 'Publish to a live URL, or your own custom domain', isNew: false },
    { text: 'Max, the deep agent, on every build', isNew: false },
    { text: 'Code export and GitHub sync', isNew: false },
    { text: '10 AI + 20 stock images per project', isNew: false },
    { text: 'Version history and restore', isNew: false }
  ];

  const agencyFeatures = [
    { text: 'Everything in Solo', isNew: false },
    { text: 'Invite clients to review and comment', isNew: true },
    { text: 'Admin role + team seats (up to 15 seats)', isNew: false },
    { text: 'Visibility controls: public, unlisted or private', isNew: false },
    { text: 'Android APK, Play Store and App Store kits', isNew: true },
    { text: 'Largest image budget: 25 AI + 50 stock per project', isNew: false }
  ];

  function getThemeColors() {
    const isLight = document.documentElement.getAttribute('toggle-theme') === 'light' || document.documentElement.classList.contains('light');
    if (isLight) {
      return {
        isLight: true,
        wrapperColor: '#121211',
        headingColor: '#121211',
        subheadingColor: '#525250',
        soloCardBg: '#FFFFFF',
        soloCardBorder: '1px solid rgba(23, 23, 22, 0.08)',
        soloCardShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        agencyCardBg: '#FFFFFF',
        agencyCardBorder: '1px solid #0284C7',
        agencyCardShadow: '0 4px 20px rgba(0, 0, 0, 0.05), 0 0 20px rgba(2, 132, 199, 0.10)',
        cardTitle: '#121211',
        cardDesc: '#737370',
        badgeSoloBg: 'rgba(16, 185, 129, 0.12)',
        badgeSoloColor: '#059669',
        badgeAgencyBg: 'rgba(2, 132, 199, 0.12)',
        badgeAgencyColor: '#0284C7',
        price: '#121211',
        cadence: '#737370',
        subText: '#737370',
        divider: 'rgba(23, 23, 22, 0.08)',
        creditsHexStroke: '#0284C7',
        creditsHexFill: '#0284C7',
        creditsText: '#121211',
        marginBadgeBg: 'rgba(16, 185, 129, 0.12)',
        marginBadgeColor: '#059669',
        tabContainerBg: '#F3F2EE',
        tabInactiveColor: '#737370',
        tabActiveSoloBg: '#FFFFFF',
        tabActiveSoloColor: '#121211',
        tabActiveSoloShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        tabActiveAgencyBg: '#0284C7',
        tabActiveAgencyColor: '#FFFFFF',
        tabActiveAgencyShadow: '0 1px 4px rgba(2, 132, 199, 0.25)',
        freeSubContainerBg: '#F8F7F5',
        freeSubBtnActiveBg: 'rgba(2, 132, 199, 0.08)',
        freeSubBtnActiveBorder: '1px solid #0284C7',
        freeSubBtnActiveColor: '#0284C7',
        freeSubBtnInactiveBg: '#FFFFFF',
        freeSubBtnInactiveBorder: '1px solid rgba(23, 23, 22, 0.08)',
        freeSubBtnInactiveColor: '#737370',
        featureCheckStroke: '#059669',
        featureText: '#374151',
        featureBadgeBg: '#EAEAE7',
        featureBadgeColor: '#4A4A47',
        soloBtnBg: '#EAEAE7',
        soloBtnBorder: '1px solid rgba(23, 23, 22, 0.12)',
        soloBtnColor: '#121211',
        agencyBtnBg: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
        agencyBtnColor: '#FFFFFF',
        guaranteeColor: '#737370'
      };
    } else {
      return {
        isLight: false,
        wrapperColor: '#ffffff',
        headingColor: 'rgb(253, 252, 250)',
        subheadingColor: 'rgb(209, 209, 205)',
        soloCardBg: 'rgb(20, 20, 20)',
        soloCardBorder: '1px solid rgba(255, 255, 255, 0.08)',
        soloCardShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        agencyCardBg: 'rgb(20, 20, 20)',
        agencyCardBorder: '1px solid #2299d8',
        agencyCardShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 0 16px rgba(34, 153, 216, 0.12)',
        cardTitle: '#ffffff',
        cardDesc: 'rgba(255, 255, 255, 0.5)',
        badgeSoloBg: 'rgba(74, 222, 128, 0.12)',
        badgeSoloColor: '#4ade80',
        badgeAgencyBg: 'rgba(34, 153, 216, 0.12)',
        badgeAgencyColor: '#2299d8',
        price: '#ffffff',
        cadence: 'rgba(255, 255, 255, 0.6)',
        subText: 'rgba(255, 255, 255, 0.5)',
        divider: 'rgba(255, 255, 255, 0.08)',
        creditsHexStroke: '#2299d8',
        creditsHexFill: '#2299d8',
        creditsText: '#ffffff',
        marginBadgeBg: 'rgba(74, 222, 128, 0.12)',
        marginBadgeColor: '#4ade80',
        tabContainerBg: 'rgba(255, 255, 255, 0.05)',
        tabInactiveColor: 'rgba(255, 255, 255, 0.55)',
        tabActiveSoloBg: 'rgba(255, 255, 255, 0.14)',
        tabActiveSoloColor: '#ffffff',
        tabActiveSoloShadow: 'none',
        tabActiveAgencyBg: 'rgba(34, 153, 216, 0.25)',
        tabActiveAgencyColor: '#ffffff',
        tabActiveAgencyShadow: 'none',
        freeSubContainerBg: 'rgba(255, 255, 255, 0.04)',
        freeSubBtnActiveBg: 'rgba(34, 153, 216, 0.2)',
        freeSubBtnActiveBorder: 'none',
        freeSubBtnActiveColor: '#ffffff',
        freeSubBtnInactiveBg: 'rgba(255, 255, 255, 0.03)',
        freeSubBtnInactiveBorder: 'none',
        freeSubBtnInactiveColor: 'rgba(255, 255, 255, 0.7)',
        featureCheckStroke: '#4ade80',
        featureText: 'rgb(209, 209, 205)',
        featureBadgeBg: 'rgba(255, 255, 255, 0.08)',
        featureBadgeColor: '#ffffff',
        soloBtnBg: '#2C2C2B',
        soloBtnBorder: '1px solid rgba(255, 255, 255, 0.12)',
        soloBtnColor: '#ffffff',
        agencyBtnBg: 'linear-gradient(180deg, #49ade2 0%, #2299d8 100%)',
        agencyBtnColor: '#1e1e1d',
        guaranteeColor: 'rgba(255, 255, 255, 0.45)'
      };
    }
  }

  function renderPricingHTML() {
    const s = soloTiers[selectedSoloIdx];
    const a = agencyTiers[selectedAgencyIdx];
    const c = getThemeColors();

    return `
    <div class="bjcrumbs-pricing-wrapper" style="position: relative; z-index: 1; padding: 64px 20px 80px; max-width: 1040px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: ${c.wrapperColor};">
      
      <!-- Section Header Styled with font-weight medium, no Pricing badge -->
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 48px;">
        <h2 class="framer-text" dir="auto" style="text-align: center; margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 48px; font-weight: 500; line-height: 1.2; letter-spacing: -0.02em; color: ${c.headingColor};">
          Simple, transparent pricing
        </h2>
        <p class="framer-text" dir="auto" style="text-align: center; margin: 14px auto 0 auto; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 400; line-height: 22px; color: ${c.subheadingColor}; max-width: 540px;">
          Simple, credit-backed plans charged on your Stripe. Wholesale is $0.10 a credit. Everything above is your margin.
        </p>
      </div>

      <!-- Plan Cards Grid -->
      ${renderCardsHTML(s, a, c)}

      <!-- Framer Footer Guarantee Note -->
      <p style="font-family: 'Inter', sans-serif; font-size: 13px; font-style: italic; color: ${c.guaranteeColor}; text-align: center; margin-top: 36px; letter-spacing: -0.01em;">
        Cancel anytime · Upgrades prorated automatically by Stripe · Secure checkout
      </p>

    </div>
    `;
  }

  // Renders the 2-Card Plan Grid (Solo & Agency) matching Framer UI
  function renderCardsHTML(s, a, c) {
    const isFree = s.id === 'free';

    return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; max-width: 960px; margin: 0 auto; align-items: stretch;">
      
      <!-- CARD 1: SOLO -->
      <div class="bjcrumbs-pricing-card solo-card" style="background: ${c.soloCardBg}; border: ${c.soloCardBorder}; border-radius: 28px; padding: 36px 32px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: ${c.soloCardShadow}; transition: all 0.2s ease;">
        <div>
          <!-- Plan Name & Description -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div>
              <h3 style="font-family: 'Inter', sans-serif; font-size: 17px; font-weight: 600; color: ${c.cardTitle}; margin: 0; letter-spacing: -0.01em;">Solo</h3>
              <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: ${c.cardDesc}; margin: 4px 0 0 0;">One builder, their own workspace.</p>
            </div>
            ${s.badge ? `<span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: ${c.badgeSoloColor}; background: ${c.badgeSoloBg}; border: none; padding: 3px 10px; border-radius: 9999px;">${s.badge}</span>` : ''}
          </div>

          <!-- Price Display -->
          <div style="margin-top: 24px;">
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 48px; font-weight: 700; color: ${c.price}; letter-spacing: -0.03em; line-height: 1;">${formatPrice(s.priceUSD)}</span>
              ${s.priceUSD > 0 ? `<span style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; color: ${c.cadence};">/mo</span>` : ''}
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: ${c.subText}; margin-top: 6px;">
              ${isFree ? 'Full Solo access · No credit card required' : 'Billed monthly · Cancel anytime'}
            </div>
          </div>

          <!-- Credits Row with Hexagon Icon -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 22px; padding-top: 18px; border-top: 1px solid ${c.divider};">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c.creditsHexStroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <circle cx="12" cy="12" r="2.5" fill="${c.creditsHexFill}"></circle>
              </svg>
              <span style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700; color: ${c.creditsText};">${s.credits.toLocaleString()} Credits / mo</span>
            </div>
          </div>

          <!-- Solo Tier Selector Tabs (NO BORDER) -->
          <div style="margin-top: 16px;">
            <div style="display: flex; gap: 4px; background: ${c.tabContainerBg}; border: none; border-radius: 12px; padding: 4px;">
              ${soloTiers.map((t, idx) => {
                const isActive = selectedSoloIdx === idx;
                const tabStyle = isActive
                  ? `background: ${c.tabActiveSoloBg}; color: ${c.tabActiveSoloColor}; box-shadow: ${c.tabActiveSoloShadow}; font-weight: 600;`
                  : `background: transparent; color: ${c.tabInactiveColor}; font-weight: 500;`;
                return `
                <button type="button" data-solo-tier="${idx}" style="flex: 1; padding: 7px 6px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 12px; text-align: center; cursor: pointer; transition: all 0.15s; outline: none; border: none; ${tabStyle}">
                  ${t.name}
                </button>
              `;
              }).join('')}
            </div>
          </div>

          <!-- Free Tier Sub-options (Only shown when Free tier selected) -->
          ${isFree ? `
          <div style="margin-top: 14px; background: ${c.freeSubContainerBg}; border: none; border-radius: 14px; padding: 14px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: ${c.subText}; margin-bottom: 8px;">
              Free Tier Cadence:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button type="button" id="subtier-monthly-btn" style="padding: 10px 12px; border-radius: 10px; text-align: left; cursor: pointer; transition: all 0.15s; border: ${freeSubTier === 'monthly' ? c.freeSubBtnActiveBorder : c.freeSubBtnInactiveBorder}; background: ${freeSubTier === 'monthly' ? c.freeSubBtnActiveBg : c.freeSubBtnInactiveBg}; color: ${freeSubTier === 'monthly' ? c.freeSubBtnActiveColor : c.freeSubBtnInactiveColor};">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 12px; font-weight: 600;">Monthly refill</span>
                  <span style="font-size: 10px; font-weight: 600; color: ${c.marginBadgeColor}; background: ${c.marginBadgeBg}; border: none; padding: 2px 7px; border-radius: 9999px;">Recommended</span>
                </div>
                <div style="font-size: 11px; color: ${c.subText}; margin-top: 3px;">Refills every 30 days · Unused expire · $6.00/mo from pool</div>
              </button>
              <button type="button" id="subtier-onetime-btn" style="padding: 10px 12px; border-radius: 10px; text-align: left; cursor: pointer; transition: all 0.15s; border: ${freeSubTier === 'onetime' ? c.freeSubBtnActiveBorder : c.freeSubBtnInactiveBorder}; background: ${freeSubTier === 'onetime' ? c.freeSubBtnActiveBg : c.freeSubBtnInactiveBg}; color: ${freeSubTier === 'onetime' ? c.freeSubBtnActiveColor : c.freeSubBtnInactiveColor};">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 12px; font-weight: 600;">One-time starter</span>
                  ${freeSubTier === 'onetime' ? `<span style="color: ${c.creditsHexStroke}; font-weight: bold;">✓</span>` : ''}
                </div>
                <div style="font-size: 11px; color: ${c.subText}; margin-top: 3px;">Granted once · Never expire · $6.00 once from pool</div>
              </button>
            </div>
          </div>
          ` : ''}

          <!-- Feature List -->
          <ul style="margin-top: 26px; display: flex; flex-direction: column; gap: 13px; list-style: none; padding: 0;">
            ${soloFeatures.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 10px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c.featureCheckStroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span style="font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 400; color: ${c.featureText}; line-height: 1.45;">
                  ${item.text}
                </span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Action CTA Button (Secondary Style) -->
        <div style="margin-top: 36px;">
          <a href="https://app.aiwa.codes" class="framer-btn-secondary" style="display: block; width: 100%; text-align: center; background: ${c.soloBtnBg}; border: ${c.soloBtnBorder}; border-radius: 9999px; padding: 13px 24px; color: ${c.soloBtnColor}; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; box-sizing: border-box; transition: all 0.2s; box-shadow: none;">
            ${isFree ? 'Get Started' : 'Upgrade'}
          </a>
        </div>
      </div>

      <!-- CARD 2: AGENCY (1px Border, Subtle Shadow, Exact Primary Button) -->
      <div class="bjcrumbs-pricing-card agency-card" style="background: ${c.agencyCardBg}; border: ${c.agencyCardBorder}; border-radius: 28px; padding: 36px 32px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: ${c.agencyCardShadow}; position: relative; transition: all 0.2s ease;">
        <div>
          <!-- Plan Name & Description -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div>
              <h3 style="font-family: 'Inter', sans-serif; font-size: 17px; font-weight: 600; color: ${c.cardTitle}; margin: 0; letter-spacing: -0.01em;">Agency</h3>
              <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: ${c.cardDesc}; margin: 4px 0 0 0;">Teams that invite clients and ship with sign-off.</p>
            </div>
            ${a.badge ? `<span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: ${c.badgeAgencyColor}; background: ${c.badgeAgencyBg}; border: none; padding: 3px 10px; border-radius: 9999px;">${a.badge}</span>` : ''}
          </div>

          <!-- Price Display -->
          <div style="margin-top: 24px;">
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 48px; font-weight: 700; color: ${c.price}; letter-spacing: -0.03em; line-height: 1;">${formatPrice(a.priceUSD)}</span>
              <span style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; color: ${c.cadence};">/mo</span>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: ${c.subText}; margin-top: 6px;">
              Billed monthly · Cancel anytime
            </div>
          </div>

          <!-- Credits Row with Hexagon Icon -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 22px; padding-top: 18px; border-top: 1px solid ${c.divider};">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c.creditsHexStroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <circle cx="12" cy="12" r="2.5" fill="${c.creditsHexFill}"></circle>
              </svg>
              <span style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700; color: ${c.creditsText};">${a.credits.toLocaleString()} Credits / mo</span>
            </div>
          </div>

          <!-- Agency Tier Selector Tabs (NO BORDER) -->
          <div style="margin-top: 16px;">
            <div style="display: flex; gap: 4px; background: ${c.tabContainerBg}; border: none; border-radius: 12px; padding: 4px;">
              ${agencyTiers.map((t, idx) => {
                const isActive = selectedAgencyIdx === idx;
                const tabStyle = isActive
                  ? `background: ${c.tabActiveAgencyBg}; color: ${c.tabActiveAgencyColor}; box-shadow: ${c.tabActiveAgencyShadow}; font-weight: 600;`
                  : `background: transparent; color: ${c.tabInactiveColor}; font-weight: 500;`;
                return `
                <button type="button" data-agency-tier="${idx}" style="flex: 1; padding: 7px 6px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 12px; text-align: center; cursor: pointer; transition: all 0.15s; outline: none; border: none; ${tabStyle}">
                  ${t.name}
                </button>
              `;
              }).join('')}
            </div>
          </div>

          <!-- Feature List -->
          <ul style="margin-top: 26px; display: flex; flex-direction: column; gap: 13px; list-style: none; padding: 0;">
            ${agencyFeatures.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 10px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c.creditsHexStroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 400; color: ${c.featureText}; line-height: 1.45;">
                    ${item.text}
                  </span>
                  ${item.isNew ? `<span style="background: ${c.featureBadgeBg}; border: none; color: ${c.featureBadgeColor}; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 9999px;">New</span>` : ''}
                </div>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Action CTA Button (Primary Button) -->
        <div style="margin-top: 36px;">
          <a href="https://app.aiwa.codes" class="framer-btn-primary" style="display: block; width: 100%; text-align: center; background: ${c.agencyBtnBg}; border: none; border-radius: 9999px; padding: 13px 24px; color: ${c.agencyBtnColor}; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; box-sizing: border-box; box-shadow: none; transition: all 0.2s;">
            Upgrade
          </a>
        </div>
      </div>

    </div>
    `;
  }

  function updatePricing() {
    const html = renderPricingHTML();
    window.__bjcrumbsPricingHTML = html;
    const container = document.getElementById('bjcrumbs-white-label-pricing');
    if (container) {
      container.innerHTML = html;
    }
  }

  // Delegated event listener at document level — immune to React hydration/re-render wipes
  document.addEventListener('click', function (e) {
    const soloBtn = e.target.closest('[data-solo-tier]');
    if (soloBtn) {
      e.preventDefault();
      selectedSoloIdx = parseInt(soloBtn.getAttribute('data-solo-tier'), 10);
      updatePricing();
      return;
    }

    const agencyBtn = e.target.closest('[data-agency-tier]');
    if (agencyBtn) {
      e.preventDefault();
      selectedAgencyIdx = parseInt(agencyBtn.getAttribute('data-agency-tier'), 10);
      updatePricing();
      return;
    }

    const btnMonthly = e.target.closest('#subtier-monthly-btn');
    if (btnMonthly) {
      e.preventDefault();
      freeSubTier = 'monthly';
      updatePricing();
      return;
    }

    const btnOnetime = e.target.closest('#subtier-onetime-btn');
    if (btnOnetime) {
      e.preventDefault();
      freeSubTier = 'onetime';
      updatePricing();
      return;
    }
  });

  // Re-render dynamically when theme toggles
  window.addEventListener('themeChange', updatePricing);
  if (window.MutationObserver) {
    new MutationObserver(() => {
      updatePricing();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['toggle-theme', 'class'] });
  }

  // Expose on window for SSR / hydration
  window.__renderPricing = renderPricingHTML;
  window.__bjcrumbsPricingHTML = renderPricingHTML();
  window.__updatePricing = updatePricing;

  function initPricing() {
    const container = document.getElementById('bjcrumbs-white-label-pricing');
    if (container) {
      container.innerHTML = renderPricingHTML();
      console.log('[Pricing] Successfully initialized white-label pricing with delegated events');
    } else {
      setTimeout(initPricing, 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricing);
  } else {
    initPricing();
  }
})();
