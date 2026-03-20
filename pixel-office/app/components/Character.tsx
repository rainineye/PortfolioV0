/**
 * Character — A single pixel-art character in the office.
 *
 * Rendering:
 *   - Uses CSS background-position cycling for frame animation (image-rendering: pixelated)
 *   - Falls back to a colored placeholder div if sprite PNG not found
 *   - Sprite sheet layout: horizontal strip, row 0 = idle, row 1 = talking
 *
 * States: idle | hover | activated | loading | streaming | error | queued
 *
 * Entry animation: pop-in with staggered delay (set via animationDelay prop)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { Skill } from "@/lib/skills";
import { SpeechBubble } from "./SpeechBubble";

interface CharacterProps {
  skill: Skill;
  isActive: boolean;          // this character has the current bubble
  isQueued: boolean;          // waiting in queue
  onActivate: () => void;     // called when user clicks
  animationDelay: number;     // ms delay for entry animation
  soundEnabled: boolean;
  onClose: () => void;
}

/** Pastel color per skill ID for placeholders */
function placeholderColor(id: string): string {
  const palette = [
    "#C8A87A", "#8B6914", "#5C3A1E", "#87CEEB", "#E8D5B0",
    "#A0C080", "#D08040", "#6080C0", "#C060A0", "#80B080",
    "#D0A050", "#8090D0", "#B07070", "#70B0A0", "#C09060",
    "#9070B0", "#B0C070", "#70A0C0", "#C07090", "#A0B060",
    "#8060A0",
  ];
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

export function Character({
  skill,
  isActive,
  isQueued,
  onActivate,
  animationDelay,
  soundEnabled,
  onClose,
}: CharacterProps) {
  const [spriteLoaded, setSpriteLoaded] = useState(false);
  const [talkingRow, setTalkingRow] = useState(false);
  const [shaking, setShaking] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Switch to talking animation when active
  useEffect(() => {
    setTalkingRow(isActive);
  }, [isActive]);

  function handleActivate() {
    if (isActive) return; // already active
    onActivate();
  }

  // Talking sprite row: y-offset = frameHeight (row 1)
  const spriteY = talkingRow ? -skill.frameHeight : 0;
  const totalSpriteWidth = skill.frameWidth * skill.idleFrames;
  const animDuration = skill.animationSpeed * skill.idleFrames;

  /*
   * CSS animation cycles through horizontal frames using steps():
   *
   *  Frame 0   Frame 1   Frame 2   Frame 3
   *  [48px] → [96px] → [144px] → [192px] → wrap
   *
   * background-position-x moves by -frameWidth per step.
   */
  const spriteStyle: React.CSSProperties = {
    width: skill.frameWidth * 2,
    height: skill.frameHeight * 2,
    backgroundImage: `url(${skill.sprite})`,
    backgroundSize: `${totalSpriteWidth * 2}px auto`,
    backgroundPositionY: `${spriteY * 2}px`,
    backgroundPositionX: "0px",
    imageRendering: "pixelated",
    animation: `sprite-idle ${animDuration}ms steps(${skill.idleFrames}) infinite`,
    ["--frame-width" as string]: `${skill.frameWidth * 2}px`,
  };

  return (
    <div
      className="character-enter"
      style={{
        position: "absolute",
        left: skill.position.left,
        top: skill.position.top,
        transform: "translate(-50%, -100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        animationDelay: `${animationDelay}ms`,
        zIndex: isActive ? 50 : 10,
      }}
    >
      {/* Speech bubble — above character */}
      {isActive && (
        <div style={{ marginBottom: 4 }}>
          <SpeechBubble
            skillId={skill.id}
            skillName={skill.name}
            onClose={onClose}
            tailSide="left"
            soundEnabled={soundEnabled}
            onError={() => {
              setShaking(true);
              setTimeout(() => setShaking(false), 500);
            }}
          />
        </div>
      )}

      {/* Skill name label */}
      <span
        className="font-pixel"
        style={{
          fontSize: 6,
          color: "#FFF8E7",
          background: "rgba(44,24,16,0.75)",
          padding: "2px 4px",
          borderRadius: 2,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
        aria-hidden
      >
        {skill.name}
      </span>

      {/* Character sprite / placeholder */}
      <button
        onClick={handleActivate}
        className={`relative pixel-border ${isQueued ? "character-queued" : ""} ${shaking ? "character-shake" : ""}`}
        style={{
          padding: 0,
          background: "transparent",
          border: "none",
          cursor: isActive ? "default" : "pointer",

          minWidth: skill.frameWidth * 2,
          minHeight: skill.frameHeight * 2,
        }}
        aria-label={`Activate ${skill.name} skill — ${skill.description}`}
        title={skill.description}
        onKeyDown={(e) => e.key === "Enter" && handleActivate()}
      >
        {/* Sprite (shown if loaded) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={skill.sprite}
          alt=""
          aria-hidden
          onLoad={() => setSpriteLoaded(true)}
          onError={() => setSpriteLoaded(false)}
          style={{ display: "none" }}
        />
        {spriteLoaded ? (
          <div
            style={spriteStyle}
            className="pixel"
            aria-hidden
          />
        ) : (
          /* Pixel placeholder when sprite not yet generated */
          <div
            style={{
              width: skill.frameWidth * 2,
              height: skill.frameHeight * 2,
              background: placeholderColor(skill.id),
              border: "2px solid var(--bubble-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
            aria-hidden
          >
            <span className="font-pixel text-center" style={{ fontSize: 5, color: "#2C1810", padding: "0 2px", lineHeight: 1.5 }}>
              {skill.id.slice(0, 6)}
            </span>
          </div>
        )}

        {/* Active glow overlay */}
        {isActive && (
          <div
            style={{
              position: "absolute",
              inset: -2,
              border: "2px solid #F5E642",
              pointerEvents: "none",
            }}
            aria-hidden
          />
        )}
      </button>
    </div>
  );
}
