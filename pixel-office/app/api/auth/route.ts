/**
 * POST /api/auth
 *
 * Validates the gate password and sets a session cookie.
 * Password is stored in GATE_PASSWORD env var.
 */

import { cookies } from "next/headers";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { password } = body;
  const expected = process.env.GATE_PASSWORD ?? "";

  if (!password || password !== expected) {
    // Small delay to slow brute force
    await new Promise((r) => setTimeout(r, 300));
    return new Response(JSON.stringify({ error: "Wrong password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookieStore = await cookies();
  cookieStore.set("pixel-office-gate", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
