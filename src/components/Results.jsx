import { DIFF_CFG, TCOLOR } from "../constants/config.js";
import { getGrade } from "../utils/game.js";
import { cap } from "../utils/helpers.js";
import { STRINGS } from "../i18n/strings.js";
import TypeBadge from "./atoms/TypeBadge.jsx";

export default function Results({ data, onHome, onRetry, lang }) {
  const s = STRINGS[lang].results;
  const { score, results, diff } = data;

  const numCorrect = results.filter((r) => r.correct).length;
  const pct = Math.round((numCorrect / results.length) * 100);
  const { g, c: gc, t: gt, sub: gs } = getGrade(pct);

  const maxStreak = (() => {
    let run = 0,
      best = 0;
    results.forEach((r) => {
      if (r.correct) {
        run++;
        best = Math.max(best, run);
      } else run = 0;
    });
    return best;
  })();

  const avgTime = (() => {
    const timed = results.filter((r) => r.sel !== null);
    if (!timed.length) return 0;
    return Math.round(
      timed.reduce((a, r) => a + (DIFF_CFG[diff].time - r.tLeft), 0) /
        timed.length,
    );
  })();

  const gradeText = s.grades[g];

  return (
    <main>
      {/* ═══ GRADE HERO — dark tile ═══════════════════════════════ */}
      <section
        className="tile tile--dark"
        style={{
          paddingTop: "var(--sp-section)",
          paddingBottom: "var(--sp-section)",
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
            textAlign: "center",
          }}
        >
          {/* Grade circle */}
          <div
            className="grade-circle fade-up"
            style={{
              color: gc,
              borderColor: gc,
              boxShadow: `0 0 48px ${gc}44`,
            }}
            aria-label={`Grade ${g}`}
          >
            {g}
          </div>

          {/* Grade title */}
          <div className="fade-up" style={{ animationDelay: ".08s" }}>
            <p
              className="t-display-md"
              style={{ color: "var(--color-on-dark)", marginBottom: 6 }}
            >
              {gradeText.title}
            </p>
            <p
              className="t-body"
              style={{ color: "var(--color-muted-on-dark)" }}
            >
              {gradeText.sub}
            </p>
          </div>

          {/* Accuracy pill */}
          <div
            className="fade-up"
            style={{
              display: "inline-flex",
              gap: 10,
              alignItems: "center",
              padding: "6px 20px",
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: "var(--r-pill)",
              animationDelay: ".14s",
            }}
          >
            <span
              className="t-caption-strong"
              style={{ color: "var(--color-on-dark)" }}
            >
              {s.correct(numCorrect, results.length)}
            </span>
            <span
              style={{
                width: 1,
                height: 14,
                background: "rgba(255,255,255,.2)",
              }}
              aria-hidden="true"
            />
            <span className="t-caption-strong" style={{ color: gc }}>
              {s.accuracy(pct)}
            </span>
          </div>

          {/* Difficulty chip */}
          <span
            className="fade-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 16px",
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: "var(--r-pill)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "-0.12px",
              color: "var(--color-muted-on-dark)",
              animationDelay: ".18s",
            }}
          >
            {s.diffIcons[diff]} {s.diffLabels[diff]}
          </span>
        </div>
      </section>

      {/* ═══ STATS GRID — white tile ══════════════════════════════ */}
      <section
        className="tile tile--light"
        style={{
          paddingTop: "var(--sp-section)",
          paddingBottom: "var(--sp-section)",
          gap: "var(--sp-lg)",
        }}
      >
        <div
          className="content-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            width: "100%",
          }}
        >
          {[
            { k: s.stats.score, v: score, c: "#0066cc" },
            { k: s.stats.accuracy, v: `${pct}%`, c: gc },
            {
              k: s.stats.streak,
              v: `×${maxStreak}`,
              c: "var(--color-warning)",
            },
            { k: s.stats.avgTime, v: `${avgTime}s`, c: "var(--color-ink-48)" },
          ].map((stat) => (
            <div
              key={stat.k}
              className="card-utility"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                textAlign: "center",
                padding: "var(--sp-lg) var(--sp-md)",
              }}
            >
              <span
                className="t-caption"
                style={{
                  color: "var(--color-ink-48)",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                {stat.k}
              </span>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  color: stat.c,
                }}
              >
                {stat.v}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ QUESTION RECAP — parchment tile ══════════════════════ */}
      <section
        className="tile tile--parchment"
        style={{
          paddingTop: "var(--sp-section)",
          paddingBottom: "var(--sp-section)",
          gap: "var(--sp-lg)",
          alignItems: "stretch",
        }}
      >
        <div
          className="content-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-lg)",
            width: "100%",
          }}
        >
          <h2 className="t-tagline" style={{ color: "var(--color-ink)" }}>
            {s.recapTitle}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.map((r, i) => (
              <div
                key={i}
                className="card-utility"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: r.correct
                    ? "rgba(52,199,89,.06)"
                    : "rgba(255,59,48,.06)",
                  border: `1px solid ${r.correct ? "rgba(52,199,89,.22)" : "rgba(255,59,48,.22)"}`,
                  borderRadius: "var(--r-lg)",
                }}
              >
                {/* Q number */}
                <span
                  className="t-caption"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "var(--r-sm)",
                    flexShrink: 0,
                    background: "var(--color-canvas)",
                    border: "1px solid var(--color-hairline)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-ink-48)",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>

                {/* Sprite */}
                <img
                  src={r.q.pk.sprite}
                  alt={cap(r.q.pk.name)}
                  style={{
                    width: 42,
                    height: 42,
                    objectFit: "contain",
                    flexShrink: 0,
                    filter: r.correct ? "none" : "grayscale(.55)",
                    /* product shadow on sprites */
                    filter: r.correct
                      ? "drop-shadow(rgba(0,0,0,0.22) 2px 3px 12px)"
                      : "grayscale(.55) drop-shadow(rgba(0,0,0,0.10) 2px 3px 8px)",
                  }}
                />

                {/* Name + types */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="t-body-strong"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cap(r.q.pk.name)}
                  </p>
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
                        className="type-badge"
                        style={{ background: TCOLOR[t] || "#555", fontSize: 8 }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score or wrong guess */}
                <div style={{ textAlign: "end", flexShrink: 0 }}>
                  <p
                    className="t-body-strong"
                    style={{
                      color: r.correct
                        ? "var(--color-success)"
                        : "var(--color-danger)",
                    }}
                  >
                    {r.correct ? `+${r.pts}` : "✗"}
                  </p>
                  {!r.correct && (
                    <p className="t-fine-print" style={{ marginTop: 2 }}>
                      {r.sel
                        ? r.q.mode === "type"
                          ? r.sel
                          : cap(r.sel)
                        : s.timeout}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contextual message */}
          {pct < 65 && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "var(--r-lg)",
                background: "rgba(0,102,204,.06)",
                border: "1px solid rgba(0,102,204,.18)",
              }}
            >
              <p
                className="t-caption"
                style={{ color: "var(--color-ink)", lineHeight: 1.6 }}
              >
                {s.tip}
              </p>
            </div>
          )}
          {pct >= 90 && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "var(--r-lg)",
                background: "rgba(255,215,0,.10)",
                border: "1px solid rgba(255,200,0,.30)",
                textAlign: "center",
              }}
            >
              <p className="t-body-strong" style={{ color: "#996600" }}>
                {s.sRankMsg}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ STICKY ACTION BAR ════════════════════════════════════ */}
      <div className="sticky-bar">
        <button className="btn-primary-full" onClick={onRetry}>
          {s.playAgain}&nbsp;<span aria-hidden="true">{s.playAgainArrow}</span>
        </button>
        <button className="btn-secondary-full" onClick={onHome}>
          {s.changeSettings}
        </button>
        <p className="t-fine-print" style={{ textAlign: "center" }}>
          {s.poweredBy}
        </p>
      </div>
    </main>
  );
}
