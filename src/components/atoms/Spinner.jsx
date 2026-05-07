export default function Spinner({ label = "Loading Pokémon data…" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          border: "4px solid rgba(255,255,255,.08)",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin .8s linear infinite",
        }}
      />
      <p style={{ fontSize: 12, color: "rgba(255,255,255,.32)", letterSpacing: 1 }}>
        {label}
      </p>
    </div>
  );
}
