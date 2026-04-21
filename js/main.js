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
  var site = document.querySelector(".portfolio-site");
  var tabs = document.querySelectorAll(".tabs .tab[data-tab]");
  var aboutSection = document.querySelector(".about-inline");
  var craftSection = document.querySelector(".craft-inline");
  var heroMessage = document.querySelector(".hero-msg-section");
  var projectListSection = document.querySelector(".project-list-section");
  var chronologicalBleed = document.querySelector(".chronological-bleed");

  function setActiveTab(tabName) {
    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-tab") === tabName;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setView(viewName) {
    var isAbout = viewName === "about";
    var isCraft = viewName === "craft";
    var isHome = !isAbout && !isCraft;

    if (site) {
      site.classList.toggle("view-about", isAbout);
      site.classList.toggle("view-craft", isCraft);
    }
    if (aboutSection) aboutSection.setAttribute("aria-hidden", isAbout ? "false" : "true");
    if (craftSection) craftSection.setAttribute("aria-hidden", isCraft ? "false" : "true");
    if (heroMessage) heroMessage.setAttribute("aria-hidden", isHome ? "false" : "true");
    if (projectListSection) projectListSection.setAttribute("aria-hidden", isHome ? "false" : "true");
    if (chronologicalBleed) chronologicalBleed.setAttribute("aria-hidden", isHome ? "false" : "true");

    // Scrolling to the top makes the transition feel like a real tab change
    // rather than keeping old scroll position from the previous view.
    if (isCraft || isAbout) {
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
  }

  function activate(tabName, syncHash) {
    setActiveTab(tabName);
    var view = tabName === "about" ? "about"
             : tabName === "craft" ? "craft"
             : "home";
    setView(view);

    if (!syncHash) return;

    if (tabName === "about") {
      window.history.replaceState(null, "", "#about");
    } else if (tabName === "craft") {
      window.history.replaceState(null, "", "#craft");
    } else if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function syncFromLocation() {
    var hash = window.location.hash;
    var target = hash === "#about" ? "about"
               : hash === "#craft" ? "craft"
               : "projects";
    activate(target, false);
  }

  syncFromLocation();
  window.addEventListener("hashchange", syncFromLocation);

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(this.getAttribute("data-tab"), true);
      // Drop focus so the focus ring doesn't linger on the just-clicked tab.
      // Keyboard users saw the ring when tabbing onto it; releasing focus
      // after activation matches the behavior of native app-style tabs.
      this.blur();
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
    if (window.innerWidth <= 768) return false;
    // Disable snap when another tab's view is active (Craft/About) — those views
    // hide the carousel and chronological section, so snapping into them is nonsensical.
    var site = document.querySelector(".portfolio-site");
    if (site && (site.classList.contains("view-craft") || site.classList.contains("view-about"))) {
      return false;
    }
    return true;
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
  var DRAG_RATIO_THRESHOLD = 0.18;

  function getProject(projectId) {
    return projects.find(function (project) {
      return project.id === projectId;
    }) || null;
  }

  function getPointX(event) {
    if (event.touches && event.touches.length) return event.touches[0].clientX;
    if (event.changedTouches && event.changedTouches.length) return event.changedTouches[0].clientX;
    return event.clientX;
  }

  function setPreviewPosition(card, imageIndex, dragOffset, animate) {
    var preview = card.querySelector("[data-mobile-preview]");
    var track = card.querySelector("[data-preview-track]");
    var dots = card.querySelectorAll("[data-preview-dot]");
    if (!preview || !track) return;

    var projectId = preview.getAttribute("data-project-id");
    var project = getProject(projectId);
    if (!project || !project.images || !project.images.length) return;

    var normalizedIndex = ((imageIndex % project.images.length) + project.images.length) % project.images.length;
    preview.setAttribute("data-current-image", String(normalizedIndex));
    preview.classList.toggle("is-dragging", !animate);

    var width = preview.clientWidth || 1;
    var offset = typeof dragOffset === "number" ? dragOffset : 0;
    var translateX = -normalizedIndex * width + offset;
    track.style.transform = "translate3d(" + translateX + "px, 0, 0)";

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === normalizedIndex);
    });
  }

  function syncPreview(card, imageIndex) {
    setPreviewPosition(card, imageIndex, 0, true);
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

    var preview = card.querySelector("[data-mobile-preview]");
    if (!preview) return;

    function clearDragState() {
      preview.classList.remove("is-dragging");
      preview.removeAttribute("data-drag-start-x");
      preview.removeAttribute("data-drag-current-x");
      preview.removeAttribute("data-dragging");
    }

    function handleDragStart(event) {
      if (!card.classList.contains("is-expanded")) return;
      var pointX = getPointX(event);
      preview.setAttribute("data-drag-start-x", String(pointX));
      preview.setAttribute("data-drag-current-x", String(pointX));
      preview.setAttribute("data-dragging", "true");
    }

    function handleDragMove(event) {
      if (preview.getAttribute("data-dragging") !== "true") return;
      if (!card.classList.contains("is-expanded")) return;

      var startX = Number(preview.getAttribute("data-drag-start-x"));
      if (!Number.isFinite(startX)) return;

      var currentX = getPointX(event);
      preview.setAttribute("data-drag-current-x", String(currentX));

      var deltaX = currentX - startX;
      var current = Number(preview.getAttribute("data-current-image")) || 0;
      setPreviewPosition(card, current, deltaX, false);
    }

    function handleDragEnd(event) {
      if (!card.classList.contains("is-expanded")) return;

      var startX = Number(preview.getAttribute("data-drag-start-x"));
      if (!Number.isFinite(startX)) {
        clearDragState();
        return;
      }

      var endX = getPointX(event);
      var deltaX = endX - startX;
      var current = Number(preview.getAttribute("data-current-image")) || 0;
      var width = preview.clientWidth || 1;
      var shouldSwitch = Math.abs(deltaX) > width * DRAG_RATIO_THRESHOLD;

      clearDragState();
      if (!shouldSwitch) {
        syncPreview(card, current);
        return;
      }

      syncPreview(card, deltaX < 0 ? current + 1 : current - 1);
    }

    preview.addEventListener("touchstart", handleDragStart, { passive: true });
    preview.addEventListener("touchmove", handleDragMove, { passive: true });
    preview.addEventListener("touchend", handleDragEnd, { passive: true });
    preview.addEventListener("mousedown", handleDragStart);
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
  });
})();
