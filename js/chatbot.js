/**
 * RRCE IEEE Assistant — AI-style browser-based assistant.
 * Runs entirely on the client, with zero external API dependencies.
 *
 * ARCHITECTURE & EXTENSION NOTE:
 * To swap the deterministic knowledge base with a serverless LLM backend,
 * replace the body of `getReply(userText, context)` below with a `fetch()` call
 * to your secure serverless proxy endpoint (e.g. AWS Lambda, Cloudflare Worker,
 * or Vercel API Route).
 *
 * NEVER embed a secret API key (OpenAI, Gemini, Anthropic, etc.) in frontend code.
 */
(function (global) {
  "use strict";

  const D = global.RRCE;
  const UI = global.RRCEUI;

  const STORAGE_KEY_MSGS = "rrce_chat_history";
  const STORAGE_KEY_OPEN = "rrce_chat_open";
  const MAX_INPUT_LEN = 300;

  const STOP_WORDS = new Set([
    "a", "an", "the", "is", "in", "at", "of", "on", "for", "to", "and", "or",
    "can", "you", "tell", "me", "about", "please", "i", "want", "would", "like",
    "what", "where", "how", "who", "which", "are", "do", "does", "get", "give"
  ]);

  const QUICK_CHIPS = [
    { label: "Upcoming events", query: "upcoming events" },
    { label: "Next event", query: "when is the next event" },
    { label: "Announcements", query: "latest announcements" },
    { label: "How to join", query: "how to join ieee" },
    { label: "Chapters", query: "what chapters are available" },
    { label: "Team", query: "who is the counselor and team" },
    { label: "Contact", query: "how to contact branch" },
    { label: "Location", query: "where is rrce located" },
    { label: "Member dashboard", query: "what is member dashboard" }
  ];

  /* Levenshtein distance for fuzzy typo matching */
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const row = [];
    for (let i = 0; i <= b.length; i++) row[i] = i;
    for (let i = 1; i <= a.length; i++) {
      let prev = i;
      for (let j = 1; j <= b.length; j++) {
        const val = a.charAt(i - 1) === b.charAt(j - 1) ? row[j - 1] : Math.min(row[j - 1], row[j], prev) + 1;
        row[j - 1] = prev;
        prev = val;
      }
      row[b.length] = prev;
    }
    return row[b.length];
  }

  function tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(function (w) {
        return w.length > 1;
      });
  }

  const GENERIC_WORDS = new Set([
    "what", "where", "how", "who", "which", "when", "tell", "show", "give", "about", "branch", "ieee", "rrce"
  ]);

  function wordMatch(userWord, keyWord) {
    if (userWord === keyWord) {
      if (GENERIC_WORDS.has(keyWord)) return 1.0;
      return 3.0 + Math.min(keyWord.length * 0.3, 2.0);
    }
    // Only allow substring matching if keyword is long and distinct
    if (keyWord.length >= 6 && userWord.indexOf(keyWord) !== -1) {
      return 2.5;
    }
    if (Math.max(userWord.length, keyWord.length) >= 4) {
      if (levenshtein(userWord, keyWord) <= 1) {
        if (GENERIC_WORDS.has(keyWord)) return 0.8;
        return 2.5;
      }
    }
    return 0;
  }

  function scoreIntent(intent, userTokens) {
    let score = 0;
    const keywords = (intent.keywords || []).concat(intent.synonyms || []);
    userTokens.forEach(function (token) {
      if (STOP_WORDS.has(token) && !GENERIC_WORDS.has(token)) return;
      let tokenMax = 0;
      keywords.forEach(function (kw) {
        const m = wordMatch(token, kw.toLowerCase());
        if (m > tokenMax) tokenMax = m;
      });
      score += tokenMax;
    });
    return score;
  }

  function getUpcomingEventsList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (D.EVENTS || []).filter(function (e) {
      return new Date(e.date + "T00:00:00") >= today;
    }).sort(function (a, b) {
      return a.date < b.date ? -1 : 1;
    });
  }

  function formatTime(isoDateStr) {
    const d = new Date(isoDateStr);
    return isNaN(d) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  /* Computes rich dynamic responses */
  function computeDynamicIntent(intentId) {
    const upcoming = getUpcomingEventsList();

    if (intentId === "next_event") {
      if (!upcoming.length) {
        return {
          text: "There are currently no upcoming events scheduled on the calendar.",
          links: [{ label: "View Past Events", href: "events.html" }]
        };
      }
      const next = upcoming[0];
      return {
        text: "The next upcoming event is \"" + next.title + "\" on " + UI.formatDate(next.date) + " at " + next.time + " (" + next.venue + "). " + next.summary,
        links: [
          { label: "Add to Calendar", href: UI.calendarUrl(next) },
          { label: "Events Calendar", href: "events.html" }
        ],
        card: {
          title: next.title,
          meta: UI.formatDate(next.date) + " • " + next.venue,
          desc: next.summary
        }
      };
    }

    if (intentId === "upcoming_events") {
      if (!upcoming.length) {
        return {
          text: "No upcoming events are currently listed on the branch calendar.",
          links: [{ label: "Past Events", href: "events.html" }]
        };
      }
      const top3 = upcoming.slice(0, 3);
      const lines = top3.map(function (e, idx) {
        return (idx + 1) + ". " + e.title + " (" + UI.formatDate(e.date) + ")";
      }).join("\n");
      return {
        text: "Here are the next upcoming events at RRCE IEEE:\n" + lines,
        links: [
          { label: "View Full Calendar", href: "events.html" },
          { label: "Join IEEE", href: "membership.html" }
        ]
      };
    }

    if (intentId === "past_events") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const past = (D.EVENTS || []).filter(function (e) {
        return new Date(e.date + "T00:00:00") < today;
      });
      return {
        text: "The branch has hosted " + past.length + " technical workshops and symposiums. Explore the past events tab for details and slides.",
        links: [{ label: "Events Archive", href: "events.html" }]
      };
    }

    if (intentId === "latest_announcements") {
      const top = (D.ANNOUNCEMENTS || []).slice(0, 3);
      const lines = top.map(function (a, idx) {
        return (idx + 1) + ". [" + a.category + "] " + a.title + " (" + UI.formatDate(a.date) + ")";
      }).join("\n");
      return {
        text: "Here are the latest branch announcements:\n" + lines,
        links: [{ label: "All Announcements", href: "announcements.html" }]
      };
    }

    if (intentId === "chapters_all") {
      const chs = D.CHAPTERS || [];
      const list = chs.map(function (c) {
        return "• " + c.name + " (" + c.department + ")";
      }).join("\n");
      return {
        text: "RRCE IEEE features " + chs.length + " department-mapped technical society chapters:\n" + list + "\n\n(Charters are placeholders marked TODO pending counselor confirmation).",
        links: [{ label: "Explore Chapters", href: "chapters.html" }]
      };
    }

    if (intentId === "team_summary") {
      const counselor = (D.TEAM || []).find(function (m) {
        return m.roleGroup === "counselor";
      });
      const cName = counselor ? counselor.name : "Faculty Counselor (TODO)";
      return {
        text: "The student branch operates under Faculty Counselor " + cName + ", supported by our executive committee (Chair, Vice-Chair, Secretary, Treasurer, and Chapter Leads). (Officer names are placeholders TODO).",
        links: [{ label: "Meet Full Team", href: "team.html" }]
      };
    }

    return null;
  }

  /**
   * Primary reply function exposed by the Assistant.
   * Can be swapped with a fetch() call to a serverless LLM backend.
   */
  async function getReply(userText, context) {
    const raw = (userText || "").trim();
    if (!raw) {
      return {
        text: "Please type a question or choose from the quick topics below.",
        links: []
      };
    }

    // Simulate natural processing latency (400 - 800ms)
    await new Promise(function (res) {
      setTimeout(res, 450 + Math.random() * 300);
    });

    const tokens = tokenize(raw);
    const kb = D.CHATBOT_KB || [];

    let bestIntent = null;
    let highestScore = 0;

    kb.forEach(function (intent) {
      const s = scoreIntent(intent, tokens);
      if (s > highestScore) {
        highestScore = s;
        bestIntent = intent;
      }
    });

    // Threshold score of 1.5 required for reliable intent match
    if (bestIntent && highestScore >= 1.5) {
      if (bestIntent.dynamic) {
        const dyn = computeDynamicIntent(bestIntent.dynamic);
        if (dyn) return dyn;
      }
      return {
        text: bestIntent.answer,
        links: bestIntent.links || [],
        card: bestIntent.card || null
      };
    }

    // Fallback response with prefilled mailto email link
    const subject = encodeURIComponent("[Chatbot Inquiry] " + raw.slice(0, 40));
    const body = encodeURIComponent("Hello IEEE RRCE Team,\n\nI asked the AI Assistant: \"" + raw + "\"\n\nCould you please help clarify this for me?\n\nRegards,");
    const mailtoUrl = "mailto:" + (D.SITE.email || "ieee.sb@rrce.org") + "?subject=" + subject + "&body=" + body;

    return {
      text: "I'm not sure about that yet, or the details have not been announced officially. You can try one of the quick suggestions below or email the student branch team directly.",
      links: [
        { label: "Email the Team", href: mailtoUrl, external: true },
        { label: "Contact Page", href: "contact.html" },
        { label: "Membership Guide", href: "membership.html" }
      ]
    };
  }

  /* ==========================================================================
     Chatbot UI Controller & State Persistence
     ========================================================================== */
  let chatPanel = null;
  let chatLauncher = null;
  let messagesContainer = null;
  let chatInput = null;
  let chatSendBtn = null;
  let isTyping = false;

  function loadMessages() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY_MSGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [
      {
        sender: "bot",
        text: "Hello! I am the RRCE IEEE Assistant. Ask me anything about our technical chapters, upcoming events, membership, or the member portal preview.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links: [
          { label: "Upcoming Events", href: "events.html" },
          { label: "How to Join", href: "membership.html" }
        ]
      }
    ];
  }

  function saveMessages(msgs) {
    try {
      sessionStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(msgs.slice(-25)));
    } catch (e) {}
  }

  function isChatOpen() {
    try {
      return sessionStorage.getItem(STORAGE_KEY_OPEN) === "true";
    } catch (e) {
      return false;
    }
  }

  function setChatOpenState(open) {
    try {
      sessionStorage.setItem(STORAGE_KEY_OPEN, open ? "true" : "false");
    } catch (e) {}
  }

  function renderMessageItem(msg) {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg " + (msg.sender === "user" ? "chat-msg--user" : "chat-msg--bot");

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";

    // Text content safely set with textContent
    const p = document.createElement("div");
    p.style.whiteSpace = "pre-line";
    p.textContent = msg.text;
    bubble.appendChild(p);

    // Optional mini card
    if (msg.card) {
      const card = document.createElement("div");
      card.className = "chat-card";
      const h4 = document.createElement("h4");
      h4.textContent = msg.card.title;
      card.appendChild(h4);
      if (msg.card.meta) {
        const meta = document.createElement("div");
        meta.style.fontSize = "0.78rem";
        meta.style.color = "var(--muted)";
        meta.textContent = msg.card.meta;
        card.appendChild(meta);
      }
      if (msg.card.desc) {
        const desc = document.createElement("p");
        desc.style.margin = "0.3rem 0 0 0";
        desc.textContent = msg.card.desc;
        card.appendChild(desc);
      }
      bubble.appendChild(card);
    }

    // Optional link buttons
    if (msg.links && msg.links.length) {
      const linkWrap = document.createElement("div");
      linkWrap.className = "chat-links";
      msg.links.forEach(function (l) {
        const a = document.createElement("a");
        a.className = "chat-link-btn";
        a.textContent = l.label + " →";
        a.href = UI.pageHref(l.href);
        if (l.external || /^https?:/i.test(l.href) || /^mailto:/i.test(l.href)) {
          a.rel = "noopener";
          if (!/^mailto:/i.test(l.href)) a.target = "_blank";
        }
        linkWrap.appendChild(a);
      });
      bubble.appendChild(linkWrap);
    }

    wrap.appendChild(bubble);

    const time = document.createElement("span");
    time.className = "chat-msg__time";
    time.textContent = msg.time || "";
    wrap.appendChild(time);

    return wrap;
  }

  function renderAllMessages() {
    if (!messagesContainer) return;
    messagesContainer.innerHTML = "";
    const msgs = loadMessages();
    msgs.forEach(function (m) {
      messagesContainer.appendChild(renderMessageItem(m));
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    removeTypingIndicator();
    const ind = document.createElement("div");
    ind.className = "chat-typing";
    ind.id = "chat-typing-indicator";
    ind.setAttribute("aria-label", "RRCE IEEE Assistant is typing");
    ind.innerHTML = "<span></span><span></span><span></span>";
    messagesContainer.appendChild(ind);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const existing = document.getElementById("chat-typing-indicator");
    if (existing) existing.remove();
  }

  async function handleSend(customText) {
    const text = typeof customText === "string" ? customText.trim() : (chatInput ? chatInput.value.trim() : "");
    if (!text || isTyping) return;

    if (chatInput) {
      chatInput.value = "";
      chatInput.disabled = true;
    }
    if (chatSendBtn) chatSendBtn.disabled = true;
    isTyping = true;

    const msgs = loadMessages();
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append User Message
    const userMsg = { sender: "user", text: text, time: now };
    msgs.push(userMsg);
    saveMessages(msgs);
    messagesContainer.appendChild(renderMessageItem(userMsg));
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show Typing Indicator
    showTypingIndicator();

    try {
      const reply = await getReply(text, { history: msgs });
      removeTypingIndicator();

      const botMsg = {
        sender: "bot",
        text: reply.text,
        links: reply.links,
        card: reply.card,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      msgs.push(botMsg);
      saveMessages(msgs);
      messagesContainer.appendChild(renderMessageItem(botMsg));
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
      removeTypingIndicator();
      const errMsg = {
        sender: "bot",
        text: "I encountered an error processing your query. Please try again or reach us via the contact page.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links: [{ label: "Contact Page", href: "contact.html" }]
      };
      msgs.push(errMsg);
      saveMessages(msgs);
      messagesContainer.appendChild(renderMessageItem(errMsg));
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } finally {
      isTyping = false;
      if (chatInput) {
        chatInput.disabled = false;
        chatInput.focus();
      }
      if (chatSendBtn) chatSendBtn.disabled = false;
    }
  }

  function openChat() {
    if (!chatPanel || !document.getElementById("chat-form")) {
      initChatbot();
    }
    if (!chatPanel) return;
    chatPanel.hidden = false;
    chatPanel.style.display = "flex";
    if (chatLauncher) chatLauncher.setAttribute("aria-expanded", "true");
    setChatOpenState(true);
    renderAllMessages();
    if (chatInput) chatInput.focus();
  }

  function closeChat() {
    if (!chatPanel) return;
    chatPanel.hidden = true;
    chatPanel.style.display = "none";
    if (chatLauncher) {
      chatLauncher.setAttribute("aria-expanded", "false");
      chatLauncher.focus();
    }
    setChatOpenState(false);
  }

  function toggleChat() {
    if (!chatPanel || !document.getElementById("chat-form")) {
      initChatbot();
    }
    if (!chatPanel) return;
    if (chatPanel.hidden) {
      openChat();
    } else {
      closeChat();
    }
  }

  function clearChat() {
    try {
      sessionStorage.removeItem(STORAGE_KEY_MSGS);
    } catch (e) {}
    renderAllMessages();
    if (chatInput) chatInput.focus();
  }

  function buildChatMarkup() {
    if (!chatPanel) return;
    if (document.getElementById("chat-form")) return; // already built
    chatPanel.innerHTML =
      '<div class="chat-header">' +
        '<div class="chat-header__info">' +
          '<div class="chat-avatar" aria-hidden="true">IEEE</div>' +
          '<div>' +
            '<h3 class="chat-title">RRCE IEEE Assistant</h3>' +
            '<div class="chat-status"><span class="chat-status__dot"></span> Online</div>' +
          '</div>' +
        '</div>' +
        '<div class="chat-header__actions">' +
          '<button class="chat-header__btn" type="button" data-chat-clear title="Clear chat history" aria-label="Clear chat history">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>' +
          '</button>' +
          '<button class="chat-header__btn" type="button" data-chat-close title="Minimise assistant" aria-label="Minimise assistant">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 12H6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="chat-messages" id="chat-messages-wrap" aria-live="polite"></div>' +
      '<div class="chat-chips" id="chat-quick-chips" role="group" aria-label="Quick question chips">' +
        QUICK_CHIPS.map(function (c) {
          return '<button class="chat-chip" type="button" data-query="' + UI.escapeHtml(c.query) + '">' + UI.escapeHtml(c.label) + '</button>';
        }).join("") +
      '</div>' +
      '<form class="chat-form" id="chat-form" novalidate>' +
        '<input class="chat-input" id="chat-input" type="text" maxlength="' + MAX_INPUT_LEN + '" placeholder="Ask about events, membership..." aria-label="Ask a question" />' +
        '<button class="chat-send" id="chat-send" type="submit" aria-label="Send question">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
        '</button>' +
      '</form>';

    messagesContainer = document.getElementById("chat-messages-wrap");
    chatInput = document.getElementById("chat-input");
    chatSendBtn = document.getElementById("chat-send");

    const form = document.getElementById("chat-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        handleSend();
      });
    }

    const chipsWrap = document.getElementById("chat-quick-chips");
    if (chipsWrap) {
      chipsWrap.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-query]");
        if (!btn) return;
        handleSend(btn.getAttribute("data-query"));
      });
    }

    const closeBtn = chatPanel.querySelector("[data-chat-close]");
    if (closeBtn) closeBtn.addEventListener("click", closeChat);

    const clearBtn = chatPanel.querySelector("[data-chat-clear]");
    if (clearBtn) clearBtn.addEventListener("click", clearChat);

    // Esc key closes panel
    document.addEventListener("keydown", function (e) {
      if (chatPanel && !chatPanel.hidden && e.key === "Escape") {
        closeChat();
      }
    });
  }

  function initChatbot() {
    chatPanel = document.getElementById("chat-panel");
    chatLauncher = document.getElementById("chat-launcher");
    if (!chatPanel || !chatLauncher) return;

    buildChatMarkup();

    if (isChatOpen()) {
      openChat();
    } else {
      chatPanel.hidden = true;
      chatPanel.style.display = "none";
    }
  }

  // Delegated document-level click listener so it never misses a click
  document.addEventListener("click", function (e) {
    const launcher = e.target.closest("#chat-launcher, .chat-launcher");
    if (launcher) {
      e.preventDefault();
      toggleChat();
    }
  });

  // Auto initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }

  global.RRCEChat = {
    init: initChatbot,
    toggleChat,
    openChat,
    closeChat,
    clearChat,
    getReply,
    scoreIntent,
    wordMatch,
    tokenize
  };
})(window);
