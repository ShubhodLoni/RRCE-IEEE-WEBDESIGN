/**
 * Shared chrome for the public IEEE RRCE site.
 * Markup is injected from template strings (no fetch) so file:// works.
 */
(function (global) {
  "use strict";

  const D = global.RRCE;

  function root() {
    return (document.body && document.body.dataset.root) || "";
  }

  function asset(path) {
    if (!path) return "";
    if (/^(https?:|data:|mailto:|tel:)/i.test(path)) return path;
    return root() + path;
  }

  function pageHref(path) {
    if (!path) return "#";
    if (/^(https?:|mailto:|tel:)/i.test(path)) return path;
    return root() + path;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function storageGet(store, key) {
    try {
      return store.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function storageSet(store, key, value) {
    try {
      store.setItem(key, value);
    } catch (err) {
      /* ignore quota / private mode */
    }
  }

  function initialsSvg(name) {
    const letters = String(name || "IEEE")
      .split(/\s+/)
      .map(function (w) {
        return w.charAt(0);
      })
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#0B5CAD"/><text x="48" y="56" text-anchor="middle" font-family="Arial" font-size="32" font-weight="700" fill="#FFC20E">' +
      letters.replace(/[<>]/g, "") +
      "</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function applyImg(el, spec, extraFallback) {
    if (!el || !spec) return el;
    const fallback = asset(spec.fallback || extraFallback || D.FALLBACK_GRADIENT);
    const primary = asset(spec.src);
    el.alt = spec.alt || "";
    el.loading = spec.loading || "lazy";
    el.decoding = "async";
    if (spec.width) el.width = spec.width;
    if (spec.height) el.height = spec.height;
    if (!spec.width && !spec.height) {
      el.style.aspectRatio = spec.aspect || "16 / 10";
    }
    el.onerror = function () {
      if (el.dataset.fallbackApplied === "1") {
        el.onerror = null;
        el.src = D.FALLBACK_GRADIENT;
        return;
      }
      el.dataset.fallbackApplied = "1";
      el.src = fallback;
    };
    el.src = primary;
    return el;
  }

  function imgHtml(spec, className) {
    const cls = className ? ' class="' + escapeHtml(className) + '"' : "";
    const w = spec.width ? ' width="' + spec.width + '"' : "";
    const h = spec.height ? ' height="' + spec.height + '"' : "";
    return (
      "<img" +
      cls +
      w +
      h +
      ' alt="' +
      escapeHtml(spec.alt || "") +
      '" loading="lazy" decoding="async" data-img-src="' +
      escapeHtml(spec.src) +
      '" data-img-fallback="' +
      escapeHtml(spec.fallback || "") +
      '">'
    );
  }

  function hydrateImages(scope) {
    (scope || document).querySelectorAll("[data-img-src]").forEach(function (el) {
      applyImg(el, {
        src: el.getAttribute("data-img-src"),
        fallback: el.getAttribute("data-img-fallback"),
        alt: el.getAttribute("alt"),
        width: el.getAttribute("width"),
        height: el.getAttribute("height")
      });
    });
  }

  function icon(name) {
    const icons = {
      sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"/></svg>',
      menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
      close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
      up: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
      chat: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 16.5A7.5 7.5 0 1 1 12.5 21H5z"/></svg>',
      linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.5h4.56V24H.22zM8.34 8.5h4.37v2.12h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v8.76h-4.56v-7.77c0-1.85-.03-4.23-2.58-4.23-2.58 0-2.98 2.01-2.98 4.09V24H8.34z"/></svg>'
    };
    return icons[name] || "";
  }

  function getTheme() {
    const saved = storageGet(localStorage, "rrce-theme");
    if (saved === "light" || saved === "dark") return saved;
    try {
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (err) {
      return "light";
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    storageSet(localStorage, "rrce-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      btn.innerHTML = theme === "dark" ? icon("sun") : icon("moon");
    });
  }

  function focusTrap(container, onClose) {
    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    function handler(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = Array.prototype.slice.call(container.querySelectorAll(selector)).filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", handler);
    return function () {
      container.removeEventListener("keydown", handler);
    };
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function isNew(iso) {
    const d = new Date(iso + "T00:00:00");
    return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }

  function announcementRanked() {
    return D.ANNOUNCEMENTS.slice().sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
  }

  function eventImage(event) {
    return {
      src: D.IMAGES.picsum(event.slug, 800, 500),
      fallback: D.FALLBACK_GRADIENT,
      alt: event.title + " (stock placeholder image)"
    };
  }

  function calendarUrl(event) {
    const start = event.date.replace(/-/g, "") + "T" + (event.time || "09:00").replace(":", "") + "00";
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.summary + " — IEEE SB RRCE");
    const location = encodeURIComponent(event.venue + ", " + D.SITE.address);
    return (
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      text +
      "&dates=" +
      start +
      "/" +
      start +
      "&details=" +
      details +
      "&location=" +
      location
    );
  }

  function topStrip() {
    return (
      '<div class="top-strip">' +
        '<div class="container top-strip__inner">' +
          '<div class="top-strip__logos">' +
            '<a class="top-strip__logo-link" href="' + escapeHtml(pageHref("index.html")) + '" aria-label="IEEE RRCE Student Branch">' +
              imgHtml(D.IMAGES.logos.ieeeSb, "top-strip__logo top-strip__logo--ieee") +
            '</a>' +
            '<span class="top-strip__sep" aria-hidden="true">|</span>' +
            '<a class="top-strip__logo-link" href="' + escapeHtml(D.SITE.collegeUrl) + '" target="_blank" rel="noopener" aria-label="' + escapeHtml(D.SITE.collegeName) + '">' +
              imgHtml(D.IMAGES.logos.rrce, "top-strip__logo top-strip__logo--rrce") +
              '<span class="top-strip__college-label">' + escapeHtml(D.SITE.collegeShort) + '</span>' +
            '</a>' +
          '</div>' +
          '<div class="top-strip__links">' +
            '<a href="' + escapeHtml(D.SITE.collegeUrl) + '" target="_blank" rel="noopener">rrce.org</a> · ' +
            '<a href="tel:+918028437124">' + escapeHtml(D.SITE.phone) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function tickerMarkup() {
    const items = D.ANNOUNCEMENTS.slice(0, 6);
    const buttons = items
      .map(function (a) {
        return (
          '<button class="ticker__item" type="button" data-ann-id="' +
          escapeHtml(a.id) +
          '">' +
          escapeHtml(a.title) +
          "</button>"
        );
      })
      .join('<span aria-hidden="true"> · </span>');
    return (
      '<div class="ticker" data-ticker><div class="container ticker__inner"><span class="ticker__label">News</span><div class="ticker__track-wrap"><div class="ticker__track">' +
      buttons +
      '<span aria-hidden="true"> · </span>' +
      buttons +
      "</div></div></div></div>"
    );
  }

  function navMarkup() {
    const page = document.body.dataset.page || "";
    const links = D.NAV.map(function (item) {
      const current = item.page === page ? ' aria-current="page"' : "";
      return (
        '<li><a href="' +
        escapeHtml(pageHref(item.href)) +
        '"' +
        current +
        ">" +
        escapeHtml(item.label) +
        "</a></li>"
      );
    }).join("");
    const drawerLinks = D.NAV.map(function (item) {
      const current = item.page === page ? ' aria-current="page"' : "";
      return (
        '<a href="' +
        escapeHtml(pageHref(item.href)) +
        '"' +
        current +
        ">" +
        escapeHtml(item.label) +
        "</a>"
      );
    }).join("");
    return (
      '<header class="site-header"><nav class="nav" data-nav aria-label="Primary"><div class="container nav__inner"><a class="brand" href="' +
      escapeHtml(pageHref("index.html")) +
      '">' +
      imgHtml(D.IMAGES.logos.rrce, "brand__rrce") +
      imgHtml(D.IMAGES.logos.ieeeSb, "brand__ieee") +
      '</a><ul class="nav__links">' +
      links +
      '</ul><div class="nav__actions"><button class="icon-btn" type="button" data-theme-toggle aria-pressed="false" aria-label="Toggle theme"></button><a class="btn btn--ghost" href="' +
      escapeHtml(pageHref("portal/dashboard.html")) +
      '">Member Dashboard</a><a class="btn btn--yellow" href="' +
      escapeHtml(pageHref("membership.html")) +
      '">Join IEEE</a><button class="icon-btn menu-toggle" type="button" data-menu-open aria-expanded="false" aria-controls="nav-drawer" aria-label="Open menu">' +
      icon("menu") +
      "</button></div></div></nav></header>" +
      '<div id="nav-drawer" class="nav-drawer" hidden role="dialog" aria-label="Menu">' +
      '<button class="icon-btn" type="button" data-menu-close aria-label="Close menu">' +
      icon("close") +
      "</button>" +
      drawerLinks +
      '<a class="btn btn--ghost" href="' +
      escapeHtml(pageHref("portal/dashboard.html")) +
      '">Member Dashboard</a><a class="btn btn--yellow" href="' +
      escapeHtml(pageHref("membership.html")) +
      '">Join IEEE</a></div><button class="backdrop" data-menu-backdrop hidden aria-label="Close menu"></button>'
    );
  }

  function footerMarkup() {
    const quick = D.NAV.map(function (item) {
      return '<li><a href="' + escapeHtml(pageHref(item.href)) + '">' + escapeHtml(item.label) + "</a></li>";
    }).join("");
    const chapters = D.CHAPTERS.map(function (c) {
      return "<li>" + escapeHtml(c.short) + " — " + escapeHtml(c.name) + "</li>";
    }).join("");
    const depts = D.SITE.departments.map(function (d) {
      return "<li>" + escapeHtml(d) + "</li>";
    }).join("");
    return (
      '<footer class="site-footer"><div class="container footer-grid"><div>' +
      imgHtml(D.IMAGES.logos.ieeeSb) +
      "<p>IEEE Student Branch at " +
      escapeHtml(D.SITE.collegeName) +
      ". " +
      escapeHtml(D.SITE.ieeeRegion) +
      ". " +
      escapeHtml(D.SITE.ieeeSection) +
      " affiliation is unverified (TODO).</p></div><div><h3>Quick links</h3><ul>" +
      quick +
      "</ul></div><div><h3>Chapters</h3><ul>" +
      chapters +
      "</ul><p class=\"todo-note\">TODO charters</p></div><div><h3>College</h3><p>" +
      escapeHtml(D.SITE.address) +
      "</p><p><a href=\"tel:+918028437124\">" +
      escapeHtml(D.SITE.phone) +
      '</a></p><p>Departments</p><ul>' +
      depts +
      '</ul><div class="socials" aria-label="Social links"><a href="' +
      escapeHtml(D.SITE.socials.instagram) +
      '" rel="noopener">IG</a><a href="' +
      escapeHtml(D.SITE.socials.linkedin) +
      '" rel="noopener">in</a><a href="' +
      escapeHtml(D.SITE.socials.youtube) +
      '" rel="noopener">YT</a><a href="' +
      escapeHtml(D.SITE.socials.x) +
      '" rel="noopener">X</a></div><p class="todo-note">TODO social URLs</p></div></div><div class="container copyright">© ' +
      new Date().getFullYear() +
      " IEEE Student Branch — " +
      escapeHtml(D.SITE.collegeShort) +
      ". Not an official IEEE.org site. Placeholder content is labelled TODO.</div></footer>"
    );
  }

  function overlaysMarkup() {
    return (
      '<button class="to-top" type="button" data-to-top hidden aria-label="Back to top">' +
      icon("up") +
      '</button>' +
      '<button class="chat-launcher" id="chat-launcher" type="button" aria-label="Open RRCE IEEE Assistant" aria-expanded="false" aria-controls="chat-panel">' +
      icon("chat") +
      '<span class="chat-launcher__dot" aria-hidden="true"></span></button>' +
      '<div class="chat-panel" id="chat-panel" role="dialog" aria-label="RRCE IEEE Assistant" hidden></div>' +
      '<div class="modal" id="ann-modal" hidden><div class="backdrop" data-ann-close tabindex="-1"></div><div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="ann-modal-title" tabindex="-1"><div class="modal__head"><div><span id="ann-modal-tag"></span><h2 id="ann-modal-title"></h2></div><button class="icon-btn" type="button" data-ann-close aria-label="Close">' +
      icon("close") +
      '</button></div><p id="ann-modal-date" class="lede"></p><div id="ann-modal-body"></div><p id="ann-modal-link"></p></div></div>'
    );
  }

  let lastAnnFocus = null;
  let releaseAnnTrap = null;

  function openAnnouncement(id) {
    const item = D.ANNOUNCEMENTS.find(function (a) {
      return a.id === id;
    });
    if (!item) return;
    const modal = document.getElementById("ann-modal");
    const dialog = modal.querySelector(".modal__dialog");
    lastAnnFocus = document.activeElement;
    modal.hidden = false;
    document.getElementById("ann-modal-title").textContent = item.title;
    const tag = document.getElementById("ann-modal-tag");
    tag.className = "tag tag--" + item.category;
    tag.textContent = item.category;
    document.getElementById("ann-modal-date").textContent = formatDate(item.date);
    const body = document.getElementById("ann-modal-body");
    body.textContent = item.body;
    const linkWrap = document.getElementById("ann-modal-link");
    linkWrap.textContent = "";
    if (item.link) {
      const a = document.createElement("a");
      a.className = "btn btn--yellow";
      a.href = pageHref(item.link.href);
      a.textContent = item.link.label;
      if (/^https?:/i.test(item.link.href)) a.rel = "noopener";
      linkWrap.appendChild(a);
    }
    dialog.focus();
    releaseAnnTrap = focusTrap(modal, closeAnnouncement);
  }

  function closeAnnouncement() {
    const modal = document.getElementById("ann-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (releaseAnnTrap) releaseAnnTrap();
    if (lastAnnFocus && lastAnnFocus.focus) lastAnnFocus.focus();
  }

  function bindChrome() {
    hydrateImages(document);
    setTheme(getTheme());

    document.addEventListener("click", function (e) {
      const themeBtn = e.target.closest("[data-theme-toggle]");
      if (themeBtn) {
        setTheme(getTheme() === "dark" ? "light" : "dark");
      }
      const ann = e.target.closest("[data-ann-id]");
      if (ann) openAnnouncement(ann.getAttribute("data-ann-id"));
      if (e.target.closest("[data-ann-close]")) closeAnnouncement();
      if (e.target.closest("[data-menu-open]")) openMenu();
      if (e.target.closest("[data-menu-close], [data-menu-backdrop]")) closeMenu();
      if (e.target.closest("[data-to-top]")) window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const nav = document.querySelector("[data-nav]");
    window.addEventListener("scroll", function () {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
      const topBtn = document.querySelector("[data-to-top]");
      if (topBtn) topBtn.hidden = window.scrollY < 400;
    });
  }

  let releaseMenuTrap = null;
  let lastMenuFocus = null;

  function openMenu() {
    const drawer = document.getElementById("nav-drawer");
    const backdrop = document.querySelector("[data-menu-backdrop]");
    const toggle = document.querySelector("[data-menu-open]");
    lastMenuFocus = document.activeElement;
    drawer.hidden = false;
    backdrop.hidden = false;
    drawer.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    const closeBtn = drawer.querySelector("[data-menu-close]");
    if (closeBtn) closeBtn.focus();
    releaseMenuTrap = focusTrap(drawer, closeMenu);
  }

  function closeMenu() {
    const drawer = document.getElementById("nav-drawer");
    const backdrop = document.querySelector("[data-menu-backdrop]");
    const toggle = document.querySelector("[data-menu-open]");
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove("is-open");
    drawer.hidden = true;
    if (backdrop) backdrop.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (releaseMenuTrap) releaseMenuTrap();
    if (lastMenuFocus && lastMenuFocus.focus) lastMenuFocus.focus();
  }

  function mountChrome() {
    const top = document.getElementById("site-chrome-top");
    const foot = document.getElementById("site-footer");
    const overlays = document.getElementById("site-overlays");
    if (top) top.innerHTML = topStrip() + tickerMarkup() + navMarkup();
    if (foot) foot.innerHTML = footerMarkup();
    if (overlays) overlays.innerHTML = overlaysMarkup();
    bindChrome();
    if (global.RRCEChat && typeof global.RRCEChat.init === "function") {
      global.RRCEChat.init();
    }
  }

  global.RRCEUI = {
    root,
    asset,
    pageHref,
    escapeHtml,
    storageGet,
    storageSet,
    initialsSvg,
    applyImg,
    imgHtml,
    hydrateImages,
    icon,
    getTheme,
    setTheme,
    focusTrap,
    formatDate,
    isNew,
    announcementRanked,
    eventImage,
    calendarUrl,
    openAnnouncement,
    closeAnnouncement,
    mountChrome
  };
})(window);
