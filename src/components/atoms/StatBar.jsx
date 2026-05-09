export default function StatBar({ label, value, color }) {
  const pct = Math.min(100, Math.round((value / 255) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        className="t-caption"
        style={{
          width: 52,
          color: "var(--color-ink-48)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 4,
          borderRadius: "var(--r-pill)",
          background: "var(--color-hairline)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "var(--r-pill)",
            transition: "width .55s ease",
          }}
        />
      </div>
      <span
        className="t-caption"
        style={{
          width: 28,
          textAlign: "end",
          color: "var(--color-ink-48)",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}
