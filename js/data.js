/**
 * Public site content for the IEEE Student Branch of
 * RajaRajeswari College of Engineering (RRCE), Bengaluru.
 *
 * HOW TO ADD AN EVENT
 * Append an object to EVENTS:
 *   { id, slug, title, summary, body, category, date (ISO YYYY-MM-DD),
 *     time, venue, registerUrl, imageSlug }
 * Upcoming vs past is computed from `date` vs today. Featured countdown
 * auto-picks the soonest upcoming event.
 *
 * HOW TO ADD AN ANNOUNCEMENT
 * Prepend to ANNOUNCEMENTS (newest first):
 *   { id, title, summary, body, category: "Event"|"Membership"|"Competition"|"Notice",
 *     date (ISO), pinned, link?: { label, href } }
 *
 * HOW TO ADD A TEAM MEMBER
 * Push onto TEAM with roleGroup: "counselor"|"mentor"|"execom",
 * plus name, role, department, bio, linkedin, avatarSeed.
 *
 * HOW TO ADD A CHAPTER
 * Push onto CHAPTERS: id, name, short, department, description, activities[],
 * headName, headRole.
 *
 * HOW TO ADD A GALLERY ITEM
 * Push onto GALLERY: id, slug, title, category, caption, date.
 *
 * HOW TO ADD A CHATBOT ANSWER
 * Add an intent to CHATBOT_KB (see Phase 3): id, keywords[], synonyms[],
 * answer, links[], dynamic.
 *
 * Unverified items are marked TODO. Do not present them as confirmed facts.
 */
(function (global) {
  "use strict";

  const SITE = {
    collegeName: "RajaRajeswari College of Engineering",
    collegeShort: "RRCE",
    collegeEst: 2006,
    address: "#14, Ramohalli Cross, Kumbalgodu, Mysore Road, Bengaluru - 560074",
    phone: "+91-80-28437124 / 28437375",
    collegeUrl: "https://www.rrce.org",
    status: "Autonomous institute under VTU Belagavi, AICTE approved, ISO 9001:2015 certified, sponsored by Moogambigai Charitable and Educational Trust.",
    departments: [
      "CSE",
      "ISE",
      "ECE",
      "EEE",
      "ME",
      "Robotics & Automation",
      "CSE (IoT, Cyber Security incl. Blockchain)",
      "MCA",
      "MBA"
    ],
    ieeeRegion: "Region 10",
    /* TODO verify IEEE Bangalore Section affiliation for this student branch */
    ieeeSection: "IEEE Bangalore Section",
    branchName: "IEEE Student Branch",
    /* TODO replace with the official student branch email */
    email: "ieee.sb@rrce.org",
    /* TODO confirm student branch founding year */
    branchFounded: 2014,
    /* TODO replace with real social profile URLs */
    socials: {
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
      youtube: "https://www.youtube.com/",
      x: "https://x.com/"
    },
    heroHeadline: "IEEE Student Branch at RajaRajeswari College of Engineering",
    heroSubtext:
      "A student-led IEEE community at RRCE, Bengaluru — connecting departments through technical talks, competitions, and volunteering. Founding year and officer names are placeholders until the branch confirms them."
  };

  const FALLBACK_GRADIENT =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0A2A5E"/><stop offset="55%" stop-color="#0B5CAD"/><stop offset="100%" stop-color="#FFC20E"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/></svg>'
    );

  function picsum(slug, w, h) {
    return "https://picsum.photos/seed/" + encodeURIComponent(slug) + "/" + (w || 800) + "/" + (h || 500);
  }

  function dicebear(seed) {
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(seed);
  }

  const IMAGES = {
    logos: {
      rrce: {
        src: "assets/img/rrce-logo.svg",
        fallback: "assets/img/rrce-logo.svg",
        alt: "RajaRajeswari College of Engineering",
        width: 48,
        height: 48
      },
      ieeeSb: {
        src: "assets/img/ieee-sb-logo.svg",
        fallback: "assets/img/ieee-sb-logo.svg",
        alt: "IEEE RRCE Student Branch",
        width: 180,
        height: 28
      }
    },
    campus: {
      hero: {
        src: "assets/img/rrce-campus-1.jpg",
        fallback: "assets/img/rrce-campus-1.svg",
        alt: "RRCE campus at Kumbalgodu, Bengaluru (placeholder until a local photo is added)"
      },
      collage: [
        {
          src: "assets/img/rrce-campus-2.jpg",
          fallback: "assets/img/rrce-campus-2.svg",
          alt: "RRCE campus photograph 2 (placeholder illustration)"
        },
        {
          src: "assets/img/rrce-campus-3.jpg",
          fallback: "assets/img/rrce-campus-3.svg",
          alt: "RRCE campus photograph 3 (placeholder illustration)"
        },
        {
          src: "assets/img/rrce-campus-4.jpg",
          fallback: "assets/img/rrce-campus-4.svg",
          alt: "RRCE campus photograph 4 (placeholder illustration)"
        },
        {
          src: "assets/img/rrce-campus-5.jpg",
          fallback: "assets/img/rrce-campus-5.svg",
          alt: "RRCE campus photograph 5 (placeholder illustration)"
        }
      ]
    },
    pillars: {
      learn: { src: picsum("rrce-learn", 800, 500), fallback: FALLBACK_GRADIENT, alt: "Students learning at a technical session (stock placeholder)" },
      build: { src: picsum("rrce-build", 800, 500), fallback: FALLBACK_GRADIENT, alt: "Students building a hardware project (stock placeholder)" },
      compete: { src: picsum("rrce-compete", 800, 500), fallback: FALLBACK_GRADIENT, alt: "Students competing in a hackathon (stock placeholder)" },
      volunteer: { src: picsum("rrce-volunteer", 800, 500), fallback: FALLBACK_GRADIENT, alt: "Student volunteers at a campus event (stock placeholder)" }
    },
    dashboardTeaser: {
      src: picsum("rrce-dashboard", 960, 600),
      fallback: FALLBACK_GRADIENT,
      alt: "Stylised preview of the member dashboard (placeholder)"
    },
    fallbacks: {
      gradient: FALLBACK_GRADIENT
    },
    picsum: picsum,
    dicebear: dicebear
  };

  /* TODO replace every announcement with real branch notices */
  const ANNOUNCEMENTS = [
    {
      id: "a8",
      title: "IEEE Day 2026 recap and photo drive",
      summary: "Share your IEEE Day photos with the branch media team by 10 November.",
      body: "Placeholder notice. The branch will confirm whether IEEE Day was hosted and how members can submit photos. Do not treat this date as official.",
      category: "Notice",
      date: "2026-10-28",
      pinned: true,
      link: { label: "Open gallery", href: "gallery.html" }
    },
    {
      id: "a7",
      title: "Membership drive for odd semester",
      summary: "Placeholder window for new IEEE student members. Confirm dues with the counselor.",
      body: "This membership drive is sample content. Real dues, last dates, and payment steps must be published by the branch counselor before this notice is treated as official.",
      category: "Membership",
      date: "2026-10-20",
      pinned: true,
      link: { label: "How to join", href: "membership.html" }
    },
    {
      id: "a6",
      title: "Guest lecture on responsible AI",
      summary: "Sample upcoming talk mapped to CSE / ISE. Speaker and hall are not confirmed.",
      body: "Placeholder event announcement. Speaker name, venue, and registration link need branch approval.",
      category: "Event",
      date: "2026-10-18",
      pinned: false,
      link: { label: "View events", href: "events.html" }
    },
    {
      id: "a5",
      title: "IEEEXtreme practice nights",
      summary: "Weekly programming practice listed as a sample competition notice.",
      body: "IEEEXtreme practice schedule is placeholder content. Confirm the official IEEEXtreme date on ieee.org before registering teams.",
      category: "Competition",
      date: "2026-10-12",
      pinned: false,
      link: { label: "IEEEXtreme", href: "https://ieeextreme.org/" }
    },
    {
      id: "a4",
      title: "Call for student volunteers",
      summary: "Help with registration desks, photography, and hospitality at branch events.",
      body: "Volunteer roles listed here are examples. The branch has not published a verified volunteer roster.",
      category: "Notice",
      date: "2026-09-30",
      pinned: false,
      link: { label: "Contact the team", href: "contact.html" }
    },
    {
      id: "a3",
      title: "Robotics workshop with RAS chapter",
      summary: "Hands-on session mapped to Robotics & Automation. Dates are sample only.",
      body: "Placeholder workshop. Kit list and faculty coordinator will be announced by the chapter head.",
      category: "Event",
      date: "2026-09-15",
      pinned: false
    },
    {
      id: "a2",
      title: "Petition window for new technical chapter",
      summary: "Sample notice about starting an additional society chapter on campus.",
      body: "IEEE chapter petitions require a counselor and a minimum petition count. This item is not an official call.",
      category: "Membership",
      date: "2026-08-22",
      pinned: false,
      link: { label: "See chapters", href: "chapters.html" }
    },
    {
      id: "a1",
      title: "Orientation for first-year students",
      summary: "Intro to IEEE at RRCE — sample recap of an odd-semester orientation.",
      body: "Placeholder recap. Attendance numbers and slides are not published.",
      category: "Event",
      date: "2026-08-08",
      pinned: false
    }
  ];

  /* TODO replace events, venues, and register links with real branch calendar */
  const EVENTS = [
    {
      id: "e1",
      slug: "ieee-day-2026",
      title: "IEEE Day campus meetup",
      summary: "Sample recap-style event used for past-tab listings.",
      body: "Placeholder. IEEE Day is observed globally; RRCE hosting details are not verified here.",
      category: "Community",
      date: "2026-10-01",
      time: "10:00",
      venue: "Main seminar hall (venue TODO)",
      registerUrl: "membership.html"
    },
    {
      id: "e2",
      slug: "pcb-workshop",
      title: "PCB design weekend",
      summary: "Hands-on layout session for ECE and EEE students (sample).",
      body: "Placeholder workshop. Tools, kit fees, and faculty names need confirmation.",
      category: "Workshop",
      date: "2026-11-08",
      time: "09:30",
      venue: "ECE lab complex (venue TODO)",
      registerUrl: "contact.html"
    },
    {
      id: "e3",
      slug: "ieeextreme-practice",
      title: "IEEEXtreme practice night",
      summary: "Timed coding warmup before the global 24-hour contest.",
      body: "Placeholder practice session. Official IEEEXtreme registration is on ieee.org.",
      category: "Competition",
      date: "2026-11-22",
      time: "18:00",
      venue: "CSE lab 2 (venue TODO)",
      registerUrl: "https://ieeextreme.org/"
    },
    {
      id: "e4",
      slug: "responsible-ai-talk",
      title: "Guest lecture: responsible AI",
      summary: "Industry talk mapped to CSE / ISE. Speaker TBD.",
      body: "Placeholder lecture. Do not advertise a speaker until the branch confirms the name.",
      category: "Talk",
      date: "2026-12-05",
      time: "11:00",
      venue: "Auditorium (venue TODO)",
      registerUrl: "contact.html"
    },
    {
      id: "e5",
      slug: "hardware-hackathon",
      title: "Campus hardware hackathon",
      summary: "24-hour build challenge across departments (sample flagship).",
      body: "Placeholder hackathon. Prize pool and problem statements are not announced.",
      category: "Competition",
      date: "2027-01-18",
      time: "09:00",
      venue: "Innovation lab (venue TODO)",
      registerUrl: "contact.html"
    },
    {
      id: "e6",
      slug: "orientation-2026",
      title: "Student branch orientation",
      summary: "Intro session for new members.",
      body: "Placeholder past event.",
      category: "Community",
      date: "2026-08-20",
      time: "14:00",
      venue: "Seminar hall (venue TODO)",
      registerUrl: "membership.html"
    },
    {
      id: "e7",
      slug: "power-and-energy-visit",
      title: "Power lab open house",
      summary: "EEE-focused demo afternoon (sample).",
      body: "Placeholder visit.",
      category: "Workshop",
      date: "2026-09-12",
      time: "15:00",
      venue: "EEE block (venue TODO)",
      registerUrl: "chapters.html"
    },
    {
      id: "e8",
      slug: "women-in-engineering",
      title: "Women in Engineering meetup",
      summary: "Peer mentoring circle (sample community event).",
      body: "Placeholder meetup. WIE chapter status at RRCE is not verified.",
      category: "Community",
      date: "2026-12-18",
      time: "16:00",
      venue: "MBA seminar room (venue TODO)",
      registerUrl: "contact.html"
    }
  ];

  /* TODO confirm which IEEE societies are formally chartered at RRCE */
  const CHAPTERS = [
    {
      id: "cs",
      name: "IEEE Computer Society",
      short: "CS",
      department: "CSE / ISE / CSE (IoT, Cyber Security incl. Blockchain)",
      description: "Placeholder chapter card. Activities would cover computing, security, and software. Charter status is not verified.",
      activities: ["Coding clubs", "IEEEXtreme practice", "Research paper reading"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "comsoc",
      name: "IEEE Communications Society",
      short: "ComSoc",
      department: "ECE",
      description: "Placeholder mapping to Electronics and Communication Engineering.",
      activities: ["RF/comms talks", "5G seminars", "Ham radio interest"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "pes",
      name: "IEEE Power & Energy Society",
      short: "PES",
      department: "EEE",
      description: "Placeholder mapping to Electrical and Electronics Engineering.",
      activities: ["Power lab demos", "Grid talks", "Industrial visits"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "ras",
      name: "IEEE Robotics and Automation Society",
      short: "RAS",
      department: "Robotics & Automation / ME",
      description: "Placeholder mapping to Robotics & Automation and Mechanical Engineering.",
      activities: ["Bot builds", "ROS workshops", "Field robotics demos"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "ias",
      name: "IEEE Industry Applications",
      short: "IAS",
      department: "ME / EEE",
      description: "Placeholder industry-facing chapter. Not a verified charter.",
      activities: ["Factory visits", "CAD clinics", "Safety talks"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "wie",
      name: "IEEE Women in Engineering",
      short: "WIE",
      department: "All departments",
      description: "Placeholder affinity group spanning CSE through MBA.",
      activities: ["Mentoring", "Speaker series", "Outreach"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "cis",
      name: "IEEE Computational Intelligence",
      short: "CIS",
      department: "MCA / CSE",
      description: "Placeholder mapping for MCA and CSE students interested in AI.",
      activities: ["ML reading group", "Kaggle nights", "Ethics seminars"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    },
    {
      id: "tem",
      name: "IEEE Technology & Engineering Management",
      short: "TEMS",
      department: "MBA",
      description: "Placeholder mapping to MBA for product and tech-management topics.",
      activities: ["Case clubs", "Startup office hours", "IP awareness"],
      headName: "Chapter head name TODO",
      headRole: "Student chair (placeholder)"
    }
  ];

  /* TODO replace with the real counselor, mentor, and execom */
  const TEAM = [
    {
      id: "t1",
      name: "Dr. Faculty Counselor",
      role: "Branch Counselor",
      roleGroup: "counselor",
      department: "Department TODO",
      bio: "Placeholder faculty counselor. Replace with the appointed IEEE Branch Counselor.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "CounselorRRCE"
    },
    {
      id: "t2",
      name: "Prof. Faculty Mentor",
      role: "Branch Mentor",
      roleGroup: "mentor",
      department: "Department TODO",
      bio: "Placeholder mentor.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "MentorRRCE"
    },
    {
      id: "t3",
      name: "Student Chair (name TODO)",
      role: "Chair",
      roleGroup: "execom",
      department: "CSE",
      bio: "Placeholder executive committee chair.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "ChairRRCE"
    },
    {
      id: "t4",
      name: "Vice Chair (name TODO)",
      role: "Vice Chair",
      roleGroup: "execom",
      department: "ECE",
      bio: "Placeholder vice chair.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "ViceChairRRCE"
    },
    {
      id: "t5",
      name: "Secretary (name TODO)",
      role: "Secretary",
      roleGroup: "execom",
      department: "ISE",
      bio: "Placeholder secretary.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "SecretaryRRCE"
    },
    {
      id: "t6",
      name: "Treasurer (name TODO)",
      role: "Treasurer",
      roleGroup: "execom",
      department: "EEE",
      bio: "Placeholder treasurer.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "TreasurerRRCE"
    },
    {
      id: "t7",
      name: "Webmaster (name TODO)",
      role: "Webmaster",
      roleGroup: "execom",
      department: "CSE (IoT, Cyber Security incl. Blockchain)",
      bio: "Placeholder webmaster.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "WebmasterRRCE"
    },
    {
      id: "t8",
      name: "Event Lead (name TODO)",
      role: "Event Lead",
      roleGroup: "execom",
      department: "ME",
      bio: "Placeholder event lead.",
      linkedin: "https://www.linkedin.com/",
      avatarSeed: "EventLeadRRCE"
    }
  ];

  /* TODO replace stock gallery with branch-owned photos */
  const GALLERY = [
    { id: "g1", slug: "rrce-gallery-orientation", title: "Orientation hall", category: "Events", caption: "Stock placeholder — not an RRCE photo.", date: "2026-08-20" },
    { id: "g2", slug: "rrce-gallery-workshop", title: "Workshop benches", category: "Workshops", caption: "Stock placeholder — not an RRCE photo.", date: "2026-09-12" },
    { id: "g3", slug: "rrce-gallery-hackathon", title: "Hackathon night", category: "Competitions", caption: "Stock placeholder — not an RRCE photo.", date: "2026-10-01" },
    { id: "g4", slug: "rrce-gallery-lab", title: "Electronics lab", category: "Campus", caption: "Stock placeholder — not an RRCE photo.", date: "2026-07-02" },
    { id: "g5", slug: "rrce-gallery-team", title: "Volunteer desk", category: "Community", caption: "Stock placeholder — not an RRCE photo.", date: "2026-09-30" },
    { id: "g6", slug: "rrce-gallery-talk", title: "Guest lecture", category: "Events", caption: "Stock placeholder — not an RRCE photo.", date: "2026-10-18" },
    { id: "g7", slug: "rrce-gallery-outdoor", title: "Campus walk", category: "Campus", caption: "Stock placeholder — not an RRCE photo.", date: "2026-06-11" },
    { id: "g8", slug: "rrce-gallery-award", title: "Certificate moment", category: "Community", caption: "Stock placeholder — not an RRCE photo.", date: "2026-10-28" }
  ];

  const FAQ = [
    {
      q: "Who can join the IEEE Student Branch at RRCE?",
      a: "Students of RajaRajeswari College of Engineering can apply for IEEE student membership through ieee.org. Branch-specific dues or WhatsApp groups have not been published here (TODO)."
    },
    {
      q: "Is this website an official IEEE membership portal?",
      a: "No. Join IEEE on ieee.org. This site is a public information page plus a frontend-only dashboard preview with dummy data and no login."
    },
    {
      q: "How do I contact the counselor?",
      a: "Use the contact form (opens your email app). The branch email listed on this site is a placeholder until the counselor confirms the address."
    },
    {
      q: "Which departments are represented?",
      a: "RRCE lists CSE, ISE, ECE, EEE, ME, Robotics & Automation, CSE (IoT, Cyber Security incl. Blockchain), MCA, and MBA. Chapter-to-department mappings on this site are placeholders."
    }
  ];

  const RESOURCES = [
    { id: "r1", title: "IEEE Xplore", blurb: "Digital library for IEEE journals and conference papers.", href: "https://ieeexplore.ieee.org/" },
    { id: "r2", title: "IEEEXtreme", blurb: "Global 24-hour programming contest for IEEE students.", href: "https://ieeextreme.org/" },
    { id: "r3", title: "vTools", blurb: "IEEE volunteer tools for events and reporting.", href: "https://vtools.ieee.org/" },
    { id: "r4", title: "IEEE Bangalore Section", blurb: "Section page — TODO verify how the RRCE branch is listed.", href: "https://ieeebangalore.org/" },
    { id: "r5", title: "Join IEEE", blurb: "Official membership application.", href: "https://www.ieee.org/membership/join/index.html" },
    { id: "r6", title: "RRCE website", blurb: "RajaRajeswari College of Engineering.", href: "https://www.rrce.org" }
  ];

  const BENEFITS = [
    { title: "IEEE Xplore access", body: "Student members can access IEEE’s digital library according to their membership package (details on ieee.org)." },
    { title: "Awards and contests", body: "IEEEXtreme, paper contests, and society awards — eligibility depends on active membership." },
    { title: "Global network", body: "IEEE is a worldwide professional community. Region 10 covers Asia Pacific." },
    { title: "Career development", body: "Talks, mentoring, and project showcases organised locally (event list is currently placeholder data)." }
  ];

  const PILLARS = [
    { key: "learn", title: "Learn", body: "Talks, workshops, and reading groups across RRCE departments." },
    { key: "build", title: "Build", body: "Hardware, software, and robotics projects with chapter support." },
    { key: "compete", title: "Compete", body: "IEEEXtreme, hackathons, and paper presentations." },
    { key: "volunteer", title: "Volunteer", body: "Run events, mentor juniors, and represent the branch on campus." }
  ];

  /* TODO replace counts after the branch publishes official numbers */
  const STATS = [
    { key: "members", label: "Members", value: 128, note: "Placeholder count" },
    { key: "events", label: "Events hosted", value: 24, note: "Placeholder count" },
    { key: "chapters", label: "Chapters", value: 8, note: "Placeholder — charters unverified" },
    { key: "years", label: "Years active", value: 12, note: "Placeholder — founding year TODO" }
  ];

  const NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "about.html", label: "About", page: "about" },
    { href: "chapters.html", label: "Chapters", page: "chapters" },
    { href: "events.html", label: "Events", page: "events" },
    { href: "announcements.html", label: "Announcements", page: "announcements" },
    { href: "team.html", label: "Team", page: "team" },
    { href: "gallery.html", label: "Gallery", page: "gallery" },
    { href: "membership.html", label: "Membership", page: "membership" },
    { href: "contact.html", label: "Contact", page: "contact" }
  ];

  /* Populated in Phase 3 with intent definitions for RRCE IEEE Assistant */
  const CHATBOT_KB = [
    {
      id: "greeting",
      keywords: ["hello", "hi", "hey", "namaste", "morning", "evening", "howdy", "sup", "greetings"],
      synonyms: ["start", "begin", "welcome"],
      answer: "Hello! I am the RRCE IEEE Assistant. I can help you with event schedules, society chapters, membership steps, announcements, and navigating the member portal preview. What would you like to know?",
      links: [
        { label: "Upcoming Events", href: "events.html" },
        { label: "How to Join", href: "membership.html" }
      ]
    },
    {
      id: "what_is_ieee",
      keywords: ["what", "ieee", "stand", "institute", "electrical", "electronics", "engineers", "organization", "society"],
      synonyms: ["definition", "meaning", "background"],
      answer: "IEEE (Institute of Electrical and Electronics Engineers) is the world's largest technical professional organization dedicated to advancing technology for humanity. It spans over 160 countries with hundreds of student branches globally.",
      links: [{ label: "Official IEEE Site", href: "https://www.ieee.org" }]
    },
    {
      id: "about_branch",
      keywords: ["about", "branch", "rrce", "student", "history", "story", "founded", "established", "background"],
      synonyms: ["info", "overview", "heritage"],
      answer: "The IEEE Student Branch at RajaRajeswari College of Engineering (RRCE) is a campus community operating under IEEE Region 10 (Bangalore Section - TODO verify). It connects students across all 9 departments through workshops, hackathons, and research projects. (Branch founding year is a placeholder TODO: 2014).",
      links: [{ label: "Read Branch Story", href: "about.html" }]
    },
    {
      id: "how_to_join",
      keywords: ["join", "membership", "register", "apply", "become", "member", "enrol", "enroll", "fees", "cost", "price", "sign", "joinn"],
      synonyms: ["admission", "subscription", "pricing"],
      answer: "To join IEEE: 1. Visit ieee.org and create an account. 2. Select Student Membership. 3. Specify RajaRajeswari College of Engineering as your institution. 4. Complete online dues on ieee.org. Note: This website is an informational site and does NOT collect membership fees or process passwords.",
      links: [
        { label: "Membership Guide", href: "membership.html" },
        { label: "Join on IEEE.org", href: "https://www.ieee.org/membership/join/index.html" }
      ]
    },
    {
      id: "benefits",
      keywords: ["benefits", "benefit", "perks", "advantages", "discounts", "access", "opportunities", "merits", "gain"],
      synonyms: ["value", "features", "privileges"],
      answer: "IEEE student membership provides: access to IEEE Xplore digital library papers, eligibility for the global 24-hour IEEEXtreme coding challenge, discounted conference registrations, student travel grants, and leadership experience in technical society chapters.",
      links: [{ label: "View Benefits", href: "membership.html#benefits" }]
    },
    {
      id: "chapters",
      keywords: ["chapters", "societies", "society", "groups", "affinity", "units", "clubs"],
      synonyms: ["divisions", "sections"],
      dynamic: "chapters_all",
      answer: "RRCE IEEE hosts technical society chapters mapped to our engineering departments, including Computer Society (CSE/ISE), Robotics & Automation Society (Robotics & ME), Power & Energy Society (EEE), and Women in Engineering (WIE). (Society charters are placeholders marked TODO).",
      links: [{ label: "Explore Chapters", href: "chapters.html" }]
    },
    {
      id: "chapter_cs",
      keywords: ["computer", "society", "cs", "coding", "software", "ai", "machine learning", "data"],
      synonyms: ["algorithms", "programming"],
      answer: "The IEEE Computer Society chapter is mapped to the CSE and ISE departments. It focuses on software systems, cloud computing, cybersecurity, and algorithms. (Chapter charter is a placeholder TODO).",
      links: [{ label: "View Computer Society", href: "chapters.html" }]
    },
    {
      id: "chapter_ras",
      keywords: ["robotics", "automation", "ras", "robots", "hardware", "mechatronics", "drones", "sensor"],
      synonyms: ["circuits", "embedded"],
      answer: "The IEEE Robotics and Automation Society (RAS) chapter is linked with the Robotics & Automation and Mechanical Engineering departments, focusing on autonomous systems, sensor interfacing, and microcontrollers. (Chapter charter is a placeholder TODO).",
      links: [{ label: "View RAS Chapter", href: "chapters.html" }]
    },
    {
      id: "chapter_pes",
      keywords: ["power", "energy", "pes", "electrical", "grid", "renewables", "solar", "ev"],
      synonyms: ["electricity", "generation"],
      answer: "The IEEE Power & Energy Society (PES) chapter is linked with Electrical & Electronics Engineering (EEE), covering smart grids, electric vehicles, and renewable power systems. (Chapter charter is a placeholder TODO).",
      links: [{ label: "View PES Chapter", href: "chapters.html" }]
    },
    {
      id: "chapter_wie",
      keywords: ["women", "engineering", "wie", "female", "stem", "diversity", "girls", "womeninengineering"],
      synonyms: ["empowerment", "inclusion"],
      answer: "IEEE Women in Engineering (WIE) is an affinity group dedicated to empowering and mentoring women engineers and scientists across all RRCE departments. (Charter is a placeholder TODO).",
      links: [{ label: "View WIE Chapter", href: "chapters.html" }]
    },
    {
      id: "upcoming_events",
      keywords: ["upcoming", "events", "calendar", "schedule", "workshops", "sessions", "talks", "seminars", "hackathons", "event"],
      synonyms: ["activities", "agenda", "timetable"],
      dynamic: "upcoming_events",
      answer: "Upcoming events at RRCE IEEE are scheduled regularly across campus.",
      links: [{ label: "Full Events Calendar", href: "events.html" }]
    },
    {
      id: "next_event",
      keywords: ["next", "soonest", "when", "featured", "countdown", "tomorrow"],
      synonyms: ["immediate", "closest"],
      dynamic: "next_event",
      answer: "Here is the next scheduled event for the branch.",
      links: [{ label: "Events Page", href: "events.html" }]
    },
    {
      id: "past_events",
      keywords: ["past", "previous", "earlier", "archive", "concluded", "history", "completed"],
      synonyms: ["finished", "prior"],
      dynamic: "past_events",
      answer: "Our past events include technical workshops, webinars, and hackathons conducted across campus departments.",
      links: [{ label: "View Past Events", href: "events.html" }]
    },
    {
      id: "announcements",
      keywords: ["announcements", "notices", "circulars", "updates", "news", "bulletin", "recent", "notice"],
      synonyms: ["alerts", "notifications"],
      dynamic: "latest_announcements",
      answer: "Here are the latest branch announcements.",
      links: [{ label: "All Announcements", href: "announcements.html" }]
    },
    {
      id: "ieeextreme",
      keywords: ["ieeextreme", "extreme", "programming", "contest", "24-hour", "competition", "competitive"],
      synonyms: ["hackathon", "challenge"],
      answer: "IEEEXtreme is a global, virtual 24-hour competitive programming challenge hosted annually by IEEE. Teams of up to 3 student members compete against thousands of teams worldwide under faculty proctorship.",
      links: [
        { label: "IEEEXtreme Official", href: "https://ieeextreme.org/" },
        { label: "Branch Events", href: "events.html" }
      ]
    },
    {
      id: "team_counselor",
      keywords: ["team", "counselor", "chair", "faculty", "mentor", "execom", "leads", "officers", "president", "advisor"],
      synonyms: ["leadership", "heads", "management"],
      dynamic: "team_summary",
      answer: "The branch is guided by a faculty counselor and managed by the student executive committee (Chair, Vice-Chair, Secretary, Treasurer, Chapter Leads). (All officer names on this site are placeholders marked TODO until the counselor confirms the roster).",
      links: [{ label: "Meet the Team", href: "team.html" }]
    },
    {
      id: "contact",
      keywords: ["contact", "email", "reach", "phone", "call", "inquiry", "message", "query", "support", "helpdesk"],
      synonyms: ["touch", "communicate"],
      answer: "You can reach the college at +91-80-28437124 / 28437375. Branch email is currently a placeholder (TODO: ieee.sb@rrce.org). You can also use our contact form to send an email inquiry directly.",
      links: [{ label: "Contact Page", href: "contact.html" }]
    },
    {
      id: "location_directions",
      keywords: ["location", "located", "locate", "address", "where", "directions", "map", "place", "campus", "kumbalgodu", "mysore road"],
      synonyms: ["venue", "situated", "reach"],
      answer: "RajaRajeswari College of Engineering (RRCE) is located at #14, Ramohalli Cross, Kumbalgodu, Mysore Road, Bengaluru - 560074, Karnataka, India.",
      links: [{ label: "View Campus Map", href: "contact.html#contact-details" }]
    },
    {
      id: "college_info",
      keywords: ["college", "rrce", "rajarajeswari", "institution", "vtu", "aicte", "iso", "trust", "moogambigai", "autonomous"],
      synonyms: ["university", "accreditation"],
      answer: "RajaRajeswari College of Engineering (RRCE), established in 2006, is an autonomous institute affiliated with VTU Belagavi, AICTE approved, ISO 9001:2015 certified, and sponsored by Moogambigai Charitable and Educational Trust.",
      links: [
        { label: "College Site", href: "https://www.rrce.org" },
        { label: "About RRCE", href: "about.html#institution" }
      ]
    },
    {
      id: "departments",
      keywords: ["departments", "branches", "courses", "degrees", "programs", "disciplines"],
      synonyms: ["majors", "streams"],
      answer: "RRCE offers programs across 9 departments: CSE, ISE, ECE, EEE, ME, Robotics & Automation, CSE (IoT, Cyber Security incl. Blockchain), MCA, and MBA.",
      links: [{ label: "Chapters by Department", href: "chapters.html" }]
    },
    {
      id: "resources",
      keywords: ["resources", "xplore", "vtools", "bangalore section", "tools", "library", "papers", "portal"],
      synonyms: ["material", "links"],
      answer: "Key IEEE resources include: IEEE Xplore Digital Library (ieeexplore.ieee.org), vTools volunteer management (vtools.ieee.org), IEEEXtreme (ieeextreme.org), and the IEEE Bangalore Section portal (ieeebangalore.org).",
      links: [
        { label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/" },
        { label: "vTools", href: "https://vtools.ieee.org/" }
      ]
    },
    {
      id: "volunteering",
      keywords: ["volunteer", "volunteering", "help", "organize", "organizing", "crew", "participate", "lead"],
      synonyms: ["assist", "support"],
      answer: "Students can volunteer to help coordinate hackathons, manage registrations, design event posters, or assist with audio-visual setups. Volunteering provides certificates and leadership experience.",
      links: [{ label: "Contact ExeCom", href: "contact.html" }]
    },
    {
      id: "sponsorship",
      keywords: ["sponsor", "sponsorship", "partner", "collaborate", "industry", "company", "fund"],
      synonyms: ["finance", "corporate"],
      answer: "We welcome industry partners and tech organizations to sponsor student hackathons, conduct campus recruitment seminars, or mentor student capstone projects. Please reach out via our contact page.",
      links: [{ label: "Contact for Sponsorship", href: "contact.html" }]
    },
    {
      id: "member_dashboard",
      keywords: ["dashboard", "portal", "member", "preview", "login", "certificate", "id card", "qr code", "points", "badge"],
      synonyms: ["account", "profile"],
      answer: "The Member Dashboard (/portal/dashboard.html) is a FRONTEND-ONLY PREVIEW with dummy data. There is NO login, registration, or backend. It demonstrates what an active member portal would look like: digital membership cards with QR codes, canvas certificate generation, event passes, and points.",
      links: [{ label: "Open Dashboard Preview", href: "portal/dashboard.html" }]
    },
    {
      id: "thanks",
      keywords: ["thank", "thanks", "appreciate", "helpful", "great", "awesome", "good job", "thankyou"],
      synonyms: ["grateful", "cheers"],
      answer: "You're very welcome! If you have any more questions about IEEE or RRCE, feel free to ask anytime. Have a great day!",
      links: [
        { label: "Upcoming Events", href: "events.html" },
        { label: "Member Dashboard", href: "portal/dashboard.html" }
      ]
    },
    {
      id: "goodbye",
      keywords: ["bye", "goodbye", "see you", "cya", "farewell", "later"],
      synonyms: ["exit", "leave"],
      answer: "Goodbye! Wishing you success in your engineering journey at RRCE. Feel free to chat again whenever you need information.",
      links: [{ label: "Back to Home", href: "index.html" }]
    }
  ];

  global.RRCE = {
    SITE,
    IMAGES,
    ANNOUNCEMENTS,
    EVENTS,
    CHAPTERS,
    TEAM,
    GALLERY,
    FAQ,
    RESOURCES,
    BENEFITS,
    PILLARS,
    STATS,
    NAV,
    CHATBOT_KB,
    FALLBACK_GRADIENT
  };
})(window);
