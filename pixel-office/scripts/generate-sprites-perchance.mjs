/**
 * scripts/generate-sprites-perchance.mjs
 *
 * Generates pixel art sprites for all 21 gstack skills via perchance.org/ai-pixel-art-generator
 * Uses Playwright for browser automation — no API key needed, completely free.
 *
 * Usage:
 *   node scripts/generate-sprites-perchance.mjs
 *   npx playwright install chromium   # first time only
 *
 * Options:
 *   --only qa,ship        Only generate specific skills
 *   --skip investigate    Skip specific skills
 *   --dry-run             Print prompts without opening browser
 *   --headed              Show browser window (useful for debugging)
 *
 * Output:
 *   public/sprites/{skill-id}.png
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPRITES_DIR = path.join(__dirname, "../public/sprites");
const PERCHANCE_URL = "https://perchance.org/ai-pixel-art-generator";

// ── Skill definitions ─────────────────────────────────────────────────────────

const SKILLS = [
  { id: "qa",                    character: "a meticulous QA tester holding a clipboard with reading glasses, looking serious and focused" },
  { id: "ship",                  character: "an excited developer throwing a paper airplane, mid-throw with a big grin" },
  { id: "investigate",           character: "a detective squinting through a magnifying glass, coat collar up, suspicious expression" },
  { id: "office-hours",          character: "a relaxed mentor leaning back in a chair holding a coffee mug, warm smile" },
  { id: "browse",                character: "an explorer holding binoculars up to their eyes, scanning the horizon" },
  { id: "review",                character: "a strict code reviewer holding a red pen, scrutinizing a document with raised eyebrow" },
  { id: "design-review",         character: "a designer holding a color palette and tilting their head thoughtfully at a canvas" },
  { id: "retro",                 character: "a team lead standing at a whiteboard covered in sticky notes, marker in hand" },
  { id: "plan-eng-review",       character: "an architect in a hard hat studying a blueprint, pencil behind ear" },
  { id: "plan-ceo-review",       character: "a CEO in a business suit with arms crossed, evaluating expression, power pose" },
  { id: "plan-design-review",    character: "a designer with a sketchbook open, drawing wireframes with a stylus" },
  { id: "design-consultation",   character: "a creative director surrounded by mood boards and color swatches, inspired look" },
  { id: "document-release",      character: "a technical writer with a quill pen and stack of scrolls, writing carefully" },
  { id: "codex",                 character: "a rival developer with a laptop, glasses glinting knowingly, skeptical smirk" },
  { id: "careful",               character: "a safety guard wearing a hard hat and holding a stop sign, stern warning expression" },
  { id: "freeze",                character: "an ice mage with a glowing frost staff, frost crystals in the air around them" },
  { id: "guard",                 character: "a paladin in shining pixel armor holding a shield, protective stance" },
  { id: "unfreeze",              character: "the same ice mage but with frost melting and dripping, relieved expression" },
  { id: "setup-browser-cookies", character: "a cheerful chef holding a tray of freshly baked cookies, oven mitts on" },
  { id: "gstack-upgrade",        character: "a mechanic in overalls holding a wrench and grinning, just finished fixing something" },
  { id: "qa-only",               character: "an inspector with a clipboard but conspicuously no pen, hands-off observing posture" },
];

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(character) {
  return [
    `pixel art character sprite: ${character}.`,
    `16-bit RPG style, 3/4 isometric view like Stardew Valley.`,
    `Warm earthy tones, transparent background.`,
    `Small sprite, crisp pixel edges, no anti-aliasing.`,
  ].join(" ");
}

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const headed = args.includes("--headed");

const onlyArg = args.find((a) => a.startsWith("--only="))?.split("=")[1]
  ?? (args[args.indexOf("--only") + 1]?.startsWith("--") ? null : args[args.indexOf("--only") + 1]);
const skipArg = args.find((a) => a.startsWith("--skip="))?.split("=")[1]
  ?? (args[args.indexOf("--skip") + 1]?.startsWith("--") ? null : args[args.indexOf("--skip") + 1]);

const onlyIds = onlyArg ? new Set(onlyArg.split(",")) : null;
const skipIds = skipArg ? new Set(skipArg.split(",")) : new Set();

const toGenerate = SKILLS.filter((s) => {
  if (onlyIds && !onlyIds.has(s.id)) return false;
  if (skipIds.has(s.id)) return false;
  const dest = path.join(SPRITES_DIR, `${s.id}.png`);
  if (fs.existsSync(dest)) {
    console.log(`⏭  ${s.id}.png already exists — skipping`);
    return false;
  }
  return true;
});

if (toGenerate.length === 0) {
  console.log("Nothing to generate.");
  process.exit(0);
}

console.log(`\nGenerating ${toGenerate.length} sprites via perchance.org...\n`);

if (dryRun) {
  for (const skill of toGenerate) {
    console.log(`\n[DRY RUN] ${skill.id}:`);
    console.log(buildPrompt(skill.character));
  }
  process.exit(0);
}

// ── Ensure output directory ───────────────────────────────────────────────────

fs.mkdirSync(SPRITES_DIR, { recursive: true });

// ── Helper: find element using multiple selector strategies ──────────────────

async function findElement(page, selectors, description) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        return el;
      }
    } catch {
      // try next
    }
  }
  throw new Error(`Could not find ${description}. Tried: ${selectors.join(", ")}`);
}

// ── Helper: download image from URL ──────────────────────────────────────────

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buf));
}

// ── Main ──────────────────────────────────────────────────────────────────────

const browser = await chromium.launch({
  headless: !headed,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
});

const page = await context.newPage();

console.log(`Opening ${PERCHANCE_URL} ...`);

// Navigate and wait for the page to be fully interactive
await page.goto(PERCHANCE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

// Perchance generators load inside an iframe — wait for it
console.log("Waiting for generator iframe to load...");

let generatorFrame = page;

try {
  // Wait up to 30s for an iframe to appear
  await page.waitForSelector("iframe", { timeout: 30000 });
  const iframes = page.frames();

  // Find the generator iframe (usually the one with the actual content)
  for (const frame of iframes) {
    const frameUrl = frame.url();
    if (frameUrl && frameUrl !== "about:blank" && !frameUrl.includes("google") && !frameUrl.includes("ad")) {
      console.log(`  Found frame: ${frameUrl}`);
      generatorFrame = frame;
    }
  }
} catch {
  console.log("No iframe found — using main page directly.");
}

// Give the page extra time to fully render the generator
await page.waitForTimeout(3000);

// ── Locate the prompt input ───────────────────────────────────────────────────

const PROMPT_SELECTORS = [
  "textarea#prompt",
  "textarea[placeholder*='prompt' i]",
  "textarea[placeholder*='describe' i]",
  "textarea[placeholder*='enter' i]",
  "input[placeholder*='prompt' i]",
  "textarea",
  "input[type='text']",
];

const GENERATE_SELECTORS = [
  "button:has-text('Generate')",
  "button:has-text('Create')",
  "button:has-text('Make')",
  "input[type='button'][value*='Generate' i]",
  "input[type='submit'][value*='Generate' i]",
  "button[class*='generate' i]",
  "button[id*='generate' i]",
  "[onclick*='generate' i]",
];

const DOWNLOAD_SELECTORS = [
  "a[download]",
  "a:has-text('Download')",
  "button:has-text('Download')",
  "a[href*='.png']",
  "a[href*='blob:']",
  "a[href*='data:image']",
];

const IMAGE_SELECTORS = [
  "img.output",
  "img.result",
  "img[id*='output']",
  "img[id*='result']",
  "img[src*='blob:']",
  "img[src*='data:image']",
  "#outputImage",
  ".output img",
  ".result img",
  "canvas",
];

// Verify we can find the prompt input before starting the loop
console.log("Detecting generator UI elements...");

let promptEl;
try {
  promptEl = await findElement(generatorFrame, PROMPT_SELECTORS, "prompt input");
  console.log("✓ Found prompt input");
} catch (err) {
  // Dump page HTML for debugging
  const html = await page.content();
  fs.writeFileSync("/tmp/perchance-debug.html", html);
  console.error(`\nERROR: ${err.message}`);
  console.error("Page HTML saved to /tmp/perchance-debug.html for debugging.");
  console.error("Try running with --headed to see the browser window.");
  await browser.close();
  process.exit(1);
}

// ── Generate sprites ──────────────────────────────────────────────────────────

let succeeded = 0;
let failed = 0;

for (const skill of toGenerate) {
  const prompt = buildPrompt(skill.character);
  const dest = path.join(SPRITES_DIR, `${skill.id}.png`);

  process.stdout.write(`Generating ${skill.id}... `);

  try {
    // Clear and fill the prompt
    await promptEl.click({ timeout: 5000 });
    await promptEl.selectAll?.() ?? await page.keyboard.press("Control+a");
    await promptEl.fill(prompt, { timeout: 5000 });

    // Click generate
    const generateBtn = await findElement(generatorFrame, GENERATE_SELECTORS, "generate button");
    await generateBtn.click({ timeout: 5000 });

    // Wait for image to appear (up to 60 seconds — AI generation can be slow)
    let imageUrl = null;

    // Strategy 1: Wait for a download link
    try {
      const downloadEl = await findElement(generatorFrame, DOWNLOAD_SELECTORS, "download link");
      await generatorFrame.waitForSelector(DOWNLOAD_SELECTORS.join(", "), { timeout: 60000 });

      const href = await downloadEl.getAttribute("href");
      if (href && (href.startsWith("http") || href.startsWith("blob:") || href.startsWith("data:"))) {
        imageUrl = href;
      }
    } catch {
      // Strategy 1 failed, try strategy 2
    }

    // Strategy 2: Wait for the output image to get a src
    if (!imageUrl) {
      try {
        await generatorFrame.waitForFunction(
          (sels) => {
            for (const sel of sels) {
              const el = document.querySelector(sel);
              if (el) {
                if (el.tagName === "IMG" && el.src && el.src !== "") return true;
                if (el.tagName === "CANVAS") return true;
              }
            }
            return false;
          },
          IMAGE_SELECTORS,
          { timeout: 60000 }
        );

        for (const sel of IMAGE_SELECTORS) {
          const el = await generatorFrame.$(sel);
          if (!el) continue;

          const tagName = await el.evaluate((n) => n.tagName);
          if (tagName === "CANVAS") {
            // Convert canvas to PNG
            const dataUrl = await el.evaluate((canvas) => canvas.toDataURL("image/png"));
            const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
            fs.writeFileSync(dest, Buffer.from(base64, "base64"));
            imageUrl = "canvas"; // sentinel
            break;
          } else {
            imageUrl = await el.getAttribute("src");
            if (imageUrl) break;
          }
        }
      } catch {
        // Strategy 2 failed
      }
    }

    if (!imageUrl) {
      throw new Error("Could not find generated image after 60s");
    }

    // Download image (skip if already written from canvas)
    if (imageUrl !== "canvas") {
      if (imageUrl.startsWith("data:image")) {
        const base64 = imageUrl.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(dest, Buffer.from(base64, "base64"));
      } else if (imageUrl.startsWith("blob:")) {
        // Fetch blob URL from within the page context
        const base64 = await page.evaluate(async (url) => {
          const res = await fetch(url);
          const buf = await res.arrayBuffer();
          return btoa(String.fromCharCode(...new Uint8Array(buf)));
        }, imageUrl);
        fs.writeFileSync(dest, Buffer.from(base64, "base64"));
      } else {
        await downloadImage(imageUrl, dest);
      }
    }

    console.log(`✓  saved → public/sprites/${skill.id}.png`);
    succeeded++;

    // Wait between requests to avoid overwhelming the free service
    if (toGenerate.indexOf(skill) < toGenerate.length - 1) {
      await page.waitForTimeout(3000);
    }
  } catch (err) {
    console.log(`✗  FAILED: ${err.message}`);
    failed++;
    // Take a debug screenshot on failure
    const debugPath = `/tmp/perchance-fail-${skill.id}.png`;
    await page.screenshot({ path: debugPath }).catch(() => {});
    console.log(`   Debug screenshot: ${debugPath}`);
  }
}

await browser.close();

console.log(`\nDone: ${succeeded} generated, ${failed} failed.`);
if (failed > 0) {
  console.log("Re-run to retry failed sprites (existing files are skipped automatically).");
  console.log("Run with --headed to watch the browser if you need to debug.");
}
