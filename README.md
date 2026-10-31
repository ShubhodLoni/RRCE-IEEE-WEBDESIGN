  # RRCE IEEE Student Branch Website

  Official, production-quality, multi-page website for the **IEEE Student Branch of Rajarajeswari College of Engineering (RRCE), Bengaluru** (affiliated with the **IEEE Bangalore Section**, Region 10).

  Built strictly using **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)** with **zero frameworks**, **zero UI libraries**, and **zero build tools**.

  ---

  ## 🚀 How to Run Locally

  ### Option 1: VS Code Live Server (Recommended)
  1. Open Visual Studio Code.
  2. Select **File → Open Folder...** and choose the `rrce-ieee` folder (`c:\Users\Hp\OneDrive\Desktop\webdesign\rrce-ieee`).
  3. If not already installed, install the **Live Server** extension by Ritwick Dey from the VS Code Extensions Marketplace.
  4. Right-click on `index.html` in the file explorer and select **"Open with Live Server"** (or click **"Go Live"** on the bottom right status bar).
  5. The website will automatically launch in your default web browser at `http://127.0.0.1:5500/index.html`.

  ### Option 2: Direct File Open
  * Double-click `index.html` in Windows File Explorer. All navigation, responsive styles, search filters, modals, and local mock authentication run natively in any modern browser without requiring a server or build step.

  ### Option 3: Python or Node Local Server
  From a terminal inside the project directory:
  ```bash
  # Python 3
  python -m http.server 8000

  # Node.js
  npx serve
  ```
  Then navigate to `http://localhost:8000`.

  ---

  ## 📂 Project Architecture

  ```
  rrce-ieee/
  ├── index.html                  # Homepage (Hero, statistics, upcoming events, research spotlight, chapters)
  ├── about.html                  # About IEEE, Student Branch concept, RRCE history, vision, mission, roadmap
  ├── members.html                # Members Directory (Search, designation & department filters, member profile cards)
  ├── publications.html           # Research & Publications Portal (Multi-facet filter, abstract modal, 7-step guide)
  ├── events.html                 # Events & Activities (Upcoming/Past tabs, capacity bars, photo gallery)
  ├── chapters.html               # Chapters & Technical Societies (CS, WIE, RAS, PES, charter petition guide)
  ├── contact.html                # Contact Us (Validated form, campus map placeholder, faculty advisor card)
  ├── login.html                  # Member & Admin Login (Password toggle, remember me, demo session integration)
  ├── register.html               # Student Registration (USN check, department, password strength meter)
  ├── dashboard.html              # Student Member Dashboard (Profile editing, membership record, event passes)
  ├── admin.html                  # Administrator Console (Overview KPIs, member & publication management)
  │
  ├── css/
  │   ├── style.css               # Design System (Custom properties, typography, cards, modals, toast, dark mode)
  │   ├── responsive.css          # Mobile-first media queries (360px, 480px, 768px, 1024px, 1280px, 1440px+)
  │   ├── auth.css                # Auth pages: Centered glass-style cards, floating controls, password strength bars
  │   └── dashboard.css           # Dashboards: Sidebar layout, tab routing, KPI cards, responsive data tables
  │
  ├── js/
  │   ├── main.js                 # Shared UI engine: sticky nav, mobile drawer, dark mode, smooth scroll, counters, modal focus trap
  │   ├── members.js              # 14 sample members, real-time debounced search, department & designation filters
  │   ├── publications.js         # 14 sample research papers, multi-filter search, accessible abstract modal
  │   ├── events.js               # 13 sample technical events, upcoming/past tabs, category filter, seat capacity bars
  │   ├── auth.js                 # Validation (email, VTU USN, password strength, match), mock session in localStorage
  │   └── dashboard.js            # Dashboard tab switching, profile populator/editor, admin data table operations
  │
  └── assets/
      ├── icons/                  # Inline SVG icons
      ├── images/                 # Photo gallery visuals
      └── logos/                  # IEEE brand marks
  ```

  ---

  ## 🎨 Design System

  * **Color Tokens (Academic Minimal Palette)**:
    * `--navy-900`: `#0a1628` (Primary dark, hero, footer)
    * `--navy-700`: `#11263f`
    * `--ieee-blue`: `#006699` (Primary IEEE accent, buttons, links)
    * `--ieee-blue-light`: `#00a3d9` (Hover highlights)
    * `--cyan-accent`: `#22d3ee` (Glows, icons on dark)
    * `--gold-accent`: `#f5b301` (Badges, key tags)
    * `--surface`: `#ffffff`; `--surface-alt`: `#f5f7fa`; `--border`: `#e2e8f0`
    * `--text-primary`: `#0f172a`; `--text-secondary`: `#475569`
    * `--success`: `#16a34a`; `--danger`: `#dc2626`; `--warning`: `#f59e0b`
  * **Gradients**:
    * `--grad-hero`: `linear-gradient(135deg, #0a1628 0%, #0b3a5c 55%, #006699 100%)`
    * `--grad-accent`: `linear-gradient(90deg, #006699, #22d3ee)`
  * **Typography**:
    * Headings: `"Sora", sans-serif` (600, 700, 800)
    * Body/UI: `"Inter", sans-serif` (400, 500, 600)
    * Labels/Monospace: `"JetBrains Mono", monospace` (500)
    * Fluid scaling: `h1` `clamp(2rem, 5vw + 1rem, 3.8rem)`, `h2` `clamp(1.5rem, 3vw + 1rem, 2.35rem)`

  ---

  ## ✅ Quality & Verification Checklist

  - [x] **0 Broken Links**: All internal navigation, stylesheet references, and script paths resolve (audited via Node script).
  - [x] **Responsive Layouts**: Tested with 0 horizontal overflow at 360px, 480px, 768px, 1024px, 1280px, and 1440px+.
  - [x] **Accessibility (WCAG AA)**: Skip-to-content links, visible `:focus-visible` outlines, accessible aria attributes, and keyboard modal focus traps (Escape key and Tab cycle).
  - [x] **Dark Mode Toggle**: Clean theme switch in the header persisted in `localStorage` across all pages.
  - [x] **Real Data Datasets (Zero Placeholders)**:
    - `members.js`: 14 realistic sample members across Leadership, Executive Committee, Technical Coordinators, and Members.
    - `publications.js`: 14 realistic peer-reviewed papers with full abstracts, DOIs, and IEEE Xplore links.
    - `events.js`: 13 technical events (7 upcoming, 6 past) with capacity fill meters and registration triggers.
  - [x] **Safe XSS Escaping**: All dynamic rendering escaped using `window.RRCE.escapeHTML`.
  - [x] **Form Validation**: College email regex, VTU student USN verification (`1RR...`), password strength meter, and password visibility toggles.
  - [x] **Mock Auth & Dashboard**: Session simulation via `localStorage.getItem('rrce_demo_user')`, profile editor, and interactive admin management tables.
  - [x] **Reduced Motion**: Respects `prefers-reduced-motion: reduce` for all scroll reveals and counter animations.
  - [x] **Print Styles**: Clean `@media print` rules hiding navigation and formatting text for paper export.
