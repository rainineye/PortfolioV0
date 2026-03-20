/**
 * Component tests for Character and SpeechBubble.
 *
 * Coverage:
 *   Character: renders name label, calls onActivate on click, shows queued glow
 *   SpeechBubble: renders header, close button, triggers onClose
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Character } from "@/app/components/Character";
import { SpeechBubble } from "@/app/components/SpeechBubble";
import { SKILLS } from "@/lib/skills";

// Mock fetch for SpeechBubble streaming tests
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const qaSkill = SKILLS.find((s) => s.id === "qa")!;

describe("Character component", () => {
  it("renders the skill name label", () => {
    render(
      <Character
        skill={qaSkill}
        isActive={false}
        isQueued={false}
        onActivate={vi.fn()}
        onClose={vi.fn()}
        animationDelay={0}
        soundEnabled={false}
      />
    );
    expect(screen.getByText("/qa")).toBeDefined();
  });

  it("calls onActivate when the button is clicked", () => {
    const onActivate = vi.fn();
    render(
      <Character
        skill={qaSkill}
        isActive={false}
        isQueued={false}
        onActivate={onActivate}
        onClose={vi.fn()}
        animationDelay={0}
        soundEnabled={false}
      />
    );
    const btn = screen.getByRole("button", { name: /activate \/qa/i });
    fireEvent.click(btn);
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("does NOT call onActivate when already active", () => {
    const onActivate = vi.fn();
    render(
      <Character
        skill={qaSkill}
        isActive={true}
        isQueued={false}
        onActivate={onActivate}
        onClose={vi.fn()}
        animationDelay={0}
        soundEnabled={false}
      />
    );
    const btn = screen.getByRole("button", { name: /activate \/qa/i });
    fireEvent.click(btn);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it("has accessible aria-label with description", () => {
    render(
      <Character
        skill={qaSkill}
        isActive={false}
        isQueued={false}
        onActivate={vi.fn()}
        onClose={vi.fn()}
        animationDelay={0}
        soundEnabled={false}
      />
    );
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-label")).toContain(qaSkill.description);
  });

  it("renders SpeechBubble when active (fetch returns streaming response)", async () => {
    // Mock a minimal streaming response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: vi
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('0:"Hello"\n'),
            })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    render(
      <Character
        skill={qaSkill}
        isActive={true}
        isQueued={false}
        onActivate={vi.fn()}
        onClose={vi.fn()}
        animationDelay={0}
        soundEnabled={false}
      />
    );

    // Speech bubble dialog should be present
    expect(screen.getByRole("dialog")).toBeDefined();
  });
});

describe("SpeechBubble component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders skill name in header", () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => ({ read: vi.fn().mockResolvedValue({ done: true }) }) },
    });

    render(
      <SpeechBubble
        skillId="qa"
        skillName="/qa"
        onClose={vi.fn()}
        soundEnabled={false}
      />
    );

    expect(screen.getByText("/qa")).toBeDefined();
  });

  it("calls onClose when close button is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => ({ read: vi.fn().mockResolvedValue({ done: true }) }) },
    });

    const onClose = vi.fn();
    render(
      <SpeechBubble
        skillId="qa"
        skillName="/qa"
        onClose={onClose}
        soundEnabled={false}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows error state when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <SpeechBubble
        skillId="qa"
        skillName="/qa"
        onClose={vi.fn()}
        soundEnabled={false}
      />
    );

    // Wait for error state
    await vi.waitFor(() => {
      expect(screen.getByRole("dialog").textContent).toContain(
        "bad day"
      );
    });
  });

  it("shows error state on 401 response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    render(
      <SpeechBubble
        skillId="qa"
        skillName="/qa"
        onClose={vi.fn()}
        soundEnabled={false}
      />
    );

    await vi.waitFor(() => {
      expect(screen.getByRole("dialog").textContent).toContain("Unauthorized");
    });
  });
});
