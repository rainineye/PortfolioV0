// Mobile-only one-time snap-scroll between the hero and the active main
// content (chronological project list on home view, slide viewer on craft
// view). The first downward swipe always lands the user at the main content
// start (even if iOS momentum scroll overshoots past it — we snap back).
// After that landing, scrolling is FREE — no further snap-back, no ping-pong.
// The user gets a one-time tactile "land at the project list / slide viewer"
// then can browse normally. Returning the user near the hero top resets the
// state so the next downward swipe re-triggers the landing.
//
// Why JS instead of pure CSS scroll-snap:
//   CSS scroll-snap uses the browser's default smooth easing — there's no
//   way to customize the timing function. We want a bouncier easeOutBack
//   for the snap, plus momentum-aware animation duration (faster swipes
//   produce briefer snaps, slow drags produce longer settles).
(function () {
  "use strict";

  var MOBILE_BP = 768;
  var html = document.documentElement;

  var hero = document.querySelector(".hero-section");
  var chrono = document.querySelector(".chronological-bleed");
  var craftInline = document.querySelector(".craft-inline");
  if (!hero || (!chrono && !craftInline)) return;

  var enabled = window.innerWidth <= MOBILE_BP;
  if (!enabled) return;

  // Take over from CSS scroll-snap so JS can drive the animation.
  html.style.scrollSnapType = "none";
  html.style.scrollBehavior = "auto";

  var isAnimating = false;
  var scrollEndTimer = null;
  var lastScrollY = window.scrollY;
  var lastTime = performance.now();
  var lastSnapTime = 0;
  var SNAP_COOLDOWN = 250; // ms — guards against double-snap when both
                           // scrollend and the debounce fallback fire.

  // Has the user already had their one-time landing at the main content?
  // Reset to false when the user scrolls back near the hero top.
  var hasLandedAtMain = false;

  // Velocity history — sampled from scroll events. We can't read the user's
  // touch velocity directly, but we can recover it from how fast scroll
  // position changes during/after the gesture.
  var velocitySamples = [];

  function recordVelocitySample(now, dt, dy) {
    if (dt <= 0) return;
    var v = dy / dt;
    velocitySamples.push({ time: now, v: v });
    while (velocitySamples.length > 0 && now - velocitySamples[0].time > 1000) {
      velocitySamples.shift();
    }
  }

  function getSwipeVelocity() {
    if (velocitySamples.length === 0) return 0;
    var peak = 0;
    var peakAbs = 0;
    for (var i = 0; i < velocitySamples.length; i++) {
      var v = velocitySamples[i].v;
      var a = Math.abs(v);
      if (a > peakAbs) {
        peakAbs = a;
        peak = v;
      }
    }
    return peak;
  }

  // easeOutBack — overshoots past the target then settles back.
  function easeOutBack(t) {
    var c1 = 1.5;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  // Active main snap target (depends on current view).
  function getMainTarget() {
    if (chrono && chrono.offsetParent !== null) return chrono;
    if (craftInline && craftInline.offsetParent !== null) return craftInline;
    return null;
  }

  // Absolute document Y for an element. More reliable than offsetTop in the
  // presence of unusual offsetParent chains.
  function absoluteY(el) {
    var rect = el.getBoundingClientRect();
    return Math.round(rect.top + window.scrollY);
  }

  function snapEnabled() {
    return getMainTarget() !== null;
  }

  function pickSnap() {
    var main = getMainTarget();
    if (!main) return null;

    var y = window.scrollY;
    var mainY = absoluteY(main);

    // Reset the landing flag when user is back near the hero top — so the
    // next downward swipe will re-trigger the one-time landing.
    if (y < 30) {
      hasLandedAtMain = false;
    }

    var v = getSwipeVelocity();
    var DIRECTION_EPSILON = 0.02; // very low — any meaningful direction counts

    // After the user has had their landing at main, snap is mostly OFF (free
    // scroll). One exception: if they scroll significantly back toward the
    // hero (above mainY/2) with an upward velocity, snap them to top.
    if (hasLandedAtMain) {
      if (v < -DIRECTION_EPSILON && y < mainY * 0.5) {
        return { y: 0, name: "top" };
      }
      return null;
    }

    // First-time logic: any downward direction commits to a landing at main,
    // any upward direction snaps to top. The "one-time" character means we
    // honor this even if iOS momentum has carried the user past mainY —
    // snap back to mainY so the chronological title is at the top.
    if (v > DIRECTION_EPSILON) {
      return { y: mainY, name: "main" };
    }
    if (v < -DIRECTION_EPSILON) {
      return { y: 0, name: "top" };
    }

    // No direction (rare — programmatic scroll, etc) — pick nearest.
    return Math.abs(y) < Math.abs(mainY - y)
      ? { y: 0, name: "top" }
      : { y: mainY, name: "main" };
  }

  function animateTo(targetY, duration) {
    isAnimating = true;
    var startY = window.scrollY;
    var distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      isAnimating = false;
      return;
    }

    var startTime = performance.now();

    function step(now) {
      var elapsed = now - startTime;
      var t = Math.min(elapsed / duration, 1);
      var eased = easeOutBack(t);
      window.scrollTo(0, startY + distance * eased);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        isAnimating = false;
        velocitySamples.length = 0;
      }
    }

    requestAnimationFrame(step);
  }

  function maybeSnap() {
    if (isAnimating) return;
    if (!snapEnabled()) return;
    if (performance.now() - lastSnapTime < SNAP_COOLDOWN) return;

    var target = pickSnap();
    if (!target) return;
    if (Math.abs(target.y - window.scrollY) < 5) return;

    // Mark "landed at main" BEFORE animating, so subsequent scroll events
    // during/after the animation don't re-trigger.
    if (target.name === "main") {
      hasLandedAtMain = true;
    } else if (target.name === "top") {
      hasLandedAtMain = false;
    }

    var distance = Math.abs(target.y - window.scrollY);
    var v = Math.max(Math.min(Math.abs(getSwipeVelocity()), 2.5), 0.4);
    var duration = Math.min(Math.max((distance / v) * 1.4, 380), 950);

    lastSnapTime = performance.now();
    animateTo(target.y, duration);
  }

  function onScroll() {
    if (isAnimating) return;
    var now = performance.now();
    var dt = now - lastTime;
    var y = window.scrollY;
    recordVelocitySample(now, dt, y - lastScrollY);
    lastScrollY = y;
    lastTime = now;
  }

  // Initial state detection: if the page loaded with scroll position already
  // past the main content (e.g. browser scroll restoration after a reload),
  // treat the landing as already done — we don't want to yank the user back
  // to mainY when they reload partway through the cards.
  (function () {
    var main = getMainTarget();
    if (main && window.scrollY >= absoluteY(main) + 50) {
      hasLandedAtMain = true;
    }
  })();

  // Always attach BOTH the velocity-aware debounce fallback AND the native
  // scrollend listener (when available). The cooldown prevents double-snap
  // if both fire close together. This belt-and-suspenders approach ensures
  // snap fires even on browsers where scrollend exists in the API but
  // doesn't fire reliably for window scrolls.
  window.addEventListener("scroll", onScroll, { passive: true });

  function scheduleDebouncedSnap() {
    var v = Math.abs(getSwipeVelocity());
    // 120ms baseline + up to 380ms extra wait for high-velocity swipes,
    // letting the browser's natural momentum play out before we snap.
    var delay = 120 + Math.min(v * 200, 380);
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(maybeSnap, delay);
  }

  window.addEventListener("scroll", scheduleDebouncedSnap, { passive: true });

  if ("onscrollend" in window) {
    window.addEventListener(
      "scrollend",
      function () {
        clearTimeout(scrollEndTimer);
        requestAnimationFrame(maybeSnap);
      },
      { passive: true }
    );
  }

  // Restore native CSS snap if viewport widens past the mobile breakpoint.
  window.addEventListener(
    "resize",
    function () {
      var nowEnabled = window.innerWidth <= MOBILE_BP;
      if (enabled && !nowEnabled) {
        html.style.scrollSnapType = "";
        html.style.scrollBehavior = "";
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", scheduleDebouncedSnap);
        enabled = false;
      }
    },
    { passive: true }
  );
})();
