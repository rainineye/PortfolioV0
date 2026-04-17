(function () {
  var root = document.querySelector(".story-trillion");
  var closeBtn = document.getElementById("closeBtn");
  var isEmbedded = window.parent !== window;

  if (root) {
    root.setAttribute("data-embedded", isEmbedded ? "true" : "false");
  }

  // ── Scroll progress / reading indicator ──────────────────────────────────
  var progressEl   = document.createElement("div");
  var trackEl      = document.createElement("div");
  var fillEl       = document.createElement("div");
  var thumbEl      = document.createElement("div");
  progressEl.className         = "scroll-progress";
  trackEl.className            = "scroll-progress__track";
  fillEl.className             = "scroll-progress__fill";
  thumbEl.className            = "scroll-progress__thumb";
  fillEl.appendChild(thumbEl);
  progressEl.appendChild(trackEl);
  progressEl.appendChild(fillEl);
  document.body.appendChild(progressEl);

  function updateScrollProgress() {
    var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
    var maxScroll  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
    fillEl.style.height = (pct * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (!closeBtn) return;

  // Switch × stroke color when scrolled past the dark hero image into white area
  var heroSection = document.querySelector(".title-image-section");
  if (heroSection) {
    function updateCloseBtnColor() {
      var heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom <= 60) {
        closeBtn.classList.add("close-btn--light");
      } else {
        closeBtn.classList.remove("close-btn--light");
      }
    }
    window.addEventListener("scroll", updateCloseBtnColor, { passive: true });
    updateCloseBtnColor();
  }
})();
