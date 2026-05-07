import { DIFF_CFG, TOTAL_Q } from "../constants/config.js";
import { hexRgb } from "../utils/helpers.js";

const MODES = [
  {
    k: "silhouette",
    icon: "🌑",
    t: "Who's That Pokémon?",
    d: "Identify from the shadow — the classic challenge",
  },
  {
    k: "type",
    icon: "⚡",
    t: "Type Expert",
    d: "Name the primary type of each Pokémon",
  },
  {
    k: "mixed",
    icon: "🎲",
    t: "Mixed Challenge",
    d: "Both modes combined — the ultimate knowledge test",
  },
];

export default function Home({ mode, setMode, diff, setDiff, best, onStart }) {
  return (
    <div
      style={{
        padding: "24px 16px",
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* ── Hero ── */}
      <div className="fu" style={{ textAlign: "center", paddingTop: 16 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
            background: "rgba(99,102,241,.14)",
            border: "1px solid rgba(99,102,241,.32)",
            borderRadius: 30,
            padding: "5px 16px",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: 2,
            color: "rgba(180,175,255,.9)",
          }}
        >
          ⭐ PROFESSOR OAK'S ACADEMY
        </div>

        <h1
          className="shimmer-text"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(14px, 3.4vw, 21px)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          POKÉMON
          <br />
          KNOWLEDGE
          <br />
          TEST
        </h1>

        <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13.5, lineHeight: 1.8 }}>
          How well do you{" "}
          <span style={{ color: "rgba(180,175,255,.75)", fontWeight: 700 }}>
            really
          </span>{" "}
          know your Pokémon?
          <br />
          Prove it across {TOTAL_Q} timed questions.
        </p>

        {best > 0 && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              background: "rgba(245,158,11,.09)",
              border: "1px solid rgba(245,158,11,.25)",
              borderRadius: 12,
              padding: "7px 18px",
              fontSize: 12,
              color: "#fbbf24",
              fontWeight: 700,
            }}
          >
            🏆 Personal Best: {best}
          </div>
        )}
      </div>

      {/* ── Mode selector ── */}
      <div className="fu stagger">
        <div className="lbl">SELECT QUIZ MODE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MODES.map((m) => {
            const active = mode === m.k;
            return (
              <button
                key={m.k}
                onClick={() => setMode(m.k)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 16,
                  textAlign: "left",
                  width: "100%",
                  background: active
                    ? "rgba(99,102,241,.17)"
                    : "rgba(255,255,255,.035)",
                  border: active
                    ? "1.5px solid rgba(99,102,241,.58)"
                    : "1.5px solid rgba(255,255,255,.08)",
                  color: "#e8e8ff",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: active
                      ? "rgba(99,102,241,.28)"
                      : "rgba(255,255,255,.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    transition: "background .2s",
                  }}
                >
                  {m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>
                    {m.t}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.36)",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.d}
                  </div>
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: active ? "#6366f1" : "rgba(255,255,255,.07)",
                    border: active ? "none" : "1px solid rgba(255,255,255,.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "#fff",
                    transition: "all .2s",
                  }}
                >
                  {active ? "✓" : ""}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Difficulty ── */}
      <div className="fu">
        <div className="lbl">DIFFICULTY</div>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}
        >
          {Object.entries(DIFF_CFG).map(([k, d]) => {
            const active = diff === k;
            return (
              <button
                key={k}
                onClick={() => setDiff(k)}
                style={{
                  padding: "14px 8px",
                  borderRadius: 14,
                  textAlign: "center",
                  background: active
                    ? `rgba(${hexRgb(d.color)},.15)`
                    : "rgba(255,255,255,.035)",
                  border: active
                    ? `1.5px solid ${d.color}`
                    : "1.5px solid rgba(255,255,255,.08)",
                  color: active ? d.color : "rgba(255,255,255,.42)",
                  transition: "all .2s",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800 }}>{d.label}</div>
                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.75 }}>
                  {d.sub}
                </div>
                <div style={{ fontSize: 10, marginTop: 3, opacity: 0.5 }}>
                  ⏱ {d.time}s / Q
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Feature strip ── */}
      <div
        className="glass"
        style={{
          padding: "14px 10px",
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
        }}
      >
        {[
          ["📝", "10 Qs"],
          ["🔥", "Streaks"],
          ["⏱", "Time Bonus"],
          ["🎖", "S–D Grade"],
        ].map(([icon, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 5 }}>{icon}</div>
            <div
              style={{
                fontSize: 9.5,
                color: "rgba(255,255,255,.38)",
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Start CTA ── */}
      <button
        onClick={onStart}
        className="shimmer-btn"
        style={{
          padding: "18px",
          borderRadius: 16,
          border: "none",
          color: "#fff",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 0.5,
          boxShadow: "0 8px 36px rgba(99,102,241,.45)",
        }}
      >
        START THE TEST →
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 9,
          color: "rgba(255,255,255,.18)",
          letterSpacing: 1.5,
        }}
      >
        {TOTAL_Q} QUESTIONS · POWERED BY POKÉAPI.CO
      </p>
    </div>
  );
}
