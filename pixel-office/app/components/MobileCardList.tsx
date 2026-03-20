/**
 * MobileCardList — Vertical card list for < 768px screens.
 *
 * Desktop shows the isometric office; mobile shows a scrollable list
 * of skill cards. Each card shows:
 *   - Character sprite (or placeholder)
 *   - Skill name (Press Start 2P)
 *   - Description (VT323)
 *   - Tap → activates the speech bubble panel below
 *
 * Layout:
 *   +------------------+
 *   | [sprite]  /qa    |
 *   |  Systematically  |  ← tapped
 *   |  QA test...      |
 *   +------------------+
 *   | [bubble panel]   |
 *   +------------------+
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import type { Skill } from "@/lib/skills";
import { SpeechBubble } from "./SpeechBubble";

interface MobileCardListProps {
  skills: Skill[];
  soundEnabled: boolean;
}

function placeholderColor(id: string): string {
  const palette = [
    "#C8A87A","#8B6914","#5C3A1E","#87CEEB","#E8D5B0",
    "#A0C080","#D08040","#6080C0","#C060A0","#80B080",
    "#D0A050","#8090D0","#B07070","#70B0A0","#C09060",
    "#9070B0","#B0C070","#70A0C0","#C07090","#A0B060",
    "#8060A0",
  ];
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

export function MobileCardList({ skills, soundEnabled }: MobileCardListProps) {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  function handleActivate(id: string) {
    setActiveSkillId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      style={{
        padding: "16px 12px",
        paddingBottom: 80,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: "100vh",
        background: "#1a1206",
      }}
    >
      <h1
        className="font-pixel text-center"
        style={{ fontSize: 8, color: "#FFF8E7", marginBottom: 8 }}
      >
        gstack office
      </h1>

      {skills.map((skill) => {
        const isActive = activeSkillId === skill.id;

        return (
          <div key={skill.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Card */}
            <button
              onClick={() => handleActivate(skill.id)}
              className="pixel-border"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: isActive ? "#E8D5B0" : "var(--bubble-bg)",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: 2,
                minHeight: 64,
              }}
              aria-label={`Activate ${skill.name} skill — ${skill.description}`}
              aria-expanded={isActive}
            >
              {/* Sprite or placeholder */}
              <div
                style={{
                  width: 48,
                  height: 64,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <Image
                  src={skill.sprite}
                  alt=""
                  width={48}
                  height={64}
                  className="pixel"
                  aria-hidden
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Placeholder */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: placeholderColor(skill.id),
                    border: "2px solid #2C1810",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: -1,
                  }}
                  aria-hidden
                >
                  <span className="font-pixel" style={{ fontSize: 5, color: "#2C1810" }}>
                    {skill.id.slice(0, 4)}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="font-pixel"
                  style={{ fontSize: 8, color: "var(--text)", marginBottom: 6 }}
                >
                  {skill.name}
                </div>
                <div
                  className="font-vt"
                  style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.3 }}
                >
                  {skill.description}
                </div>
              </div>

              {/* Arrow indicator */}
              <span
                className="font-pixel"
                style={{ fontSize: 8, color: "var(--text)", transform: isActive ? "rotate(90deg)" : "none", transition: "transform 0.1s" }}
                aria-hidden
              >
                ▶
              </span>
            </button>

            {/* Expanded bubble panel */}
            {isActive && (
              <div style={{ paddingLeft: 12 }}>
                <SpeechBubble
                  skillId={skill.id}
                  skillName={skill.name}
                  onClose={() => setActiveSkillId(null)}
                  tailSide="left"
                  soundEnabled={soundEnabled}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
