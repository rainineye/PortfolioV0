// Craft tab — single-image slide viewer.
// Data comes from window.CRAFT_SLIDES (see js/craft-data.js).
//
// Rules of engagement:
//   - Images are shown with object-fit: contain (CSS). Never cropped.
//   - One slide visible at a time. Fade on change, no sliding track.
//   - Keyboard arrows, swipe, explicit nav buttons, and chapter jumps
//     all call the same activate(i) function.
(function () {
  var root = document.querySelector(".craft-inline");
  if (!root) return;

  var slides = Array.isArray(window.CRAFT_SLIDES) ? window.CRAFT_SLIDES : [];
  if (!slides.length) return;

  // -------------------------------------------------------------------------
  // Build the viewer DOM once. The caption updates in place; images are
  // pre-rendered into the stage and simply toggled via .is-current.
  // -------------------------------------------------------------------------

  root.innerHTML = [
    '<header class="craft-header">',
    '  <p class="craft-eyebrow">Craft <em>— objects, drawings, and modeled spaces.</em></p>',
    '  <nav class="craft-chapters" aria-label="Chapters"></nav>',
    "</header>",
    '<div class="craft-viewer">',
    '  <div class="craft-stage" role="region" aria-live="polite" aria-label="Slide image"></div>',
    '  <aside class="craft-caption" aria-label="Slide caption">',
    '    <div class="craft-caption__nav">',
    '      <button type="button" class="craft-nav-btn craft-nav-btn--prev" aria-label="Previous slide">',
    '        <svg class="craft-nav-btn__arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="10,7 5,12 10,17"/></svg>',
    '        <span class="craft-nav-btn__label">Previous</span>',
    "      </button>",
    '      <span class="craft-caption__counter" aria-live="polite"></span>',
    '      <button type="button" class="craft-nav-btn craft-nav-btn--next" aria-label="Next slide">',
    '        <span class="craft-nav-btn__label">Next</span>',
    '        <svg class="craft-nav-btn__arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="14,7 19,12 14,17"/></svg>',
    "      </button>",
    "    </div>",
    '    <div class="craft-caption__content">',
    '      <p class="craft-caption__chapter"></p>',
    '      <h2 class="craft-caption__title"></h2>',
    '      <p class="craft-caption__subtitle"></p>',
    '      <p class="craft-caption__body"></p>',
    "    </div>",
    '    <p class="craft-caption__meta"></p>',
    "  </aside>",
    "</div>",
    '<footer class="craft-footer">',
    '  <ul class="craft-dots" role="tablist" aria-label="Slides"></ul>',
    '  <p class="craft-hint">Use <kbd>←</kbd> <kbd>→</kbd> to navigate</p>',
    "</footer>",
  ].join("\n");

  var stage = root.querySelector(".craft-stage");
  var prevBtn = root.querySelector(".craft-nav-btn--prev");
  var nextBtn = root.querySelector(".craft-nav-btn--next");
  var chaptersNav = root.querySelector(".craft-chapters");
  var captionEl = root.querySelector(".craft-caption");
  var captionContent = root.querySelector(".craft-caption__content");
  var counterEl = root.querySelector(".craft-caption__counter");
  var chapterLabelEl = root.querySelector(".craft-caption__chapter");
  var titleEl = root.querySelector(".craft-caption__title");
  var subtitleEl = root.querySelector(".craft-caption__subtitle");
  var bodyEl = root.querySelector(".craft-caption__body");
  var metaEl = root.querySelector(".craft-caption__meta");
  var dotsList = root.querySelector(".craft-dots");

  // -------------------------------------------------------------------------
  // Build image elements (pre-rendered in the stage) + chapter buttons + dots
  // -------------------------------------------------------------------------

  // Build a chapter index: first slide index for each unique chapter,
  // in the order chapters first appear.
  var chapterFirst = [];
  var seen = {};
  slides.forEach(function (s, i) {
    if (!seen[s.chapter]) {
      seen[s.chapter] = true;
      chapterFirst.push({ chapter: s.chapter, index: i });
    }
  });

  // Chapter buttons
  chapterFirst.forEach(function (c, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "craft-chapter-btn";
    btn.setAttribute("data-index", String(c.index));
    btn.innerHTML =
      '<span>' + String(idx + 1).padStart(2, "0") + "</span>" + c.chapter;
    chaptersNav.appendChild(btn);
  });

  // Image elements + dots
  slides.forEach(function (s, i) {
    var img = document.createElement("img");
    img.className = "craft-stage__img";
    img.setAttribute("data-index", String(i));
    img.alt = s.title + (s.subtitle ? " — " + s.subtitle : "");
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    img.src = s.src;
    stage.appendChild(img);

    var li = document.createElement("li");
    li.setAttribute("role", "presentation");
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "craft-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1) + ": " + s.title);
    dot.setAttribute("data-index", String(i));
    li.appendChild(dot);
    dotsList.appendChild(li);
  });

  var imageEls = Array.prototype.slice.call(stage.querySelectorAll(".craft-stage__img"));
  var dotEls = Array.prototype.slice.call(dotsList.querySelectorAll(".craft-dot"));
  var chapterBtns = Array.prototype.slice.call(chaptersNav.querySelectorAll(".craft-chapter-btn"));

  // -------------------------------------------------------------------------
  // State + activation
  // -------------------------------------------------------------------------

  var current = -1;
  var pad2 = function (n) { return String(n).padStart(2, "0"); };

  function currentChapterFor(index) {
    var chapter = slides[index].chapter;
    // Highlight the chapter button whose span covers this slide (i.e. the
    // latest chapter button whose data-index is <= current).
    var active = chapterFirst[0];
    for (var k = 0; k < chapterFirst.length; k++) {
      if (chapterFirst[k].index <= index) active = chapterFirst[k];
    }
    return { chapter: chapter, activeEntry: active };
  }

  function activate(nextIndex) {
    nextIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (nextIndex === current) return;

    var previous = current;
    current = nextIndex;
    var slide = slides[current];

    // Cross-fade captions
    captionEl.classList.add("is-transitioning");
    window.setTimeout(function () {
      counterEl.textContent = pad2(current + 1) + " / " + pad2(slides.length);
      chapterLabelEl.textContent = slide.chapter;
      titleEl.textContent = slide.title;
      subtitleEl.textContent = slide.subtitle || "";
      subtitleEl.style.display = slide.subtitle ? "" : "none";
      bodyEl.textContent = slide.caption || "";
      metaEl.textContent = slide.meta || "";
      metaEl.style.display = slide.meta ? "" : "none";
      captionEl.classList.remove("is-transitioning");
    }, 180);

    // Swap the current image
    imageEls.forEach(function (img, i) {
      img.classList.toggle("is-current", i === current);
    });

    // Update dots
    dotEls.forEach(function (dot, i) {
      var on = i === current;
      dot.classList.toggle("is-current", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });

    // Update chapter buttons
    var ctx = currentChapterFor(current);
    chapterBtns.forEach(function (btn) {
      var idx = Number(btn.getAttribute("data-index"));
      btn.classList.toggle("is-current", idx === ctx.activeEntry.index);
    });

    // Update prev/next disabled state
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  // -------------------------------------------------------------------------
  // Event wiring
  // -------------------------------------------------------------------------

  prevBtn.addEventListener("click", function () { activate(current - 1); });
  nextBtn.addEventListener("click", function () { activate(current + 1); });

  dotEls.forEach(function (dot) {
    dot.addEventListener("click", function () {
      activate(Number(this.getAttribute("data-index")));
    });
  });

  chapterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activate(Number(this.getAttribute("data-index")));
    });
  });

  // Keyboard — left/right arrows, Home, End
  // Only active while we're on the Craft view, so we don't hijack arrows
  // on the Projects/About tabs.
  document.addEventListener("keydown", function (e) {
    var site = document.querySelector(".portfolio-site");
    if (!site || !site.classList.contains("view-craft")) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

    if (e.key === "ArrowRight") { e.preventDefault(); activate(current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); activate(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); activate(0); }
    else if (e.key === "End") { e.preventDefault(); activate(slides.length - 1); }
  });

  // Touch swipe — on the stage
  var touchStartX = null;
  var touchStartY = null;
  var SWIPE_THRESHOLD = 40; // px
  stage.addEventListener("touchstart", function (e) {
    if (!e.touches || !e.touches.length) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    var t = (e.changedTouches && e.changedTouches[0]) || null;
    if (!t) { touchStartX = null; return; }
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    // Only treat as a horizontal swipe if horizontal dominates
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) activate(current + 1);
      else activate(current - 1);
    }
  }, { passive: true });

  // Start at slide 0
  activate(0);
})();
