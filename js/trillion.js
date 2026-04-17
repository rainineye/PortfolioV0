(function () {
  var root = document.querySelector(".story-trillion");
  var closeBtn = document.getElementById("closeBtn");
  var isEmbedded = window.parent !== window;

  if (root) {
    root.setAttribute("data-embedded", isEmbedded ? "true" : "false");
  }

  if (!closeBtn) return;

  closeBtn.addEventListener("click", function () {
    if (isEmbedded) {
      window.parent.postMessage({ type: "closeTrillionOverlay" }, "*");
    } else if (window.history.length > 1) {
      window.history.back();
    }
  });

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
