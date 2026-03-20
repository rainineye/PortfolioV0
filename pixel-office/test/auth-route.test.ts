/**
 * Tests for POST /api/auth — password gate.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: mockSet,
    })
  ),
}));

import { POST } from "@/app/api/auth/route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.GATE_PASSWORD = "test-secret";
});

describe("POST /api/auth", () => {
  it("returns 200 and sets cookie for correct password", async () => {
    const res = await POST(makeRequest({ password: "test-secret" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockSet).toHaveBeenCalledWith(
      "pixel-office-gate",
      "authenticated",
      expect.objectContaining({ httpOnly: true })
    );
  });

  it("returns 401 for wrong password", async () => {
    const res = await POST(makeRequest({ password: "wrong" }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Wrong password");
  });

  it("returns 401 for empty password", async () => {
    const res = await POST(makeRequest({ password: "" }));
    expect(res.status).toBe(401);
  });

  it("returns 401 for missing password field", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{{not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("does NOT set cookie for wrong password", async () => {
    await POST(makeRequest({ password: "hacker" }));
    expect(mockSet).not.toHaveBeenCalled();
  });
});
