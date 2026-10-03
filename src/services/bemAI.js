/**
 * BEM AI Engine
 * 
 * Client-side natural language processing engine for the BEM AI Assistant.
 * Uses keyword matching, fuzzy search, and the BEM knowledge base to generate
 * intelligent, context-aware responses.
 * 
 * SECURITY: This is a client-side knowledge-based assistant.
 * For production, this should be replaced with:
 *   React → Firebase Cloud Function → AI API
 * The AI API key must never be placed directly in the React frontend.
 */

import { bemKnowledge } from "./bemKnowledge";

// ─── KEYWORD → INTENT MAP ────────────────────────────────────
const intentPatterns = [
  // Product
  { keywords: ["what is bem", "what's bem", "about bem", "tell me about bem", "explain bem"], intent: "what_is_bem" },
  { keywords: ["how does bem work", "how bem works", "bem workflow", "how does it work"], intent: "how_bem_works" },
  { keywords: ["tagline", "motto", "slogan"], intent: "tagline" },

  // GNSS
  { keywords: ["gnss", "gps", "navigation satellite", "positioning", "navic", "glonass", "galileo"], intent: "gnss" },
  { keywords: ["latitude", "longitude", "altitude", "coordinates", "location data", "positioning data"], intent: "gnss_data" },

  // Earth Monitoring
  { keywords: ["earth monitoring", "earth observation", "monitoring system"], intent: "earth_monitoring" },
  { keywords: ["water", "river", "lake", "reservoir", "flood", "water monitoring"], intent: "water_monitoring" },
  { keywords: ["land", "terrain", "land use", "geographic", "mountain"], intent: "land_monitoring" },
  { keywords: ["environment", "vegetation", "land condition", "forest", "green"], intent: "environment_monitoring" },
  { keywords: ["atmosphere", "air quality", "air pollution", "atmospheric", "greenhouse", "emission"], intent: "atmosphere_monitoring" },

  // Satellite
  { keywords: ["satellite", "data source", "satellite network", "satellite data", "source network"], intent: "satellite_network" },

  // Image Center
  { keywords: ["image", "imagery", "satellite image", "earth image", "photo", "picture", "image center"], intent: "image_center" },
  { keywords: ["before after", "before/after", "comparison", "compare images"], intent: "image_comparison" },

  // Change Detection
  { keywords: ["change detection", "detect change", "change", "possible change"], intent: "change_detection" },

  // Alerts & Citizen Reporting (PRD §44 & §58)
  { keywords: ["report an alert", "report alert", "submit alert", "how to report", "report incident", "report disaster", "how do i report an alert", "citizen report", "submit incident"], intent: "report_alert" },
  { keywords: ["pending review", "what does pending review mean", "under review status", "unverified report", "why is my alert pending", "pending status"], intent: "pending_review" },
  { keywords: ["how are citizen alerts verified", "verify alerts", "how do admins verify", "verification workflow", "verified alert", "admin verification", "how to verify"], intent: "verify_alerts" },
  { keywords: ["my alerts", "track my alert", "track report", "status of my alert", "where is my report", "my reports"], intent: "my_alerts" },
  { keywords: ["verified alerts", "public alerts feed", "confirmed alerts", "active alerts", "official alerts", "verified public alerts"], intent: "verified_alerts" },
  { keywords: ["alert", "advisory", "warning", "notification", "alert system", "alert center", "how do alerts work", "alert workflow"], intent: "alerts" },

  // Security
  { keywords: ["security", "security center", "data integrity", "authentication", "anomaly"], intent: "security" },

  // Reports
  { keywords: ["report", "reports", "summary", "monitoring summary"], intent: "reports" },

  // Public Information
  { keywords: ["public information", "public post", "publish", "publishing"], intent: "public_info" },

  // Map
  { keywords: ["india map", "map", "interactive map", "monitoring map", "states", "region"], intent: "india_map" },

  // Authentication
  { keywords: ["login", "log in", "sign in", "access portal", "how to login", "how do i login"], intent: "login" },
  { keywords: ["register", "sign up", "create account", "registration", "new account"], intent: "register" },
  { keywords: ["password", "passwordless", "no password"], intent: "passwordless" },
  { keywords: ["admin login", "admin access", "admin account"], intent: "admin_login" },

  // User
  { keywords: ["profile", "my profile", "user profile", "account info", "my account"], intent: "profile" },
  { keywords: ["role", "admin role", "public user", "people of india", "user type"], intent: "user_types" },

  // Simulation
  { keywords: ["simulation", "simulated", "simulation data", "demo data", "fake data", "test data"], intent: "simulation" },

  // Navigation
  { keywords: ["where can i see", "where is", "how to find", "navigate", "go to", "take me to", "show me", "find"], intent: "navigation" },
  { keywords: ["dashboard", "my dashboard", "home page", "main page"], intent: "dashboard" },

  // Data
  { keywords: ["data classification", "data types", "internal data", "restricted", "public data"], intent: "data_classification" },

  // Audit
  { keywords: ["audit", "audit log", "activity log", "system log"], intent: "audit_logs" },

  // Settings
  { keywords: ["settings", "configuration", "preferences", "system settings"], intent: "settings" },

  // General help
  { keywords: ["help", "how can you help", "what can you do", "capabilities", "features", "what do you do"], intent: "help" },
  { keywords: ["hello", "hi", "hey", "good morning", "good evening", "namaste"], intent: "greeting" },
  { keywords: ["thank", "thanks", "thank you", "dhanyavad"], intent: "thanks" },
  { keywords: ["bye", "goodbye", "see you", "exit"], intent: "goodbye" },

  // Social Media
  { keywords: ["social media", "instagram", "twitter", "social post"], intent: "social_media" },

  // Logout
  { keywords: ["logout", "log out", "sign out", "exit account"], intent: "logout" },
];

// ─── RESPONSE GENERATORS ─────────────────────────────────────
const responseGenerators = {

  what_is_bem: () => ({
    text: bemKnowledge.product.description,
    followUp: "Would you like to know how BEM works, or explore a specific feature?"
  }),

  how_bem_works: () => ({
    text: `BEM follows a structured workflow to ensure all information is validated and approved:\n\n**${bemKnowledge.product.workflow}**\n\nFor simulated data: ${bemKnowledge.product.simulationWorkflow}\n\n${bemKnowledge.product.principle}`,
    followUp: "Would you like to learn about a specific module like Earth Monitoring, GNSS, or Alerts?"
  }),

  tagline: () => ({
    text: `BEM's tagline is: **"${bemKnowledge.product.tagline}"**\n\nThis captures BEM's core mission — monitoring Earth observations across India, detecting environmental changes, and informing the public with verified information.`
  }),

  gnss: () => ({
    text: bemKnowledge.features.gnssReceiver.whatIsGNSS + "\n\n" + bemKnowledge.features.gnssReceiver.description,
    followUp: "The GNSS Receiver page shows real-time positioning data. Want to know what each GNSS field means?",
    navSuggestion: { label: "GO TO GNSS RECEIVER", path: "/gnss", adminOnly: true }
  }),

  gnss_data: () => ({
    text: `The GNSS Receiver displays these positioning fields:\n\n• **Latitude** — North-south position on Earth\n• **Longitude** — East-west position on Earth\n• **Altitude** — Height above sea level\n• **Accuracy** — Position precision estimate\n• **Satellite Count** — Number of satellites being tracked\n• **Signal Status** — Quality of satellite signals\n• **Timestamp** — When the reading was taken\n• **Data Source** — Where the data originates from\n\nIn the MVP, all readings are from the GNSS Simulator and marked as **SIMULATION DATA**.`
  }),

  earth_monitoring: () => {
    const em = bemKnowledge.features.earthMonitoring;
    return {
      text: `${em.description}\n\n**Categories:**\n• 🌊 **Water** — ${em.categories.water.items.join(", ")}\n• 🏔 **Land/Terrain** — ${em.categories.land.items.join(", ")}\n• 🌱 **Environment** — ${em.categories.environment.items.join(", ")}\n• 🌫 **Atmosphere** — ${em.categories.atmosphere.items.join(", ")}`,
      navSuggestion: { label: "GO TO EARTH MONITORING", path: "/earth-monitoring", adminOnly: true }
    };
  },

  water_monitoring: () => ({
    text: `BEM's Water Monitoring tracks:\n\n• **Rivers** — Flow patterns and water levels\n• **Lakes** — Surface area and water quality\n• **Reservoirs** — Storage capacity and changes\n• **Water Information** — Comprehensive water data\n• **Water-area Changes** — Temporal change detection\n\nAll water data undergoes validation and human review before publication.`,
    navSuggestion: { label: "GO TO EARTH MONITORING", path: "/earth-monitoring", adminOnly: true }
  }),

  land_monitoring: () => ({
    text: `BEM's Land/Terrain monitoring covers:\n\n• **Land-use Changes** — Urban expansion, agricultural changes\n• **Terrain Information** — Topographic data and features\n• **Geographic Changes** — Shifts in geographic boundaries\n• **Mountain/Terrain Imagery** — Visual documentation of terrain`,
    navSuggestion: { label: "GO TO EARTH MONITORING", path: "/earth-monitoring", adminOnly: true }
  }),

  environment_monitoring: () => ({
    text: `BEM's Environmental monitoring includes:\n\n• **Environmental Indicators** — Key metrics about ecological health\n• **Vegetation Information** — Forest cover, crop health, greenery\n• **Land Condition** — Soil health and surface conditions\n\nAll environmental data is validated before being shared publicly.`
  }),

  atmosphere_monitoring: () => ({
    text: `BEM's Atmospheric monitoring tracks:\n\n• **Air-quality Information** — Pollution levels and air quality indices\n• **Atmospheric Indicators** — Weather and atmospheric data\n• **Greenhouse-gas Information** — When supported by legitimate data sources\n\nBEM does not fabricate atmospheric measurements.`
  }),

  satellite_network: () => ({
    text: bemKnowledge.features.satelliteNetwork.description + `\n\nData sources are classified as:\n• **Approved Real Sources** — Verified and authenticated\n• **Simulated Sources** — Demo data, clearly labeled\n• **Offline Sources** — Currently disconnected`,
    navSuggestion: { label: "GO TO SATELLITE NETWORK", path: "/satellites", adminOnly: true }
  }),

  image_center: () => ({
    text: bemKnowledge.features.imageCenter.description + "\n\nEach image includes metadata: region, date, source, type, and classification.",
    followUp: "BEM also supports Before/After image comparison for approved datasets.",
    navSuggestion: { label: "GO TO IMAGE CENTER", path: "/images", adminOnly: true }
  }),

  image_comparison: () => ({
    text: "BEM supports **Before/After image comparison** when appropriate approved datasets are available. This allows side-by-side visual comparison of changes in terrain, water bodies, vegetation, and land use over time.",
    navSuggestion: { label: "GO TO IMAGE CENTER", path: "/images", adminOnly: true }
  }),

  change_detection: () => ({
    text: `${bemKnowledge.features.changeDetection.description}\n\n**Change Categories:**\n${bemKnowledge.features.changeDetection.categories.map(c => `• ${c}`).join("\n")}\n\n⚠️ ${bemKnowledge.features.changeDetection.note}`,
    navSuggestion: { label: "GO TO CHANGE DETECTION", path: "/change-detection", adminOnly: true }
  }),

  report_alert: () => ({
    text: `To submit an incident or Earth observation as a citizen:\n\n1. Go to **Report an Alert**.\n2. Select the **Event Category** (Flood, Forest Fire, Landslide, Cyclone, etc.).\n3. Enter the exact **Location, Landmark, District, State & PIN Code**.\n4. Describe the incident and select your perceived threat level.\n5. Optionally attach a photo (PNG/JPEG under 5MB).\n6. Check the confirmation preview and submit to receive a unique **Tracking ID** (e.g. BEM-ALERT-000001).\n\n⚠️ All citizen reports start as **PENDING REVIEW** and are never published immediately to avoid panic.`,
    navSuggestion: { label: "REPORT AN ALERT", path: "/dashboard/report-alert" }
  }),

  pending_review: () => ({
    text: `**PENDING REVIEW** means your submission has been safely stored in the BEM system and is awaiting independent verification by an authorized administrator.\n\n• Citizen reports are classified as **unverified observations** initially.\n• They will NOT appear on the public map or public feed until verified.\n• Administrators cross-reference the report with satellite passes, radar data, and ground sensors before taking action.`
  }),

  verify_alerts: () => ({
    text: `**Citizen Alert Verification Workflow:**\n\n1. **Intake:** Report arrives in the Admin Alert Center under *Citizen Alert Reports*.\n2. **Telemetry Cross-Reference:** Admin checks satellite passes, radar reflectivity, and regional sensors for confirmation.\n3. **Threat Classification:** Admin assigns an official Verified Threat Level (LOW, MODERATE, HIGH, CRITICAL, or DISMISSED).\n4. **Action:**\n   • **ACCEPT & PUBLISH:** Broadcasts immediately to the Public Verified Alerts feed and India Map.\n   • **HOLD FOR VERIFICATION:** Retains report while monitoring additional satellite sweeps.\n   • **REJECT:** Closes report with a formal reason (Duplicate, Unsubstantiated, Out of Bounds).\n5. **Citizen Notification:** The citizen's *My Alerts* portal updates with the review timestamp and notes.`
  }),

  my_alerts: () => ({
    text: `You can track the status of all your submitted alerts in the **My Alerts** portal. It displays:\n\n• Live Status Badges: **PENDING REVIEW**, **ON HOLD**, **VERIFIED**, or **REJECTED**\n• Assigned BEM Tracking ID\n• Incident timestamp and location\n• Official BEM Administrator review notes`,
    navSuggestion: { label: "GO TO MY ALERTS", path: "/dashboard/my-alerts" }
  }),

  verified_alerts: () => ({
    text: `The **Verified Public Alerts** feed displays only emergency events and Earth observations that have been investigated and approved by BEM administrators.\n\nEach alert card includes verified threat level, affected district, official summary, and administrative reviewer sign-off.`,
    navSuggestion: { label: "VIEW VERIFIED ALERTS", path: "/dashboard/verified-alerts" }
  }),

  alerts: () => ({
    text: `${bemKnowledge.features.alertCenter.description}\n\n**Alert Workflow:**\n${bemKnowledge.features.alertCenter.workflow.split(" → ").map(s => `→ ${s}`).join("\n")}\n\n**Statuses:** ${bemKnowledge.features.alertCenter.statuses.join(", ")}\n\n⚠️ ${bemKnowledge.features.alertCenter.principle}`,
    navSuggestion: { label: "GO TO ALERT CENTER", path: "/alerts", adminOnly: true }
  }),

  security: () => ({
    text: `${bemKnowledge.features.securityCenter.description}\n\n**Pipeline:**\n${bemKnowledge.features.securityCenter.pipeline.split(" → ").map(s => `→ ${s}`).join("\n")}\n\n${bemKnowledge.features.securityCenter.note}`,
    navSuggestion: { label: "GO TO SECURITY CENTER", path: "/security", adminOnly: true }
  }),

  reports: () => ({
    text: `${bemKnowledge.features.reports.description}\n\n**Admin Reports Include:**\n${bemKnowledge.features.reports.adminReports.map(r => `• ${r}`).join("\n")}\n\n**Public Reports:** ${bemKnowledge.features.reports.publicReports}`,
    navSuggestion: { label: "GO TO REPORTS", path: "/reports", adminOnly: true }
  }),

  public_info: () => ({
    text: `${bemKnowledge.features.publicPosts.description}\n\n**Categories:**\n${bemKnowledge.features.publicPosts.categories.map(c => `• ${c}`).join("\n")}\n\nAll public information is reviewed and approved by administrators before publication.`,
    navSuggestion: { label: "GO TO PUBLIC INFORMATION", path: "/public-posts", adminOnly: true }
  }),

  india_map: () => ({
    text: bemKnowledge.features.indiaMap.description + "\n\n**Features:**\n" + bemKnowledge.features.indiaMap.features.map(f => `• ${f}`).join("\n"),
    followUp: bemKnowledge.features.indiaMap.interaction
  }),

  login: () => ({
    text: `**People of India:** Enter your Phone Number (+91) and Valid Email ID — no password required. Click "CONTINUE SECURELY".\n\n**Admin:** Enter your Email Address and Password through the Admin portal.\n\nDon't have an account? You can register as a People of India user.`,
    navSuggestion: { label: "GO TO LOGIN", path: "/login" }
  }),

  register: () => ({
    text: `To create a People of India account, provide:\n\n• **Full Name**\n• **Phone Number** (+91, 10-digit)\n• **Valid Email ID**\n• **Location / City**\n• **Address**\n• **City PIN Code** (6 digits)\n\nNo password is required. Click "CREATE ACCOUNT" to register.`,
    navSuggestion: { label: "GO TO REGISTRATION", path: "/register" }
  }),

  passwordless: () => ({
    text: "People of India accounts use **passwordless authentication**. You only need your phone number and email to log in — no password to remember. This is by design, making BEM accessible to all citizens of India while maintaining security through phone and email verification."
  }),

  admin_login: () => ({
    text: "Admin login requires an authorized Email Address and Password. Admin accounts cannot be created through public registration — only authorized administrators have admin access. The admin login is available through the Secure Access Portal.",
    navSuggestion: { label: "GO TO LOGIN", path: "/login" }
  }),

  profile: () => ({
    text: "Your User Profile displays:\n\n• Full Name\n• Phone Number\n• Email\n• Location/City\n• Address\n• PIN Code\n• Verification Status\n\nNote: Users cannot modify their role.",
    navSuggestion: { label: "GO TO PROFILE", path: "/profile" }
  }),

  user_types: () => ({
    text: `BEM has two user types:\n\n**1. Admin**\n${bemKnowledge.userTypes.admin.description}\nLogin: ${bemKnowledge.userTypes.admin.loginMethod}\n\n**2. People of India**\n${bemKnowledge.userTypes.publicUser.description}\nLogin: ${bemKnowledge.userTypes.publicUser.loginMethod}\n\n${bemKnowledge.userTypes.publicUser.restrictions}`
  }),

  simulation: () => ({
    text: `**${bemKnowledge.dataClassification.SIMULATION_DATA}**\n\nIn the current MVP, BEM uses simulated data for demonstration purposes. This includes GNSS readings, satellite data, and environmental information.\n\nEvery simulated reading is clearly displayed with a **SIMULATION DATA** badge. BEM never presents simulated information as real satellite, GNSS, environmental, or emergency data.`
  }),

  navigation: (query, isAdmin) => {
    const lower = query.toLowerCase();
    const navItems = [
      { keywords: ["image", "imagery", "satellite image", "photo"], label: "Image Center", path: "/images", adminOnly: true },
      { keywords: ["gnss", "receiver", "gps"], label: "GNSS Receiver", path: "/gnss", adminOnly: true },
      { keywords: ["satellite", "data source", "network"], label: "Satellite Network", path: "/satellites", adminOnly: true },
      { keywords: ["earth monitoring", "monitoring"], label: "Earth Monitoring", path: "/earth-monitoring", adminOnly: true },
      { keywords: ["change detection", "detect"], label: "Change Detection", path: "/change-detection", adminOnly: true },
      { keywords: ["alert", "advisory"], label: "Alert Center", path: "/alerts", adminOnly: true },
      { keywords: ["security"], label: "Security Center", path: "/security", adminOnly: true },
      { keywords: ["report"], label: "Reports", path: "/reports", adminOnly: true },
      { keywords: ["public information", "public post"], label: "Public Information", path: "/public-posts", adminOnly: true },
      { keywords: ["user", "manage user"], label: "User Management", path: "/users", adminOnly: true },
      { keywords: ["audit", "log", "activity"], label: "Audit Logs", path: "/audit-logs", adminOnly: true },
      { keywords: ["setting", "config", "preference"], label: "Settings", path: "/settings", adminOnly: true },
      { keywords: ["report alert", "report an alert", "submit alert", "report incident"], label: "Report an Alert", path: "/dashboard/report-alert", adminOnly: false },
      { keywords: ["my alerts", "my alert", "my report", "track alert"], label: "My Alerts", path: "/dashboard/my-alerts", adminOnly: false },
      { keywords: ["verified alert", "verified alerts", "public alerts", "verified feed"], label: "Verified Alerts", path: "/dashboard/verified-alerts", adminOnly: false },
      { keywords: ["profile", "my profile", "account"], label: "User Profile", path: "/profile", adminOnly: false },
      { keywords: ["dashboard", "home", "main"], label: isAdmin ? "Admin Dashboard" : "Public Dashboard", path: isAdmin ? "/" : "/public-dashboard", adminOnly: false },
    ];

    for (const item of navItems) {
      if (item.keywords.some(k => lower.includes(k))) {
        if (item.adminOnly && !isAdmin) {
          return {
            text: `The ${item.label} is available to administrators only. As a public user, you can access the Public Dashboard, your Profile, public alerts, and published information.`
          };
        }
        return {
          text: `You can find **${item.label}** in the application.`,
          navSuggestion: { label: `GO TO ${item.label.toUpperCase()}`, path: item.path }
        };
      }
    }

    return {
      text: "I can help you navigate BEM. What feature are you looking for? I can point you to the Dashboard, GNSS Receiver, Earth Monitoring, Image Center, Alerts, Reports, your Profile, or any other section."
    };
  },

  dashboard: (query, isAdmin) => ({
    text: isAdmin
      ? "The Admin Dashboard is your central command center. It shows system overview, active monitoring status, satellite counts, alert summaries, and quick access to all BEM modules."
      : "The Public Dashboard shows human-verified Earth monitoring information including the India Monitoring Map, latest public alerts, Earth images, environmental information, and your profile.",
    navSuggestion: { label: isAdmin ? "GO TO ADMIN DASHBOARD" : "GO TO PUBLIC DASHBOARD", path: isAdmin ? "/" : "/public-dashboard" }
  }),

  data_classification: () => ({
    text: `BEM classifies data into four categories:\n\n• **SIMULATION DATA** — ${bemKnowledge.dataClassification.SIMULATION_DATA}\n• **PUBLIC** — ${bemKnowledge.dataClassification.PUBLIC}\n• **INTERNAL** — ${bemKnowledge.dataClassification.INTERNAL}\n• **RESTRICTED** — ${bemKnowledge.dataClassification.RESTRICTED}`
  }),

  audit_logs: () => ({
    text: bemKnowledge.features.auditLogs.description,
    navSuggestion: { label: "GO TO AUDIT LOGS", path: "/audit-logs", adminOnly: true }
  }),

  settings: () => ({
    text: bemKnowledge.features.settings.description,
    navSuggestion: { label: "GO TO SETTINGS", path: "/settings", adminOnly: true }
  }),

  help: () => ({
    text: "I can help you with:\n\n• 🛰 **BEM Features** — Earth Monitoring, GNSS, Satellites, Images, Alerts\n• 🗺 **Navigation** — Finding features and pages in the application\n• 🔐 **Authentication** — Login, registration, and account information\n• 📊 **Data** — Understanding monitoring data, classifications, and workflows\n• ⚡ **Alerts** — How the alert review and approval system works\n• 🌍 **Earth Monitoring** — Water, land, environment, atmosphere\n\nJust ask me anything about BEM!",
    followUp: "Try asking: 'What is GNSS?', 'How do alerts work?', or 'Where can I see satellite images?'"
  }),

  greeting: () => {
    const greetings = [
      "Hello! 👋 I'm the BEM Assistant. How can I help you understand Bharat Earth Monitor today?",
      "Namaste! 🙏 Welcome to the BEM Assistant. I can explain any feature of Bharat Earth Monitor. What would you like to know?",
      "Hi there! 👋 I'm here to help you navigate and understand BEM. What would you like to explore?"
    ];
    return { text: greetings[Math.floor(Math.random() * greetings.length)] };
  },

  thanks: () => ({
    text: "You're welcome! 🙏 I'm always here to help with anything related to Bharat Earth Monitor. Don't hesitate to ask if you have more questions!"
  }),

  goodbye: () => ({
    text: "Goodbye! 👋 Thank you for using the BEM Assistant. I'll be right here whenever you need help with Bharat Earth Monitor. Stay informed, stay safe! 🛰"
  }),

  social_media: () => ({
    text: "BEM can prepare content for official social media publication. The workflow is:\n\n**Observation → Analysis → Review → Admin Approval → Public Post → Social Media Content**\n\nUnverified information is never automatically published. All social media content must go through admin approval first."
  }),

  logout: () => ({
    text: "To log out, click the **LOGOUT** button in the sidebar or navigation menu. After logout, your session will end and you'll be redirected to the Login page. Protected pages cannot be accessed through browser navigation after logout."
  }),

  out_of_scope: () => ({
    text: "I'm the BEM Assistant, so I'm mainly designed to help with **Bharat Earth Monitor** and its features. I can help you understand Earth monitoring, GNSS, satellite data, alerts, images, reports, and how to use this website.\n\nIs there something about BEM I can help you with?"
  }),

  unknown: () => ({
    text: "I don't have enough information to answer that accurately from the BEM system. However, I can help you with:\n\n• BEM features and how they work\n• Earth monitoring, GNSS, and satellite data\n• Alerts, images, and reports\n• Website navigation and account management\n\nCould you rephrase your question, or try one of the quick questions?"
  })
};

// ─── INTENT DETECTION ─────────────────────────────────────────

function detectIntent(query) {
  const lower = query.toLowerCase().trim();

  // Direct FAQ match first
  const faqMatch = bemKnowledge.faq.find(f => {
    const faqLower = f.q.toLowerCase();
    return lower === faqLower || lower === faqLower.replace("?", "") ||
      lower.includes(faqLower.replace("?", "").replace("what is ", "").replace("how does ", "").replace("how do ", ""));
  });

  if (faqMatch) {
    return { type: "faq", match: faqMatch };
  }

  // Pattern-based intent matching
  let bestMatch = null;
  let bestScore = 0;

  for (const pattern of intentPatterns) {
    for (const keyword of pattern.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Exact phrase match scores highest
      if (lower === keywordLower || lower === keywordLower + "?") {
        return { type: "intent", intent: pattern.intent, score: 100 };
      }

      // Contains full phrase
      if (lower.includes(keywordLower)) {
        const score = (keywordLower.length / lower.length) * 80 + keywordLower.split(" ").length * 5;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = pattern.intent;
        }
      }

      // Word overlap scoring
      const queryWords = lower.split(/\s+/);
      const keywordWords = keywordLower.split(/\s+/);
      const overlap = keywordWords.filter(kw => queryWords.some(qw => qw.includes(kw) || kw.includes(qw)));
      if (overlap.length > 0) {
        const score = (overlap.length / keywordWords.length) * 60;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = pattern.intent;
        }
      }
    }
  }

  if (bestMatch && bestScore > 20) {
    return { type: "intent", intent: bestMatch, score: bestScore };
  }

  // Fuzzy: check if query words match any knowledge base terms
  const queryWords = lower.split(/\s+/).filter(w => w.length > 2);
  const allTerms = [
    "bem", "bharat", "earth", "monitor", "gnss", "satellite", "alert",
    "image", "security", "report", "change", "detection", "water",
    "land", "terrain", "atmosphere", "environment", "map", "india",
    "dashboard", "login", "register", "profile", "simulation", "data"
  ];

  const matchedTerms = queryWords.filter(w => allTerms.some(t => w.includes(t) || t.includes(w)));
  if (matchedTerms.length === 0) {
    return { type: "out_of_scope" };
  }

  return { type: "unknown" };
}

// ─── MAIN QUERY PROCESSOR ────────────────────────────────────

/**
 * Process a user query and return a response.
 * 
 * @param {string} query - The user's question
 * @param {object} options - Context options
 * @param {boolean} options.isAdmin - Whether the current user is an admin
 * @param {string} options.currentPath - Current route path for context-aware responses
 * @returns {object} Response with text, followUp, and optional navSuggestion
 */
export function processQuery(query, options = {}) {
  const { isAdmin = false, currentPath = "/" } = options;

  if (!query || query.trim().length === 0) {
    return { text: "Please type a question and I'll do my best to help you with BEM!" };
  }

  const detected = detectIntent(query);

  // FAQ direct match
  if (detected.type === "faq") {
    return {
      text: detected.match.a,
      followUp: "Would you like to know more about any other BEM feature?"
    };
  }

  // Intent-based response
  if (detected.type === "intent") {
    const generator = responseGenerators[detected.intent];
    if (generator) {
      const response = generator(query, isAdmin);

      // Filter admin-only navigation suggestions for public users
      if (response.navSuggestion && response.navSuggestion.adminOnly && !isAdmin) {
        return {
          text: response.text,
          followUp: response.followUp,
          // Don't show admin-only navigation to public users
        };
      }

      return response;
    }
  }

  // Out of scope
  if (detected.type === "out_of_scope") {
    return responseGenerators.out_of_scope();
  }

  // Unknown but BEM-related
  return responseGenerators.unknown();
}

/**
 * Get contextual greeting based on current page.
 */
export function getPageContext(path) {
  return bemKnowledge.pageContext[path] || null;
}

/**
 * Get the welcome message for first-time chat opening.
 */
export function getWelcomeMessage() {
  return {
    text: "Hello! I'm the BEM Assistant. 👋\n\nI can explain how Bharat Earth Monitor works, help you navigate the website, and answer questions about Earth monitoring, GNSS, satellite data, images, alerts, reports and other BEM features.\n\nHow can I help you?",
    isBot: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get quick question suggestions.
 */
export function getQuickQuestions() {
  return bemKnowledge.quickQuestions;
}
