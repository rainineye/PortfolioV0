# Pixel Office — gstack Skills Visualizer

A living, isometric pixel art office where each of the 21 gstack skills is represented by a unique character. Click a character to trigger a real Claude API call and watch the response stream in their speech bubble.

## What it is

Every skill dashboard is buttons and text. This is a living world.

- **21 pixel art characters** — each with a distinct personality matching their skill
- **Real Claude API calls** — streaming responses via Vercel AI SDK
- **Day/night cycle** — office lighting shifts with your local time
- **Password protected** — invite-only with a passphrase gate
- **Mobile friendly** — isometric office on desktop, card list on mobile

## Running locally

```bash
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY and GATE_PASSWORD

npm install
npm run dev
# Open http://localhost:3000
```

## Deploying to Vercel

```bash
vercel deploy
```

Set these environment variables in Vercel:
- `ANTHROPIC_API_KEY` — your Anthropic API key
- `GATE_PASSWORD` — passphrase to enter the office

## Generating sprites

Sprites are not included. Generate them with DALL-E 3:

```
Prompt template:
"isometric pixel art character, [character description], 3/4 top-down RPG view,
48x64px per frame, sprite sheet 4 frames horizontal idle animation,
warm Stardew Valley palette, transparent background, no anti-aliasing"
```

Place sprites as `/public/sprites/{skill-id}.png`.
Until sprites are generated, characters render as colored placeholder tiles.

## Tech stack

- [Next.js 15](https://nextjs.org/) — App Router, server components
- [Vercel AI SDK](https://sdk.vercel.ai/) — `streamText` + `useCompletion`
- [Anthropic Claude](https://anthropic.com/) — `claude-sonnet-4-6`
- [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) + [VT323](https://fonts.google.com/specimen/VT323) — Google Fonts

## Structure

```
app/
  page.tsx                 ← Password gate
  office/page.tsx          ← Office scene (auth-gated)
  components/
    OfficeScene.tsx         ← Full-screen isometric scene
    Character.tsx           ← Sprite + animation + click handler
    SpeechBubble.tsx        ← Streaming output bubble
    MobileCardList.tsx      ← Mobile card layout
    SoundToggle.tsx         ← Mute button
  api/
    auth/route.ts           ← POST /api/auth (password check)
    invoke-skill/route.ts   ← POST /api/invoke-skill (Claude stream)
lib/
  skills.ts                 ← All 21 skills — single source of truth
test/
  skills.test.ts            ← Skill metadata validation
  api-route.test.ts         ← Route validation tests
  auth-route.test.ts        ← Auth route tests
  components.test.tsx       ← Component interaction tests
```
