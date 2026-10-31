/**
 * Public-site interactivity. Pages opt in with body[data-page].
 */
(function () {
  "use strict";

  const D = window.RRCE;
  const UI = window.RRCEUI;

  function prefersReducedMotion() {
    try {
      return matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (err) {
      return false;
    }
  }

  function reveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function animateCounters() {
    const cards = document.querySelectorAll("[data-count]");
    if (!cards.length) return;

    function run(el) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const target = Number(el.getAttribute("data-count")) || 0;
      if (prefersReducedMotion()) {
        el.textContent = String(target);
        return;
      }
      const start = performance.now();
      const duration = 1100;
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * t));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      cards.forEach(run);
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) run(entry.target);
      });
    });
    cards.forEach(function (c) {
      io.observe(c);
    });
  }

  function upcomingEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return D.EVENTS.filter(function (e) {
      return new Date(e.date + "T00:00:00") >= today;
    }).sort(function (a, b) {
      return a.date < b.date ? -1 : 1;
    });
  }

  function pastEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return D.EVENTS.filter(function (e) {
      return new Date(e.date + "T00:00:00") < today;
    }).sort(function (a, b) {
      return a.date < b.date ? 1 : -1;
    });
  }

  function renderHero() {
    const media = document.querySelector("[data-hero-media]");
    if (!media) return;
    const img = document.createElement("img");
    img.setAttribute("fetchpriority", "high");
    img.loading = "eager";
    UI.applyImg(img, D.IMAGES.campus.hero);
    img.addEventListener("error", function () {
      const hero = document.querySelector(".hero");
      if (hero && img.src.indexOf("data:image") === 0) hero.classList.add("hero--fallback");
    });
    media.appendChild(img);
    const h1 = document.querySelector("[data-hero-title]");
    const sub = document.querySelector("[data-hero-sub]");
    if (h1) h1.textContent = D.SITE.heroHeadline;
    if (sub) sub.textContent = D.SITE.heroSubtext;
  }

  function renderStats() {
    const wrap = document.querySelector("[data-stats]");
    if (!wrap) return;
    wrap.innerHTML = D.STATS.map(function (s) {
      return (
        '<article class="card stat-card reveal"><strong data-count="' +
        s.value +
        '">0</strong><span>' +
        UI.escapeHtml(s.label) +
        '</span><span class="todo-note">' +
        UI.escapeHtml(s.note) +
        "</span></article>"
      );
    }).join("");
  }

  function renderAboutPreview() {
    const collage = document.querySelector("[data-collage]");
    if (!collage) return;
    collage.innerHTML = D.IMAGES.campus.collage
      .slice(0, 3)
      .map(function (img) {
        return UI.imgHtml(img);
      })
      .join("");
    UI.hydrateImages(collage);
  }

  function renderHomeAnnouncements() {
    const wrap = document.querySelector("[data-home-announcements]");
    if (!wrap) return;
    const items = UI.announcementRanked().slice(0, 4);
    wrap.innerHTML = items
      .map(function (a) {
        return (
          '<button class="card card__body ann-card reveal" type="button" data-ann-id="' +
          UI.escapeHtml(a.id) +
          '"><div class="meta-row"><span class="tag tag--' +
          UI.escapeHtml(a.category) +
          '">' +
          UI.escapeHtml(a.category) +
          "</span>" +
          (a.pinned ? '<span class="todo-note">Pinned</span>' : "") +
          (UI.isNew(a.date) ? '<span class="todo-note">New</span>' : "") +
          "<span>" +
          UI.escapeHtml(UI.formatDate(a.date)) +
          '</span></div><h3>' +
          UI.escapeHtml(a.title) +
          '</h3><p class="summary">' +
          UI.escapeHtml(a.summary) +
          "</p></button>"
        );
      })
      .join("");
  }

  function renderPillars() {
    const wrap = document.querySelector("[data-pillars]");
    if (!wrap) return;
    wrap.innerHTML = D.PILLARS.map(function (p) {
      const img = D.IMAGES.pillars[p.key];
      return (
        '<article class="card reveal">' +
        UI.imgHtml(img) +
        '<div class="card__body"><h3>' +
        UI.escapeHtml(p.title) +
        "</h3><p>" +
        UI.escapeHtml(p.body) +
        "</p></div></article>"
      );
    }).join("");
    UI.hydrateImages(wrap);
  }

  function renderChaptersPreview() {
    const wrap = document.querySelector("[data-chapters-preview]");
    if (!wrap) return;
    wrap.innerHTML = D.CHAPTERS.map(function (c) {
      return (
        '<article class="card card__body reveal"><span class="todo-note">TODO charter</span><h3>' +
        UI.escapeHtml(c.name) +
        "</h3><p>Mapped to " +
        UI.escapeHtml(c.department) +
        "</p><p class=\"lede\">" +
        UI.escapeHtml(c.description) +
        "</p></article>"
      );
    }).join("");
  }

  function renderMarquee() {
    const track = document.querySelector("[data-event-marquee]");
    if (!track) return;
    const names = D.EVENTS.map(function (e) {
      return "<span>" + UI.escapeHtml(e.title) + "</span>";
    }).join("");
    track.innerHTML = names + names;
  }

  let countdownTimer = null;

  function renderFeatured() {
    const wrap = document.querySelector("[data-featured]");
    if (!wrap) return;
    const next = upcomingEvents()[0];
    if (!next) {
      wrap.innerHTML = '<p class="empty">No upcoming events listed yet.</p>';
      return;
    }
    const img = UI.eventImage(next);
    wrap.innerHTML =
      '<div class="featured reveal"><div class="featured__media">' +
      UI.imgHtml(img) +
      '</div><div class="featured__body"><span class="todo-note">Placeholder event</span><p class="section-kicker">Featured</p><h3>' +
      UI.escapeHtml(next.title) +
      "</h3><p>" +
      UI.escapeHtml(next.summary) +
      "</p><p>" +
      UI.escapeHtml(UI.formatDate(next.date)) +
      " · " +
      UI.escapeHtml(next.time) +
      " · " +
      UI.escapeHtml(next.venue) +
      '</p><div class="countdown" data-countdown="' +
      UI.escapeHtml(next.date) +
      "T" +
      UI.escapeHtml(next.time) +
      ':00"></div><a class="btn btn--yellow" href="' +
      UI.escapeHtml(UI.pageHref(next.registerUrl)) +
      '">Register interest</a> <a class="btn btn--ghost" href="' +
      UI.escapeHtml(UI.calendarUrl(next)) +
      '" rel="noopener">Add to Google Calendar</a></div></div>';
    UI.hydrateImages(wrap);
    startCountdown(wrap.querySelector("[data-countdown]"));
  }

  function startCountdown(el) {
    if (!el) return;
    if (countdownTimer) clearInterval(countdownTimer);
    function tick() {
      const target = new Date(el.getAttribute("data-countdown"));
      const diff = target.getTime() - Date.now();
      if (isNaN(target.getTime()) || diff <= 0) {
        el.textContent = "";
        const ended = document.createElement("p");
        ended.textContent = "Event ended";
        el.appendChild(ended);
        if (countdownTimer) clearInterval(countdownTimer);
        return;
      }
      const s = Math.floor(diff / 1000);
      const days = Math.floor(s / 86400);
      const hours = Math.floor((s % 86400) / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = s % 60;
      el.innerHTML =
        "<div><strong>" +
        days +
        "</strong><span>Days</span></div><div><strong>" +
        hours +
        "</strong><span>Hours</span></div><div><strong>" +
        mins +
        "</strong><span>Mins</span></div><div><strong>" +
        secs +
        "</strong><span>Secs</span></div>";
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function eventCard(event) {
    const img = UI.eventImage(event);
    return (
      '<article class="card reveal">' +
      UI.imgHtml(img) +
      '<div class="card__body"><div class="meta-row"><span class="date-badge">' +
      UI.escapeHtml(event.date.slice(8, 10)) +
      "<small>" +
      UI.escapeHtml(UI.formatDate(event.date).split(" ")[1] || "") +
      '</small></span><span class="tag tag--Event">' +
      UI.escapeHtml(event.category) +
      '</span><span class="todo-note">TODO</span></div><h3>' +
      UI.escapeHtml(event.title) +
      "</h3><p>" +
      UI.escapeHtml(event.summary) +
      "</p><p>" +
      UI.escapeHtml(event.venue) +
      '</p><a href="' +
      UI.escapeHtml(UI.pageHref(event.registerUrl)) +
      '">Register</a></div></article>'
    );
  }

  function renderUpcomingThree() {
    const wrap = document.querySelector("[data-upcoming-three]");
    if (!wrap) return;
    wrap.innerHTML = upcomingEvents().slice(0, 3).map(eventCard).join("");
    UI.hydrateImages(wrap);
  }

  function renderBenefits() {
    const wrap = document.querySelector("[data-benefits]");
    if (!wrap) return;
    wrap.innerHTML = D.BENEFITS.map(function (b) {
      return (
        '<article class="card benefit reveal"><h3>' +
        UI.escapeHtml(b.title) +
        "</h3><p>" +
        UI.escapeHtml(b.body) +
        "</p></article>"
      );
    }).join("");
  }

  function renderTeamPreview() {
    const wrap = document.querySelector("[data-team-preview]");
    if (!wrap) return;
    wrap.innerHTML = D.TEAM.slice(0, 4)
      .map(function (m) {
        const spec = {
          src: D.IMAGES.dicebear(m.avatarSeed),
          fallback: UI.initialsSvg(m.name),
          alt: "Avatar illustration for " + m.name
        };
        return (
          '<article class="card person reveal">' +
          UI.imgHtml(spec, "avatar") +
          '<div class="card__body"><h3>' +
          UI.escapeHtml(m.name) +
          "</h3><p>" +
          UI.escapeHtml(m.role) +
          '</p><span class="todo-note">Placeholder</span></div></article>'
        );
      })
      .join("");
    UI.hydrateImages(wrap);
  }

  function renderGalleryStrip() {
    const wrap = document.querySelector("[data-gallery-strip]");
    if (!wrap) return;
    wrap.innerHTML = D.GALLERY.map(function (g) {
      const spec = {
        src: D.IMAGES.picsum(g.slug, 800, 500),
        fallback: D.FALLBACK_GRADIENT,
        alt: g.title + " — " + g.caption
      };
      return UI.imgHtml(spec);
    }).join("");
    UI.hydrateImages(wrap);
  }

  function renderResources() {
    const wrap = document.querySelector("[data-resources]");
    if (!wrap) return;
    wrap.innerHTML = D.RESOURCES.map(function (r) {
      return (
        '<a class="card resource reveal" href="' +
        UI.escapeHtml(r.href) +
        '" rel="noopener"><h3>' +
        UI.escapeHtml(r.title) +
        "</h3><p>" +
        UI.escapeHtml(r.blurb) +
        "</p></a>"
      );
    }).join("");
  }

  function renderHome() {
    renderHero();
    renderStats();
    renderAboutPreview();
    renderHomeAnnouncements();
    renderPillars();
    renderChaptersPreview();
    renderMarquee();
    renderFeatured();
    renderUpcomingThree();
    renderBenefits();
    const shot = document.querySelector("[data-dashboard-shot]");
    if (shot) {
      shot.innerHTML = UI.imgHtml(D.IMAGES.dashboardTeaser);
      UI.hydrateImages(shot);
    }
    renderTeamPreview();
    renderGalleryStrip();
    renderResources();
  }

  function filterList(items, query, category, getCat) {
    const q = (query || "").trim().toLowerCase();
    return items.filter(function (item) {
      const hay = (item.title + " " + (item.summary || "") + " " + (item.body || "")).toLowerCase();
      const catOk = !category || category === "All" || getCat(item) === category;
      const qOk = !q || hay.indexOf(q) !== -1;
      return catOk && qOk;
    });
  }

  function renderAnnouncementsPage() {
    const list = document.querySelector("[data-ann-list]");
    if (!list) return;
    const search = document.querySelector("[data-ann-search]");
    const chips = document.querySelector("[data-ann-chips]");
    let category = "All";

    function paint() {
      const items = filterList(UI.announcementRanked(), search ? search.value : "", category, function (a) {
        return a.category;
      });
      if (!items.length) {
        list.innerHTML = '<p class="empty">No announcements match those filters.</p>';
        return;
      }
      list.innerHTML = items
        .map(function (a) {
          return (
            '<button class="card card__body ann-card" type="button" data-ann-id="' +
            UI.escapeHtml(a.id) +
            '"><div class="meta-row"><span class="tag tag--' +
            UI.escapeHtml(a.category) +
            '">' +
            UI.escapeHtml(a.category) +
            "</span>" +
            (a.pinned ? "<span class=\"todo-note\">Pinned</span>" : "") +
            (UI.isNew(a.date) ? "<span class=\"todo-note\">New</span>" : "") +
            "<span>" +
            UI.escapeHtml(UI.formatDate(a.date)) +
            "</span></div><h3>" +
            UI.escapeHtml(a.title) +
            '</h3><p class="summary">' +
            UI.escapeHtml(a.summary) +
            "</p></button>"
          );
        })
        .join("");
    }

    if (chips) {
      const cats = ["All", "Event", "Membership", "Competition", "Notice"];
      chips.innerHTML = cats
        .map(function (c, i) {
          return (
            '<button class="chip' +
            (i === 0 ? " is-active" : "") +
            '" type="button" data-chip="' +
            c +
            '">' +
            c +
            "</button>"
          );
        })
        .join("");
      chips.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-chip]");
        if (!btn) return;
        category = btn.getAttribute("data-chip");
        chips.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("is-active", c === btn);
        });
        paint();
      });
    }
    if (search) search.addEventListener("input", paint);
    paint();
  }

  function renderChaptersPage() {
    const wrap = document.querySelector("[data-chapters-page]");
    if (!wrap) return;
    wrap.innerHTML = D.CHAPTERS.map(function (c) {
      return (
        '<button class="card card__body ann-card" type="button" data-chapter-id="' +
        UI.escapeHtml(c.id) +
        '"><span class="todo-note">TODO</span><h3>' +
        UI.escapeHtml(c.name) +
        "</h3><p>" +
        UI.escapeHtml(c.department) +
        "</p></button>"
      );
    }).join("");

    const modal = document.getElementById("chapter-modal");
    if (!modal) return;
    let release = null;
    let last = null;
    function close() {
      modal.hidden = true;
      if (release) release();
      if (last && last.focus) last.focus();
    }
    wrap.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-chapter-id]");
      if (!btn) return;
      const c = D.CHAPTERS.find(function (x) {
        return x.id === btn.getAttribute("data-chapter-id");
      });
      if (!c) return;
      last = document.activeElement;
      modal.hidden = false;
      modal.querySelector("[data-ch-title]").textContent = c.name;
      modal.querySelector("[data-ch-dept]").textContent = "Linked department: " + c.department;
      modal.querySelector("[data-ch-desc]").textContent = c.description;
      modal.querySelector("[data-ch-acts]").textContent = "Activities: " + c.activities.join(", ");
      modal.querySelector("[data-ch-head]").textContent = c.headName + " — " + c.headRole;
      modal.querySelector(".modal__dialog").focus();
      release = UI.focusTrap(modal, close);
    });
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-ch-close]")) close();
    });
  }

  function renderEventsPage() {
    const wrap = document.querySelector("[data-events-page]");
    if (!wrap) return;
    const search = document.querySelector("[data-event-search]");
    let tab = "Upcoming";
    let category = "All";
    const cats = ["All"].concat(
      D.EVENTS.map(function (e) {
        return e.category;
      }).filter(function (v, i, arr) {
        return arr.indexOf(v) === i;
      })
    );

    const tabs = document.querySelector("[data-event-tabs]");
    if (tabs) {
      tabs.innerHTML =
        '<button class="tab is-active" type="button" role="tab" aria-selected="true" data-tab="Upcoming">Upcoming</button><button class="tab" type="button" role="tab" aria-selected="false" data-tab="Past">Past</button>';
      tabs.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-tab]");
        if (!btn) return;
        tab = btn.getAttribute("data-tab");
        tabs.querySelectorAll(".tab").forEach(function (t) {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        paint();
      });
    }
    const chips = document.querySelector("[data-event-chips]");
    if (chips) {
      chips.innerHTML = cats
        .map(function (c, i) {
          return '<button class="chip' + (i === 0 ? " is-active" : "") + '" type="button" data-chip="' + UI.escapeHtml(c) + '">' + UI.escapeHtml(c) + "</button>";
        })
        .join("");
      chips.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-chip]");
        if (!btn) return;
        category = btn.getAttribute("data-chip");
        chips.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("is-active", c === btn);
        });
        paint();
      });
    }

    function paint() {
      const source = tab === "Past" ? pastEvents() : upcomingEvents();
      const items = filterList(source, search ? search.value : "", category, function (e) {
        return e.category;
      });
      wrap.innerHTML = items.length
        ? items
            .map(function (event) {
              return (
                eventCard(event) +
                '<p class="container"><a href="' +
                UI.escapeHtml(UI.calendarUrl(event)) +
                '" rel="noopener">Add to Google Calendar</a></p>'
              );
            })
            .join("")
        : '<p class="empty">No events in this view.</p>';
      UI.hydrateImages(wrap);
    }
    if (search) search.addEventListener("input", paint);
    paint();
  }

  function renderTeamPage() {
    const wrap = document.querySelector("[data-team-page]");
    if (!wrap) return;
    const groups = [
      { key: "counselor", label: "Faculty counselor" },
      { key: "mentor", label: "Mentor" },
      { key: "execom", label: "Executive committee" }
    ];
    wrap.innerHTML = groups
      .map(function (g) {
        const people = D.TEAM.filter(function (m) {
          return m.roleGroup === g.key;
        });
        return (
          "<section><h2>" +
          UI.escapeHtml(g.label) +
          '</h2><div class="grid grid-4">' +
          people
            .map(function (m) {
              const spec = {
                src: D.IMAGES.dicebear(m.avatarSeed),
                fallback: UI.initialsSvg(m.name),
                alt: "Avatar illustration for " + m.name,
                width: 96,
                height: 96
              };
              return (
                '<article class="card person"><div class="card__body">' +
                UI.imgHtml(spec, "avatar") +
                "<h3>" +
                UI.escapeHtml(m.name) +
                "</h3><p>" +
                UI.escapeHtml(m.role) +
                "</p><p>" +
                UI.escapeHtml(m.department) +
                '</p><p class="todo-note">Placeholder officer</p><a href="' +
                UI.escapeHtml(m.linkedin) +
                '" rel="noopener" aria-label="LinkedIn (placeholder)">' +
                UI.icon("linkedin") +
                "</a></div></article>"
              );
            })
            .join("") +
          "</div></section>"
        );
      })
      .join("");
    UI.hydrateImages(wrap);
  }

  function renderGalleryPage() {
    const wrap = document.querySelector("[data-gallery-page]");
    const chips = document.querySelector("[data-gallery-chips]");
    if (!wrap) return;
    let category = "All";
    const cats = ["All"].concat(
      D.GALLERY.map(function (g) {
        return g.category;
      }).filter(function (v, i, a) {
        return a.indexOf(v) === i;
      })
    );
    if (chips) {
      chips.innerHTML = cats
        .map(function (c, i) {
          return '<button class="chip' + (i === 0 ? " is-active" : "") + '" type="button" data-chip="' + UI.escapeHtml(c) + '">' + UI.escapeHtml(c) + "</button>";
        })
        .join("");
      chips.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-chip]");
        if (!btn) return;
        category = btn.getAttribute("data-chip");
        chips.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("is-active", c === btn);
        });
        paint();
      });
    }

    let index = 0;
    const lightbox = document.getElementById("lightbox");

    function items() {
      return D.GALLERY.filter(function (g) {
        return category === "All" || g.category === category;
      });
    }

    function show(i) {
      const list = items();
      if (!list.length) return;
      index = (i + list.length) % list.length;
      const g = list[index];
      const img = lightbox.querySelector("img");
      UI.applyImg(img, {
        src: D.IMAGES.picsum(g.slug, 1200, 800),
        fallback: D.FALLBACK_GRADIENT,
        alt: g.title + " — " + g.caption
      });
      lightbox.querySelector("[data-lb-cap]").textContent = g.title + " — " + g.caption;
      lightbox.hidden = false;
      lightbox.querySelector("[data-lb-close]").focus();
    }

    function paint() {
      const list = items();
      wrap.innerHTML = list
        .map(function (g, i) {
          const spec = {
            src: D.IMAGES.picsum(g.slug, 800, 500),
            fallback: D.FALLBACK_GRADIENT,
            alt: g.title + " — " + g.caption
          };
          return (
            '<button class="card" type="button" data-g-index="' +
            i +
            '">' +
            UI.imgHtml(spec) +
            "</button>"
          );
        })
        .join("");
      UI.hydrateImages(wrap);
    }

    wrap.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-g-index]");
      if (!btn) return;
      show(Number(btn.getAttribute("data-g-index")));
    });

    if (lightbox) {
      lightbox.addEventListener("click", function (e) {
        if (e.target.closest("[data-lb-close]")) lightbox.hidden = true;
        if (e.target.closest("[data-lb-prev]")) show(index - 1);
        if (e.target.closest("[data-lb-next]")) show(index + 1);
      });
      document.addEventListener("keydown", function (e) {
        if (lightbox.hidden) return;
        if (e.key === "Escape") lightbox.hidden = true;
        if (e.key === "ArrowLeft") show(index - 1);
        if (e.key === "ArrowRight") show(index + 1);
      });
      let touchX = null;
      lightbox.addEventListener("touchstart", function (e) {
        touchX = e.changedTouches[0].screenX;
      });
      lightbox.addEventListener("touchend", function (e) {
        if (touchX == null) return;
        const dx = e.changedTouches[0].screenX - touchX;
        if (dx > 40) show(index - 1);
        if (dx < -40) show(index + 1);
        touchX = null;
      });
    }
    paint();
  }

  function renderFaq() {
    const wrap = document.querySelector("[data-faq]");
    if (!wrap) return;
    wrap.innerHTML = D.FAQ.map(function (item, i) {
      return (
        '<div class="accordion"><button type="button" aria-expanded="false" aria-controls="faq-' +
        i +
        '" id="faq-btn-' +
        i +
        '">' +
        UI.escapeHtml(item.q) +
        '</button><div class="panel" id="faq-' +
        i +
        '" hidden><p>' +
        UI.escapeHtml(item.a) +
        "</p></div></div>"
      );
    }).join("");
    wrap.addEventListener("click", function (e) {
      const btn = e.target.closest("button[aria-expanded]");
      if (!btn) return;
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.hidden = expanded;
    });
  }

  function renderContact() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const status = document.querySelector("[data-contact-status]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const topic = form.querySelector('[name="topic"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !topic || message.length < 8) {
        status.className = "form-error";
        status.textContent = "Please add a name, valid email, topic, and a message of at least 8 characters.";
        return;
      }
      const subject = encodeURIComponent("[IEEE RRCE] " + topic);
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      status.className = "form-ok";
      status.textContent = "Opening your email app. The branch address is a placeholder (TODO).";
      window.location.href = "mailto:" + D.SITE.email + "?subject=" + subject + "&body=" + body;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    UI.mountChrome();
    const page = document.body.dataset.page;
    if (page === "home") renderHome();
    if (page === "announcements") renderAnnouncementsPage();
    if (page === "chapters") renderChaptersPage();
    if (page === "events") renderEventsPage();
    if (page === "team") renderTeamPage();
    if (page === "gallery") renderGalleryPage();
    if (page === "membership") renderFaq();
    if (page === "contact") renderContact();
    reveal();
    animateCounters();
  });

  window.RRCEMain = { upcomingEvents, pastEvents, eventCard };
})();
