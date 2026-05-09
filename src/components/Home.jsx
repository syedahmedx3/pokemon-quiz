import { DIFF_CFG } from "../constants/config.js";
import { STRINGS } from "../i18n/strings.js";

const MODE_KEYS = ["silhouette", "type", "mixed"];
const DIFF_KEYS = ["easy", "medium", "hard"];

export default function Home({
  mode,
  setMode,
  diff,
  setDiff,
  best,
  onStart,
  lang,
}) {
  const s = STRINGS[lang].home;

  return (
    <main>
      {/* ═══ HERO — parchment tile ════════════════════════════════ */}
      <section
        className="tile tile--parchment"
        style={{
          paddingTop: "var(--sp-section)",
          paddingBottom: 0,
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
          {/* Eyebrow */}
          <span className="eyebrow-pill fade-up">⭐ {s.eyebrow}</span>

          {/* Hero headline */}
          <h1
            className="t-hero fade-up"
            style={{ color: "var(--color-ink)", animationDelay: ".06s" }}
          >
            {s.headline.map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <p
            className="t-body fade-up"
            style={{
              color: "var(--color-ink-48)",
              maxWidth: 460,
              animationDelay: ".12s",
            }}
          >
            {s.tagline}
          </p>

          {/* Best score */}
          {best > 0 && (
            <div
              className="fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 18px",
                background: "var(--color-canvas)",
                border: "1px solid var(--color-hairline)",
                borderRadius: "var(--r-pill)",
                animationDelay: ".16s",
              }}
            >
              <span className="t-caption-strong">🏆 {s.bestScore}:</span>
              <span
                className="t-caption-strong"
                style={{ color: "var(--color-primary)" }}
              >
                {best}
              </span>
            </div>
          )}

          {/* Divider to next section */}
          <div style={{ height: "var(--sp-section)" }} />
        </div>
      </section>

      {/* ═══ MODE SELECTION — dark tile ══════════════════════════ */}
      <section
        className="tile tile--dark"
        style={{
          paddingTop: "var(--sp-section)",
          paddingBottom: "var(--sp-section)",
          gap: "var(--sp-md)",
          textAlign: "start",
        }}
      >
        <div
          className="content-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-md)",
            width: "100%",
          }}
        >
          <p
            className="t-caption-strong"
            style={{
              color: "var(--color-muted-on-dark)",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {s.modeLabel}
          </p>

          {MODE_KEYS.map((k) => {
            const m = s.modes[k];
            const active = mode === k;
            return (
              <button
                key={k}
                onClick={() => setMode(k)}
                aria-pressed={active}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 16px",
                  borderRadius: "var(--r-lg)",
                  width: "100%",
                  textAlign: "start",
                  background: active
                    ? "rgba(255,255,255,.10)"
                    : "rgba(255,255,255,.04)",
                  border: active
                    ? "1.5px solid rgba(255,255,255,.35)"
                    : "1.5px solid rgba(255,255,255,.08)",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  transition: "background .15s, border-color .15s",
                }}
              >
                {/* Icon box */}
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "var(--r-sm)",
                    flexShrink: 0,
                    background: active
                      ? "rgba(255,255,255,.16)"
                      : "rgba(255,255,255,.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    transition: "background .15s",
                  }}
                >
                  {m.icon}
                </div>

                {/* Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="t-body-strong"
                    style={{ color: "var(--color-on-dark)", marginBottom: 2 }}
                  >
                    {m.title}
                  </div>
                  <div
                    className="t-caption"
                    style={{ color: "var(--color-muted-on-dark)" }}
                  >
                    {m.desc}
                  </div>
                </div>

                {/* Radio dot */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: active ? "var(--color-primary)" : "transparent",
                    border: active
                      ? "none"
                      : "1.5px solid rgba(255,255,255,.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "#fff",
                    fontWeight: 700,
                    transition: "all .15s",
                  }}
                >
                  {active ? "✓" : ""}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══ DIFFICULTY — white tile ══════════════════════════════ */}
      <section
        className="tile tile--light"
        style={{
          paddingTop: "var(--sp-section)",
          paddingBottom: "var(--sp-section)",
          gap: "var(--sp-md)",
        }}
      >
        <div
          className="content-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-md)",
            width: "100%",
          }}
        >
          <p
            className="t-caption-strong"
            style={{
              color: "var(--color-ink-48)",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {s.diffLabel}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
            }}
          >
            {DIFF_KEYS.map((k) => {
              const d = s.diffs[k];
              const cfg = DIFF_CFG[k];
              const active = diff === k;
              return (
                <button
                  key={k}
                  onClick={() => setDiff(k)}
                  aria-pressed={active}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "14px 8px",
                    background: "var(--color-canvas)",
                    border: active
                      ? `2px solid ${cfg.color}`
                      : "1px solid var(--color-hairline)",
                    borderRadius: "var(--r-lg)",
                    cursor: "pointer",
                    fontFamily: "var(--font)",
                    transition: "border-color .15s",
                  }}
                >
                  <span
                    className="t-body-strong"
                    style={{ color: active ? cfg.color : "var(--color-ink)" }}
                  >
                    {d.label}
                  </span>
                  <span
                    className="t-caption"
                    style={{ color: "var(--color-ink-48)" }}
                  >
                    {d.sub}
                  </span>
                  <span className="t-fine-print">{d.timer}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE STRIP — parchment tile ══════════════════════ */}
      <section
        className="tile tile--parchment"
        style={{ paddingTop: "var(--sp-xxl)", paddingBottom: "var(--sp-xxl)" }}
      >
        <div className="content-wrap" style={{ width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 8,
            }}
          >
            {[
              ["📝", 0],
              ["🔥", 1],
              ["⏱", 2],
              ["🎖", 3],
            ].map(([icon, i]) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 22 }} aria-hidden="true">
                  {icon}
                </span>
                <span
                  className="t-caption"
                  style={{ color: "var(--color-ink-48)", textAlign: "center" }}
                >
                  {s.features[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STICKY START BAR ═════════════════════════════════════ */}
      <div className="sticky-bar">
        <button className="btn-primary-full" onClick={onStart}>
          {s.cta}&nbsp;<span aria-hidden="true">{s.ctaArrow}</span>
        </button>
        <p
          className="t-fine-print"
          style={{ textAlign: "center", color: "var(--color-ink-48)" }}
        >
          {s.poweredBy}
        </p>
      </div>
    </main>
  );
}
