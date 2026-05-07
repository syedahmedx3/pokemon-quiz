export default function StatBar({ label, value, color }) {
  const pct = Math.min(100, Math.round((value / 255) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 60,
          fontSize: 9.5,
          color: "rgba(255,255,255,.38)",
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          background: "rgba(255,255,255,.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 3,
            background: color,
            transition: "width .6s ease",
          }}
        />
      </div>
      <div
        style={{
          width: 28,
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,.55)",
          textAlign: "right",
        }}
      >
        {value}
      </div>
    </div>
  );
}
