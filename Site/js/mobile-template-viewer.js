(function () {
  'use strict';

  var PHONE_QUERY = '(max-width: 809.98px)';
  var CARD_SELECTOR = '[data-framer-name="Made With"] .framer-j2DWm';
  var PREVIEW_LABEL = 'Open Preview';
  var TEMPLATE_LABEL = 'Use Template';
  var lastOpenAt = 0;

  function isPhone() {
    return window.matchMedia(PHONE_QUERY).matches;
  }

  function largestSrc(img) {
    var fallback = img.currentSrc || img.getAttribute('src') || '';
    var srcset = img.getAttribute('srcset') || '';
    if (!srcset) return fallback;

    var bestUrl = fallback;
    var bestWidth = 0;
    srcset.split(',').forEach(function (candidate) {
      var parts = candidate.trim().split(/\s+/);
      var url = parts[0];
      var width = 0;
      if (parts[1] && /w$/.test(parts[1])) width = parseInt(parts[1], 10) || 0;
      if (url && width >= bestWidth) {
        bestWidth = width;
        bestUrl = url;
      }
    });
    return bestUrl || fallback;
  }

  function cardTitle(card) {
    var title = card.querySelector('.framer-1ei3sjd');
    var text = title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
    return text || 'Template';
  }

  function linkForLabel(card, label) {
    var anchors = card.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      var text = (anchors[i].textContent || '').replace(/\s+/g, ' ').trim();
      if (text !== label) continue;
      var href = anchors[i].getAttribute('href');
      if (!href) return null;
      return {
        href: href,
        target: anchors[i].getAttribute('target') || '_blank'
      };
    }
    return null;
  }

  function makeAction(className, label, link) {
    var el;
    if (link) {
      el = document.createElement('a');
      el.href = link.href;
      el.target = link.target || '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el = document.createElement('button');
      el.type = 'button';
    }
    el.className = className;
    el.textContent = label;
    return el;
  }

  function closeLightbox() {
    var existing = document.getElementById('bjc-template-lightbox');
    if (existing) existing.remove();
    document.documentElement.classList.remove('bjc-lightbox-open');
  }

  function openLightbox(card) {
    closeLightbox();

    var image = card.querySelector('.framer-onxy6i img');
    if (!image) return;

    var title = cardTitle(card);
    var root = document.createElement('div');
    root.id = 'bjc-template-lightbox';
    root.className = 'bjc-template-lightbox';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', title);

    var stage = document.createElement('div');
    stage.className = 'bjc-template-lightbox__stage';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'bjc-template-lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00d7';

    var frame = document.createElement('div');
    frame.className = 'bjc-template-lightbox__frame';

    var fullImage = document.createElement('img');
    fullImage.alt = title;
    fullImage.src = largestSrc(image);

    var actions = document.createElement('div');
    actions.className = 'bjc-template-lightbox__actions';
    actions.appendChild(makeAction('bjc-template-lightbox__preview', PREVIEW_LABEL, linkForLabel(card, PREVIEW_LABEL)));
    actions.appendChild(makeAction('bjc-template-lightbox__template', TEMPLATE_LABEL, linkForLabel(card, TEMPLATE_LABEL)));

    frame.appendChild(fullImage);
    stage.appendChild(closeBtn);
    stage.appendChild(frame);
    stage.appendChild(actions);
    root.appendChild(stage);
    document.body.appendChild(root);
    document.documentElement.classList.add('bjc-lightbox-open');
    closeBtn.focus();

    closeBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    });

    root.addEventListener('click', function (event) {
      if (event.target === root) closeLightbox();
    });
  }

  function onCardActivate(event) {
    if (!isPhone()) return;
    if (event.target.closest && event.target.closest('#bjc-template-lightbox')) return;

    var card = event.target.closest && event.target.closest(CARD_SELECTOR);
    if (!card) return;
    if (event.target.closest && event.target.closest('a, button')) return;
    if (Date.now() - lastOpenAt < 450) return;

    lastOpenAt = Date.now();
    event.preventDefault();
    event.stopPropagation();
    openLightbox(card);
  }

  document.addEventListener('click', onCardActivate, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeLightbox();
  });

  window.matchMedia(PHONE_QUERY).addEventListener('change', function (event) {
    if (!event.matches) closeLightbox();
  });
})();
