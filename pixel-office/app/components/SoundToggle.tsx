/**
 * SoundToggle — Pixel art mute/unmute button.
 * Persists state in localStorage.
 */

"use client";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="pixel-border font-pixel"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        background: "rgba(44,24,16,0.85)",
        color: "#FFF8E7",
        fontSize: 8,
        padding: "6px 10px",
        cursor: "pointer",
        zIndex: 200,
        borderRadius: 2,
      }}
      aria-label={enabled ? "Mute typing sounds" : "Enable typing sounds"}
      title={enabled ? "Mute sounds" : "Enable sounds"}
    >
      {enabled ? "♪ on" : "♪ off"}
    </button>
  );
}
