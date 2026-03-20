/**
 * / — Password Gate
 *
 * Shows if the user has not authenticated.
 * Redirects to /office on success.
 *
 * Layout:
 *   - Office background blurred behind
 *   - Guard character (pixel art placeholder) centered
 *   - Speech bubble with password input below character
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Enter the passphrase...");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/office");
      } else {
        setError("Wrong passphrase. Try again.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ background: "#1a1206" }}
    >
      {/* Blurred office background hint */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url(/office-bg.png)",
          filter: "blur(4px)",
          imageRendering: "pixelated",
        }}
        aria-hidden
      />

      {/* Gate UI */}
      <div className="relative flex flex-col items-center gap-0 z-10">
        {/* Guard character */}
        <div
          className={`pixel ${shake ? "character-shake" : ""} transition-transform`}
          style={{ width: 96, height: 128, marginBottom: -4 }}
          aria-hidden
        >
          <Image
            src="/sprites/careful.png"
            alt="Gate guard"
            width={96}
            height={128}
            className="pixel"
            priority
            onError={(e) => {
              // Fallback: colored placeholder if sprite not found
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Pixel placeholder for when sprite not yet generated */}
          <div
            className="pixel-border"
            style={{
              width: 96,
              height: 128,
              background: "linear-gradient(135deg, #8B6914 50%, #5C3A1E 50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            aria-hidden
          >
            <span className="font-pixel text-center" style={{ fontSize: 8, color: "#FFF8E7" }}>
              /careful
            </span>
          </div>
        </div>

        {/* Speech bubble form */}
        <div
          className="bubble-tail-left relative pixel-border font-vt"
          style={{
            background: "var(--bubble-bg)",
            borderRadius: 4,
            padding: "16px 20px",
            minWidth: 260,
            maxWidth: 320,
          }}
          role="dialog"
          aria-label="Password gate"
        >
          <p
            className="font-pixel mb-3"
            style={{ fontSize: 8, color: "var(--text)", lineHeight: 1.8 }}
          >
            Enter the passphrase to enter the office.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="passphrase..."
              className="pixel-border font-vt"
              style={{
                background: "#fff",
                padding: "6px 10px",
                fontSize: 18,
                color: "var(--text)",
                outline: "none",
                borderRadius: 2,
                width: "100%",
                boxSizing: "border-box",
              }}
              autoFocus
              aria-label="Passphrase input"
              disabled={loading}
            />

            {error && (
              <p
                className="font-vt"
                style={{ fontSize: 16, color: "#CC2200", margin: 0 }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="pixel-border font-pixel"
              style={{
                background: loading ? "#8B6914" : "var(--desk)",
                color: "#FFF8E7",
                padding: "8px",
                fontSize: 8,
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 2,
                marginTop: 4,
              }}
              disabled={loading}
            >
              {loading ? "checking..." : "→ enter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
