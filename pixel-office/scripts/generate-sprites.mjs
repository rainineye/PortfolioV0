/**
 * scripts/generate-sprites.mjs
 *
 * Generates pixel art sprites for all 21 gstack skills via DALL-E 3.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-sprites.mjs
 *
 * Options:
 *   --only qa,ship        Only generate specific skills (comma-separated IDs)
 *   --skip investigate    Skip specific skills
 *   --dry-run             Print prompts without calling the API
 *
 * Output:
 *   public/sprites/{skill-id}.png   (1024x1024 DALL-E output, then cropped)
 *
 * DALL-E 3 generates 1024x1024 images. We save them as-is — the app uses
 * CSS to render them at 48x64px with image-rendering: pixelated.
 * For best results: manually crop/edit in Aseprite after generation.
 *
 * Cost estimate: ~$0.04/image × 21 = ~$0.84 total
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPRITES_DIR = path.join(__dirname, "../public/sprites");

// ── Skill definitions (id + character concept) ───────────────────────────────

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

// ── Prompt template ───────────────────────────────────────────────────────────

function buildPrompt(character) {
  return [
    `Isometric pixel art character: ${character}.`,
    `Style: 16-bit RPG, 3/4 top-down isometric view (like Stardew Valley or old Final Fantasy).`,
    `Palette: warm earthy tones (oak browns, cream, sky blue accents).`,
    `Size feel: small character sprite, 48x64 pixels (render at high resolution but keep the pixel art aesthetic).`,
    `Sprite sheet: 4 frames of idle animation arranged horizontally on a TRANSPARENT background.`,
    `Requirements: crisp pixel edges, no anti-aliasing, no gradients, clearly readable at small size.`,
    `Do NOT include text, UI elements, or background scenery.`,
  ].join(" ");
}

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="))?.split("=")[1]
  ?? (args[args.indexOf("--only") + 1]?.startsWith("--") ? null : args[args.indexOf("--only") + 1]);
const skipArg = args.find((a) => a.startsWith("--skip="))?.split("=")[1]
  ?? (args[args.indexOf("--skip") + 1]?.startsWith("--") ? null : args[args.indexOf("--skip") + 1]);

const onlyIds = onlyArg ? new Set(onlyArg.split(",")) : null;
const skipIds = skipArg ? new Set(skipArg.split(",")) : new Set();

const toGenerate = SKILLS.filter((s) => {
  if (onlyIds && !onlyIds.has(s.id)) return false;
  if (skipIds.has(s.id)) return false;
  // Skip if sprite already exists
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

console.log(`\nGenerating ${toGenerate.length} sprites...\n`);

if (dryRun) {
  for (const skill of toGenerate) {
    console.log(`\n[DRY RUN] ${skill.id}:`);
    console.log(buildPrompt(skill.character));
  }
  process.exit(0);
}

// ── API key check ─────────────────────────────────────────────────────────────

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY environment variable not set.");
  console.error("Usage: OPENAI_API_KEY=sk-... node scripts/generate-sprites.mjs");
  process.exit(1);
}

// ── Ensure output directory ───────────────────────────────────────────────────

fs.mkdirSync(SPRITES_DIR, { recursive: true });

// ── Generate sprites sequentially (avoid rate limits) ────────────────────────

let succeeded = 0;
let failed = 0;

for (const skill of toGenerate) {
  const prompt = buildPrompt(skill.character);
  const dest = path.join(SPRITES_DIR, `${skill.id}.png`);

  process.stdout.write(`Generating ${skill.id}... `);

  try {
    // Call DALL-E 3 API
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
        quality: "standard",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`API error ${res.status}: ${err.error?.message ?? res.statusText}`);
    }

    const data = await res.json();
    const imageUrl = data.data[0].url;

    // Download the image
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);

    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));

    console.log(`✓  saved to public/sprites/${skill.id}.png`);
    succeeded++;

    // Rate limit: wait 2s between requests (DALL-E 3 limit: ~5 img/min on tier 1)
    if (toGenerate.indexOf(skill) < toGenerate.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.log(`✗  FAILED: ${err.message}`);
    failed++;
    // Continue with next sprite
  }
}

console.log(`\nDone: ${succeeded} generated, ${failed} failed.`);
if (failed > 0) {
  console.log(`Re-run to retry failed sprites (existing files are skipped automatically).`);
}
