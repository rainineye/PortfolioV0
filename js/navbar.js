(function () {
  var navRoot = document.querySelector("[data-nav-root]");
  if (!navRoot) return;

  function renderTab(label, config) {
    var className = "tab" + (config.active ? " active" : "");
    var attrs = ' class="' + className + '"';

    if (config.active && config.kind === "button") {
      attrs += ' type="button" aria-pressed="true"';
    } else if (config.kind === "button") {
      attrs += ' type="button" data-tab="' + config.dataTab + '" aria-pressed="false"';
    } else if (config.active) {
      attrs += ' aria-current="page"';
    } else {
      attrs += ' href="' + config.href + '"';
    }

    var tagName = config.kind === "button" ? "button" : (config.active ? "span" : "a");
    return "<" + tagName + attrs + ">" + label + "</" + tagName + ">";
  }

  var tabsMarkup = [
    renderTab("Projects", { kind: "button", dataTab: "projects", active: false }),
    '<span class="tab-sep" aria-hidden="true">,</span>',
    renderTab("Craft", { kind: "button", dataTab: "craft", active: false }),
    '<span class="tab-sep" aria-hidden="true">,</span>',
    renderTab("About", { kind: "button", dataTab: "about", active: false }),
  ].join("");

  navRoot.innerHTML = [
    '  <div class="nav-hello">',
    '    <img src="favicon.ico" alt="" class="nav-avatar" width="16" height="16" aria-hidden="true" />',
    '    <p class="hello-text">Hi! It&apos;s <span class="name">Mian</span>, <span class="role">Product</span><span class="slash"> / </span><span class="role">UX Lead</span></p>',
    "  </div>",
    '  <div class="tabs-row">',
    '    <div class="tabs" aria-label="Primary sections">' + tabsMarkup + "</div>",
    '    <div class="contact-fullscreen">',
    '      <a href="mailto:rainineyeweb3@gmail.com?subject=Portfolio%20Inquiry" class="contact-link">Contact</a>',
    '      <button type="button" class="fullscreen-btn" id="fullscreenBtn" aria-label="Enter fullscreen">',
    '        <img src="assets/icons/fullscreen--no--normal.svg" alt="" class="fullscreen-btn__icon" width="24" height="24" aria-hidden="true" />',
    "      </button>",
    "    </div>",
    "  </div>",
  ].join("");
})();
