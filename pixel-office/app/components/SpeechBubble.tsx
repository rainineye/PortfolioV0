/**
 * SpeechBubble — Pixel-art speech bubble showing streaming Claude output.
 *
 * States:
 *   loading   → shows "..." blinking cursor
 *   streaming → text flows in word-by-word, blinking cursor at end
 *   done      → text complete, copy button appears
 *   error     → in-character error message
 *
 * Design tokens: bubble-bg (#FFF8E7), bubble-border (#2C1810), VT323 16-18px
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechBubbleProps {
  skillId: string;
  skillName: string;
  onClose: () => void;
  /** Which side the bubble tail points toward the character */
  tailSide?: "left" | "right";
  soundEnabled: boolean;
  /** Called when the stream errors — triggers shake animation on the Character */
  onError?: () => void;
}

/** Lightweight tick sound (base64 encoded beep) */
function playTick() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Audio not available — silent fail
  }
}

export function SpeechBubble({
  skillId,
  skillName,
  onClose,
  tailSide = "left",
  soundEnabled,
  onError,
}: SpeechBubbleProps) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"loading" | "streaming" | "done" | "error">(
    "loading"
  );
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastTickRef = useRef(0);

  const startStream = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setText("");
    setStatus("loading");

    try {
      const res = await fetch("/api/invoke-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setText(
          `Hmm, something went wrong on my end.\n(${err.error ?? res.status})`
        );
        setStatus("error");
        onError?.();
        return;
      }

      setStatus("streaming");

      // Vercel AI SDK data stream format — parse text chunks
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          // AI SDK format: `0:"chunk text"`
          if (line.startsWith('0:"')) {
            const raw = line.slice(3, -1);
            const chunk = raw
              .replace(/\\n/g, "\n")
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, "\\");
            setText((prev) => prev + chunk);

            // Tick sound: throttled to ~30 ticks/sec
            if (soundEnabled) {
              const now = Date.now();
              if (now - lastTickRef.current > 33) {
                lastTickRef.current = now;
                playTick();
              }
            }
          }
        }
      }

      setStatus("done");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setText("I seem to be having a bad day...\nTry clicking me again.");
      setStatus("error");
      onError?.();
    }
  }, [skillId, soundEnabled, onError]);

  useEffect(() => {
    startStream();
    return () => {
      abortRef.current?.abort();
    };
  }, [startStream]);

  // Auto-scroll on new text
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  async function handleCopy() {
    await navigator.clipboard.writeText(text).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const tailClass =
    tailSide === "left" ? "bubble-tail-left" : "bubble-tail-right";

  return (
    <div
      className={`${tailClass} relative pixel-border`}
      style={{
        background: "var(--bubble-bg)",
        borderRadius: 4,
        padding: "10px 12px",
        width: 280,
        maxHeight: 220,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        zIndex: 100,
      }}
      role="dialog"
      aria-label={`${skillName} response`}
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ gap: 6 }}>
        <span
          className="font-pixel"
          style={{ fontSize: 7, color: "var(--text)", whiteSpace: "nowrap" }}
        >
          {skillName}
        </span>
        <button
          onClick={onClose}
          className="pixel-border font-pixel"
          style={{
            fontSize: 7,
            padding: "2px 5px",
            background: "#C8A87A",
            cursor: "pointer",
            lineHeight: 1,
            flexShrink: 0,
          }}
          aria-label="Close response"
        >
          ✕
        </button>
      </div>

      {/* Scrollable text area */}
      <div
        ref={scrollRef}
        className="font-vt overflow-y-auto"
        style={{
          fontSize: 17,
          lineHeight: 1.35,
          color: "var(--text)",
          flex: 1,
          minHeight: 60,
          maxHeight: 150,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {status === "loading" && (
          <span className="cursor-blink" style={{ opacity: 0.6 }}>
            &nbsp;
          </span>
        )}
        {text}
        {status === "streaming" && (
          <span className="cursor-blink" aria-hidden />
        )}
        {status === "error" && (
          <span style={{ color: "#CC2200" }}>{text || "Something went wrong."}</span>
        )}
      </div>

      {/* Footer: copy button when done */}
      {status === "done" && (
        <button
          onClick={handleCopy}
          className="pixel-border font-pixel"
          style={{
            alignSelf: "flex-start",
            fontSize: 7,
            padding: "3px 8px",
            background: copied ? "#5C3A1E" : "var(--desk)",
            color: "#FFF8E7",
            cursor: "pointer",
            borderRadius: 2,
          }}
          aria-label="Copy response to clipboard"
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      )}
    </div>
  );
}
