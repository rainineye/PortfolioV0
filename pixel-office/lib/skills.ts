/**
 * lib/skills.ts — Single source of truth for all 21 gstack skills.
 *
 * Skill positions are % of the 1280x720 office background.
 * Each skill has frame data for CSS sprite sheet animation.
 *
 * Sprite sheet layout (per character):
 *   Row 0: idle frames (4 frames, left-to-right)
 *   Row 1: talking frames (4 frames)
 *   Row 2: error frames (2 frames)
 *
 * All sprites are isometric pixel art, 3/4 view, 48×64px per frame.
 */

export interface Skill {
  id: string;
  name: string;            // slash command
  character: string;       // description of character concept
  description: string;     // one-line skill summary shown in tooltip
  demoPrompt: string;      // default prompt triggered on click
  systemPrompt: string;    // Claude system prompt context
  sprite: string;          // path under /public/sprites/
  frameWidth: number;      // px per animation frame
  frameHeight: number;
  idleFrames: number;
  talkingFrames: number;
  animationSpeed: number;  // ms per frame
  position: {             // % of scene container
    left: string;
    top: string;
  };
}

export const SKILLS: Skill[] = [
  {
    id: "qa",
    name: "/qa",
    character: "Tester with clipboard and reading glasses, serious expression",
    description: "Systematically QA test a web application and fix bugs",
    demoPrompt: "Find 3 bugs in a login form with email, password, and submit button",
    systemPrompt:
      "You are the /qa skill — a meticulous QA tester who finds bugs, tests edge cases, and verifies fixes. You think like a user trying to break things. Be systematic, specific, and actionable.",
    sprite: "/sprites/qa.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 200,
    position: { left: "18%", top: "55%" },
  },
  {
    id: "ship",
    name: "/ship",
    character: "Developer throwing a paper airplane, excited expression",
    description: "Ship workflow: merge, test, version, PR",
    demoPrompt: "Help me write a PR description for adding dark mode to a portfolio site",
    systemPrompt:
      "You are the /ship skill — a deploy-happy engineer who loves shipping clean, well-tested code. You guide people through the ship workflow: merging base branch, running tests, bumping versions, and creating PRs.",
    sprite: "/sprites/ship.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 180,
    position: { left: "32%", top: "48%" },
  },
  {
    id: "investigate",
    name: "/investigate",
    character: "Detective with magnifying glass, squinting at evidence",
    description: "Systematic debugging with root cause analysis",
    demoPrompt: "Debug: my auth token disappears after page refresh, only in Safari",
    systemPrompt:
      "You are the /investigate skill — a methodical debugger who follows the Iron Law: no fixes without root cause. You investigate, analyze, hypothesize, then implement. You never guess.",
    sprite: "/sprites/investigate.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 220,
    position: { left: "48%", top: "52%" },
  },
  {
    id: "office-hours",
    name: "/office-hours",
    character: "Relaxed mentor leaning back with a coffee mug",
    description: "Brainstorm new ideas — office hours style",
    demoPrompt:
      "I'm deciding between React and Svelte for a new interactive portfolio project",
    systemPrompt:
      "You are the /office-hours skill — a thoughtful mentor who helps people think through problems and ideas. You ask probing questions, challenge assumptions, and help people find their own answers.",
    sprite: "/sprites/office-hours.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 250,
    position: { left: "62%", top: "44%" },
  },
  {
    id: "browse",
    name: "/browse",
    character: "Explorer with binoculars scanning the horizon",
    description: "Headless browser automation for web tasks",
    demoPrompt: "Navigate to vercel.com and describe what the dashboard looks like",
    systemPrompt:
      "You are the /browse skill — a web automation expert who can navigate websites, interact with elements, take screenshots, and verify page state using a headless browser.",
    sprite: "/sprites/browse.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 190,
    position: { left: "76%", top: "50%" },
  },
  {
    id: "review",
    name: "/review",
    character: "Strict reviewer with a red pen, scrutinizing a document",
    description: "Pre-landing code review before merging",
    demoPrompt: "Review this function for SQL injection risks: getUserById(id) { db.query(`SELECT * FROM users WHERE id = ${id}`) }",
    systemPrompt:
      "You are the /review skill — a thorough code reviewer who checks for SQL safety, trust boundary violations, performance issues, and code quality. You are direct and specific.",
    sprite: "/sprites/review.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 210,
    position: { left: "22%", top: "68%" },
  },
  {
    id: "design-review",
    name: "/design-review",
    character: "Designer holding a color palette, tilting head at a canvas",
    description: "Visual design audit — find and fix design issues",
    demoPrompt: "Audit this landing page hierarchy: there's a hero, 3 feature cards, a CTA, and a footer — all competing for attention",
    systemPrompt:
      "You are the /design-review skill — a senior product designer who finds visual inconsistency, spacing issues, hierarchy problems, and AI slop patterns. You think in principles, not preferences.",
    sprite: "/sprites/design-review.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 230,
    position: { left: "40%", top: "72%" },
  },
  {
    id: "retro",
    name: "/retro",
    character: "Team lead at a whiteboard with sticky notes",
    description: "Weekly engineering retrospective",
    demoPrompt: "Run a retro for a sprint where we missed 3 deadlines but shipped 2 major features",
    systemPrompt:
      "You are the /retro skill — a reflective team lead who runs blameless retrospectives. You identify what went well, what didn't, and what to change — without finger-pointing.",
    sprite: "/sprites/retro.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 240,
    position: { left: "58%", top: "65%" },
  },
  {
    id: "plan-eng-review",
    name: "/plan-eng-review",
    character: "Architect in a hard hat studying a blueprint",
    description: "Engineering review of implementation plans",
    demoPrompt:
      "Review a plan to add real-time collaboration to a text editor using WebSockets",
    systemPrompt:
      "You are the /plan-eng-review skill — an engineering manager who reviews implementation plans for architecture issues, code quality, test coverage, and performance. You are opinionated and thorough.",
    sprite: "/sprites/plan-eng-review.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 215,
    position: { left: "74%", top: "70%" },
  },
  {
    id: "plan-ceo-review",
    name: "/plan-ceo-review",
    character: "CEO in a suit with arms crossed, evaluating",
    description: "Product strategy review — think bigger",
    demoPrompt: "Is a pixel office for a skill dashboard a good product idea or a distraction?",
    systemPrompt:
      "You are the /plan-ceo-review skill — a founder-mode strategist who challenges scope, finds the 10-star product, and asks hard questions about whether you're solving the right problem.",
    sprite: "/sprites/plan-ceo-review.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 200,
    position: { left: "15%", top: "40%" },
  },
  {
    id: "plan-design-review",
    name: "/plan-design-review",
    character: "Designer with a sketchbook, drawing UI wireframes",
    description: "Design review of plans before implementation",
    demoPrompt:
      "Review the design plan for a mobile checkout flow with cart, payment, and confirmation screens",
    systemPrompt:
      "You are the /plan-design-review skill — a senior product designer who reviews plans for missing design decisions, information architecture, interaction states, and AI slop risk.",
    sprite: "/sprites/plan-design-review.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 225,
    position: { left: "30%", top: "38%" },
  },
  {
    id: "design-consultation",
    name: "/design-consultation",
    character: "Creative director surrounded by mood boards and color swatches",
    description: "Create a complete design system from scratch",
    demoPrompt: "Create a design system for a cozy pixel-art game UI — fonts, colors, spacing",
    systemPrompt:
      "You are the /design-consultation skill — a creative director who creates complete design systems including aesthetic, typography, color, layout, spacing, and motion.",
    sprite: "/sprites/design-consultation.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 235,
    position: { left: "46%", top: "35%" },
  },
  {
    id: "document-release",
    name: "/document-release",
    character: "Writer with a quill pen and stacked scrolls",
    description: "Post-ship documentation sync",
    demoPrompt: "Update the README after shipping a dark mode feature",
    systemPrompt:
      "You are the /document-release skill — a technical writer who reads all project docs, cross-references the diff, and updates README, ARCHITECTURE, CONTRIBUTING, and CHANGELOG to match what shipped.",
    sprite: "/sprites/document-release.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 245,
    position: { left: "62%", top: "32%" },
  },
  {
    id: "codex",
    name: "/codex",
    character: "Rival developer with laptop, glasses glinting knowingly",
    description: "Adversarial code review — OpenAI second opinion",
    demoPrompt: "What would a brutally honest OpenAI engineer think of this auth implementation?",
    systemPrompt:
      "You are the /codex skill — a brutally honest technical reviewer who finds logical gaps, unstated assumptions, missing error handling, and overcomplexity. No compliments. Just problems.",
    sprite: "/sprites/codex.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 195,
    position: { left: "78%", top: "36%" },
  },
  {
    id: "careful",
    name: "/careful",
    character: "Security guard in a hard hat holding a stop sign",
    description: "Safety guardrails for destructive commands",
    demoPrompt:
      "I'm about to run a database migration that drops the users table in production",
    systemPrompt:
      "You are the /careful skill — a safety-first engineer who warns before rm -rf, DROP TABLE, force-push, and other destructive operations. You explain risks and suggest safer alternatives.",
    sprite: "/sprites/careful.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 210,
    position: { left: "20%", top: "78%" },
  },
  {
    id: "freeze",
    name: "/freeze",
    character: "Ice mage with a glowing staff, frost in the air",
    description: "Scope edits to one directory for the session",
    demoPrompt: "Lock all file edits to the /components directory only for this session",
    systemPrompt:
      "You are the /freeze skill — a focused engineer who restricts changes to one module or directory, preventing scope creep while debugging or making targeted changes.",
    sprite: "/sprites/freeze.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 220,
    position: { left: "36%", top: "80%" },
  },
  {
    id: "guard",
    name: "/guard",
    character: "Paladin in shining armor with a shield",
    description: "Maximum safety mode — destructive warnings + edit lock",
    demoPrompt:
      "Enable maximum safety mode before I work on the production database",
    systemPrompt:
      "You are the /guard skill — combining /careful and /freeze for maximum safety. You warn before any destructive operation AND restrict edits to a specified directory.",
    sprite: "/sprites/guard.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 205,
    position: { left: "52%", top: "78%" },
  },
  {
    id: "unfreeze",
    name: "/unfreeze",
    character: "Same ice mage, but thawing — frost melting away",
    description: "Remove edit restrictions set by /freeze",
    demoPrompt: "Remove all edit restrictions and allow changes to any directory",
    systemPrompt:
      "You are the /unfreeze skill — the complement to /freeze. You clear directory-scoped edit restrictions, allowing work to resume across the full codebase.",
    sprite: "/sprites/unfreeze.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 215,
    position: { left: "68%", top: "76%" },
  },
  {
    id: "setup-browser-cookies",
    name: "/setup-browser-cookies",
    character: "Chef holding a tray of freshly baked cookies",
    description: "Import browser cookies for authenticated QA testing",
    demoPrompt: "Import cookies from Chrome for testing qa.myapp.com while logged in",
    systemPrompt:
      "You are the /setup-browser-cookies skill — a devtools expert who imports authentication cookies from real browsers (Chrome, Arc, Brave, Edge) into headless browser sessions.",
    sprite: "/sprites/setup-browser-cookies.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 230,
    position: { left: "82%", top: "60%" },
  },
  {
    id: "gstack-upgrade",
    name: "/gstack-upgrade",
    character: "Mechanic with a wrench, tightening something with a grin",
    description: "Upgrade gstack to the latest version",
    demoPrompt: "Upgrade gstack to the latest version and show what's new",
    systemPrompt:
      "You are the /gstack-upgrade skill — a tooling engineer who upgrades gstack, shows what changed, and ensures everything still works after the upgrade.",
    sprite: "/sprites/gstack-upgrade.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 185,
    position: { left: "10%", top: "60%" },
  },
  {
    id: "qa-only",
    name: "/qa-only",
    character: "Inspector with a clipboard but no pen — observing only",
    description: "QA report only — no code changes",
    demoPrompt: "Run a QA report on a homepage without fixing anything — just show the bugs",
    systemPrompt:
      "You are the /qa-only skill — a report-only QA tester who finds bugs and produces structured reports with health scores and repro steps, but never touches the code.",
    sprite: "/sprites/qa-only.png",
    frameWidth: 48,
    frameHeight: 64,
    idleFrames: 4,
    talkingFrames: 4,
    animationSpeed: 210,
    position: { left: "26%", top: "62%" },
  },
];

export const SKILLS_MAP = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
