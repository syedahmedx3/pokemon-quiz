import { DIFF_CFG, TCOLOR } from "../constants/config.js";
import { getGrade } from "../utils/game.js";
import { cap, hexRgb } from "../utils/helpers.js";
import TypeBadge from "./atoms/TypeBadge.jsx";

export default function Results({ data, onHome, onRetry }) {
  const { score, results, diff } = data;
  const numCorrect = results.filter((r) => r.correct).length;
  const pct        = Math.round((numCorrect / results.length) * 100);
  const { g, c: gc, t: gt, s: gs } = getGrade(pct);

  /* Best streak */
  const maxStreak = (() => {
    let s = 0, mx = 0;
    results.forEach((r) => {
      if (r.correct) { s++; mx = Math.max(mx, s); }
      else s = 0;
    });
    return mx;
  })();

  /* Average answer time (excluding timeouts) */
  const avgTime = (() => {
    const answered = results.filter((r) => r.sel !== null);
    if (!answered.length) return 0;
    const totalUsed = answered.reduce(
      (a, r) => a + (DIFF_CFG[diff].time - r.tLeft),
      0
    );
    return Math.round(totalUsed / answered.length);
  })();

  return (
    <div
      className="fu"
      style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}
    >
      {/* ── Grade circle ── */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          className="sci"
          style={{
            width: 118,
            height: 118,
            borderRadius: "50%",
            margin: "0 auto 18px",
            background: `rgba(${hexRgb(gc)},.11)`,
            border: `3px solid ${gc}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 50px rgba(${hexRgb(gc)},.32), inset 0 0 30px rgba(${hexRgb(gc)},.08)`,
          }}
        >
          <span
            style={{
              fontFamily: "'Press Start 2P',monospace",
              fontSize: 46,
              color: gc,
              lineHeight: 1,
            }}
          >
            {g}
          </span>
        </div>
        <div style={{ fontSize: 23, fontWeight: 900, color: gc, marginBottom: 5 }}>
          {gt}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
          {gs}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.26)" }}>
          {numCorrect}/{results.length} correct · {pct}% accuracy
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 11,
          marginBottom: 22,
        }}
      >
        {[
          { k: "FINAL SCORE",  v: score,       c: "#fbbf24" },
          { k: "ACCURACY",     v: `${pct}%`,   c: gc },
          { k: "BEST STREAK",  v: `×${maxStreak}`, c: "#fb923c" },
          { k: "AVG ANSWER",   v: `${avgTime}s`,   c: "#60a5fa" },
        ].map((s) => (
          <div
            key={s.k}
            className="glass"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.8,
                color: "rgba(255,255,255,.28)",
                marginBottom: 8,
              }}
            >
              {s.k}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.c }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      {/* ── Difficulty badge ── */}
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: `rgba(${hexRgb(DIFF_CFG[diff].color)},.12)`,
            border: `1px solid rgba(${hexRgb(DIFF_CFG[diff].color)},.3)`,
            borderRadius: 10,
            padding: "6px 16px",
            fontSize: 11,
            fontWeight: 700,
            color: DIFF_CFG[diff].color,
          }}
        >
          {diff === "easy" ? "🟢" : diff === "medium" ? "🟡" : "🔴"}{" "}
          {DIFF_CFG[diff].label} · {DIFF_CFG[diff].sub}
        </span>
      </div>

      {/* ── Question recap ── */}
      <div className="card" style={{ padding: "18px 18px 14px", marginBottom: 22 }}>
        <div className="lbl">QUESTION RECAP</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "10px 12px",
                borderRadius: 12,
                background: r.correct
                  ? "rgba(74,222,128,.065)"
                  : "rgba(248,113,113,.065)",
                border: `1px solid ${
                  r.correct
                    ? "rgba(74,222,128,.18)"
                    : "rgba(248,113,113,.18)"
                }`,
              }}
            >
              {/* Q number */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  flexShrink: 0,
                  background: "rgba(255,255,255,.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,.4)",
                }}
              >
                {i + 1}
              </div>

              {/* Sprite */}
              <img
                src={r.q.pk.sprite}
                alt={cap(r.q.pk.name)}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  flexShrink: 0,
                  filter: r.correct ? "none" : "grayscale(.55)",
                }}
              />

              {/* Name + types */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cap(r.q.pk.name)}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    marginTop: 4,
                    flexWrap: "wrap",
                  }}
                >
                  {r.q.pk.types.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: TCOLOR[t] || "#555",
                        color: "#fff",
                        padding: "1px 7px",
                        borderRadius: 8,
                        fontSize: 8.5,
                        fontWeight: 700,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Points / wrong guess */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: r.correct ? "#4ade80" : "#f87171",
                  }}
                >
                  {r.correct ? `+${r.pts}` : "✗"}
                </div>
                {!r.correct && r.sel && (
                  <div
                    style={{
                      fontSize: 9.5,
                      color: "rgba(255,255,255,.3)",
                      marginTop: 2,
                    }}
                  >
                    {r.q.mode === "type" ? r.sel : cap(r.sel)}
                  </div>
                )}
                {!r.correct && !r.sel && (
                  <div
                    style={{
                      fontSize: 9.5,
                      color: "rgba(255,255,255,.28)",
                      marginTop: 2,
                    }}
                  >
                    timeout
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contextual messages ── */}
      {pct < 65 && (
        <div
          className="glow-card"
          style={{ padding: "14px 18px", marginBottom: 22, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(180,175,255,.85)",
              lineHeight: 1.7,
            }}
          >
            💡 Tip: Study type matchups and Gen I Pokémon first — they appear most in all difficulties!
          </div>
        </div>
      )}
      {pct >= 90 && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: 22,
            textAlign: "center",
            background: "rgba(255,215,0,.08)",
            border: "1px solid rgba(255,215,0,.25)",
            borderRadius: 18,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>
            🏅 S-Rank! You're a true Pokémon Master!
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <button
          onClick={onRetry}
          className="shimmer-btn"
          style={{
            padding: "17px",
            borderRadius: 15,
            border: "none",
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            boxShadow: "0 8px 30px rgba(99,102,241,.45)",
            letterSpacing: 0.5,
          }}
        >
          PLAY AGAIN →
        </button>
        <button
          onClick={onHome}
          style={{
            padding: "15px",
            borderRadius: 15,
            background: "rgba(255,255,255,.05)",
            border: "1.5px solid rgba(255,255,255,.1)",
            color: "rgba(255,255,255,.62)",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ← Change Settings
        </button>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 9,
          color: "rgba(255,255,255,.15)",
          letterSpacing: 1.5,
          marginTop: 22,
        }}
      >
        POWERED BY POKÉAPI.CO
      </p>
    </div>
  );
}
