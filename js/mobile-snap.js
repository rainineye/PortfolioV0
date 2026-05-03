// Mobile-only snap-scroll between the hero and the active main content
// (chronological project list on home view, slide viewer on craft view).
//
// Why JS instead of pure CSS scroll-snap:
//   CSS scroll-snap handles the snapping but uses the browser's default smooth
//   easing — there's no way to customize the timing function for snap. We want:
//     - Bouncy easing (overshoot slightly, settle back) so the snap feels tactile.
//     - Momentum-aware behavior: a hard swipe should carry over into the snap;
//       the animation duration scales with the swipe's velocity, and the snap
//       target is biased in the direction of the swipe.
//   The CSS rules in main.css remain as a fallback — if this script fails to
//   load, users still get native snap (just without the bounce / momentum).
//
// Snap targets (per active view):
//   - .hero-section (y = 0)
//   - .chronological-bleed (home view) OR .craft-inline (craft view), at its offsetTop
// Within the main content (past its start), scrolling stays free.
//
// On about view neither chrono nor craft is visible → no snap.
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
  // Hysteresis state: are we currently "in" the main content zone (free scroll)?
  // Toggled by pickSnap based on scroll position with a 50px buffer in each
  // direction so small overshoot doesn't ping-pong us in and out.
  var inMain = false;

  // Velocity history — sampled from scroll events. We can't read the user's
  // touch velocity directly (the OS owns the gesture), but we can recover a
  // good approximation from how fast scroll position changes during/after the
  // gesture. Keeping a short rolling window lets us read the *peak* velocity
  // of the swipe rather than the ~0 velocity at the moment scrolling stops.
  var velocitySamples = []; // { time, v } in pixels-per-ms

  function recordVelocitySample(now, dt, dy) {
    if (dt <= 0) return;
    var v = dy / dt;
    velocitySamples.push({ time: now, v: v });
    // Keep ~1000ms of samples — long enough that the user's initial swipe
    // velocity is still in the buffer after the browser's natural momentum
    // scroll has played out (swipe + iOS momentum can total ~700-900ms).
    while (velocitySamples.length > 0 && now - velocitySamples[0].time > 1000) {
      velocitySamples.shift();
    }
  }

  // Peak (signed) velocity from recent history — represents the user's swipe
  // intent better than the instantaneous velocity at scroll-end (which is 0).
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

  // ---------------------------------------------------------------------------
  // Easing — easeOutBack: overshoots past the target, then settles back.
  // c1 controls the overshoot amount.
  // ---------------------------------------------------------------------------
  function easeOutBack(t) {
    var c1 = 1.5;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  // ---------------------------------------------------------------------------
  // The "main content" snap target depends on which view is active:
  //   - Home view   → .chronological-bleed (project list)
  //   - Craft view  → .craft-inline (slide viewer)
  //   - About view  → no main target (centered button, no scroll)
  // Visibility is determined by display:none → offsetParent is null.
  // ---------------------------------------------------------------------------
  function getMainTarget() {
    if (chrono && chrono.offsetParent !== null) return chrono;
    if (craftInline && craftInline.offsetParent !== null) return craftInline;
    return null;
  }

  function snapEnabled() {
    return getMainTarget() !== null;
  }

  function pickSnap() {
    var main = getMainTarget();
    if (!main) return null;

    var y = window.scrollY;
    var mainY = main.offsetTop;

    // Hysteresis state machine — prevents ping-pong AND recovers from small
    // momentum overshoot:
    //   - Enter "in main" zone only when scrolled clearly past mainY (50px
    //     buffer). User has committed to browsing main content.
    //   - Exit "in main" zone only when scrolled clearly back above mainY
    //     (50px buffer). User is heading back to hero.
    // While "in main" → free scroll (return null). Otherwise → snap based
    // on swipe direction. This handles the Craft view case where a gentle
    // swipe can momentum-overshoot a small mainY by 30-40px; the user
    // still gets a clean one-time landing at the craft start.
    if (!inMain && y >= mainY + 50) {
      inMain = true;
    } else if (inMain && y < mainY - 50) {
      inMain = false;
    }

    if (inMain) return null;

    var v = getSwipeVelocity();
    var DIRECTION_EPSILON = 0.05;

    if (v > DIRECTION_EPSILON) {
      // Swiped down → snap to main start.
      return { y: mainY, name: "main" };
    }
    if (v < -DIRECTION_EPSILON) {
      // Swiped up → snap to top.
      return { y: 0, name: "top" };
    }

    // No clear direction — pick the nearer of the two targets.
    return Math.abs(y) < Math.abs(mainY - y)
      ? { y: 0, name: "top" }
      : { y: mainY, name: "main" };
  }

  // ---------------------------------------------------------------------------
  // Animation — duration scales with velocity AND distance so the snap feels
  // like a natural deceleration from the swipe. easeOutBack at the tail adds
  // a slight overshoot/settle that registers as "spring".
  // ---------------------------------------------------------------------------
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
        // Final clamp to exact target (rounding may leave a sub-pixel drift).
        window.scrollTo(0, targetY);
        isAnimating = false;
        velocitySamples.length = 0; // reset so the next swipe starts fresh
      }
    }

    requestAnimationFrame(step);
  }

  function maybeSnap() {
    if (isAnimating) return;
    if (!snapEnabled()) return;

    var target = pickSnap();
    if (!target) return;
    if (Math.abs(target.y - window.scrollY) < 5) return;

    var distance = Math.abs(target.y - window.scrollY);
    // Floor velocity at 0.4 so low-velocity / stationary snaps still get
    // a sensible duration. Cap at 2.5 so very fast swipes don't overshoot
    // into a too-long animation.
    var v = Math.max(Math.min(Math.abs(getSwipeVelocity()), 2.5), 0.4);
    // Natural inertia duration. Long target + slow swipe = longer animation.
    // Short target + fast swipe = brisk snap. Bounded to avoid extremes.
    var duration = Math.min(Math.max(distance / v * 1.4, 380), 950);

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

  // Use the native `scrollend` event when available — it fires only after
  // both the gesture AND the browser's momentum scroll have completed, which
  // is exactly when we want to snap. Fallback: a velocity-aware debounce
  // that waits longer when the swipe was fast (giving momentum room to play).
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("onscrollend" in window) {
    window.addEventListener("scrollend", function () {
      // Defer one frame so the very last scroll position is settled.
      requestAnimationFrame(maybeSnap);
    }, { passive: true });
  } else {
    window.addEventListener("scroll", function () {
      var v = Math.abs(getSwipeVelocity());
      // 120ms baseline + up to 380ms extra wait for high-velocity swipes,
      // letting the browser's natural momentum play out before we snap.
      var delay = 120 + Math.min(v * 200, 380);
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(maybeSnap, delay);
    }, { passive: true });
  }

  // If the viewport widens past the mobile breakpoint, restore native snap
  // and stop driving the animation in JS.
  window.addEventListener(
    "resize",
    function () {
      var nowEnabled = window.innerWidth <= MOBILE_BP;
      if (enabled && !nowEnabled) {
        html.style.scrollSnapType = "";
        html.style.scrollBehavior = "";
        window.removeEventListener("scroll", onScroll);
        enabled = false;
      }
    },
    { passive: true }
  );
})();
