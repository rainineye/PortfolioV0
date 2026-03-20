/**
 * Tests for POST /api/invoke-skill route logic.
 *
 * We test the validation layer without calling the real Claude API:
 *   - Missing skillId → 400
 *   - Unknown skillId → 400
 *   - Missing gate cookie → 401
 *   - Valid request but no API key → 503
 *
 * The actual streaming path is tested via integration/E2E tests.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers to control cookie values
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock ai and @ai-sdk/anthropic to avoid real API calls
const mockStreamResult = {
  toDataStreamResponse: () => new Response("stream", { status: 200 }),
};
vi.mock("ai", () => ({
  streamText: vi.fn(() => mockStreamResult),
}));
vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "mocked-model"),
}));

import { cookies } from "next/headers";
import { POST } from "@/app/api/invoke-skill/route";

function makeCookieStore(gateValue?: string) {
  return {
    get: (name: string) =>
      name === "pixel-office-gate" && gateValue
        ? { value: gateValue }
        : undefined,
  };
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/invoke-skill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  // clearAllMocks resets call counts but preserves mock implementations
  vi.clearAllMocks();
});

describe("POST /api/invoke-skill — auth validation", () => {
  it("returns 401 when gate cookie is missing", async () => {
    vi.mocked(cookies).mockResolvedValue(makeCookieStore() as never);
    const res = await POST(makeRequest({ skillId: "qa" }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 when gate cookie has wrong value", async () => {
    vi.mocked(cookies).mockResolvedValue(
      makeCookieStore("wrong-token") as never
    );
    const res = await POST(makeRequest({ skillId: "qa" }));
    expect(res.status).toBe(401);
  });
});

describe("POST /api/invoke-skill — input validation", () => {
  beforeEach(() => {
    vi.mocked(cookies).mockResolvedValue(
      makeCookieStore("authenticated") as never
    );
  });

  it("returns 400 when skillId is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("skillId required");
  });

  it("returns 400 when skillId is unknown", async () => {
    const res = await POST(makeRequest({ skillId: "nonexistent-skill" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Unknown skill");
  });

  it("returns 400 when body is invalid JSON", async () => {
    vi.mocked(cookies).mockResolvedValue(
      makeCookieStore("authenticated") as never
    );
    const req = new Request("http://localhost/api/invoke-skill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{{{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 503 when ANTHROPIC_API_KEY is not set", async () => {
    const original = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    const res = await POST(makeRequest({ skillId: "qa" }));
    expect(res.status).toBe(503);
    process.env.ANTHROPIC_API_KEY = original;
  });

  it("calls streamText with valid skill and returns 200", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    const { streamText } = await import("ai");
    const res = await POST(makeRequest({ skillId: "qa" }));
    expect(res.status).toBe(200);
    expect(streamText).toHaveBeenCalledOnce();
    // Verify system prompt is passed
    const call = vi.mocked(streamText).mock.calls[0][0];
    expect(call.system).toContain("/qa");
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("uses skill demoPrompt when no message provided", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    const { streamText } = await import("ai");
    await POST(makeRequest({ skillId: "ship" }));
    const call = vi.mocked(streamText).mock.calls[0][0];
    expect(call.prompt).toContain("PR description");
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("uses custom message when provided", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    const { streamText } = await import("ai");
    await POST(makeRequest({ skillId: "qa", message: "Test my login form" }));
    const call = vi.mocked(streamText).mock.calls[0][0];
    expect(call.prompt).toBe("Test my login form");
    delete process.env.ANTHROPIC_API_KEY;
  });
});
