import { useState, useEffect, useRef } from "react";
import { DIFF_CFG, TCOLOR, TOTAL_Q } from "../constants/config.js";
import { buildQ, preloadQ, calcPts, resolveMode } from "../utils/game.js";
import { cap, pad3, hexRgb } from "../utils/helpers.js";
import Spinner   from "./atoms/Spinner.jsx";
import LetterKey from "./atoms/LetterKey.jsx";
import TypeBadge from "./atoms/TypeBadge.jsx";
import StatBar   from "./atoms/StatBar.jsx";
import ScorePopup from "./atoms/ScorePopup.jsx";

export default function Quiz({ mode, diff, onDone }) {
  const maxT = DIFF_CFG[diff].time;

  /* ── Render state (drives UI) ────────────────────────────────── */
  const [q,         setQ]         = useState(null);
  const [qIdx,      setQIdx]      = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [sel,       setSel]       = useState(null);
  const [answered,  setAnswered]  = useState(false);
  const [score,     setScore]     = useState(0);
  const [streak,    setStreak]    = useState(0);
  const [lives,     setLives]     = useState(3);
  const [timeLeft,  setTimeLeft]  = useState(maxT);
  const [lastPts,   setLastPts]   = useState(0);
  const [correct,   setCorrect]   = useState(false);
  const [showStats, setShowStats] = useState(false);

  /* ── Mutable refs — no stale-closure issues ──────────────────── */
  const scoreR    = useRef(0);
  const streakR   = useRef(0);
  const livesR    = useRef(3);
  const answeredR = useRef(false);
  const qIdxR     = useRef(0);
  const qR        = useRef(null);
  const startT    = useRef(0);
  const resultsR  = useRef([]);
  const timerR    = useRef(null);
  const nextQR    = useRef(null);   // pre-loaded next question

  /* ── Answer handler (always reads latest state via refs) ─────── */
  const answerFn = useRef(null);
  answerFn.current = (val) => {
    if (answeredR.current) return;
    answeredR.current = true;
    clearInterval(timerR.current);

    const tLeft   = Math.max(0, maxT - (Date.now() - startT.current) / 1000);
    const isRight = val === qR.current.answer;

    setAnswered(true);
    setSel(val);
    setCorrect(isRight);

    let pts = 0;
    if (isRight) {
      pts = calcPts(tLeft, maxT, streakR.current);
      scoreR.current  += pts;
      streakR.current += 1;
      setScore(scoreR.current);
      setStreak(streakR.current);
      setLastPts(pts);
    } else {
      streakR.current = 0;
      livesR.current -= 1;
      setStreak(0);
      setLives(livesR.current);
    }

    resultsR.current.push({
      q:       qR.current,
      sel:     val,
      correct: isRight,
      pts,
      tLeft:   Math.round(tLeft),
    });

    // Advance after a short review pause
    setTimeout(() => {
      const next = qIdxR.current + 1;
      if (next >= TOTAL_Q || livesR.current <= 0) {
        onDone({
          score:   scoreR.current,
          results: resultsR.current,
          diff,
          mode,
        });
      } else {
        qIdxR.current = next;
        setQIdx(next);
        setShowStats(false);
        loadFn.current(next);
      }
    }, 2100);
  };

  /* ── Load question (uses pre-loaded data when available) ─────── */
  const loadFn = useRef(null);
  loadFn.current = async (idx) => {
    setLoading(true);
    setSel(null);
    setAnswered(false);
    answeredR.current = false;
    setTimeLeft(maxT);

    try {
      let nq = null;

      if (nextQR.current) {
        nq = nextQR.current;
        nextQR.current = null;
      } else {
        nq = await buildQ(resolveMode(mode, idx), diff);
      }

      qR.current     = nq;
      startT.current = Date.now();
      setQ(nq);
      setLoading(false);

      // Pre-load next question silently
      const nextIdx = idx + 1;
      if (nextIdx < TOTAL_Q) {
        preloadQ(mode, diff, nextIdx).then((pre) => {
          if (pre) nextQR.current = pre;
        });
      }
    } catch {
      setTimeout(() => loadFn.current(idx), 1500);
    }
  };

  // Boot
  useEffect(() => { loadFn.current(0); }, []); // eslint-disable-line

  /* ── Countdown timer ─────────────────────────────────────────── */
  useEffect(() => {
    if (loading || answered) return;
    timerR.current = setInterval(() => {
      setTimeLeft((t) => {
        const n = t - 1;
        if (n <= 0) {
          clearInterval(timerR.current);
          answerFn.current(null); // timeout = wrong
          return 0;
        }
        return n;
      });
    }, 1000);
    return () => clearInterval(timerR.current);
  }, [loading, answered, qIdx]);

  /* ── Render ──────────────────────────────────────────────────── */
  if (loading) return <Spinner label={`Loading question ${qIdx + 1} of ${TOTAL_Q}…`} />;

  const tPct = (timeLeft / maxT) * 100;
  const tCol =
    tPct > 55 ? "#4ade80" : tPct > 25 ? "#facc15" : "#f87171";
  const rev = answered;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

      {/* ── HUD ── */}
      <div
        className="si"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        {/* Lives */}
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                fontSize: 20,
                transition: "all .3s",
                filter: i < lives ? "none" : "grayscale(1)",
                opacity: i < lives ? 1 : 0.3,
              }}
            >
              ❤️
            </span>
          ))}
        </div>

        {/* Score */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Press Start 2P',monospace",
              fontSize: 17,
              color: "#fbbf24",
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,.25)",
              letterSpacing: 1.5,
              marginTop: 4,
            }}
          >
            SCORE
          </div>
        </div>

        {/* Streak + Q number */}
        <div style={{ textAlign: "right" }}>
          {streak > 1 && (
            <div
              style={{
                fontSize: 12,
                color: "#fb923c",
                fontWeight: 800,
                marginBottom: 3,
                animation: "glow 1.4s ease-in-out infinite",
              }}
            >
              🔥 ×{streak}
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,.32)",
              fontWeight: 700,
            }}
          >
            {qIdx + 1}
            <span style={{ opacity: 0.4 }}>/{TOTAL_Q}</span>
          </div>
        </div>
      </div>

      {/* ── Progress dots ── */}
      <div
        style={{
          display: "flex",
          gap: 5,
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        {Array.from({ length: TOTAL_Q }).map((_, i) => (
          <div
            key={i}
            className="dot"
            style={{
              background:
                i < qIdx
                  ? resultsR.current[i]?.correct
                    ? "#4ade80"
                    : "#f87171"
                  : i === qIdx
                  ? "#6366f1"
                  : "rgba(255,255,255,.1)",
              transform: i === qIdx ? "scale(1.6)" : "scale(1)",
              boxShadow:
                i === qIdx ? "0 0 8px rgba(99,102,241,.75)" : "none",
            }}
          />
        ))}
      </div>

      {/* ── Timer bar ── */}
      <div className="tbar" style={{ marginBottom: 18 }}>
        <div className="tfill" style={{ width: `${tPct}%`, background: tCol }} />
      </div>

      {/* ── Question card ── */}
      <div className="card si" style={{ padding: "22px 22px 18px", marginBottom: 14 }}>

        {/* Mode header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              color: "rgba(255,255,255,.28)",
              textTransform: "uppercase",
            }}
          >
            {q.mode === "silhouette"
              ? "🌑 Who's That Pokémon?"
              : "⚡ What Type Is This?"}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: tCol,
              background: `rgba(${hexRgb(tCol)},.12)`,
              border: `1px solid rgba(${hexRgb(tCol)},.3)`,
              borderRadius: 8,
              padding: "3px 10px",
              transition: "color .45s, background .45s, border-color .45s",
            }}
          >
            ⏱ {timeLeft}s
          </div>
        </div>

        {/* ── SILHOUETTE MODE ── */}
        {q.mode === "silhouette" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="pkwrap">
              <img
                src={q.pk.sprite}
                alt={rev ? q.pk.name : "mystery"}
                className={rev ? "reveal" : "sil"}
                style={{ width: 158, height: 158, objectFit: "contain", display: "block" }}
              />
            </div>

            {rev && (
              <div className="fu" style={{ textAlign: "center", marginTop: 14 }}>
                <div style={{ fontSize: 21, fontWeight: 900, marginBottom: 4 }}>
                  {cap(q.pk.name)}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.3)",
                    marginBottom: 10,
                  }}
                >
                  #{pad3(q.pk.id)}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  {q.pk.types.map((t) => (
                    <TypeBadge key={t} type={t} size="lg" />
                  ))}
                </div>

                {/* Expandable base stats */}
                <button
                  onClick={() => setShowStats((s) => !s)}
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,.38)",
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {showStats ? "Hide stats ▲" : "Show base stats ▼"}
                </button>
                {showStats && (
                  <div
                    className="fu"
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                    }}
                  >
                    <StatBar label="HP"  value={q.pk.stats.hp}      color="#f87171" />
                    <StatBar label="ATK" value={q.pk.stats.attack}  color="#fb923c" />
                    <StatBar label="DEF" value={q.pk.stats.defense} color="#facc15" />
                    <StatBar label="SPD" value={q.pk.stats.speed}   color="#4ade80" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TYPE MODE ── */}
        {q.mode === "type" && (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div className="pkwrap">
              <img
                src={q.pk.sprite}
                alt={q.pk.name}
                style={{ width: 110, height: 110, objectFit: "contain", display: "block" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  lineHeight: 1.25,
                  marginBottom: 5,
                }}
              >
                {cap(q.pk.name)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,.3)",
                  marginBottom: 10,
                }}
              >
                #{pad3(q.pk.id)}
              </div>
              {rev && (
                <div
                  className="fu"
                  style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                >
                  {q.pk.types.map((t) => (
                    <TypeBadge key={t} type={t} size="lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Feedback banner ── */}
        {rev && (
          <div
            className="fu"
            style={{
              marginTop: 16,
              padding: "11px 14px",
              borderRadius: 12,
              background: correct
                ? "rgba(74,222,128,.09)"
                : "rgba(248,113,113,.09)",
              border: `1px solid ${
                correct
                  ? "rgba(74,222,128,.28)"
                  : "rgba(248,113,113,.28)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div
              style={{
                color: correct ? "#4ade80" : "#f87171",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {correct
                ? "✓ Correct!"
                : sel === null
                ? "⏱ Time's up!"
                : "✗ Wrong!"}
            </div>
            {correct && lastPts > 0 && <ScorePopup pts={lastPts} />}
            {!correct && sel !== null && (
              <div
                style={{ fontSize: 11, color: "rgba(255,255,255,.32)", textAlign: "right" }}
              >
                Answer:{" "}
                <strong style={{ color: "rgba(255,255,255,.62)" }}>
                  {q.mode === "type" ? q.answer : cap(q.answer)}
                </strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Answer options ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {q.opts.map((opt, i) => {
          const val = typeof opt === "string" ? opt : opt.name;
          const lbl = q.mode === "type" ? val : cap(val);
          let cls = "";
          if (rev)
            cls =
              val === q.answer ? "ok" : val === sel ? "fail" : "dim";
          return (
            <button
              key={val}
              className={`opt ${cls}`}
              onClick={() => answerFn.current(val)}
              disabled={rev}
            >
              <LetterKey letter={"ABCD"[i]} />
              {q.mode === "type" && (
                <span
                  className="badge"
                  style={{ background: TCOLOR[val] || "#555", fontSize: 8.5 }}
                >
                  {val}
                </span>
              )}
              <span style={{ flex: 1, fontWeight: 700 }}>{lbl}</span>
              {rev && val === q.answer && (
                <span style={{ color: "#4ade80", fontSize: 18 }}>✓</span>
              )}
              {rev && val === sel && val !== q.answer && (
                <span style={{ color: "#f87171", fontSize: 18 }}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Streak hype ── */}
      {!rev && streak >= 3 && (
        <div
          style={{
            textAlign: "center",
            marginTop: 13,
            fontSize: 11,
            color: "#fb923c",
            fontWeight: 800,
            animation: "pulse 1.3s ease-in-out infinite",
          }}
        >
          🔥 {streak} in a row — don't break it!
        </div>
      )}
    </div>
  );
}
