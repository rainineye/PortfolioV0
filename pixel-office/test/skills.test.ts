/**
 * Tests for lib/skills.ts — the single source of truth for all 21 skills.
 */

import { describe, it, expect } from "vitest";
import { SKILLS, SKILLS_MAP } from "@/lib/skills";

describe("SKILLS array", () => {
  it("contains exactly 21 skills", () => {
    expect(SKILLS).toHaveLength(21);
  });

  it("every skill has required fields", () => {
    for (const skill of SKILLS) {
      expect(skill.id, `${skill.id} missing id`).toBeTruthy();
      expect(skill.name, `${skill.id} missing name`).toMatch(/^\//);
      expect(skill.description, `${skill.id} missing description`).toBeTruthy();
      expect(skill.demoPrompt, `${skill.id} missing demoPrompt`).toBeTruthy();
      expect(skill.systemPrompt, `${skill.id} missing systemPrompt`).toBeTruthy();
      expect(skill.sprite, `${skill.id} missing sprite`).toMatch(/^\/sprites\//);
      expect(skill.frameWidth, `${skill.id} missing frameWidth`).toBeGreaterThan(0);
      expect(skill.frameHeight, `${skill.id} missing frameHeight`).toBeGreaterThan(0);
      expect(skill.idleFrames, `${skill.id} missing idleFrames`).toBeGreaterThan(0);
      expect(skill.talkingFrames, `${skill.id} missing talkingFrames`).toBeGreaterThan(0);
      expect(skill.animationSpeed, `${skill.id} missing animationSpeed`).toBeGreaterThan(0);
      expect(skill.position.left, `${skill.id} missing position.left`).toMatch(/%$/);
      expect(skill.position.top, `${skill.id} missing position.top`).toMatch(/%$/);
    }
  });

  it("all skill IDs are unique", () => {
    const ids = SKILLS.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(SKILLS.length);
  });

  it("all skill names are unique", () => {
    const names = SKILLS.map((s) => s.name);
    const unique = new Set(names);
    expect(unique.size).toBe(SKILLS.length);
  });

  it("system prompts are non-trivial (>20 chars each)", () => {
    for (const skill of SKILLS) {
      expect(
        skill.systemPrompt.length,
        `${skill.id} systemPrompt too short`
      ).toBeGreaterThan(20);
    }
  });

  it("positions are valid percentages (5–95%)", () => {
    for (const skill of SKILLS) {
      const left = parseFloat(skill.position.left);
      const top = parseFloat(skill.position.top);
      expect(left, `${skill.id} left out of range`).toBeGreaterThanOrEqual(5);
      expect(left, `${skill.id} left out of range`).toBeLessThanOrEqual(95);
      expect(top, `${skill.id} top out of range`).toBeGreaterThanOrEqual(25);
      expect(top, `${skill.id} top out of range`).toBeLessThanOrEqual(95);
    }
  });
});

describe("SKILLS_MAP", () => {
  it("indexes every skill by id", () => {
    expect(Object.keys(SKILLS_MAP)).toHaveLength(21);
    for (const skill of SKILLS) {
      expect(SKILLS_MAP[skill.id]).toBe(skill);
    }
  });

  it("returns undefined for unknown ids", () => {
    expect(SKILLS_MAP["nonexistent"]).toBeUndefined();
  });
});
