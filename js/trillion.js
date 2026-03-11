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
})();
