/**
 * THE HERO - spec §2, Acts 0 through 5.
 *
 * Two overlapping systems, exactly as §2.1 describes them:
 *
 *   System A - #hero-media, PINNED to the viewport for the whole 400vh run,
 *              and later the Flip source.
 *   System B - four 100vh panels that scroll OVER it.
 *
 * ------------------------------------------------------------------------
 * ONE DELIBERATE DEPARTURE FROM THE SPEC, AND WHY
 * ------------------------------------------------------------------------
 * §2.4 pins a scrubbed <video> to the scroll position. §2.4 "Content direction
 * for AIWA" says what that video should show: "a screen recording of the actual
 * product building an app: prompt typed -> agent plan appears -> files stream
 * in -> preview renders -> deployed URL."
 *
 * That footage does not exist yet (§8 open question 2 is literally "who
 * produces the hero screen recording"). So this build renders that exact
 * sequence live, in the DOM, as a deterministic function of scroll progress.
 *
 * It is not a placeholder. It is better than the video on four counts the spec
 * itself cares about:
 *
 *   - The §2.4 video requirements - 5-10 frame GOPs, <4MB, blob preloading,
 *     the 60%-in-2s readiness gate, the seeking guard - all exist to make a
 *     video scrub smoothly. A timeline has no playhead to stall, so none of
 *     that machinery is needed and none of it can fail.
 *   - It scrubs at 60fps on anything, because scrubbing is just setting a
 *     timeline's progress.
 *   - The text stays real text: crisp at any DPR, selectable, translatable,
 *     and it costs ~0 bytes instead of 4MB. LCP improves rather than degrades.
 *   - The whole fallback ladder in §2.8 collapses to one tier. There is no
 *     slow-connection branch because there is nothing to download.
 *
 * When the real footage lands, swapping it in is a contained change: put the
 * <video> inside .hero-media__frame, and point scrubTo() at
 * `video.currentTime` instead of `sceneTl.progress()`. The pin, the Flip and
 * the arrival reveal are untouched by that swap - which is the whole reason
 * §7 says to build them in isolation from each other.
 * ------------------------------------------------------------------------
 */

import { EASE, DUR, STAGGER, REVEAL, ACCENT, INK, prefersReducedMotion, withWillChange } from './tokens.js';

/* The prompt names an event-photo product; BEAT 5 hands the canvas into the
   workspace well on the same Build live-preview still the section opens with. */
const PROMPT_TEXT = 'Build an event photo platform: guests scan a QR code, upload photos and video, and everything lands in one live gallery';

/* Prompt-beat leftover type-in is placed by measureHeroBreaks() so it
   finishes before panel 2. These used to be fixed fractions of the hero. */
const PROMPT_FALLBACK_WORD_COUNT = 6;
const PROMPT_MIN_INITIAL_CHARS = 8;
const PROMPT_LINE_SLACK_PX = 2;
const PROMPT_COLON = ':';
const PROMPT_SPACE = ' ';

/* Scene switches used to be hardcoded fractions of the whole hero (prompt
   until 0.20, plan until 0.28, idea until 0.80). Panel 3 is ~4 viewports, so
   those numbers put the PLAN robot on screen while the idea list was already
   the left copy. Breaks are measured from the live panels. */
const FALLBACK_BREAKS = {
  promptHide: 0.18,
  planShow: 0.18,
  ideaShow: 0.36,
  planHide: 0.36,
  ideaHide: 1,
  /* Was shipShow: no ship scene anymore; marks handoff / evolve HUD. */
  handoffStart: 1,
  stageCenter: 0.88,
};

/* Flip progress at which the last idea plate is fully gone. Hold it until
   the well is actually entering so there is no empty HUD frame. */
const HANDOFF_IDEA_FADE = 0.12;
const SCENE_EXIT_Y = 24;
const SCENE_EXIT_BLUR = 12;

/* Two-column rest: scene sits in the right-hand column. A full slide to
   xPercent 0 was the Flip crutch — it hauled the idea cards through the
   copy. Drift is a few points of that column, still clearly on the right. */
const STAGE_COL_X = 19;
const STAGE_COL_X_DRIFT = 14;
const STAGE_COL_SCALE = 0.94;

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function offsetFromHero(hero, el) {
  if (!hero || !el) return 0;
  return el.getBoundingClientRect().top - hero.getBoundingClientRect().top;
}

function measureHeroBreaks() {
  const hero = document.querySelector('.hero');
  const panel2 = document.querySelector('.hero__panel.is-2');
  const panel3 = document.querySelector('.hero__panel.is-3');
  const ideaCopy = document.querySelector('.hero__idea');
  const zone = document.getElementById('workspace-zone');
  const vh = window.innerHeight;
  const range = Math.max(1, (hero?.offsetHeight || vh) - vh);
  const toProgress = (px) => clamp01(px / range);

  if (!hero || !panel2 || !panel3 || !ideaCopy) {
    return { ...FALLBACK_BREAKS };
  }

  const copyTop = offsetFromHero(hero, ideaCopy);
  const statement = document.querySelector('.hero__statement');
  const stmtTop = statement ? offsetFromHero(hero, statement) : offsetFromHero(hero, panel2);
  /* Panel 2 copy is vertically centered, so it is on screen before the
     panel top hits the viewport top. Switch on the statement itself. */
  const atPlan = toProgress(stmtTop - vh * 0.55);
  /* Switch as soon as the idea list is in the viewport — not when its
     center hits mid-screen, which left the PLAN robot up beside the list. */
  const atIdea = toProgress(copyTop - vh * 0.72);
  /* Scrub finishes when panel 3's bottom hits the viewport bottom. Handoff
     must NOT start before that — stageCenter used to be ideaEnd - 0.06 and
     stole the second half of the last plate. */
  const atIdeaScrubEnd = toProgress(
    offsetFromHero(hero, panel3) + panel3.offsetHeight - vh,
  );
  const planShow = clamp01(Math.max(0.05, atPlan));
  const ideaShow = clamp01(Math.max(planShow + 0.04, atIdea));
  const ideaScrubEnd = clamp01(Math.max(ideaShow + 0.12, atIdeaScrubEnd));
  /* The well lives after the hero, so zone-enter maps to 1 on this clock.
     Stage drift ends with the idea plates; Flip fade (applyIdeaHold) owns
     the exit. Hiding the idea scene on this timeline was the blank HUD. */
  const atZoneEnter = zone
    ? toProgress(offsetFromHero(hero, zone) - vh)
    : 1;
  const handoffStart = clamp01(Math.max(ideaScrubEnd, atZoneEnter));
  const stageCenter = ideaScrubEnd;
  const ideaHide = 1;

  return {
    promptHide: planShow,
    planShow,
    ideaShow,
    planHide: ideaShow,
    ideaHide,
    handoffStart,
    stageCenter,
  };
}

function fallbackPromptLength(text) {
  const colonAt = text.indexOf(PROMPT_COLON);
  if (colonAt !== -1) return colonAt + 1;
  let words = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === PROMPT_SPACE) {
      words += 1;
      if (words === PROMPT_FALLBACK_WORD_COUNT) return i;
    }
  }
  return text.length;
}

function snapPromptLineEnd(text, fit) {
  if (fit >= text.length) return text.length;
  if (fit <= 0) return 0;
  const landedOnBreak = text[fit] === PROMPT_SPACE || text[fit - 1] === PROMPT_SPACE;
  if (landedOnBreak) {
    let n = fit;
    while (n > 0 && text[n - 1] === PROMPT_SPACE) n -= 1;
    return n;
  }
  const prevSpace = text.lastIndexOf(PROMPT_SPACE, fit - 1);
  if (prevSpace >= PROMPT_MIN_INITIAL_CHARS) return prevSpace;
  return fit;
}

function promptFontShorthand(el) {
  const cs = getComputedStyle(el);
  return cs.font || [cs.fontStyle, cs.fontWeight, cs.fontSize, cs.fontFamily].filter(Boolean).join(' ');
}

let promptMeasureCtx = null;
function measurePromptSliceWidth(font, text) {
  if (!promptMeasureCtx) {
    promptMeasureCtx = document.createElement('canvas').getContext('2d');
  }
  if (!promptMeasureCtx) return 0;
  promptMeasureCtx.font = font;
  return promptMeasureCtx.measureText(text).width;
}

/* Longest prefix of `text` that paints as one line inside the prompt card
   at the scene's current layout width. Word-snapped so the caret never sits
   mid-glyph. Recalculated whenever the hero rebuilds (width change). */
function measurePromptFirstLineLength(promptEl, text) {
  const fallback = fallbackPromptLength(text);
  if (!promptEl || !text) return fallback;

  const box = promptEl.closest('.prompt');
  const scene = promptEl.closest('.scene');
  if (!box || !scene) return fallback;

  const sceneWidth = scene.clientWidth;
  if (sceneWidth < 1) return fallback;

  const boxStyle = getComputedStyle(box);
  const padX = parseFloat(boxStyle.paddingLeft) + parseFloat(boxStyle.paddingRight);
  const borderX = parseFloat(boxStyle.borderLeftWidth) + parseFloat(boxStyle.borderRightWidth);
  const gap = parseFloat(boxStyle.gap) || parseFloat(boxStyle.columnGap) || 0;
  const glyph = box.querySelector('.prompt__glyph');
  const caret = box.querySelector('.prompt__caret');
  const glyphW = glyph ? glyph.offsetWidth : 0;
  const caretW = caret ? caret.offsetWidth : 0;
  const siblingCount = (glyph ? 1 : 0) + (caret ? 1 : 0);
  const available = sceneWidth - padX - borderX - glyphW - caretW - (gap * siblingCount) - PROMPT_LINE_SLACK_PX;
  if (available < 1) return fallback;

  const font = promptFontShorthand(promptEl);
  const sample = measurePromptSliceWidth(font, text.slice(0, PROMPT_MIN_INITIAL_CHARS));
  if (sample < 1) return fallback;

  let lo = 0;
  let hi = text.length;
  let fit = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (measurePromptSliceWidth(font, text.slice(0, mid)) <= available) {
      fit = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (fit < PROMPT_MIN_INITIAL_CHARS) return fallback;
  return snapPromptLineEnd(text, fit);
}


/* ===========================================================================
   ACT 1 · the entrance timeline (§2.3)
   Gate: window.load, then document.fonts.ready. >=480px, motion OK.
   ======================================================================== */
export function heroEntrance() {
  const h1 = document.getElementById('hero-h1');
  const scrim = document.querySelector('.hero-media__scrim');
  const chained = [...document.querySelectorAll('.hero [data-entrance]:not([hidden])')];

  /* §5.1 - reduced motion gets the final state, instantly. */
  if (prefersReducedMotion()) {
    h1?.classList.add('is-static');
    gsap.set(chained, { opacity: 1, y: 0 });
    if (scrim) scrim.style.backdropFilter = 'blur(0px)';
    return () => {};
  }

  /* SplitText must run with the real font metrics loaded, or the characters
     re-lay-out mid-timeline and the wipe stutters. main.js gates on
     fonts.ready before calling this; h1 stays visibility:hidden until now. */
  /* type MUST include 'words'. Chars are display:inline-block so the browser
     may break the line between any two of them; without word wrappers to hold
     them together, "AI product team" happily breaks as "AI product t / eam". */
  const split = new SplitText(h1, { type: 'words,chars', charsClass: 'char', wordsClass: 'word' });
  h1.style.visibility = 'visible';
  const chars = split.chars;

  const accent = ACCENT();
  const ink = INK();

  /* §5.3 - on for the entrance, off 500ms after it lands. */
  const clearCharHint = withWillChange(chars, 'opacity, color');

  const tl = gsap.timeline({ defaults: { ease: EASE.primary }, onComplete: clearCharHint });

  /* ---- Beat 1: three overlapping passes over the split characters --------
     Because pass 2 starts while pass 1 is still travelling, at any instant you
     see three states across the word at once - outline on the right,
     accent-filled in the middle, white on the left. That overlap is the whole
     effect; run the passes in sequence and it reads as three steps. */
  tl.to(chars, {
      opacity: 1,
      webkitTextStrokeColor: accent,
      duration: DUR.base,
      stagger: STAGGER.char,
      ease: EASE.enter,
    }, 0)
    .to(chars, {
      color: accent,
      duration: DUR.micro,
      stagger: STAGGER.char,
    }, 0.2)
    .to(chars, {
      color: ink,
      webkitTextStrokeColor: 'rgba(255,255,255,0)',
      duration: DUR.base,
      stagger: STAGGER.char,
    }, 0.45);

  /* ---- Beats 2-4: each starts 300ms BEFORE the previous finishes --------- */
  chained.forEach((el) => {
    tl.to(el, { opacity: 1, y: 0, duration: DUR.entrance }, STAGGER.entranceOverlap);
  });
  /* The nav used to arrive last, after the message. It no longer arrives at
     all: apps/marquee's nav has no appear animation, and matching that is the
     point - the bar is painted with the first frame and never moves. */

  /* ---- Beat 5: the atmosphere lift ---------------------------------------
     Linear, one full second, overlapping the tail of the UI settling. Nobody
     notices this one happening; everybody notices when it is missing. */
  if (scrim) {
    const b = { v: REVEAL.atmosphereBlur };
    tl.to(b, {
      v: 0,
      duration: DUR.atmosphere,
      ease: EASE.scrub,
      onUpdate: () => { scrim.style.backdropFilter = `blur(${b.v}px)`; },
      onComplete: () => { scrim.style.backdropFilter = 'blur(0px)'; },
    }, STAGGER.entranceOverlap);
  }

  return () => {
    tl.kill();
    split.revert();
    h1.classList.add('is-static');
    gsap.set(chained, { clearProps: 'all', opacity: 1, y: 0 });
  };
}

/* ===========================================================================
   Workflow ring intro — free-running (not scrubbed).
   Scene show/hide stays on the scrub timeline; robot / stages / arcs play once
   when the plan beat activates so mid-scroll never freezes a half-faded chip.
   ======================================================================== */
const WF_ROBOT_SEL = '[data-wf-robot]';
const WF_STAGE_SEL = '[data-wf-stage]';
const WF_LINK_SEL = '[data-wf-link]';
const WF_ROBOT_DUR = DUR.micro;
const WF_STAGE_DUR = DUR.micro;
const WF_STAGE_STAGGER = 0.08;
const WF_ARC_DUR = 0.4;
const WF_ARC_STAGGER = 0.08;
const WF_STAGE_AT = 0.12;
const WF_ARC_AT = 0.22;

let wfIntroTl = null;

function resetWfInternals() {
  if (wfIntroTl) {
    wfIntroTl.kill();
    wfIntroTl = null;
  }
  gsap.set(WF_ROBOT_SEL, { opacity: 0, scale: 0.96 });
  /* Opacity only — do not touch x/y or GSAP overwrites the CSS transform that
     centres each card on its ring anchor. */
  gsap.set(WF_STAGE_SEL, { opacity: 0 });
  gsap.set(WF_LINK_SEL, { opacity: 0 });
}

function playWfIntro() {
  resetWfInternals();
  wfIntroTl = gsap.timeline({ defaults: { ease: EASE.enter } });
  wfIntroTl.to(WF_ROBOT_SEL, {
    opacity: 1, scale: 1, duration: WF_ROBOT_DUR,
  }, 0);
  wfIntroTl.to(WF_STAGE_SEL, {
    opacity: 1, duration: WF_STAGE_DUR, stagger: WF_STAGE_STAGGER,
  }, WF_STAGE_AT);
  wfIntroTl.to(WF_LINK_SEL, {
    opacity: 1, duration: WF_ARC_DUR, stagger: WF_ARC_STAGGER,
  }, WF_ARC_AT);
  return wfIntroTl;
}

/* ===========================================================================
   The scrubbed build sequence - the "video" the hero canvas plays.
   Built once as a PAUSED timeline. ACT 2 then drives its .progress().
   Splitting construction from driving is what lets the pin, the scrub and the
   Flip be rebuilt independently (§2.6 "timeline rebuild contract").
   ======================================================================== */
function buildSceneTimeline() {
  const scenes = {};
  document.querySelectorAll('[data-scene]').forEach((el) => { scenes[el.dataset.scene] = el; });

  const label = document.querySelector('[data-stage-label]');
  const pct = document.querySelector('[data-stage-pct]');
  const rail = document.querySelector('[data-stage-rail]');
  const promptEl = document.querySelector('[data-prompt-text]');
  const caretEl = document.querySelector('.scene--prompt .prompt__caret');
  const initialLen = measurePromptFirstLineLength(promptEl, PROMPT_TEXT);
  const leftover = Math.max(0, PROMPT_TEXT.length - initialLen);
  const paintPrompt = (n) => {
    if (!promptEl) return;
    const chars = Math.max(initialLen, Math.min(PROMPT_TEXT.length, Math.round(n)));
    promptEl.textContent = PROMPT_TEXT.slice(0, chars);
    if (caretEl) promptEl.appendChild(caretEl);
  };
  paintPrompt(initialLen);

  const breaks = measureHeroBreaks();
  const planSpan = Math.max(0.04, breaks.planHide - breaks.planShow);
  const typeDur = Math.max(0.06, breaks.promptHide * 0.85);

  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.scrub } });

  /* ---- Where the scene lives -----------------------------------------
     Wide viewports: copy left, canvas right. The column holds through the
     hero. Through the idea plates the scene drifts a few points left — still
     a right-hand column, never a slide to centre. Exit is the Flip fade
     (applyIdeaHold), not a recentre crutch.

     Narrow viewports fall back to the spec's own model (§2.1): one full-bleed
     canvas with the text panels scrolling over it. There the legibility scrim
     does the work instead of the column split, so the scene stays soft and
     centred and never competes with the copy.                              */
  const stage = document.querySelector('.stage');
  const frame = document.querySelector('.hero-media__frame');
  const twoColumn = window.matchMedia('(min-width: 1100px)').matches;

  /* Prompt must read fully clear early in the beat. A long scrubbed fade
     (was ~14% of the hero, and mobile held opacity at 0.4 until handoff)
     meant scrolling past the prompt before it ever looked settled. */
  const STAGE_ARRIVE_OPACITY = 0.72;
  const STAGE_ARRIVE_BLUR = 'blur(2px)';
  const STAGE_ARRIVE_DUR = 0.035;

  if (twoColumn) {
    gsap.set(frame, { '--copy-scrim': 1 });
    tl.fromTo(stage,
      { xPercent: STAGE_COL_X, scale: STAGE_COL_SCALE, opacity: STAGE_ARRIVE_OPACITY, filter: STAGE_ARRIVE_BLUR },
      { xPercent: STAGE_COL_X, scale: STAGE_COL_SCALE, opacity: 1, filter: 'blur(0px)', duration: STAGE_ARRIVE_DUR }, 0);
    const driftDur = Math.max(0.08, 1 - breaks.ideaShow);
    tl.to(stage, { xPercent: STAGE_COL_X_DRIFT, duration: driftDur }, breaks.ideaShow);
  } else {
    tl.fromTo(stage,
      { scale: 1.04, opacity: STAGE_ARRIVE_OPACITY, filter: STAGE_ARRIVE_BLUR },
      { scale: 1.04, opacity: 1, filter: 'blur(0px)', duration: STAGE_ARRIVE_DUR }, 0);
    tl.to(stage, { scale: 1, duration: 0.12 }, breaks.stageCenter);
    tl.fromTo(frame, { '--copy-scrim': 1 }, { '--copy-scrim': 0, duration: 0.1 }, breaks.stageCenter);
  }

  const show = (el, at, len = 0.06) =>
    tl.fromTo(el, { autoAlpha: 0, y: 24, filter: 'blur(12px)' },
                  { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: len }, at);
  const hide = (el, at, len = 0.05) =>
    tl.to(el, { autoAlpha: 0, y: -24, filter: 'blur(12px)', duration: len }, at);

  /* -- Panel 1 · PROMPT. One measured line is already painted (poster
     frame). Remaining characters scrub in before panel 2 — never from
     length 0, and never into the idea list. -- */
  gsap.set(scenes.prompt, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
  const typed = { t: 0 };
  tl.fromTo(typed, { t: 0 }, {
    t: 1,
    duration: typeDur,
    immediateRender: false,
    onUpdate: () => {
      paintPrompt(initialLen + leftover * typed.t);
    },
  }, 0);
  hide(scenes.prompt, breaks.promptHide);

  /* -- Panel 2 · PLAN. Workflow diagram while "Watch six agents…" is the
     left copy. Scene show/hide stays scrubbed; ring internals auto-play via
     playWfIntro() when this beat activates (wired in heroScroll). -- */
  show(scenes.plan, breaks.planShow, Math.min(0.05, planSpan * 0.25));
  hide(scenes.plan, breaks.planHide);

  /* -- Panel 3 · BUILD / From Idea to Working Product.
     Stays up through the last plate. applyIdeaHold() fades it once Flip
     has begun — hiding it on this clock left a blank HUD frame. -- */
  show(scenes.build, breaks.ideaShow, 0.04);

  /* TEST beat is CSS-hidden; do not steal the idea window for it. */
  /* Duplicate workspace Mac window removed — #workspace owns that still. */

  tl.set({}, {}, 1);

  /* -- The HUD reads the same progress the scenes do. -- */
  const STAGES = [
    [0, 'plan'],
    [breaks.planShow, 'plan'],
    [breaks.ideaShow, 'build'],
    [breaks.handoffStart, 'evolve'],
  ];
  const IDEA_HUD = ['plan', 'architect', 'build', 'ship', 'evolve'];
  tl.eventCallback('onUpdate', () => {
    const p = tl.progress();
    if (rail) rail.style.width = `${(p * 100).toFixed(1)}%`;
    if (pct) pct.textContent = String(Math.round(p * 100)).padStart(2, '0');
    if (label) {
      let name = 'plan';
      if (p >= breaks.ideaShow && p < breaks.ideaHide) {
        const fromScrub = document.documentElement.dataset.ideaPlate;
        if (fromScrub !== undefined && fromScrub !== '') {
          const plate = Number(fromScrub);
          name = IDEA_HUD[Math.min(IDEA_HUD.length - 1, Math.max(0, plate))];
        } else {
          const span = Math.max(0.001, breaks.ideaHide - breaks.ideaShow);
          const local = clamp01((p - breaks.ideaShow) / span);
          name = IDEA_HUD[Math.min(IDEA_HUD.length - 1, Math.floor(local * IDEA_HUD.length))];
        }
      } else {
        for (const [at, n] of STAGES) if (p >= at) name = n;
      }
      if (label.textContent !== name) label.textContent = name;
    }
  });

  tl.progress(0).pause();
  paintPrompt(initialLen);
  return tl;
}

/* ===========================================================================
   ACT 2 · the pin + the scrub (§2.4)
   ACT 4 · the handoff (§2.6)
   ACT 5 · the arrival reveal (§2.7)
   ---------------------------------------------------------------------------
   TWO NOTES ON HOW THE PIN AND THE HANDOFF ARE BUILT, BECAUSE BOTH DIVERGE
   FROM THE LETTER OF THE SPEC IN ORDER TO HIT ITS ACCEPTANCE CRITERIA.
   ---------------------------------------------------------------------------
   1. THE PIN IS `position: fixed`, NOT ScrollTrigger's pin.
      ScrollTrigger's pin works by wrapping the element in a pin-spacer and
      switching it to fixed for the duration. Since #hero-media is absolutely
      positioned and contributes nothing to layout height, the spacer buys us
      nothing - and it costs the one thing that hurts here: at the end of the
      pin, ScrollTrigger hands the element back to its document position, which
      is 400vh above the fold. The handoff has to have already taken ownership
      by that exact frame or the canvas visibly snaps away. That single-frame
      handover is what §2.6 means by "budget real time for this".
      A permanently-fixed element is the same visual result - locked to the
      viewport, does not move for the whole hero - with no handover frame to
      get wrong, and no pin/Flip ordering to preserve across rebuilds.
      It also makes §6's "no pin jump when the URL bar collapses" free: there
      is no pin-spacer whose height could be measured against a stale
      innerHeight.

   2. THE HANDOFF INTERPOLATES AGAINST THE DESTINATION'S LIVE RECT, rather
      than Flip.fit()'s snapshot.
      Flip.fit measures the destination once, when the tween is built, and
      animates toward those numbers. That is correct when the destination is
      still. Ours is not: .workspace__zone is scrolling up the page throughout
      the handoff, which is the whole reason the handoff feels like the card
      arriving rather than the media shrinking. Against a snapshot the media
      lands a little short and the gap grows with scroll speed - §6 asks for
      "no 1px drift, no overshoot", and a snapshot cannot promise that.
      Reading zone.getBoundingClientRect() per frame and lerping the fixed box
      toward it is exact by construction, at any scroll velocity, and it stays
      exact after the handoff finishes - the media simply keeps tracking the
      zone, so the card scrolls away with the section it belongs to.
      We keep the property §2.6 actually cares about: width and height are
      animated, NOT scale, so the DOM inside genuinely re-lays-out and the
      text and screenshot stay sharp.
   ======================================================================== */

export function heroScroll() {
  const media = document.getElementById('hero-media');
  const hero = document.querySelector('.hero');
  const zone = document.getElementById('workspace-zone');
  const ideaScene = document.querySelector('[data-scene="build"]');
  if (!media || !hero || !zone) return () => {};

  const sceneTl = buildSceneTimeline();

  /* One writer for the media's box, driven by a single 0..1 handoff value.
     0 = full-bleed viewport, square corners.
     1 = exactly the zone's rect (content pane under the Mac chrome; no radius).
     Past 1 it simply stays at 1, which is what glues the card to the section. */
  let handoff = 0;
  const applyBox = () => {
    const r = zone.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const t = handoff;

    const left   = 0   + (r.left   - 0)   * t;
    const top    = 0   + (r.top    - 0)   * t;
    const width  = vw  + (r.width  - vw)  * t;
    const height = vh  + (r.height - vh)  * t;

    media.style.left = `${left}px`;
    media.style.top = `${top}px`;
    media.style.width = `${width}px`;
    media.style.height = `${height}px`;
    /* Zone sits inside .workspace__browser; corners are square under the chrome. */
    media.style.borderRadius = '0px';

    /* Once seated, the tab shot owns the well. Keeping #hero-media visible
       under a transparent zone left stage glow / boot chrome reading as a
       "loader behind the preview". Hide as soon as handoff completes; restore
       on scroll-back while t < 1. Also hide when the well has scrolled clear. */
    const seated = t >= 1;
    const offscreen = seated && (r.bottom < -200 || r.top > vh + 200);
    media.style.visibility = (seated || offscreen) ? 'hidden' : 'visible';

    zone.classList.toggle('is-occupied', t > 0.02);
    zone.classList.toggle('is-seated', seated);
  };

  /* Last plate stays painted until Flip is a few percent in.
     Do not write autoAlpha while t is 0 — that would unhide the idea scene
     during prompt/plan. Once Flip has written, clear so the scene timeline
     owns the node again on the way back. */
  let ideaHoldArmed = false;
  const applyIdeaHold = (t) => {
    if (!ideaScene) return;
    if (t <= 0) {
      if (ideaHoldArmed) {
        gsap.set(ideaScene, { clearProps: 'opacity,visibility,y,filter,transform' });
        ideaHoldArmed = false;
        sceneTl.progress(sceneTl.progress());
      }
      return;
    }
    ideaHoldArmed = true;
    const fade = Math.min(1, Math.max(0, t / HANDOFF_IDEA_FADE));
    gsap.set(ideaScene, {
      autoAlpha: 1 - fade,
      y: -SCENE_EXIT_Y * fade,
      filter: `blur(${SCENE_EXIT_BLUR * fade}px)`,
    });
  };

  /* §5.1 / §2.8 tier 4 - reduced motion.
     No pin, no scrub, no handoff: the canvas simply holds its poster frame in
     the hero, exactly as the spec's "video shows frame 0 only" describes, and
     the workspace well shows the same still the handoff would have carried
     there. Nothing is created that could later move.
     The `rm` class on <html> is what re-scopes the fixed canvas back inside
     the hero - same CSS the <480px tier uses, because it is the same need. */
  if (prefersReducedMotion()) {
    sceneTl.progress(0);
    /* progress(0) leaves the stage in its scrub START state - dimmed, blurred
       and pushed back, because that state exists to hand the frame to the
       headline before the scroll takes it back. With no scroll to take it
       back, that reads as a half-rendered page. So the resting state is
       applied directly: the poster frame, clean, in its column. */
    const wide = window.matchMedia('(min-width: 1100px)').matches;
    gsap.set('.stage', {
      clearProps: 'filter',
      opacity: wide ? 1 : 0.45,
      scale: 1,
      xPercent: wide ? STAGE_COL_X : 0,
    });
    return () => {
      gsap.set('.stage', { clearProps: 'all' });
      sceneTl.kill();
    };
  }

  const created = [];

  /* ---- System B: the scrub ----------------------------------------------
     1:1 with scroll. A second lerp on top of Lenis made the right canvas
     lag the left copy, so PLAN was still up while the idea list was already
     the active text. ideaScrub is also scrub:true; both clocks must match. */
  created.push(ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => { sceneTl.progress(self.progress); },
  }));

  /* Workflow ring: one-shot intro while panel 2 statement is the active copy.
     Matches measureHeroBreaks (statement at 55% → plan; idea copy at 72% → idea). */
  const statement = document.querySelector('.hero__statement');
  const ideaCopy = document.querySelector('.hero__idea');
  if (statement && ideaCopy) {
    created.push(ScrollTrigger.create({
      trigger: statement,
      start: 'top 55%',
      endTrigger: ideaCopy,
      end: 'top 72%',
      onEnter: () => { playWfIntro(); },
      onEnterBack: () => { playWfIntro(); },
      onLeave: () => { resetWfInternals(); },
      onLeaveBack: () => { resetWfInternals(); },
    }));
  }

  created.push(ScrollTrigger.create({ onUpdate: applyBox, onRefresh: applyBox }));

  /* §5.3 - the canvas and its scenes are animated only while the hero (and
     the card it becomes) is on screen. Past that they are a parked box, and a
     standing compositor hint on a parked box is pure cost. */
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const hint = (on) => {
    media.style.willChange = on ? 'left, top, width, height' : '';
    scenes.forEach((el) => { el.style.willChange = on ? 'opacity, transform, filter' : ''; });
  };
  hint(true);
  created.push(ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    endTrigger: zone,
    end: 'bottom top',
    onToggle: (self) => hint(self.isActive),
  }));

  /* ---- ACT 4: the handoff window ----------------------------------------
     Starts as the well enters the viewport, ends at the well's centre.
     #flip-start stays in the DOM as a 1px marker; it is not this clock.
     A 100vh spacer made the last plate vanish into an empty HUD frame
     before the morph began. */
  created.push(ScrollTrigger.create({
    trigger: zone,
    start: 'top bottom',
    end: 'center center',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      handoff = self.progress;
      applyIdeaHold(self.progress);
      applyBox();
    },
    onLeave: () => { handoff = 1; applyIdeaHold(1); applyBox(); },
    onLeaveBack: () => { handoff = 0; applyIdeaHold(0); applyBox(); },
    onRefresh: (self) => {
      handoff = self.progress;
      applyIdeaHold(self.progress);
      applyBox();
    },
  }));

  /* ---- ACT 5: the arrival reveal ---------------------------------------
     Reverses on scroll-up, which is why toggleActions is not `once`. The
     target already carries its hidden state from CSS, so nothing flashes
     between first paint and this binding.

     Act 5 reveals the Build / Test / Ship & evolve tab stack beside the well
     once the canvas has seated.

     If these selectors ever match nothing the length guard below turns Act 5
     into a no-op rather than an error. */
  const arrivalTargets = [...document.querySelectorAll('[data-ws-aside]')];
  if (arrivalTargets.length) {
    const arrival = gsap.fromTo(arrivalTargets,
      { autoAlpha: 0, filter: 'blur(12px)', y: '2em' },
      {
        autoAlpha: 1, filter: 'blur(0px)', y: 0,
        duration: DUR.base, stagger: STAGGER.item, ease: EASE.enter,
        scrollTrigger: {
          trigger: zone,
          start: 'center center+=100',
          toggleActions: 'play none none reverse',
        },
      });
    created.push(arrival.scrollTrigger);
  }

  return () => {
    created.forEach((t) => t?.kill?.());
    resetWfInternals();
    sceneTl.kill();
    hint(false);
    zone.classList.remove('is-occupied');
    zone.classList.remove('is-seated');
    media.removeAttribute('style');
  };
}
