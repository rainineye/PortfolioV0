// Project rendering
(function () {
  var projects = window.PORTFOLIO_PROJECTS;
  var projectList = document.getElementById("projectList");
  var projectsChronological = document.getElementById("projectsChronological");

  if (!Array.isArray(projects) || !projectList || !projectsChronological) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderCarouselLabels(labels) {
    if (labels.length <= 1) {
      return '<div class="label"><span>' + escapeHtml(labels[0]) + "</span></div>";
    }

    return (
      '<div class="labels-wrap">' +
      labels
        .map(function (label) {
          return '<div class="label"><span>' + escapeHtml(label) + "</span></div>";
        })
        .join("") +
      "</div>"
    );
  }

  function renderCardLabels(labels) {
    return labels
      .map(function (label) {
        return '<span class="project-card-label">' + escapeHtml(label) + "</span>";
      })
      .join("");
  }

  function renderRedirect(redirect) {
    if (redirect.type === "overlay" && redirect.variant === "trillion-full-story") {
      return (
        '<a href="#" class="project-card-redirect-item project-card-redirect-item--trillion" data-overlay="trillion">' +
        '<svg width="119" height="30" viewBox="0 0 119 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="redirect-icon" aria-label="Full Story">' +
        '<path class="redirect-icon__glyph" opacity="0.9" d="M13.5635 7.32178L21.2861 13.3286L21.4521 13.4575V14.7349L21.2861 14.8638L13.5635 20.8706L13.3506 21.0366L12.251 20.4868L12.0137 20.3677V17.519C9.39672 17.53 4.30876 18.9088 2.11523 24.5493L2.08301 24.6333L2.01953 24.6968C1.63592 25.0801 1.10554 25.0404 0.751953 24.8989C0.566628 24.8247 0.390337 24.7108 0.254883 24.5649C0.122701 24.4226 6.83608e-05 24.2155 0 23.9644C2.4863e-05 18.6913 2.02203 15.3451 4.61719 13.3286C7.02626 11.4569 9.89583 10.7553 12.0137 10.6724V7.90869L12.2275 7.78467L13.0859 7.28955L13.3359 7.14502L13.5635 7.32178Z" fill="#88A4A0"/>' +
        '<path class="redirect-icon__text" d="M33.2791 23V7.523H43.2541V9.287H35.1901V14.285H42.2671V16.028H35.1901V23H33.2791ZM45.6104 23L43.4264 20.795V12.017H45.2744L45.2534 20.354L46.3874 21.53H49.1174L51.2804 19.367V12.017H53.1284V23H51.2804V21.299L49.6004 23H45.6104ZM55.7139 23V7.523H57.5619V23H55.7139ZM60.1444 23V7.523H61.9924V23H60.1444ZM68.5162 23V21.236H76.1392L77.2732 20.081V16.994L76.1392 15.839H70.1542L67.9702 13.655V9.728L70.1542 7.523H78.3862V9.287H71.0152L69.8602 10.442L69.8812 13.004L71.0152 14.159H77.0002L79.1842 16.364V20.795L77.0002 23H68.5162ZM83.4304 23L81.4984 21.089V13.487H80.3434V12.017H81.5404L82.0024 9.203H83.3464V12.017H85.6774V13.487H83.3464V20.438L84.3334 21.467H86.1604V23H83.4304ZM89.5196 23L87.3146 20.795V14.222L89.5196 12.017H94.7276L96.9326 14.222V20.795L94.7276 23H89.5196ZM90.3176 21.53H93.9296L95.0846 20.375L95.0636 14.642L93.9296 13.487H90.3176L89.1626 14.642V20.375L90.3176 21.53ZM99.2774 23V12.017H101.125V13.991L103.036 12.017H105.85V13.865H103.12L101.125 15.923V23H99.2774ZM109.248 26.927L111.222 22.244H110.445L105.93 12.017H107.967L111.495 20.417H111.978L115.233 12.017H117.249L111.117 26.927H109.248Z" fill="black"/>' +
        "</svg></a>"
      );
    }

    return (
      '<button type="button" class="project-card-redirect-item" data-coming-soon disabled aria-disabled="true">' +
      '<img src="' + escapeHtml(redirect.icon) + '" alt="' + escapeHtml(redirect.alt) + '" class="redirect-icon" height="30" />' +
      "</button>"
    );
  }

  function renderCarouselItem(project) {
    return (
      '<div class="project-item" data-project="' + escapeHtml(project.id) + '">' +
      '<div class="project-number-badge"><span>' + escapeHtml(project.id) + "</span></div>" +
      '<div class="project-card-thumb">' +
      '<div class="project-card-bg"></div>' +
      '<div class="project-card-bg-hover"></div>' +
      renderCarouselLabels(project.labels) +
      '<div class="desc"><span>' + escapeHtml(project.description) + "</span></div>" +
      '<div class="title">' + escapeHtml(project.name) + "</div>" +
      "</div></div>"
    );
  }

  function renderPreview(project, index) {
    var previewClass = project.previewClass ? " " + project.previewClass : "";
    var leftClass = project.leftClass ? " " + project.leftClass : "";
    var loading = index === 0 ? "eager" : "lazy";

    return (
      '<div class="project-card-preview' + previewClass + '">' +
      '<div class="thumb-left' + leftClass + '">' +
      '<img src="' + escapeHtml(project.images[0]) + '" alt="' + escapeHtml(project.name) + '" width="464" height="268" loading="' + loading + '" />' +
      "</div>" +
      '<div class="thumb-mid">' +
      '<img src="' + escapeHtml(project.images[1]) + '" alt="' + escapeHtml(project.name) + '" width="472" height="268" loading="lazy" />' +
      "</div>" +
      '<div class="thumb-right">' +
      '<img src="' + escapeHtml(project.images[2]) + '" alt="' + escapeHtml(project.name) + '" width="472" height="268" loading="lazy" />' +
      "</div></div>"
    );
  }

  function renderProjectSection(project, index) {
    return (
      '<section class="project-section" id="project-' + escapeHtml(project.id) + '">' +
      '<div class="project-card">' +
      renderPreview(project, index) +
      '<div class="project-card-info">' +
      '<div class="project-card-title-block">' +
      '<div class="project-card-title-inner">' +
      '<div class="project-card-title-left">' +
      '<div class="project-card-column">' +
      '<div class="project-card-labels">' + renderCardLabels(project.labels) + "</div>" +
      '<div class="project-card-date-role">' +
      '<span class="project-card-date">' + escapeHtml(project.date) + "</span>" +
      '<span class="project-card-role">' + escapeHtml(project.role) + "</span>" +
      "</div></div>" +
      '<div class="project-card-name-wrap"><span class="project-card-name">' + escapeHtml(project.name) + "</span></div>" +
      '</div><div class="project-card-badge">' + escapeHtml(project.id) + "</div>" +
      "</div></div>" +
      '<div class="project-card-desc">' +
      '<div class="project-card-desc-title">' + escapeHtml(project.description) + "</div>" +
      '<div class="project-card-redirect">' +
      project.redirects.map(renderRedirect).join("") +
      "</div></div></div></div></section>"
    );
  }

  projectList.innerHTML = projects.concat(projects).map(renderCarouselItem).join("");
  projectsChronological.innerHTML = projects.map(renderProjectSection).join("");

  projectsChronological
    .querySelectorAll(".project-card-preview .thumb-left, .project-card-preview .thumb-mid, .project-card-preview .thumb-right")
    .forEach(function (slot) {
      var image = slot.querySelector("img");
      if (!image) return;

      function markLoaded() {
        slot.classList.add("is-loaded");
      }

      if (image.complete) {
        markLoaded();
        return;
      }

      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markLoaded, { once: true });
    });
})();
