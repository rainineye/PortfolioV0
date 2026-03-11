// Fullscreen button
(function () {
  var btn = document.getElementById("fullscreenBtn");
  if (!btn) return;

  var icon = btn.querySelector(".fullscreen-btn__icon");
  var ICONS = {
    noNormal:  "assets/icons/fullscreen--no--normal.svg",
    noHover:   "assets/icons/fullscreen--no--hover.svg",
    yesNormal: "assets/icons/fullscreen--yes--normal.svg",
    yesHover:  "assets/icons/fullscreen--yes--hover.svg",
  };

  function isFs() { return !!document.fullscreenElement; }

  function setIcon(fs, hover) {
    if (!icon) return;
    icon.src = fs
      ? (hover ? ICONS.yesHover : ICONS.yesNormal)
      : (hover ? ICONS.noHover  : ICONS.noNormal);
  }

  function updateAria() {
    btn.setAttribute("aria-label", isFs() ? "Exit fullscreen" : "Enter fullscreen");
  }

  btn.addEventListener("mouseenter", function () { setIcon(isFs(), true); });
  btn.addEventListener("mouseleave", function () { setIcon(isFs(), false); });

  btn.addEventListener("click", function () {
    if (!isFs()) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  });

  document.addEventListener("fullscreenchange", function () {
    setIcon(isFs(), false);
    updateAria();
  });
})();

// Contact link — ensure mailto works (e.g. in embedded previews / restricted browsers)
// Tab navigation
(function () {
  var tabs = document.querySelectorAll(".tabs .tab[data-tab]");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-pressed", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-pressed", "true");
    });
  });
})();

// Overlay (Trillion case study)
(function () {
  var overlay = document.getElementById("trillionOverlay");
  var closeZone = document.getElementById("trillionOverlayClose");
  var frame = document.getElementById("trillionFrame");
  var projectItems = document.querySelectorAll(".project-item[data-project]");

  projectItems.forEach(function (item) {
    item.setAttribute("role", "link");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", "Open project " + item.getAttribute("data-project"));
  });

  function openOverlay(url) {
    frame.src = url;
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    frame.src = "about:blank";
    document.body.style.overflow = "";
  }

  // Carousel item click → scroll to project section
  document.addEventListener("click", function (e) {
    var item = e.target.closest(".project-item");
    if (item) {
      var project = item.getAttribute("data-project");
      if (project) {
        var section = document.getElementById("project-" + project);
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;

    var item = e.target.closest(".project-item");
    if (!item) return;

    e.preventDefault();
    item.click();
  });

  // Open overlay for Trillion Full Story link
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[data-overlay="trillion"]');
    if (link) {
      e.preventDefault();
      openOverlay("006_Trillion.html");
    }
  });

  if (closeZone) {
    closeZone.addEventListener("click", closeOverlay);
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("active")) closeOverlay();
  });

  // Close via postMessage from iframe
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "closeTrillionOverlay") closeOverlay();
  });
})();

// Scroll snap: jump to chronological section once past the project carousel
(function () {
  var carousel = document.querySelector(".project-list-section");
  var target   = document.querySelector(".chronological-bleed");
  if (!carousel || !target) return;

  var OFFSET  = 16;    // px gap from viewport top
  var fired   = false; // only snap once per downward pass
  var rafId   = null;

  // Spring-bounce easing: fast rush + slight overshoot + settle
  // c = damping (lower = bouncier), tuned for one clean overshoot
  function springEase(t) {
    var c  = 12;
    var w  = Math.sqrt(1 - (c / 20) * (c / 20)) * 2 * Math.PI;
    return 1 - Math.exp(-c * t / 2) * Math.cos(w * t);
  }

  function snapTo(targetY) {
    var startY    = window.scrollY;
    var distance  = targetY - startY;
    var duration  = 480; // ms — fast but not jarring
    var startTime = null;

    if (rafId) cancelAnimationFrame(rafId);

    function step(now) {
      if (!startTime) startTime = now;
      var t = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * springEase(t));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    }
    rafId = requestAnimationFrame(step);
  }

  // IntersectionObserver fires once when carousel bottom edge leaves viewport upward
  var observer = new IntersectionObserver(function (entries) {
    var entry = entries[0];
    // boundingClientRect.bottom < 0 → bottom of carousel has scrolled above viewport
    if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
      if (!fired) {
        fired = true;
        var snapTarget = target.getBoundingClientRect().top + window.scrollY - OFFSET;
        snapTo(snapTarget);
      }
    } else {
      // reset when carousel comes back into view (user scrolled back up)
      fired = false;
    }
  }, { threshold: 0 });

  observer.observe(carousel);
})();
