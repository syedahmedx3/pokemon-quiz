import { useState, useEffect, useRef } from "react";
import { DIFF_CFG, TCOLOR, TOTAL_Q } from "../constants/config.js";
import { buildQ, preloadQ, calcPts, resolveMode } from "../utils/game.js";
import { cap, pad3 } from "../utils/helpers.js";
import { STRINGS } from "../i18n/strings.js";
import Spinner from "./atoms/Spinner.jsx";
import LetterKey from "./atoms/LetterKey.jsx";
import TypeBadge from "./atoms/TypeBadge.jsx";
import StatBar from "./atoms/StatBar.jsx";
import ScorePopup from "./atoms/ScorePopup.jsx";

export default function Quiz({ mode, diff, onDone, lang }) {
  const s = STRINGS[lang].quiz;
  const maxT = DIFF_CFG[diff].time;

  /* ── render state ────────────────────────────────────────────── */
  const [q, setQ] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(maxT);
  const [lastPts, setLastPts] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [showStats, setShowStats] = useState(false);

  /* ── mutation refs (no stale closures) ───────────────────────── */
  const scoreR = useRef(0);
  const streakR = useRef(0);
  const livesR = useRef(3);
  const answeredR = useRef(false);
  const qIdxR = useRef(0);
  const qR = useRef(null);
  const startT = useRef(0);
  const resultsR = useRef([]);
  const timerR = useRef(null);
  const nextQR = useRef(null);

  /* ── answer handler ──────────────────────────────────────────── */
  const answerFn = useRef(null);
  answerFn.current = (val) => {
    if (answeredR.current) return;
    answeredR.current = true;
    clearInterval(timerR.current);

    const tLeft = Math.max(0, maxT - (Date.now() - startT.current) / 1000);
    const isRight = val === qR.current.answer;
    setAnswered(true);
    setSel(val);
    setCorrect(isRight);

    let pts = 0;
    if (isRight) {
      pts = calcPts(tLeft, maxT, streakR.current);
      scoreR.current += pts;
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
      q: qR.current,
      sel: val,
      correct: isRight,
      pts,
      tLeft: Math.round(tLeft),
    });

    setTimeout(() => {
      const next = qIdxR.current + 1;
      if (next >= TOTAL_Q || livesR.current <= 0) {
        onDone({
          score: scoreR.current,
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
    }, 2000);
  };

  /* ── load question ───────────────────────────────────────────── */
  const loadFn = useRef(null);
  loadFn.current = async (idx) => {
    setLoading(true);
    setSel(null);
    setAnswered(false);
    answeredR.current = false;
    setTimeLeft(maxT);
    try {
      let nq = nextQR.current || (await buildQ(resolveMode(mode, idx), diff));
      nextQR.current = null;
      qR.current = nq;
      startT.current = Date.now();
      setQ(nq);
      setLoading(false);
      if (idx + 1 < TOTAL_Q)
        preloadQ(mode, diff, idx + 1).then((p) => {
          if (p) nextQR.current = p;
        });
    } catch {
      setTimeout(() => loadFn.current(idx), 1500);
    }
  };

  useEffect(() => {
    loadFn.current(0);
  }, []); // eslint-disable-line

  /* ── countdown ───────────────────────────────────────────────── */
  useEffect(() => {
    if (loading || answered) return;
    timerR.current = setInterval(() => {
      setTimeLeft((t) => {
        const n = t - 1;
        if (n <= 0) {
          clearInterval(timerR.current);
          answerFn.current(null);
          return 0;
        }
        return n;
      });
    }, 1000);
    return () => clearInterval(timerR.current);
  }, [loading, answered, qIdx]);

  /* ── helpers ─────────────────────────────────────────────────── */
  if (loading) return <Spinner label={s.loadingLabel(qIdx + 1, TOTAL_Q)} />;

  const tPct = (timeLeft / maxT) * 100;
  const tColor =
    tPct > 55
      ? "var(--color-success)"
      : tPct > 25
        ? "var(--color-warning)"
        : "var(--color-danger)";
  const rev = answered;

  return (
    <>
      {/* ═══ SUB-NAV FROSTED ═════════════════════════════════════ */}
      <div className="sub-nav" role="navigation" aria-label="Quiz progress">
        {/* Mode name */}
        <span
          className="sub-nav__left t-caption-strong"
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {q.mode === "silhouette" ? s.modeSilhouette : s.modeType}
        </span>

        {/* Progress dots */}
        <div
          className="sub-nav__center"
          role="progressbar"
          aria-valuenow={qIdx + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_Q}
        >
          {Array.from({ length: TOTAL_Q }).map((_, i) => {
            let cls = "progress-dot";
            if (i < qIdx)
              cls += resultsR.current[i]?.correct
                ? " progress-dot--done-correct"
                : " progress-dot--done-wrong";
            else if (i === qIdx) cls += " progress-dot--active";
            return <div key={i} className={cls} />;
          })}
        </div>

        {/* Score + Q number */}
        <div className="sub-nav__right">
          <span
            className="t-caption-strong"
            style={{ color: "var(--color-primary)" }}
          >
            {score}
          </span>
          <span
            className="t-caption"
            style={{ color: "var(--color-ink-48)", marginInlineStart: 6 }}
          >
            {qIdx + 1}/{TOTAL_Q}
          </span>
        </div>
      </div>

      {/* ═══ TIMER BAR ══════════════════════════════════════════ */}
      <div
        className="timer-track"
        role="timer"
        aria-label={`${timeLeft} ${s.timeLabel}`}
      >
        <div
          className="timer-fill"
          style={{ width: `${tPct}%`, background: tColor }}
        />
      </div>

      {/* ═══ QUESTION AREA ══════════════════════════════════════ */}
      <main style={{ paddingBottom: "var(--sp-xxl)" }}>
        {/* Question card */}
        <section
          className={
            q.mode === "silhouette" ? "tile tile--dark" : "tile tile--parchment"
          }
          style={{
            paddingTop: "var(--sp-xl)",
            paddingBottom: "var(--sp-xl)",
            gap: "var(--sp-lg)",
          }}
        >
          <div
            className="content-wrap"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--sp-lg)",
              width: "100%",
            }}
          >
            {/* Timer pill */}
            <div
              style={{
                alignSelf: "flex-end",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                background: `rgba(${tPct > 55 ? "52,199,89" : tPct > 25 ? "255,159,10" : "255,59,48"},.12)`,
                border: `1px solid ${tColor}`,
                borderRadius: "var(--r-pill)",
                fontSize: 13,
                fontWeight: 600,
                color: tColor,
                transition: "background .4s, border-color .4s, color .4s",
              }}
            >
              ⏱ {timeLeft}
              {s.timeLabel}
            </div>

            {/* SILHOUETTE MODE */}
            {q.mode === "silhouette" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--sp-md)",
                }}
              >
                <div className="pk-wrap">
                  <img
                    src={q.pk.sprite}
                    alt={rev ? cap(q.pk.name) : "mystery Pokémon"}
                    className={
                      rev ? "pk-img pk-img--reveal" : "pk-img pk-img--sil"
                    }
                    style={{
                      width: clamp(140, 180),
                      height: clamp(140, 180),
                      objectFit: "contain",
                    }}
                  />
                </div>
                {rev && (
                  <div className="fade-up" style={{ textAlign: "center" }}>
                    <p
                      className="t-display-md"
                      style={{ color: "var(--color-on-dark)", marginBottom: 4 }}
                    >
                      {cap(q.pk.name)}
                    </p>
                    <p
                      className="t-caption"
                      style={{
                        color: "var(--color-muted-on-dark)",
                        marginBottom: 10,
                      }}
                    >
                      #{pad3(q.pk.id)}
                    </p>
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
                    <button
                      onClick={() => setShowStats((v) => !v)}
                      className="link-primary-dark t-caption"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font)",
                        textDecoration: "underline",
                      }}
                    >
                      {showStats ? s.hideStats : s.showStats}
                    </button>
                    {showStats && (
                      <div
                        className="fade-up"
                        style={{
                          marginTop: "var(--sp-sm)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          width: "100%",
                          maxWidth: 300,
                        }}
                      >
                        <StatBar
                          label={s.statLabels.hp}
                          value={q.pk.stats.hp}
                          color="var(--color-danger)"
                        />
                        <StatBar
                          label={s.statLabels.atk}
                          value={q.pk.stats.attack}
                          color="var(--color-warning)"
                        />
                        <StatBar
                          label={s.statLabels.def}
                          value={q.pk.stats.defense}
                          color="var(--color-primary)"
                        />
                        <StatBar
                          label={s.statLabels.spd}
                          value={q.pk.stats.speed}
                          color="var(--color-success)"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TYPE MODE */}
            {q.mode === "type" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--sp-lg)",
                  width: "100%",
                  textAlign: "start",
                }}
              >
                <div className="pk-wrap" style={{ flexShrink: 0 }}>
                  <img
                    src={q.pk.sprite}
                    alt={cap(q.pk.name)}
                    className="pk-img"
                    style={{ width: 110, height: 110, objectFit: "contain" }}
                  />
                </div>
                <div>
                  <p className="t-display-md" style={{ marginBottom: 4 }}>
                    {cap(q.pk.name)}
                  </p>
                  <p
                    className="t-caption"
                    style={{
                      color: "var(--color-ink-48)",
                      marginBottom: rev ? 10 : 0,
                    }}
                  >
                    #{pad3(q.pk.id)}
                  </p>
                  {rev && (
                    <div
                      className="fade-up"
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

            {/* Feedback banner */}
            {rev && (
              <div
                className={`feedback-banner fade-up ${correct ? "feedback-banner--correct" : "feedback-banner--wrong"}`}
              >
                <span>
                  {correct
                    ? `✓ ${s.correct}`
                    : sel === null
                      ? `⏱ ${s.timeout}`
                      : `✗ ${s.wrong}`}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {correct && lastPts > 0 && <ScorePopup pts={lastPts} />}
                  {!correct && sel !== null && (
                    <span
                      className="t-caption"
                      style={{ color: "var(--color-ink-48)" }}
                    >
                      {s.answerLabel}:{" "}
                      <strong>
                        {q.mode === "type" ? q.answer : cap(q.answer)}
                      </strong>
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Options section — always white/parchment */}
        <section
          className="tile tile--light"
          style={{
            paddingTop: "var(--sp-lg)",
            paddingBottom: "var(--sp-lg)",
            gap: "var(--sp-xs)",
          }}
        >
          <div
            className="content-wrap"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 9,
              width: "100%",
            }}
          >
            {q.opts.map((opt, i) => {
              const val = typeof opt === "string" ? opt : opt.name;
              const lbl = q.mode === "type" ? val : cap(val);
              let cls = "opt";
              if (rev)
                cls +=
                  val === q.answer
                    ? " opt--correct"
                    : val === sel
                      ? " opt--wrong"
                      : " opt--dim";

              return (
                <button
                  key={val}
                  className={cls}
                  onClick={() => answerFn.current(val)}
                  disabled={rev}
                  aria-label={lbl}
                >
                  <LetterKey letter={"ABCD"[i]} />
                  {q.mode === "type" && (
                    <span
                      className="type-badge"
                      style={{
                        background: TCOLOR[val] || "#555",
                        fontSize: 8.5,
                      }}
                    >
                      {val}
                    </span>
                  )}
                  <span
                    style={{
                      flex: 1,
                      fontFamily: "var(--font)",
                      fontSize: 15,
                      fontWeight: 400,
                      letterSpacing: "-0.12px",
                    }}
                  >
                    {lbl}
                  </span>
                  {rev && val === q.answer && (
                    <span
                      style={{ color: "var(--color-success)", fontSize: 18 }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                  {rev && val === sel && val !== q.answer && (
                    <span
                      style={{ color: "var(--color-danger)", fontSize: 18 }}
                      aria-hidden="true"
                    >
                      ✗
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Lives + streak hype — parchment strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--sp-sm) var(--sp-lg)",
            background: "var(--color-parchment)",
            borderTop: "1px solid var(--color-hairline)",
          }}
        >
          {/* Lives */}
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  fontSize: 18,
                  opacity: i < lives ? 1 : 0.22,
                  transition: "opacity .3s",
                }}
              >
                ❤️
              </span>
            ))}
          </div>

          {/* Streak */}
          {!rev && streak >= 3 && (
            <span
              className="t-caption-strong"
              style={{ color: "var(--color-warning)" }}
            >
              🔥 {s.streakMsg(streak)}
            </span>
          )}
        </div>
      </main>
    </>
  );
}

/* tiny helper — responsive image size clamped between two values */
function clamp(min, max) {
  return `clamp(${min}px, 28vw, ${max}px)`;
}
