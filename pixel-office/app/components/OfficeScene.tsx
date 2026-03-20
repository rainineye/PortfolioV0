/**
 * OfficeScene — The full-screen isometric pixel office.
 *
 * Layout:
 *   - Full viewport background image (isometric pixel art office)
 *   - 21 Character components placed with CSS absolute positioning
 *   - Day/night CSS overlay driven by local time
 *   - Responsive: ≥768px shows office, <768px shows MobileCardList
 *
 * Character queue:
 *   Only one speech bubble at a time. If a character is clicked while
 *   another is active, the new one is queued (max 1 pending). The queued
 *   character activates immediately when the current bubble closes.
 *
 *  Active state machine:
 *    idle → click → active (bubble shown)
 *    active → click other → queue other, keep current active
 *    active → close bubble → if queue: activate queued; else idle
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SKILLS } from "@/lib/skills";
import { Character } from "./Character";
import { MobileCardList } from "./MobileCardList";
import { SoundToggle } from "./SoundToggle";

/**
 * Returns a CSS rgba overlay color based on the current hour (0-23).
 * Simulates a day/night cycle by darkening/warming the window.
 *
 *  hour  0-5:  deep night  (dark indigo overlay, opacity 0.55)
 *  hour  6-8:  dawn        (warm amber overlay, opacity 0.15)
 *  hour  9-17: day         (no overlay)
 *  hour 18-20: golden hour (amber overlay, opacity 0.20)
 *  hour 21-23: dusk→night  (dark indigo overlay, opacity 0.35-0.55)
 */
function getDayNightOverlay(hour: number): { color: string; opacity: number } {
  if (hour >= 0 && hour < 6)  return { color: "#1a1a3e", opacity: 0.55 };
  if (hour >= 6 && hour < 9)  return { color: "#FFB347", opacity: 0.15 };
  if (hour >= 9 && hour < 18) return { color: "transparent", opacity: 0 };
  if (hour >= 18 && hour < 21) return { color: "#FFB347", opacity: 0.22 };
  return { color: "#1a1a3e", opacity: 0.40 };
}

export function OfficeScene() {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [queuedSkillId, setQueuedSkillId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [dayNight, setDayNight] = useState(() =>
    getDayNightOverlay(new Date().getHours())
  );
  const [clockTime, setClockTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const hourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load sound preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pixel-office-sound");
      if (stored !== null) setSoundEnabled(stored === "true");
    } catch {}
  }, []);

  // Entry animation: small delay to let fonts/bg load
  useEffect(() => {
    const t = setTimeout(() => setSceneReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Update day/night every minute
  useEffect(() => {
    function tick() {
      const now = new Date();
      setDayNight(getDayNightOverlay(now.getHours()));
      setClockTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      // Re-fire at start of next minute
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      hourTimerRef.current = setTimeout(tick, msToNextMinute);
    }
    tick();
    return () => {
      if (hourTimerRef.current) clearTimeout(hourTimerRef.current);
    };
  }, []);

  function toggleSound() {
    setSoundEnabled((prev) => {
      const next = !prev;
      try { localStorage.setItem("pixel-office-sound", String(next)); } catch {}
      return next;
    });
  }

  const handleActivate = useCallback(
    (skillId: string) => {
      if (activeSkillId === null) {
        // No active skill — activate immediately
        setActiveSkillId(skillId);
      } else if (activeSkillId !== skillId) {
        // Replace any existing queue with the new skill (keep latest intent)
        setQueuedSkillId(skillId);
      }
    },
    [activeSkillId]
  );

  const handleClose = useCallback(() => {
    if (queuedSkillId) {
      setActiveSkillId(queuedSkillId);
      setQueuedSkillId(null);
    } else {
      setActiveSkillId(null);
    }
  }, [queuedSkillId]);

  // Keyboard: Escape closes active bubble
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && activeSkillId) {
        handleClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSkillId, handleClose]);

  if (isMobile) {
    return (
      <>
        <MobileCardList skills={SKILLS} soundEnabled={soundEnabled} />
        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      </>
    );
  }

  return (
    <main
      className="relative overflow-hidden"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Office background */}
      <div
        className="absolute inset-0 pixel"
        style={{
          backgroundImage: "url(/office-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
          // Fallback: warm floor color if image not yet generated
          background: `url(/office-bg.png) center/cover, #C8A87A`,
        }}
        aria-hidden
      />

      {/* Day/night overlay */}
      {dayNight.opacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: dayNight.color,
            opacity: dayNight.opacity,
            transition: "opacity 2s ease, background 2s ease",
            zIndex: 5,
          }}
          aria-hidden
        />
      )}

      {/* Characters */}
      {sceneReady &&
        SKILLS.map((skill, i) => (
          <Character
            key={skill.id}
            skill={skill}
            isActive={activeSkillId === skill.id}
            isQueued={queuedSkillId === skill.id}
            onActivate={() => handleActivate(skill.id)}
            onClose={handleClose}
            animationDelay={i * 80 + 300}
            soundEnabled={soundEnabled}
          />
        ))}

      {/* Ambient: clock in corner (decorative) */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 16,
          zIndex: 200,
        }}
        aria-label={`Current time: ${clockTime}`}
      >
        <span
          className="font-pixel"
          style={{ fontSize: 7, color: "rgba(255,248,231,0.7)" }}
        >
          {clockTime}
        </span>
      </div>

      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    </main>
  );
}
