/**
 * Dummy data store for the IEEE RRCE Member Dashboard Preview.
 *
 * HARD CONSTRAINT:
 * All data in this file is DUMMY / SIMULATED. There is NO backend, NO database,
 * NO login, and NO persistent server state. State resets on page refresh.
 *
 * HOW TO ADD AN ITEM:
 * - Event: Push to PORTAL_EVENTS with { id, title, category, date, time, venue, status: "registered"|"attended"|"waitlist", checkInCode }
 * - Project: Push to PORTAL_PROJECTS with { id, title, chapter, lead, leadDept, summary, tech[], openRoles[], status }
 * - Resource: Push to PORTAL_RESOURCES with { id, title, type, chapter, size, link, bookmarked: boolean }
 * - Discussion: Push to PORTAL_DISCUSSIONS with { id, author, dept, title, body, upvotes, replies[], date }
 */
(function (global) {
  "use strict";

  const CURRENT_MEMBER = {
    name: "Aarav S.",
    fullName: "Aarav Sharma",
    usn: "1RR22CS001",
    department: "CSE",
    year: "3rd Year (6th Sem)",
    memberId: "IEEE-RRCE-2024-8842",
    email: "aarav.cse@rrce.ac.in",
    phone: "+91-9876543210",
    role: "Student Member & Society Lead",
    validTill: "31 Dec 2027",
    status: "Active",
    avatarSeed: "AaravCSE",
    stats: {
      eventsAttended: 12,
      points: 420,
      certificates: 5,
      badges: 6
    },
    skills: ["Python", "Embedded C", "Robotics", "ROS", "TensorFlow", "Technical Writing"],
    socials: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
      x: "https://x.com/"
    },
    joinedChapters: ["cs", "ras", "wie"]
  };

  const MEMBERS = [
    { id: "m1", name: "Aarav S.", usn: "1RR22CS001", dept: "CSE", points: 420, badges: 6, role: "Student Member", avatarSeed: "AaravCSE" },
    { id: "m2", name: "Bhavana K.", usn: "1RR22EC014", dept: "ECE", points: 495, badges: 8, role: "Chapter Chair", avatarSeed: "BhavanaECE" },
    { id: "m3", name: "Chetan R.", usn: "1RR22IS022", dept: "ISE", points: 380, badges: 5, role: "Student Member", avatarSeed: "ChetanISE" },
    { id: "m4", name: "Divya N.", usn: "1RR22EE009", dept: "EEE", points: 440, badges: 7, role: "WIE Coordinator", avatarSeed: "DivyaEEE" },
    { id: "m5", name: "Eshan M.", usn: "1RR22RO018", dept: "Robotics & Automation", points: 510, badges: 9, role: "Vice-Chair", avatarSeed: "EshanRobo" },
    { id: "m6", name: "Farhan A.", usn: "1RR23CS045", dept: "CSE", points: 290, badges: 4, role: "Volunteer", avatarSeed: "FarhanCS" },
    { id: "m7", name: "Gauri P.", usn: "1RR22ME031", dept: "ME", points: 310, badges: 5, role: "Student Member", avatarSeed: "GauriME" },
    { id: "m8", name: "Harish V.", usn: "1RR23IT012", dept: "CSE (IoT/Cyber)", points: 360, badges: 5, role: "Student Member", avatarSeed: "HarishCyber" },
    { id: "m9", name: "Ishaan T.", usn: "1RR22EC055", dept: "ECE", points: 425, badges: 6, role: "Treasurer", avatarSeed: "IshaanECE" },
    { id: "m10", name: "Janani K.", usn: "1RR22IS041", dept: "ISE", points: 470, badges: 7, role: "Secretary", avatarSeed: "JananiISE" },
    { id: "m11", name: "Kiran D.", usn: "1RR23MC008", dept: "MCA", points: 275, badges: 3, role: "Student Member", avatarSeed: "KiranMCA" },
    { id: "m12", name: "Lakshmi S.", usn: "1RR22EE033", dept: "EEE", points: 395, badges: 6, role: "PES Secretary", avatarSeed: "LakshmiEEE" },
    { id: "m13", name: "Manish B.", usn: "1RR22CS089", dept: "CSE", points: 340, badges: 4, role: "Webmaster", avatarSeed: "ManishCS" },
    { id: "m14", name: "Nisha R.", usn: "1RR23MB015", dept: "MBA", points: 220, badges: 3, role: "Outreach Lead", avatarSeed: "NishaMBA" },
    { id: "m15", name: "Omkar J.", usn: "1RR22RO005", dept: "Robotics & Automation", points: 460, badges: 7, role: "Hardware Lead", avatarSeed: "OmkarRobo" },
    { id: "m16", name: "Pooja M.", usn: "1RR22EC081", dept: "ECE", points: 350, badges: 5, role: "Student Member", avatarSeed: "PoojaECE" },
    { id: "m17", name: "Rahul S.", usn: "1RR23CS112", dept: "CSE", points: 310, badges: 4, role: "Volunteer", avatarSeed: "RahulCS" },
    { id: "m18", name: "Sneha G.", usn: "1RR22IS067", dept: "ISE", points: 430, badges: 6, role: "Editorial Lead", avatarSeed: "SnehaISE" },
    { id: "m19", name: "Tarun K.", usn: "1RR22ME019", dept: "ME", points: 295, badges: 4, role: "Design Lead", avatarSeed: "TarunME" },
    { id: "m20", name: "Umesh L.", usn: "1RR23IT044", dept: "CSE (IoT/Cyber)", points: 280, badges: 3, role: "Student Member", avatarSeed: "UmeshCyber" },
    { id: "m21", name: "Varsha H.", usn: "1RR22EC092", dept: "ECE", points: 410, badges: 6, role: "Student Member", avatarSeed: "VarshaECE" },
    { id: "m22", name: "Yash W.", usn: "1RR22CS140", dept: "CSE", points: 385, badges: 5, role: "Code Sprint Lead", avatarSeed: "YashCS" },
    { id: "m23", name: "Zara F.", usn: "1RR23RO021", dept: "Robotics & Automation", points: 330, badges: 4, role: "Volunteer", avatarSeed: "ZaraRobo" },
    { id: "m24", name: "Akash T.", usn: "1RR22EE047", dept: "EEE", points: 365, badges: 5, role: "Student Member", avatarSeed: "AkashEEE" },
    { id: "m25", name: "Meera C.", usn: "1RR22CS054", dept: "CSE", points: 450, badges: 7, role: "Student Member", avatarSeed: "MeeraCS" }
  ];

  const PORTAL_EVENTS = [
    {
      id: "pe1",
      title: "PCB Design & Fabrication Weekend",
      category: "Workshop",
      date: "2026-11-08",
      time: "09:30 AM - 04:30 PM",
      venue: "ECE Hardware Lab (Kumbalgodu Campus)",
      status: "registered",
      checkInCode: "RRCE-PCB-9942",
      pointsAwarded: 50,
      hasCertificate: false
    },
    {
      id: "pe2",
      title: "IEEEXtreme 20.0 Strategy & Sprint",
      category: "Competition",
      date: "2026-11-21",
      time: "01:30 PM - 05:00 PM",
      venue: "Central Computing Facility Lab 3",
      status: "registered",
      checkInCode: "RRCE-XTR-1024",
      pointsAwarded: 60,
      hasCertificate: false
    },
    {
      id: "pe3",
      title: "TinyML on Microcontrollers Boot Camp",
      category: "Hands-on",
      date: "2026-12-05",
      time: "10:00 AM - 03:00 PM",
      venue: "Robotics Centre of Excellence",
      status: "registered",
      checkInCode: "RRCE-TML-8819",
      pointsAwarded: 45,
      hasCertificate: false
    },
    {
      id: "pe4",
      title: "Autonomous ROS Drone Simulation",
      category: "Workshop",
      date: "2026-12-14",
      time: "02:00 PM - 05:30 PM",
      venue: "Mechanical CAD Lab",
      status: "waitlist",
      checkInCode: "RRCE-WTL-0412",
      pointsAwarded: 40,
      hasCertificate: false
    },
    {
      id: "pe5",
      title: "Clean Energy Smart Grid Symposium",
      category: "Conference",
      date: "2026-10-14",
      time: "09:00 AM - 04:00 PM",
      venue: "Dr. A.P.J. Abdul Kalam Auditorium",
      status: "attended",
      checkInCode: "RRCE-ATT-7721",
      pointsAwarded: 50,
      hasCertificate: true,
      certDate: "14 Oct 2026"
    },
    {
      id: "pe6",
      title: "Full-Stack Web3 & Blockchain Lab",
      category: "Hackathon",
      date: "2026-09-22",
      time: "10:00 AM - 06:00 PM",
      venue: "CSE Department Seminar Hall",
      status: "attended",
      checkInCode: "RRCE-ATT-6610",
      pointsAwarded: 70,
      hasCertificate: true,
      certDate: "22 Sep 2026"
    },
    {
      id: "pe7",
      title: "5G & Satellite Telecom Fundamentals",
      category: "Seminar",
      date: "2026-08-18",
      time: "11:00 AM - 01:00 PM",
      venue: "Audio Visual Hall 2",
      status: "attended",
      checkInCode: "RRCE-ATT-5509",
      pointsAwarded: 30,
      hasCertificate: true,
      certDate: "18 Aug 2026"
    },
    {
      id: "pe8",
      title: "Python for Scientific Computing",
      category: "Workshop",
      date: "2026-07-29",
      time: "09:30 AM - 03:30 PM",
      venue: "ISE Systems Laboratory",
      status: "attended",
      checkInCode: "RRCE-ATT-4412",
      pointsAwarded: 40,
      hasCertificate: true,
      certDate: "29 Jul 2026"
    },
    {
      id: "pe9",
      title: "IEEE Induction & Leadership Orientation",
      category: "Community",
      date: "2026-06-25",
      time: "02:00 PM - 04:30 PM",
      venue: "Main Campus Auditorium",
      status: "attended",
      checkInCode: "RRCE-ATT-3301",
      pointsAwarded: 25,
      hasCertificate: true,
      certDate: "25 Jun 2026"
    },
    {
      id: "pe10",
      title: "National Cyber Security Defense Hack",
      category: "Competition",
      date: "2026-12-28",
      time: "09:00 AM - 09:00 PM",
      venue: "Virtual Proctored Arena",
      status: "registered",
      checkInCode: "RRCE-SEC-1984",
      pointsAwarded: 80,
      hasCertificate: false
    }
  ];

  const PORTAL_CHAPTERS = [
    {
      id: "cs",
      name: "IEEE Computer Society (CS)",
      short: "CS",
      department: "CSE & ISE",
      membersCount: 78,
      isJoined: true,
      description: "Premier technical society advancing computing architectures, AI/ML algorithms, cloud engineering, and cybersecurity.",
      lead: "Aarav S. (Student Lead)"
    },
    {
      id: "ras",
      name: "IEEE Robotics and Automation Society (RAS)",
      short: "RAS",
      department: "Robotics & Automation / ME",
      membersCount: 64,
      isJoined: true,
      description: "Dedicated to robotics, control theory, autonomous vehicles, computer vision, and industrial mechatronics.",
      lead: "Eshan M. (Vice-Chair)"
    },
    {
      id: "pes",
      name: "IEEE Power & Energy Society (PES)",
      short: "PES",
      department: "Electrical & Electronics (EEE)",
      membersCount: 42,
      isJoined: false,
      description: "Focusing on renewable energy microgrids, electric vehicles, power electronic conversion, and high-voltage transmission.",
      lead: "Divya N. (Student Coordinator)"
    },
    {
      id: "wie",
      name: "IEEE Women in Engineering (WIE)",
      short: "WIE",
      department: "All RRCE Departments",
      membersCount: 88,
      isJoined: true,
      description: "Global network dedicated to promoting women engineers and scientists, inspiring young girls around the world to follow STEM.",
      lead: "Janani K. (WIE Lead)"
    },
    {
      id: "comsoc",
      name: "IEEE Communications Society (ComSoc)",
      short: "ComSoc",
      department: "Electronics & Communication (ECE)",
      membersCount: 39,
      isJoined: false,
      description: "Wireless sensor networks, 5G/6G physical layer design, optical communications, and satellite RF telemetry.",
      lead: "Bhavana K. (ComSoc Chair)"
    },
    {
      id: "ias",
      name: "IEEE Industry Applications Society (IAS)",
      short: "IAS",
      department: "ME, EEE & MBA",
      membersCount: 31,
      isJoined: false,
      description: "Connecting students directly to industrial manufacturing automation, power plants, and engineering management standards.",
      lead: "Faculty Advisor (TODO)"
    }
  ];

  const PORTAL_PROJECTS = [
    {
      id: "pr1",
      title: "Autonomous Campus Delivery Rover",
      chapter: "Robotics & Automation Society",
      dept: "Robotics & Automation / CSE",
      lead: "Eshan M.",
      summary: "Designing a 4-wheel differential-drive rover powered by ROS 2 and LiDAR mapping for contactless delivery across campus blocks.",
      tech: ["ROS 2", "Python", "C++", "LiDAR", "Gazebo"],
      openRoles: ["Computer Vision Lead", "Mechanical Chassis Fabricator"],
      status: "In Progress",
      stars: 18
    },
    {
      id: "pr2",
      title: "RRCE Campus Microgrid IoT Monitor",
      chapter: "Power & Energy Society",
      dept: "EEE",
      lead: "Lakshmi S.",
      summary: "Real-time energy consumption telemetry measuring rooftop solar arrays on RRCE mechanical block using ESP32 and MQTT.",
      tech: ["ESP32", "MQTT", "Grafana", "Current Transformers"],
      openRoles: ["Firmware Engineer", "Dashboard Designer"],
      status: "In Progress",
      stars: 14
    },
    {
      id: "pr3",
      title: "Decentralized Academic Credential Verifier",
      chapter: "Computer Society",
      dept: "CSE (IoT, Cyber & Blockchain)",
      lead: "Harish V.",
      summary: "Zero-knowledge cryptographic verification of college certificates and semester grade sheets on Polygon testnet.",
      tech: ["Solidity", "Hardhat", "React", "ZK-SNARKs"],
      openRoles: ["Smart Contract Auditor"],
      status: "Active Review",
      stars: 22
    },
    {
      id: "pr4",
      title: "Sub-GHz Long Range Sensor Mesh (LoRa)",
      chapter: "Communications Society",
      dept: "ECE",
      lead: "Ishaan T.",
      summary: "Deploying a low-power LoRa mesh across Kumbalgodu agricultural farm borders to track soil moisture and ambient temperature.",
      tech: ["SX1276 LoRa", "STM32", "InSAR", "KiCAD"],
      openRoles: ["RF Antenna Tuning Specialist"],
      status: "In Progress",
      stars: 11
    },
    {
      id: "pr5",
      title: "Assistive Bionic Gripper with EMG Sensors",
      chapter: "Robotics & Automation Society",
      dept: "ME & ECE",
      lead: "Omkar J.",
      summary: "3D printed tendon-driven prosthetic hand controlled by surface electromyography muscle signals.",
      tech: ["3D Printing", "Arduino", "Signal Processing", "SolidWorks"],
      openRoles: ["Biomedical Signal Analyst"],
      status: "Testing",
      stars: 27
    },
    {
      id: "pr6",
      title: "Deep Learning Brain Tumor Classifier",
      chapter: "Computer Society",
      dept: "ISE",
      lead: "Sneha G.",
      summary: "Ensemble convolutional neural network trained on MRI scans with explainable Grad-CAM heatmaps for student research publication.",
      tech: ["PyTorch", "OpenCV", "FastAPI", "Docker"],
      openRoles: ["Model Optimization Researcher"],
      status: "Published",
      stars: 31
    },
    {
      id: "pr7",
      title: "Smart Waste Segregation Machine",
      chapter: "Women in Engineering",
      dept: "CSE & ME",
      lead: "Janani K.",
      summary: "Computer vision conveyor belt separating recyclable plastics, dry paper, and compostable organic waste in cafeteria bins.",
      tech: ["Raspberry Pi 4", "TensorFlow Lite", "Servo Motors"],
      openRoles: ["Embedded Vision Volunteer"],
      status: "In Progress",
      stars: 19
    },
    {
      id: "pr8",
      title: "Autonomous Drone Precision Landing Pad",
      chapter: "Robotics & Automation Society",
      dept: "Robotics & Automation",
      lead: "Aarav S.",
      summary: "Visual fiducial ArUco marker recognition for sub-centimeter GPS-denied UAV drone landing under turbulent wind gust conditions.",
      tech: ["PX4 Autopilot", "OpenCV", "Python", "MAVLink"],
      openRoles: ["Control Systems Engineer"],
      status: "In Progress",
      stars: 25
    }
  ];

  const PORTAL_RESOURCES = [
    { id: "res1", title: "IEEE Xplore Literature Survey Guide", type: "Guide", chapter: "General", size: "1.4 MB", bookmarked: true },
    { id: "res2", title: "Introduction to ROS 2 Humble Cheatsheet", type: "Cheatsheet", chapter: "Robotics", size: "820 KB", bookmarked: true },
    { id: "res3", title: "PCB Routing Guidelines & High Frequency Traces", type: "Slide Deck", chapter: "ECE", size: "4.8 MB", bookmarked: false },
    { id: "res4", title: "IEEEXtreme 20.0 Competitive Algorithms Handbook", type: "Book", chapter: "Computer Society", size: "6.2 MB", bookmarked: true },
    { id: "res5", title: "Smart Inverter Topologies for Solar PV", type: "Paper", chapter: "PES", size: "2.1 MB", bookmarked: false },
    { id: "res6", title: "LaTeX Conference Paper Template (IEEEtran)", type: "Tool", chapter: "General", size: "340 KB", bookmarked: true },
    { id: "res7", title: "TinyML Keyword Spotting Source Code", type: "Code", chapter: "Computer Society", size: "12 MB", bookmarked: false },
    { id: "res8", title: "Git & GitHub Collaboration Workflow for Labs", type: "Guide", chapter: "General", size: "950 KB", bookmarked: false },
    { id: "res9", title: "Embedded Firmware Testing using Unity & CMock", type: "Slide Deck", chapter: "ECE / Robo", size: "3.4 MB", bookmarked: false },
    { id: "res10", title: "LoRaWAN Packet Forwarder Configuration", type: "Cheatsheet", chapter: "ComSoc", size: "510 KB", bookmarked: false },
    { id: "res11", title: "Cybersecurity Capture-The-Flag (CTF) Starter Kit", type: "Tool", chapter: "Computer Society", size: "8.5 MB", bookmarked: true },
    { id: "res12", title: "WIE Career Navigation & Research Fellowship Directory", type: "Guide", chapter: "WIE", size: "1.8 MB", bookmarked: false }
  ];

  const PORTAL_NOTIFICATIONS = [
    { id: "n1", type: "event", title: "PCB Design Weekend Confirmed", body: "Your registration is confirmed. Venue: ECE Lab complex. Check-in code is ready.", time: "2 hours ago", unread: true },
    { id: "n2", type: "certificate", title: "Clean Energy Certificate Issued", body: "Your certificate of participation for the Smart Grid Symposium is now ready to download.", time: "1 day ago", unread: true },
    { id: "n3", type: "points", title: "+50 Activity Points Earned", body: "Awarded for participating in the technical paper literature survey session.", time: "2 days ago", unread: true },
    { id: "n4", type: "announcement", title: "Call for IEEEXtreme 20.0 Teams", body: "Team registrations close next Monday. Form teams of 3 and register with the proctor.", time: "3 days ago", unread: false },
    { id: "n5", type: "badge", title: "New Badge: 'Code Sprint Master'", body: "You unlocked the Code Sprint badge by completing 3 competitive programming rounds.", time: "4 days ago", unread: false },
    { id: "n6", type: "system", title: "Branch Membership Validated", body: "Your annual student roster status has been verified for the 2026-2027 term.", time: "1 week ago", unread: false },
    { id: "n7", type: "community", title: "Reply to your Rover post", body: "Omkar J. commented: 'I can help with the 3D printed motor brackets!'", time: "1 week ago", unread: false },
    { id: "n8", type: "event", title: "TinyML Boot Camp Seats Filling", body: "Only 12 physical workshop benches remaining in the Robotics lab.", time: "2 weeks ago", unread: false },
    { id: "n9", type: "resource", title: "New Resource Added: IEEEtran Template", body: "Editorial lead uploaded updated paper submission templates.", time: "2 weeks ago", unread: false },
    { id: "n10", type: "points", title: "+70 Activity Points Earned", body: "Completed Web3 Hackathon sprint at CSE seminar hall.", time: "3 weeks ago", unread: false },
    { id: "n11", type: "announcement", title: "IEEE Day Celebrations Recap", body: "Browse through the photo gallery for highlights from the campus gathering.", time: "1 month ago", unread: false },
    { id: "n12", type: "certificate", title: "Web3 Hackathon Certificate Issued", body: "Download your certificate of merit from your certificates dashboard tab.", time: "1 month ago", unread: false },
    { id: "n13", type: "badge", title: "New Badge: 'Workshop Regular'", body: "Awarded for attending 5 hands-on technical sessions this semester.", time: "1 month ago", unread: false },
    { id: "n14", type: "system", title: "Theme Preference Saved", body: "Your display theme settings are synchronized with your browser local profile.", time: "2 months ago", unread: false },
    { id: "n15", type: "community", title: "Mentor Program Open for Juniors", body: "Senior members can now sign up to mentor 1st and 2nd year students.", time: "2 months ago", unread: false }
  ];

  const PORTAL_DISCUSSIONS = [
    {
      id: "post1",
      author: "Eshan M.",
      dept: "Robotics & Automation",
      avatarSeed: "EshanRobo",
      title: "ROS 2 vs Micro-ROS: Which are you using for your robot arm?",
      body: "We're benchmarking Micro-ROS on Teensy 4.1 vs native ROS 2 on Raspberry Pi 5 over Ethernet. Curious about jitter times anyone else has measured in our labs.",
      upvotes: 18,
      repliesCount: 7,
      date: "Yesterday"
    },
    {
      id: "post2",
      author: "Aarav S.",
      dept: "CSE",
      avatarSeed: "AaravCSE",
      title: "Tips for preparing for IEEEXtreme 24-hr contest",
      body: "For newcomers participating next month: make sure your team practices graph algorithms (Dijkstra, BFS/DFS) and dynamic programming problems under time pressure.",
      upvotes: 32,
      repliesCount: 14,
      date: "3 days ago"
    },
    {
      id: "post3",
      author: "Divya N.",
      dept: "EEE",
      avatarSeed: "DivyaEEE",
      title: "Seeking 2 students to join campus solar telemetry project",
      body: "We need someone familiar with ESP32 ADC calibration and another student interested in time-series plotting with Grafana. Drop a reply if interested!",
      upvotes: 15,
      repliesCount: 9,
      date: "4 days ago"
    },
    {
      id: "post4",
      author: "Sneha G.",
      dept: "ISE",
      avatarSeed: "SnehaISE",
      title: "Recommended datasets for medical imaging capstone?",
      body: "Looking for open-access brain MRI or chest X-ray datasets with verified ground truth masks. Let me know if you know of any Kaggle or PhysioNet archives.",
      upvotes: 11,
      repliesCount: 4,
      date: "1 week ago"
    },
    {
      id: "post5",
      author: "Bhavana K.",
      dept: "ECE",
      avatarSeed: "BhavanaECE",
      title: "PCB Antenna vs Ceramic Patch for 868 MHz LoRa",
      body: "In our field tests near Kumbalgodu, the helical wire antenna gave 1.4 km line-of-sight while the ceramic patch was limited to 800m. Sharing test notes here.",
      upvotes: 24,
      repliesCount: 6,
      date: "1 week ago"
    },
    {
      id: "post6",
      author: "Janani K.",
      dept: "ISE",
      avatarSeed: "JananiISE",
      title: "WIE Career Mentorship Circles starting next Friday",
      body: "We are pairing 2nd-year women engineering students with alumni currently working at Cisco, Intel, and Bosch. Signups open in the community tab.",
      upvotes: 28,
      repliesCount: 11,
      date: "2 weeks ago"
    },
    {
      id: "post7",
      author: "Farhan A.",
      dept: "CSE",
      avatarSeed: "FarhanCS",
      title: "How to fix SPI bus conflict between OLED and SD Card?",
      body: "Both devices share MISO/MOSI/SCK on my board, but when the SD card initializes, the OLED display freezes. Any suggestions on CS pin pullup resistors?",
      upvotes: 9,
      repliesCount: 5,
      date: "2 weeks ago"
    },
    {
      id: "post8",
      author: "Harish V.",
      dept: "CSE (IoT/Cyber)",
      avatarSeed: "HarishCyber",
      title: "Security audit checklist for college web applications",
      body: "A quick summary of OWASP Top 10 vulnerabilities every student web developer should test before deploying project demos.",
      upvotes: 41,
      repliesCount: 12,
      date: "3 weeks ago"
    },
    {
      id: "post9",
      author: "Tarun M.",
      dept: "ME",
      avatarSeed: "TarunME",
      title: "Free CAD workshop on Fusion 360 parametric modeling",
      body: "Hosting a 2-hour tutorial this Saturday covering generative design and 3D printing slicing. Room 204 Mechanical block.",
      upvotes: 19,
      repliesCount: 8,
      date: "3 weeks ago"
    },
    {
      id: "post10",
      author: "Omkar J.",
      dept: "Robotics & Automation",
      avatarSeed: "OmkarRobo",
      title: "Hardware component swap meet at RRCE makerspace",
      body: "Bring your spare sensors, motors, breadboards, and passives to trade with fellow makers next Tuesday during club hour.",
      upvotes: 26,
      repliesCount: 15,
      date: "1 month ago"
    }
  ];

  const PORTAL_BADGES = [
    { id: "b1", title: "First Hackathon", desc: "Submitted a project to an IEEE hackathon", icon: "🚀", unlocked: true },
    { id: "b2", title: "Code Sprint Master", desc: "Solved 10+ competitive algorithmic challenges", icon: "⚡", unlocked: true },
    { id: "b3", title: "Community Pillar", desc: "Contributed 5+ helpful replies on the discussion board", icon: "🤝", unlocked: true },
    { id: "b4", title: "Workshop Regular", desc: "Attended 5+ technical workshops this semester", icon: "🛠️", unlocked: true },
    { id: "b5", title: "Paper Presenter", desc: "Presented an IEEE student conference paper", icon: "📄", unlocked: true },
    { id: "b6", title: "Volunteer Star", desc: "Coordinated logistics for a major campus event", icon: "⭐", unlocked: true },
    { id: "b7", title: "Hardware Guru", desc: "Completed 3 physical hardware lab projects", icon: "🔌", unlocked: false },
    { id: "b8", title: "Chapter Leader", desc: "Elected to an executive committee leadership role", icon: "👑", unlocked: false }
  ];

  const PORTAL_TASKS = [
    { id: "t1", title: "Verify participant registration passes for PCB Design Weekend", completed: true, points: 15 },
    { id: "t2", title: "Review slide deck for upcoming TinyML microcontroller boot camp", completed: true, points: 20 },
    { id: "t3", title: "Print and organize name tags for Seminar Hall 2 attendees", completed: false, points: 10 },
    { id: "t4", title: "Test HDMI projector and microphone audio in CCF Lab 3", completed: false, points: 15 },
    { id: "t5", title: "Upload latest workshop code repository to branch GitHub", completed: false, points: 25 },
    { id: "t6", title: "Coordinate feedback survey collection after hackathon", completed: false, points: 15 }
  ];

  const MONTHLY_ACTIVITY = [
    { month: "Jan", points: 25 },
    { month: "Feb", points: 40 },
    { month: "Mar", points: 30 },
    { month: "Apr", points: 55 },
    { month: "May", points: 45 },
    { month: "Jun", points: 20 },
    { month: "Jul", points: 50 },
    { month: "Aug", points: 35 },
    { month: "Sep", points: 70 },
    { month: "Oct", points: 50 }
  ];

  global.RRCEPortalData = {
    CURRENT_MEMBER,
    MEMBERS,
    PORTAL_EVENTS,
    PORTAL_CHAPTERS,
    PORTAL_PROJECTS,
    PORTAL_RESOURCES,
    PORTAL_NOTIFICATIONS,
    PORTAL_DISCUSSIONS,
    PORTAL_BADGES,
    PORTAL_TASKS,
    MONTHLY_ACTIVITY
  };
})(window);
