/**
 * POST /api/invoke-skill
 *
 * Receives { skillId, message? } and streams a Claude response.
 * Uses Vercel AI SDK streamText with @ai-sdk/anthropic.
 *
 * Auth: Password gate is enforced client-side via session cookie.
 * This route validates the cookie server-side to prevent direct API abuse.
 *
 * Request flow:
 *   Client POST → validate gate cookie → look up skill → streamText → SSE response
 */

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { cookies } from "next/headers";
import { SKILLS_MAP } from "@/lib/skills";

const GATE_PASSWORD = process.env.GATE_PASSWORD ?? "";

export async function POST(request: Request) {
  // Validate gate cookie
  const cookieStore = await cookies();
  const gateToken = cookieStore.get("pixel-office-gate")?.value;
  if (!gateToken || gateToken !== "authenticated") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { skillId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { skillId, message } = body;

  if (!skillId || typeof skillId !== "string") {
    return new Response(JSON.stringify({ error: "skillId required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const skill = SKILLS_MAP[skillId];
  if (!skill) {
    return new Response(JSON.stringify({ error: "Unknown skill" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = message?.trim() || skill.demoPrompt;

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: skill.systemPrompt,
    prompt,
    maxTokens: 512,
  });

  return result.toDataStreamResponse();
}
