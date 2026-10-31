/**
 * IEEE RRCE Member Dashboard Controller
 * Frontend-only preview with zero authentication.
 */
(function (global) {
  "use strict";

  const D = global.RRCE;
  const UI = global.RRCEUI;
  const PD = global.RRCEPortalData;

  // In-memory state (resets on page refresh)
  const STATE = {
    member: JSON.parse(JSON.stringify(PD.CURRENT_MEMBER)),
    events: JSON.parse(JSON.stringify(PD.PORTAL_EVENTS)),
    chapters: JSON.parse(JSON.stringify(PD.PORTAL_CHAPTERS)),
    projects: JSON.parse(JSON.stringify(PD.PORTAL_PROJECTS)),
    resources: JSON.parse(JSON.stringify(PD.PORTAL_RESOURCES)),
    notifications: JSON.parse(JSON.stringify(PD.PORTAL_NOTIFICATIONS)),
    discussions: JSON.parse(JSON.stringify(PD.PORTAL_DISCUSSIONS)),
    tasks: JSON.parse(JSON.stringify(PD.PORTAL_TASKS))
  };

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
    return path;
  }

  /* Toast Notification System */
  function showToast(message, type) {
    let stack = document.getElementById("portal-toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "portal-toast-stack";
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    if (type === "success") toast.style.borderLeftColor = "#10b981";
    if (type === "error") toast.style.borderLeftColor = "#ef4444";
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(function () {
        toast.remove();
      }, 260);
    }, 3500);
  }

  /* Unread Notifications Count */
  function getUnreadNotifCount() {
    return STATE.notifications.filter(function (n) {
      return n.unread;
    }).length;
  }

  /* Draw Deterministic Canvas QR Code */
  function drawDummyQR(canvas, seed) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width || 72;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#0a2a5e";
    const modules = 21;
    const cellSize = size / modules;

    // Deterministic pseudo-random based on seed string
    let h = 0x811c9dc5;
    const str = String(seed || "IEEE-RRCE-MEMBER");
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }

    function bit(x, y) {
      // Corner position detection patterns (top-left, top-right, bottom-left)
      if ((x < 7 && y < 7) || (x >= modules - 7 && y < 7) || (x < 7 && y >= modules - 7)) {
        if (x === 0 || x === 6 || y === 0 || y === 6) return true;
        if (x >= modules - 7 && (x === modules - 7 || x === modules - 1 || y === 0 || y === 6)) return true;
        if (y >= modules - 7 && (x === 0 || x === 6 || y === modules - 7 || y === modules - 1)) return true;
        if (x >= 2 && x <= 4 && y >= 2 && y <= 4) return true;
        if (x >= modules - 5 && x <= modules - 3 && y >= 2 && y <= 4) return true;
        if (x >= 2 && x <= 4 && y >= modules - 5 && y <= modules - 3) return true;
        return false;
      }
      // Timing tracks
      if (x === 6 || y === 6) return (x + y) % 2 === 0;
      // Deterministic PRNG bits
      const val = (h ^ (x * 37 + y * 53)) & 0xfffff;
      return val % 3 === 0 || val % 7 === 0;
    }

    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (bit(c, r)) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  /* Generate Official Canvas Certificate */
  function generateCertificate(canvas, spec) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = 1200;
    const h = 800;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#ffffff");
    bgGrad.addColorStop(1, "#f4f8fd");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Outer Navy Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#0A2A5E";
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Inner Gold Accent Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FFC20E";
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Corner Ornament Squares
    ctx.fillStyle = "#FFC20E";
    const corners = [[36, 36], [w - 52, 36], [36, h - 52], [w - 52, h - 52]];
    corners.forEach(function (c) {
      ctx.fillRect(c[0], c[1], 16, 16);
    });

    // IEEE Header
    ctx.fillStyle = "#0A2A5E";
    ctx.font = "bold 26px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("IEEE STUDENT BRANCH", w / 2, 110);

    ctx.fillStyle = "#0B5CAD";
    ctx.font = "600 20px 'Space Grotesk', sans-serif";
    ctx.fillText("RajaRajeswari College of Engineering (RRCE), Bengaluru", w / 2, 142);

    ctx.fillStyle = "#5B6B82";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("Autonomous Institute under VTU Belagavi • AICTE Approved • ISO 9001:2015", w / 2, 168);

    // Certificate Title
    ctx.fillStyle = "#0A2A5E";
    ctx.font = "bold 44px 'Space Grotesk', sans-serif";
    ctx.fillText("CERTIFICATE OF PARTICIPATION", w / 2, 240);

    // Decorative Underline
    ctx.fillStyle = "#FFC20E";
    ctx.fillRect(w / 2 - 120, 255, 240, 4);

    // Presented To
    ctx.fillStyle = "#5B6B82";
    ctx.font = "18px 'Inter', sans-serif";
    ctx.fillText("This is proudly presented to", w / 2, 310);

    // Recipient Name
    ctx.fillStyle = "#0B5CAD";
    ctx.font = "bold 46px 'Space Grotesk', sans-serif";
    ctx.fillText(spec.name || STATE.member.fullName, w / 2, 375);

    // College / USN line
    ctx.fillStyle = "#5B6B82";
    ctx.font = "17px 'Inter', sans-serif";
    ctx.fillText("USN: " + (spec.usn || STATE.member.usn) + " • Department of " + (spec.dept || STATE.member.department) + ", RRCE", w / 2, 412);

    // Event Statement
    ctx.fillStyle = "#0B1B33";
    ctx.font = "20px 'Inter', sans-serif";
    ctx.fillText("for active participation in the technical event / workshop titled", w / 2, 470);

    ctx.fillStyle = "#0A2A5E";
    ctx.font = "bold 28px 'Space Grotesk', sans-serif";
    ctx.fillText('"' + (spec.eventName || "Technical Workshop") + '"', w / 2, 515);

    // Date and Venue
    ctx.fillStyle = "#5B6B82";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("Conducted on " + (spec.date || "14 Oct 2026") + " at RajaRajeswari College of Engineering campus.", w / 2, 555);

    // Signatures
    const sigY = 670;

    // Left Signature
    ctx.strokeStyle = "#5B6B82";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, sigY);
    ctx.lineTo(380, sigY);
    ctx.stroke();

    ctx.fillStyle = "#0B1B33";
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillText("Student Branch Chair", 280, sigY + 25);
    ctx.fillStyle = "#5B6B82";
    ctx.font = "13px 'Inter', sans-serif";
    ctx.fillText("IEEE RRCE Student Branch", 280, sigY + 45);

    // Center Badge / QR
    const qrCanvas = document.createElement("canvas");
    drawDummyQR(qrCanvas, spec.certId || "RRCE-CERT-2026");
    ctx.drawImage(qrCanvas, w / 2 - 36, sigY - 50, 72, 72);
    ctx.fillStyle = "#5B6B82";
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillText("ID: " + (spec.certId || "RRCE-CERT-8842"), w / 2, sigY + 36);

    // Right Signature
    ctx.beginPath();
    ctx.moveTo(w - 380, sigY);
    ctx.lineTo(w - 180, sigY);
    ctx.stroke();

    ctx.fillStyle = "#0B1B33";
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.fillText("Faculty Counselor", w - 280, sigY + 25);
    ctx.fillStyle = "#5B6B82";
    ctx.font = "13px 'Inter', sans-serif";
    ctx.fillText("IEEE RRCE Student Branch", w - 280, sigY + 45);
  }

  /* Render Handbuilt SVG Activity Chart */
  function renderActivityChart(wrap) {
    if (!wrap) return;
    const data = PD.MONTHLY_ACTIVITY || [];
    const maxVal = 80;
    const w = 600;
    const h = 220;
    const padX = 40;
    const padY = 25;
    const chartW = w - padX * 2;
    const chartH = h - padY * 2;
    const barW = chartW / data.length - 14;

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Monthly activity points chart">';

    // Horizontal grid lines
    [0, 20, 40, 60, 80].forEach(function (val) {
      const y = h - padY - (val / maxVal) * chartH;
      svg += '<line x1="' + padX + '" y1="' + y + '" x2="' + (w - padX) + '" y2="' + y + '" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3" />';
      svg += '<text x="' + (padX - 8) + '" y="' + (y + 4) + '" fill="var(--muted)" font-size="10" text-anchor="end">' + val + '</text>';
    });

    // Bars
    data.forEach(function (d, i) {
      const x = padX + i * (chartW / data.length) + 7;
      const barH = (d.points / maxVal) * chartH;
      const y = h - padY - barH;
      svg += '<rect class="chart-bar" x="' + x + '" y="' + y + '" width="' + barW + '" height="' + barH + '" rx="5" fill="var(--blue)" data-points="' + d.points + '" data-month="' + d.month + '" />';
      svg += '<text x="' + (x + barW / 2) + '" y="' + (h - 8) + '" fill="var(--muted)" font-size="11" font-weight="600" text-anchor="middle">' + d.month + '</text>';
    });

    svg += '</svg>';
    svg += '<div class="chart-tooltip" id="chart-tooltip" style="opacity: 0;"></div>';
    wrap.innerHTML = svg;

    const tooltip = document.getElementById("chart-tooltip");
    wrap.addEventListener("mousemove", function (e) {
      const bar = e.target.closest(".chart-bar");
      if (!bar) {
        if (tooltip) tooltip.style.opacity = "0";
        return;
      }
      const pts = bar.getAttribute("data-points");
      const month = bar.getAttribute("data-month");
      tooltip.textContent = month + ": " + pts + " pts";
      tooltip.style.left = e.offsetX + "px";
      tooltip.style.top = e.offsetY + "px";
      tooltip.style.opacity = "1";
    });
    wrap.addEventListener("mouseleave", function () {
      if (tooltip) tooltip.style.opacity = "0";
    });
  }

  /* Shared Portal Chrome Builder */
  function mountPortalChrome() {
    const sidebarEl = document.getElementById("portal-sidebar");
    const topbarEl = document.getElementById("portal-topbar");
    const activePage = document.body.dataset.page || "dashboard";

    const navItems = [
      { page: "dashboard", label: "Dashboard", href: "dashboard.html", icon: "📊" },
      { page: "my-events", label: "My Events", href: "my-events.html", icon: "🎟️" },
      { page: "chapters", label: "Chapters", href: "chapters.html", icon: "🏛️" },
      { page: "projects", label: "Projects", href: "projects.html", icon: "💡" },
      { page: "resources", label: "Resources", href: "resources.html", icon: "📚" },
      { page: "certificates", label: "Certificates", href: "certificates.html", icon: "🎓" },
      { page: "leaderboard", label: "Leaderboard", href: "leaderboard.html", icon: "🏆" },
      { page: "community", label: "Community", href: "community.html", icon: "💬" },
      { page: "notifications", label: "Notifications", href: "notifications.html", icon: "🔔", badge: getUnreadNotifCount() },
      { page: "profile", label: "Profile", href: "profile.html", icon: "👤" },
      { page: "settings", label: "Settings", href: "settings.html", icon: "⚙️" }
    ];

    if (sidebarEl) {
      sidebarEl.innerHTML =
        '<div class="portal-sidebar__head">' +
          '<div class="portal-sidebar__brand">' +
            'IEEE RRCE' +
            '<span>Member Portal</span>' +
          '</div>' +
        '</div>' +
        '<nav class="portal-nav" aria-label="Portal Navigation">' +
          '<span class="portal-nav__section">Member Menu</span>' +
          navItems.map(function (item) {
            const isActive = activePage === item.page;
            return (
              '<a class="portal-nav__link' + (isActive ? " is-active" : "") + '" href="' + pageHref(item.href) + '">' +
                '<span>' + item.icon + '</span>' +
                '<span>' + item.label + '</span>' +
                (item.badge ? '<span class="portal-nav__badge" id="nav-notif-badge">' + item.badge + '</span>' : '') +
              '</a>'
            );
          }).join("") +
          '<span class="portal-nav__section">Exit</span>' +
          '<a class="portal-nav__link" href="' + asset("index.html") + '">' +
            '<span>🌐</span>' +
            '<span>Back to Public Site</span>' +
          '</a>' +
        '</nav>' +
        '<div class="portal-sidebar__foot">' +
          '<div class="portal-dummy-badge">' +
            '<span class="portal-dummy-badge__dot"></span>' +
            'Preview — Dummy Data' +
          '</div>' +
        '</div>';
    }

    if (topbarEl) {
      const unread = getUnreadNotifCount();
      topbarEl.innerHTML =
        '<button class="portal-hamburger" id="portal-hamburger-btn" type="button" aria-label="Toggle navigation drawer">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>' +
        '</button>' +
        '<div class="portal-topbar__search">' +
          '<input type="search" data-portal-search placeholder="Search portal..." aria-label="Search current view" />' +
        '</div>' +
        '<div class="portal-topbar__actions">' +
          '<button class="portal-icon-btn" data-theme-toggle type="button" aria-label="Toggle theme">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
          '</button>' +
          '<a class="portal-icon-btn" href="notifications.html" aria-label="Notifications (' + unread + ' unread)">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
            (unread > 0 ? '<span class="portal-icon-btn__badge" id="topbar-notif-dot"></span>' : '') +
          '</a>' +
          '<a class="portal-avatar-btn" href="profile.html">' +
            '<img src="https://api.dicebear.com/9.x/avataaars/svg?seed=' + encodeURIComponent(STATE.member.avatarSeed) + '" alt="' + STATE.member.name + '" />' +
            '<span>' + STATE.member.name + '</span>' +
          '</a>' +
        '</div>';

      const themeBtn = topbarEl.querySelector("[data-theme-toggle]");
      if (themeBtn) {
        themeBtn.addEventListener("click", function () {
          UI.setTheme(UI.getTheme() === "dark" ? "light" : "dark");
        });
      }

      const burger = document.getElementById("portal-hamburger-btn");
      if (burger && sidebarEl) {
        let backdrop = document.getElementById("portal-drawer-backdrop");
        if (!backdrop) {
          backdrop = document.createElement("div");
          backdrop.id = "portal-drawer-backdrop";
          backdrop.className = "portal-drawer-backdrop";
          document.body.appendChild(backdrop);
        }
        function openDrawer() {
          sidebarEl.classList.add("is-open");
          backdrop.classList.add("is-open");
        }
        function closeDrawer() {
          sidebarEl.classList.remove("is-open");
          backdrop.classList.remove("is-open");
        }
        burger.addEventListener("click", openDrawer);
        backdrop.addEventListener("click", closeDrawer);
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && sidebarEl.classList.contains("is-open")) closeDrawer();
        });
      }
    }
  }

  // Common Page Initializer
  function initPortalPage() {
    mountPortalChrome();
    const page = document.body.dataset.page;

    // Attach search filter on current page list
    const searchInput = document.querySelector("[data-portal-search]");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        const q = e.target.value.toLowerCase().trim();
        const items = document.querySelectorAll("[data-searchable]");
        items.forEach(function (el) {
          const hay = el.textContent.toLowerCase();
          el.style.display = hay.indexOf(q) !== -1 ? "" : "none";
        });
      });
    }

    if (page === "dashboard") initDashboard();
    if (page === "my-events") initMyEvents();
    if (page === "chapters") initChapters();
    if (page === "projects") initProjects();
    if (page === "resources") initResources();
    if (page === "certificates") initCertificates();
    if (page === "leaderboard") initLeaderboard();
    if (page === "community") initCommunity();
    if (page === "notifications") initNotifications();
    if (page === "profile") initProfile();
    if (page === "settings") initSettings();
  }

  /* Page 1: Dashboard */
  function initDashboard() {
    const qrCanvas = document.getElementById("id-card-qr");
    if (qrCanvas) drawDummyQR(qrCanvas, STATE.member.memberId);

    const chartWrap = document.getElementById("dashboard-chart-wrap");
    if (chartWrap) renderActivityChart(chartWrap);

    // Download Membership Card PNG
    const dlBtn = document.getElementById("download-id-card-btn");
    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        const cardCanvas = document.createElement("canvas");
        const ctx = cardCanvas.getContext("2d");
        cardCanvas.width = 760;
        cardCanvas.height = 480;

        // Card background
        const grad = ctx.createLinearGradient(0, 0, 760, 480);
        grad.addColorStop(0, "#0A2A5E");
        grad.addColorStop(0.7, "#0B5CAD");
        grad.addColorStop(1, "#00629B");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 760, 480);

        ctx.strokeStyle = "#FFC20E";
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, 740, 460);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 32px 'Space Grotesk', sans-serif";
        ctx.fillText("IEEE RRCE STUDENT BRANCH", 40, 65);

        ctx.fillStyle = "#FFC20E";
        ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("DIGITAL MEMBERSHIP CARD", 40, 100);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 42px 'Space Grotesk', sans-serif";
        ctx.fillText(STATE.member.fullName, 40, 210);

        ctx.fillStyle = "#CADBEE";
        ctx.font = "22px 'Inter', sans-serif";
        ctx.fillText("USN: " + STATE.member.usn, 40, 255);
        ctx.fillText("Dept: " + STATE.member.department + " (" + STATE.member.year + ")", 40, 290);
        ctx.fillText("Member ID: " + STATE.member.memberId, 40, 325);

        // QR Code
        const qrC = document.createElement("canvas");
        drawDummyQR(qrC, STATE.member.memberId);
        ctx.drawImage(qrC, 540, 180, 160, 160);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px 'Inter', sans-serif";
        ctx.fillText("Valid Till: " + STATE.member.validTill, 40, 420);
        ctx.fillText("Status: ACTIVE", 540, 420);

        const a = document.createElement("a");
        a.download = "ieee-rrce-membership-card.png";
        a.href = cardCanvas.toDataURL("image/png");
        a.click();
        showToast("Membership Card PNG downloaded!", "success");
      });
    }

    // Print card
    const printBtn = document.getElementById("print-id-card-btn");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
      });
    }

    // Tasks checklist
    const checklistWrap = document.getElementById("dashboard-checklist");
    if (checklistWrap) {
      function renderTasks() {
        checklistWrap.innerHTML = STATE.tasks.map(function (t, idx) {
          return (
            '<label class="checklist-item' + (t.completed ? " is-completed" : "") + '">' +
              '<input type="checkbox" data-task-idx="' + idx + '"' + (t.completed ? " checked" : "") + ' />' +
              '<span>' + UI.escapeHtml(t.title) + '</span>' +
              '<span class="portal-nav__badge" style="margin-left:auto;">+' + t.points + ' pts</span>' +
            '</label>'
          );
        }).join("");
      }
      renderTasks();
      checklistWrap.addEventListener("change", function (e) {
        const idx = e.target.getAttribute("data-task-idx");
        if (idx == null) return;
        STATE.tasks[idx].completed = e.target.checked;
        if (e.target.checked) {
          STATE.member.stats.points += STATE.tasks[idx].points;
          showToast("Task completed! +" + STATE.tasks[idx].points + " points awarded.", "success");
        }
        renderTasks();
      });
    }
  }

  /* Page 2: My Events */
  function initMyEvents() {
    const listWrap = document.getElementById("my-events-list");
    const tabsWrap = document.getElementById("my-events-tabs");
    let currentTab = "registered";

    function paint() {
      const items = STATE.events.filter(function (e) {
        return e.status === currentTab;
      });
      if (!items.length) {
        listWrap.innerHTML = '<div class="empty">No events found in this category.</div>';
        return;
      }
      listWrap.innerHTML = items.map(function (e) {
        return (
          '<div class="card card__body" data-searchable style="display:flex; flex-direction:column; gap:0.6rem;">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
              '<span class="tag tag--' + UI.escapeHtml(e.category) + '">' + UI.escapeHtml(e.category) + '</span>' +
              '<span class="portal-dummy-badge">Code: ' + e.checkInCode + '</span>' +
            '</div>' +
            '<h3>' + UI.escapeHtml(e.title) + '</h3>' +
            '<p style="margin:0; font-size:0.9rem; color:var(--muted);">' +
              '📅 ' + UI.formatDate(e.date) + ' • ⏰ ' + e.time + '<br />' +
              '📍 ' + UI.escapeHtml(e.venue) +
            '</p>' +
            '<div style="display:flex; gap:0.6rem; margin-top:0.5rem; flex-wrap:wrap;">' +
              '<button class="btn btn--outline" type="button" data-event-pass="' + e.id + '">View Pass</button>' +
              '<a class="btn btn--ghost" href="' + UI.calendarUrl(e) + '" target="_blank" rel="noopener">Add to GCal</a>' +
              (currentTab === "registered"
                ? '<button class="btn btn--ghost" style="color:#ef4444;" type="button" data-cancel-event="' + e.id + '">Cancel</button>'
                : '') +
              (currentTab === "attended"
                ? '<button class="btn btn--yellow" type="button" data-event-feedback="' + e.id + '">Submit Feedback</button>'
                : '') +
            '</div>' +
          '</div>'
        );
      }).join("");
    }

    if (tabsWrap) {
      tabsWrap.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-tab]");
        if (!btn) return;
        currentTab = btn.getAttribute("data-tab");
        tabsWrap.querySelectorAll(".tab").forEach(function (t) {
          t.classList.toggle("is-active", t === btn);
        });
        paint();
      });
    }

    listWrap.addEventListener("click", function (e) {
      const passBtn = e.target.closest("[data-event-pass]");
      if (passBtn) {
        const evt = STATE.events.find(function (x) { return x.id === passBtn.getAttribute("data-event-pass"); });
        if (evt) openPassModal(evt);
      }
      const cancelBtn = e.target.closest("[data-cancel-event]");
      if (cancelBtn) {
        const id = cancelBtn.getAttribute("data-cancel-event");
        if (confirm("Are you sure you want to cancel your registration?")) {
          STATE.events = STATE.events.filter(function (x) { return x.id !== id; });
          showToast("Registration cancelled.", "success");
          paint();
        }
      }
      const feedbackBtn = e.target.closest("[data-event-feedback]");
      if (feedbackBtn) {
        const comment = prompt("Please provide your workshop rating and feedback (1-5 stars & comments):", "⭐⭐⭐⭐⭐ Outstanding technical depth!");
        if (comment) {
          showToast("Feedback submitted. Thank you for helping improve RRCE workshops!", "success");
        }
      }
    });

    paint();
  }

  function openPassModal(evt) {
    let modal = document.getElementById("event-pass-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "event-pass-modal";
      modal.className = "modal";
      document.body.appendChild(modal);
    }
    modal.hidden = false;
    modal.innerHTML =
      '<div class="backdrop" data-close-pass></div>' +
      '<div class="modal__dialog" role="dialog" aria-modal="true" tabindex="-1">' +
        '<div class="modal__head">' +
          '<div><span class="tag tag--Event">EVENT DIGITAL PASS</span><h2>' + UI.escapeHtml(evt.title) + '</h2></div>' +
          '<button class="icon-btn" type="button" data-close-pass aria-label="Close pass">✕</button>' +
        '</div>' +
        '<div style="text-align:center; padding:1.5rem 0;">' +
          '<canvas id="pass-modal-qr" style="width:140px; height:140px; border-radius:12px; border:1px solid var(--border);"></canvas>' +
          '<p style="font-family:var(--font-head); font-weight:700; font-size:1.2rem; margin:0.8rem 0 0.2rem;">' + evt.checkInCode + '</p>' +
          '<small style="color:var(--muted);">Present this check-in code at the registration desk</small>' +
        '</div>' +
        '<p><strong>Venue:</strong> ' + UI.escapeHtml(evt.venue) + '<br />' +
        '<strong>Date:</strong> ' + UI.formatDate(evt.date) + ' • ' + evt.time + '</p>' +
        '<button class="btn btn--yellow" style="width:100%;" type="button" data-close-pass>Done</button>' +
      '</div>';

    drawDummyQR(document.getElementById("pass-modal-qr"), evt.checkInCode);

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close-pass]")) modal.hidden = true;
    });
  }

  /* Page 3: Chapters */
  function initChapters() {
    const listWrap = document.getElementById("portal-chapters-list");
    if (!listWrap) return;

    function paint() {
      listWrap.innerHTML = STATE.chapters.map(function (c) {
        return (
          '<div class="card card__body" data-searchable style="display:flex; flex-direction:column; gap:0.75rem;">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
              '<span class="portal-nav__badge">' + c.short + '</span>' +
              '<span class="portal-dummy-badge">' + c.membersCount + ' members</span>' +
            '</div>' +
            '<h3>' + UI.escapeHtml(c.name) + '</h3>' +
            '<p style="margin:0; font-size:0.88rem; color:var(--muted);">' + UI.escapeHtml(c.department) + '</p>' +
            '<p style="font-size:0.92rem; flex:1;">' + UI.escapeHtml(c.description) + '</p>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:0.75rem;">' +
              '<small style="color:var(--muted);">' + UI.escapeHtml(c.lead) + '</small>' +
              '<button class="btn ' + (c.isJoined ? "btn--outline" : "btn--yellow") + '" type="button" data-toggle-chapter="' + c.id + '">' +
                (c.isJoined ? "Leave" : "Join Chapter") +
              '</button>' +
            '</div>' +
          '</div>'
        );
      }).join("");
    }

    listWrap.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-toggle-chapter]");
      if (!btn) return;
      const cid = btn.getAttribute("data-toggle-chapter");
      const ch = STATE.chapters.find(function (x) { return x.id === cid; });
      if (ch) {
        ch.isJoined = !ch.isJoined;
        ch.membersCount += ch.isJoined ? 1 : -1;
        showToast(ch.isJoined ? "Joined " + ch.name + "!" : "Left " + ch.name + ".", "success");
        paint();
      }
    });

    paint();
  }

  /* Page 4: Projects */
  function initProjects() {
    const listWrap = document.getElementById("portal-projects-list");
    if (!listWrap) return;

    function paint() {
      listWrap.innerHTML = STATE.projects.map(function (p) {
        return (
          '<div class="card card__body" data-searchable style="display:flex; flex-direction:column; gap:0.6rem;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<span class="tag tag--Competition">' + p.status + '</span>' +
              '<button class="btn btn--ghost" type="button" data-star-project="' + p.id + '">⭐ ' + p.stars + '</button>' +
            '</div>' +
            '<h3>' + UI.escapeHtml(p.title) + '</h3>' +
            '<p style="margin:0; font-size:0.85rem; color:var(--muted);">' + UI.escapeHtml(p.chapter) + ' • Lead: ' + UI.escapeHtml(p.lead) + '</p>' +
            '<p style="font-size:0.92rem; flex:1;">' + UI.escapeHtml(p.summary) + '</p>' +
            '<div style="display:flex; flex-wrap:wrap; gap:0.35rem;">' +
              p.tech.map(function (t) { return '<span class="portal-dummy-badge">' + UI.escapeHtml(t) + '</span>'; }).join("") +
            '</div>' +
            '<div style="border-top:1px solid var(--border); padding-top:0.75rem; margin-top:0.5rem; display:flex; justify-content:space-between; align-items:center;">' +
              '<small style="color:var(--muted);">Open: ' + p.openRoles.join(", ") + '</small>' +
              '<button class="btn btn--yellow" type="button" data-join-project="' + p.id + '">Apply to Team</button>' +
            '</div>' +
          '</div>'
        );
      }).join("");
    }

    listWrap.addEventListener("click", function (e) {
      const starBtn = e.target.closest("[data-star-project]");
      if (starBtn) {
        const id = starBtn.getAttribute("data-star-project");
        const p = STATE.projects.find(function (x) { return x.id === id; });
        if (p) {
          p.stars++;
          paint();
        }
      }
      const joinBtn = e.target.closest("[data-join-project]");
      if (joinBtn) {
        const role = prompt("Which open role would you like to apply for?", "Developer / Contributor");
        if (role) {
          showToast("Application submitted to project lead. You will be contacted via email!", "success");
        }
      }
    });

    const submitIdeaBtn = document.getElementById("submit-idea-btn");
    if (submitIdeaBtn) {
      submitIdeaBtn.addEventListener("click", function () {
        const title = prompt("Enter project proposal title:");
        if (title) {
          STATE.projects.unshift({
            id: "pr" + (STATE.projects.length + 1),
            title: title,
            chapter: "Computer Society",
            dept: STATE.member.department,
            lead: STATE.member.name,
            summary: "Student proposed project submitted for chapter mentoring review.",
            tech: ["Python", "Hardware", "IoT"],
            openRoles: ["Student Collaborator"],
            status: "Submitted",
            stars: 1
          });
          showToast("New project idea submitted successfully!", "success");
          paint();
        }
      });
    }

    paint();
  }

  /* Page 5: Resources */
  function initResources() {
    const listWrap = document.getElementById("portal-resources-list");
    const chipsWrap = document.getElementById("portal-resources-chips");
    let currentFilter = "All";
    let showBookmarksOnly = false;

    function paint() {
      const items = STATE.resources.filter(function (r) {
        if (showBookmarksOnly && !r.bookmarked) return false;
        if (currentFilter !== "All" && r.type !== currentFilter) return false;
        return true;
      });

      if (!items.length) {
        listWrap.innerHTML = '<div class="empty">No resources found matching the criteria.</div>';
        return;
      }

      listWrap.innerHTML = items.map(function (r) {
        return (
          '<div class="card card__body" data-searchable style="display:flex; justify-content:space-between; align-items:center; gap:1rem;">' +
            '<div>' +
              '<div style="display:flex; gap:0.4rem; align-items:center; margin-bottom:0.25rem;">' +
                '<span class="tag tag--Membership">' + r.type + '</span>' +
                '<small style="color:var(--muted);">' + r.chapter + ' • ' + r.size + '</small>' +
              '</div>' +
              '<h3 style="margin:0; font-size:1.05rem;">' + UI.escapeHtml(r.title) + '</h3>' +
            '</div>' +
            '<div style="display:flex; gap:0.5rem; align-items:center;">' +
              '<button class="portal-icon-btn" type="button" data-bookmark-res="' + r.id + '" title="Bookmark resource">' +
                (r.bookmarked ? "★" : "☆") +
              '</button>' +
              '<button class="btn btn--outline" type="button" data-download-res="' + r.id + '">Download</button>' +
            '</div>' +
          '</div>'
        );
      }).join("");
    }

    if (chipsWrap) {
      chipsWrap.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-chip]");
        if (!btn) return;
        const chip = btn.getAttribute("data-chip");
        if (chip === "Bookmarks") {
          showBookmarksOnly = true;
          currentFilter = "All";
        } else {
          showBookmarksOnly = false;
          currentFilter = chip;
        }
        chipsWrap.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("is-active", c === btn);
        });
        paint();
      });
    }

    listWrap.addEventListener("click", function (e) {
      const bm = e.target.closest("[data-bookmark-res]");
      if (bm) {
        const id = bm.getAttribute("data-bookmark-res");
        const r = STATE.resources.find(function (x) { return x.id === id; });
        if (r) {
          r.bookmarked = !r.bookmarked;
          showToast(r.bookmarked ? "Resource bookmarked!" : "Bookmark removed.", "success");
          paint();
        }
      }
      const dl = e.target.closest("[data-download-res]");
      if (dl) {
        showToast("Starting resource download from IEEE repository...", "success");
      }
    });

    paint();
  }

  /* Page 6: Certificates */
  function initCertificates() {
    const listWrap = document.getElementById("portal-certificates-list");
    if (!listWrap) return;

    const certEvents = STATE.events.filter(function (e) {
      return e.hasCertificate;
    });

    listWrap.innerHTML = certEvents.map(function (e) {
      return (
        '<div class="card card__body" data-searchable style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">' +
          '<div>' +
            '<span class="tag tag--Membership">Verified Certificate</span>' +
            '<h3 style="margin:0.35rem 0 0.2rem;">' + UI.escapeHtml(e.title) + '</h3>' +
            '<p style="margin:0; font-size:0.88rem; color:var(--muted);">' +
              'Issued on ' + (e.certDate || "14 Oct 2026") + ' • Code: ' + e.checkInCode +
            '</p>' +
          '</div>' +
          '<div style="display:flex; gap:0.5rem;">' +
            '<button class="btn btn--yellow" type="button" data-preview-cert="' + e.id + '">Preview & Download</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    listWrap.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-preview-cert]");
      if (!btn) return;
      const evt = STATE.events.find(function (x) { return x.id === btn.getAttribute("data-preview-cert"); });
      if (evt) openCertificateModal(evt);
    });
  }

  function openCertificateModal(evt) {
    let modal = document.getElementById("cert-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "cert-modal";
      modal.className = "modal";
      document.body.appendChild(modal);
    }
    modal.hidden = false;
    modal.innerHTML =
      '<div class="backdrop" data-close-cert></div>' +
      '<div class="modal__dialog" style="max-width:920px;" role="dialog" aria-modal="true" tabindex="-1">' +
        '<div class="modal__head">' +
          '<h2>Certificate of Participation</h2>' +
          '<button class="icon-btn" type="button" data-close-cert aria-label="Close certificate">✕</button>' +
        '</div>' +
        '<div style="padding:1rem 0; overflow-x:auto;">' +
          '<canvas id="cert-canvas" style="width:100%; max-width:860px; height:auto; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.12);"></canvas>' +
        '</div>' +
        '<div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.5rem;">' +
          '<button class="btn btn--outline" type="button" id="print-cert-btn">Print</button>' +
          '<button class="btn btn--yellow" type="button" id="download-cert-btn">Download PNG</button>' +
        '</div>' +
      '</div>';

    const canvas = document.getElementById("cert-canvas");
    generateCertificate(canvas, {
      name: STATE.member.fullName,
      usn: STATE.member.usn,
      dept: STATE.member.department,
      eventName: evt.title,
      date: evt.certDate || "14 Oct 2026",
      certId: evt.checkInCode
    });

    document.getElementById("download-cert-btn").addEventListener("click", function () {
      const a = document.createElement("a");
      a.download = "ieee-certificate-" + evt.id + ".png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast("Certificate downloaded successfully!", "success");
    });

    document.getElementById("print-cert-btn").addEventListener("click", function () {
      window.print();
    });

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close-cert]")) modal.hidden = true;
    });
  }

  /* Page 7: Leaderboard */
  function initLeaderboard() {
    const listWrap = document.getElementById("portal-leaderboard-rows");
    const deptSelect = document.getElementById("leaderboard-dept-filter");
    if (!listWrap) return;

    let dept = "All";

    function paint() {
      const members = PD.MEMBERS.slice().sort(function (a, b) {
        return b.points - a.points;
      }).filter(function (m) {
        return dept === "All" || m.dept === dept || (dept === "CSE" && m.dept.indexOf("CSE") !== -1);
      });

      listWrap.innerHTML = members.map(function (m, idx) {
        const isCurrent = m.usn === STATE.member.usn;
        return (
          '<tr class="' + (isCurrent ? "is-current-member" : "") + '" data-searchable>' +
            '<td><strong>#' + (idx + 1) + '</strong></td>' +
            '<td style="display:flex; align-items:center; gap:0.6rem;">' +
              '<img src="https://api.dicebear.com/9.x/avataaars/svg?seed=' + encodeURIComponent(m.avatarSeed) + '" width="28" height="28" style="border-radius:50%;" alt="" />' +
              '<span>' + UI.escapeHtml(m.name) + (isCurrent ? " (You)" : "") + '</span>' +
            '</td>' +
            '<td>' + UI.escapeHtml(m.dept) + '</td>' +
            '<td><span class="portal-nav__badge">' + m.points + ' pts</span></td>' +
            '<td>' + m.badges + ' badges</td>' +
            '<td>' + UI.escapeHtml(m.role) + '</td>' +
          '</tr>'
        );
      }).join("");
    }

    if (deptSelect) {
      deptSelect.addEventListener("change", function (e) {
        dept = e.target.value;
        paint();
      });
    }

    paint();
  }

  /* Page 8: Community */
  function initCommunity() {
    const postsWrap = document.getElementById("community-posts-list");
    const newPostForm = document.getElementById("community-new-post-form");

    function paint() {
      if (!postsWrap) return;
      postsWrap.innerHTML = STATE.discussions.map(function (p) {
        return (
          '<article class="card card__body" data-searchable style="display:flex; flex-direction:column; gap:0.5rem;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<div style="display:flex; align-items:center; gap:0.6rem;">' +
                '<img src="https://api.dicebear.com/9.x/avataaars/svg?seed=' + encodeURIComponent(p.avatarSeed) + '" width="32" height="32" style="border-radius:50%;" alt="" />' +
                '<div>' +
                  '<strong>' + UI.escapeHtml(p.author) + '</strong> ' +
                  '<small style="color:var(--muted);">• ' + UI.escapeHtml(p.dept) + ' • ' + p.date + '</small>' +
                '</div>' +
              '</div>' +
              '<button class="btn btn--outline" type="button" data-upvote-post="' + p.id + '">▲ ' + p.upvotes + '</button>' +
            '</div>' +
            '<h3 style="margin:0.25rem 0 0;">' + UI.escapeHtml(p.title) + '</h3>' +
            '<p style="margin:0; font-size:0.92rem;">' + UI.escapeHtml(p.body) + '</p>' +
            '<div style="display:flex; gap:0.6rem; align-items:center; border-top:1px solid var(--border); padding-top:0.5rem; margin-top:0.3rem;">' +
              '<small style="color:var(--muted);">💬 ' + p.repliesCount + ' replies</small>' +
              '<button class="btn btn--ghost" type="button" data-reply-post="' + p.id + '">Reply</button>' +
            '</div>' +
          '</article>'
        );
      }).join("");
    }

    if (postsWrap) {
      postsWrap.addEventListener("click", function (e) {
        const upBtn = e.target.closest("[data-upvote-post]");
        if (upBtn) {
          const id = upBtn.getAttribute("data-upvote-post");
          const p = STATE.discussions.find(function (x) { return x.id === id; });
          if (p) {
            p.upvotes++;
            paint();
          }
        }
        const replyBtn = e.target.closest("[data-reply-post]");
        if (replyBtn) {
          const text = prompt("Write your response to this thread:");
          if (text) {
            const id = replyBtn.getAttribute("data-reply-post");
            const p = STATE.discussions.find(function (x) { return x.id === id; });
            if (p) {
              p.repliesCount++;
              showToast("Reply posted!", "success");
              paint();
            }
          }
        }
      });
    }

    if (newPostForm) {
      newPostForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = newPostForm.querySelector('[name="title"]').value.trim();
        const body = newPostForm.querySelector('[name="body"]').value.trim();
        if (title && body) {
          STATE.discussions.unshift({
            id: "post" + (STATE.discussions.length + 1),
            author: STATE.member.name,
            dept: STATE.member.department,
            avatarSeed: STATE.member.avatarSeed,
            title: title,
            body: body,
            upvotes: 1,
            repliesCount: 0,
            date: "Just now"
          });
          newPostForm.reset();
          showToast("New discussion thread published!", "success");
          paint();
        }
      });
    }

    const mentorBtn = document.getElementById("request-mentor-btn");
    if (mentorBtn) {
      mentorBtn.addEventListener("click", function () {
        const field = prompt("Which technical domain do you want mentorship in? (e.g. AI/ML, Embedded, Robotics, Web3)", "Robotics & Embedded");
        if (field) {
          showToast("Mentorship request received. We will pair you with a senior IEEE mentor!", "success");
        }
      });
    }

    paint();
  }

  /* Page 9: Notifications */
  function initNotifications() {
    const listWrap = document.getElementById("portal-notifications-list");
    const chipsWrap = document.getElementById("notifications-chips");
    const markAllBtn = document.getElementById("mark-all-read-btn");
    let currentFilter = "All";

    function paint() {
      if (!listWrap) return;
      const items = STATE.notifications.filter(function (n) {
        return currentFilter === "All" || n.type === currentFilter.toLowerCase();
      });

      if (!items.length) {
        listWrap.innerHTML = '<div class="empty">No notifications in this folder.</div>';
        return;
      }

      listWrap.innerHTML = items.map(function (n) {
        return (
          '<div class="card card__body" data-searchable style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; ' + (n.unread ? "border-left:4px solid var(--blue);" : "") + '">' +
            '<div>' +
              '<div style="display:flex; gap:0.45rem; align-items:center; margin-bottom:0.25rem;">' +
                '<span class="tag tag--Membership">' + n.type.toUpperCase() + '</span>' +
                (n.unread ? '<span class="portal-dummy-badge">Unread</span>' : '') +
                '<small style="color:var(--muted);">' + n.time + '</small>' +
              '</div>' +
              '<h3 style="margin:0 0 0.25rem; font-size:1.05rem;">' + UI.escapeHtml(n.title) + '</h3>' +
              '<p style="margin:0; font-size:0.9rem; color:var(--muted);">' + UI.escapeHtml(n.body) + '</p>' +
            '</div>' +
            (n.unread ? '<button class="btn btn--ghost" type="button" data-read-notif="' + n.id + '">Mark Read</button>' : '') +
          '</div>'
        );
      }).join("");
    }

    if (chipsWrap) {
      chipsWrap.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-chip]");
        if (!btn) return;
        currentFilter = btn.getAttribute("data-chip");
        chipsWrap.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("is-active", c === btn);
        });
        paint();
      });
    }

    if (listWrap) {
      listWrap.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-read-notif]");
        if (!btn) return;
        const id = btn.getAttribute("data-read-notif");
        const n = STATE.notifications.find(function (x) { return x.id === id; });
        if (n) {
          n.unread = false;
          mountPortalChrome();
          paint();
        }
      });
    }

    if (markAllBtn) {
      markAllBtn.addEventListener("click", function () {
        STATE.notifications.forEach(function (n) { n.unread = false; });
        showToast("All notifications marked as read.", "success");
        mountPortalChrome();
        paint();
      });
    }

    paint();
  }

  /* Page 10: Profile */
  function initProfile() {
    const form = document.getElementById("portal-profile-form");
    const avatarSeeds = ["AaravCSE", "AaravCoder", "AaravTech", "AaravRobot", "AaravExplorer"];
    const avatarPickerWrap = document.getElementById("avatar-picker-wrap");
    const previewImg = document.getElementById("profile-avatar-preview");

    if (avatarPickerWrap) {
      avatarPickerWrap.innerHTML = avatarSeeds.map(function (seed) {
        const on = STATE.member.avatarSeed === seed;
        return (
          '<button type="button" class="portal-icon-btn' + (on ? " is-active" : "") + '" data-seed="' + seed + '" style="width:48px; height:48px;">' +
            '<img src="https://api.dicebear.com/9.x/avataaars/svg?seed=' + seed + '" width="40" height="40" style="border-radius:50%;" alt="" />' +
          '</button>'
        );
      }).join("");

      avatarPickerWrap.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-seed]");
        if (!btn) return;
        const s = btn.getAttribute("data-seed");
        STATE.member.avatarSeed = s;
        if (previewImg) previewImg.src = "https://api.dicebear.com/9.x/avataaars/svg?seed=" + s;
        avatarPickerWrap.querySelectorAll("button").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        showToast("Avatar updated!", "success");
        mountPortalChrome();
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        STATE.member.fullName = form.querySelector('[name="name"]').value.trim() || STATE.member.fullName;
        STATE.member.email = form.querySelector('[name="email"]').value.trim() || STATE.member.email;
        STATE.member.phone = form.querySelector('[name="phone"]').value.trim() || STATE.member.phone;
        STATE.member.year = form.querySelector('[name="year"]').value.trim() || STATE.member.year;
        showToast("Profile details updated successfully!", "success");
        mountPortalChrome();
      });
    }
  }

  /* Page 11: Settings */
  function initSettings() {
    const form = document.getElementById("portal-settings-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        showToast("Settings preferences saved!", "success");
      });
    }

    const resetBtn = document.getElementById("reset-portal-state-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Reset all dummy changes and restore default demo data?")) {
          window.location.reload();
        }
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortalPage);
  } else {
    initPortalPage();
  }

  global.RRCEPortal = {
    STATE,
    showToast,
    drawDummyQR,
    generateCertificate,
    renderActivityChart
  };
})(window);
