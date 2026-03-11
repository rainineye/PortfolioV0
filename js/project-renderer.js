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
        '<a href="#" class="project-card-redirect-item project-card-redirect-item--full-story" data-overlay="trillion" aria-label="Full Story">' +
        '<span class="redirect-icon redirect-icon--full-story" aria-hidden="true">' +
        '<span class="redirect-icon__glyph">' +
        '<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M13.5635 2.32178L21.2861 8.32861L21.4521 8.45752V9.73486L21.2861 9.86377L13.5635 15.8706L13.3506 16.0366L12.251 15.4868L12.0137 15.3677V12.519C9.39672 12.53 4.30876 13.9088 2.11523 19.5493L2.08301 19.6333L2.01953 19.6968C1.63592 20.0801 1.10554 20.0404 0.751953 19.8989C0.566628 19.8247 0.390337 19.7108 0.254883 19.5649C0.122701 19.4226 6.83608e-05 19.2155 0 18.9644C2.4863e-05 13.6913 2.02203 10.3451 4.61719 8.32861C7.02626 6.45689 9.89583 5.75529 12.0137 5.67236V2.90869L12.2275 2.78467L13.0859 2.28955L13.3359 2.14502L13.5635 2.32178Z" fill="currentColor"/>' +
        "</svg></span>" +
        '<span class="redirect-icon__text-window">' +
        '<span class="redirect-icon__text-track">' +
        '<span class="redirect-icon__text-line">Full Story</span>' +
        '<span class="redirect-icon__text-line" aria-hidden="true">Full Story</span>' +
        "</span></span></span></a>"
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

  function getMobileCardData(project) {
    var overrides = {
      "01": {
        labels: ["Auto-pay Lending"],
      },
      "02": {
        labels: ["Layer 1", "IBC Transfer"],
      },
    };

    return Object.assign({}, project, overrides[project.id] || {});
  }

  function renderMobilePreview(project, firstImageLoading) {
    return (
      '<div class="project-card-mobile-preview">' +
      '<div class="project-card-mobile-preview-track">' +
      project.images
        .map(function (image, imageIndex) {
          var edgeClass = "";
          var loading = imageIndex === 0 ? firstImageLoading : "lazy";
          if (imageIndex === 0) edgeClass = " project-card-mobile-thumb--first";
          if (imageIndex === project.images.length - 1) edgeClass = " project-card-mobile-thumb--last";

          return (
            '<div class="project-card-mobile-thumb' + edgeClass + '">' +
            '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(project.name) + '" width="390" height="225" loading="' + loading + '" />' +
            "</div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function renderMobileCard(project, index) {
    var mobileProject = getMobileCardData(project);
    var loading = index === 0 ? "eager" : "lazy";
    return (
      '<section class="project-card-mobile" id="project-mobile-' + escapeHtml(project.id) + '">' +
      renderMobilePreview(mobileProject, loading) +
      '<div class="project-card-mobile-info">' +
      '<div class="project-card-mobile-info-main">' +
      '<div class="project-card-mobile-header">' +
      '<div class="project-card-mobile-labels">' + renderCardLabels(mobileProject.labels) + "</div>" +
      '<div class="project-card-mobile-meta">' +
      '<span class="project-card-mobile-date">' + escapeHtml(mobileProject.date) + "</span>" +
      '<span class="project-card-mobile-role">' + escapeHtml(mobileProject.role) + "</span>" +
      "</div>" +
      "</div>" +
      '<div class="project-card-mobile-name">' + escapeHtml(mobileProject.name) + "</div>" +
      "</div>" +
      '<span class="project-card-mobile-badge">' + escapeHtml(mobileProject.id) + "</span>" +
      "</div></section>"
    );
  }

  projectList.innerHTML = projects.concat(projects).map(renderCarouselItem).join("");
  projectsChronological.innerHTML = projects.map(renderProjectSection).join("");

  var projectsMobile = document.getElementById("projectsMobile");
  if (projectsMobile) {
    projectsMobile.innerHTML = projects.map(renderMobileCard).join("");
    projectsMobile.removeAttribute("aria-hidden");
  }

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
