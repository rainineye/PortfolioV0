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

// Two-stage scroll snap
// Stage 0→1: first scroll down → snap to carousel view (carousel bottom + 48px gap)
// Stage 1→2: next scroll down → snap to chronological section (top - 16px)
// Beyond stage 2: free scroll
(function () {
  var carousel = document.querySelector(".project-list-section");
  var chrono   = document.querySelector(".chronological-bleed");
  if (!carousel || !chrono) return;

  function isDesktopSnapEnabled() {
    return window.innerWidth > 768;
  }

  var snap1  = null;
  var snap2  = null;
  var stage  = 0;   // current snap stage
  var locked = false; // true while animating or cooling down
  var raf    = null;

  function compute() {
    var r = carousel.getBoundingClientRect();
    snap1 = Math.round(r.top + window.scrollY + r.height - window.innerHeight + 48);
    snap2 = Math.round(chrono.getBoundingClientRect().top + window.scrollY - 16);
  }

  window.addEventListener("load", compute);

  function jumpTo(dest, nextStage) {
    if (raf) cancelAnimationFrame(raf);
    locked = true;
    stage  = nextStage;
    window.scrollTo(0, dest);
    setTimeout(function () { locked = false; }, 800);
  }

  function onDown() {
    if (!isDesktopSnapEnabled()) return;
    if (locked) return;
    if (snap1 === null) compute();
    if (stage === 0) jumpTo(snap1, 1);
    else if (stage === 1) jumpTo(snap2, 2);
    // stage 2+: free scroll, no snap
  }

  // Wheel: take only the very first event of each gesture stream
  var wheelArmed = true;
  var armTimer   = null;

  window.addEventListener("wheel", function (e) {
    if (!isDesktopSnapEnabled()) return;
    if (locked) {
      // Drain inertia — reset the arm timer but don't act
      clearTimeout(armTimer);
      armTimer = setTimeout(function () { wheelArmed = true; }, 300);
      return;
    }
    if (e.deltaY <= 0) {
      // Upward wheel — always free, just reset arm
      clearTimeout(armTimer);
      armTimer = setTimeout(function () { wheelArmed = true; }, 300);
      return;
    }
    if (wheelArmed) {
      wheelArmed = false;
      onDown();
    }
    clearTimeout(armTimer);
    armTimer = setTimeout(function () { wheelArmed = true; }, 300);
  }, { passive: true });

  // Touch
  var touchStartY = null;
  window.addEventListener("touchstart", function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (touchStartY === null) return;
    if (!isDesktopSnapEnabled()) {
      touchStartY = null;
      return;
    }
    var delta = touchStartY - e.changedTouches[0].clientY;
    touchStartY = null;
    if (delta > 30) onDown();
  }, { passive: true });
})();

// Mobile project cards: tap to expand/collapse the detail variant
(function () {
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".project-card-mobile[data-mobile-card]")
  );
  if (!cards.length) return;
  var projects = window.PORTFOLIO_PROJECTS || [];

  function getProject(projectId) {
    return projects.find(function (project) {
      return project.id === projectId;
    }) || null;
  }

  function syncPreview(card, imageIndex) {
    var preview = card.querySelector("[data-mobile-preview]");
    var image = card.querySelector("[data-preview-image]");
    var dots = card.querySelectorAll("[data-preview-dot]");
    if (!preview || !image) return;

    var projectId = preview.getAttribute("data-project-id");
    var project = getProject(projectId);
    if (!project || !project.images || !project.images.length) return;

    var normalizedIndex = ((imageIndex % project.images.length) + project.images.length) % project.images.length;
    image.src = project.images[normalizedIndex];
    image.alt = project.name + " image " + (normalizedIndex + 1);
    preview.setAttribute("data-current-image", String(normalizedIndex));
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === normalizedIndex);
    });
  }

  function setExpanded(card, expanded) {
    card.classList.toggle("is-expanded", expanded);
    card.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (expanded) {
      syncPreview(card, Number(card.querySelector("[data-mobile-preview]") && card.querySelector("[data-mobile-preview]").getAttribute("data-current-image")) || 0);
    }
  }

  function toggleCard(card) {
    var nextExpanded = !card.classList.contains("is-expanded");
    cards.forEach(function (otherCard) {
      setExpanded(otherCard, otherCard === card ? nextExpanded : false);
    });
  }

  cards.forEach(function (card) {
    syncPreview(card, 0);

    card.addEventListener("click", function (e) {
      var detailLink = e.target.closest(".project-card-mobile-detail-link");
      if (detailLink) return;

      var preview = e.target.closest("[data-mobile-preview]");
      if (preview && card.classList.contains("is-expanded")) {
        e.preventDefault();
        var current = Number(preview.getAttribute("data-current-image")) || 0;
        syncPreview(card, current + 1);
        return;
      }

      toggleCard(card);
    });

    card.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target.closest(".project-card-mobile-detail-link")) return;
      e.preventDefault();
      toggleCard(card);
    });
  });
})();
