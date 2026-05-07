export default function ScorePopup({ pts }) {
  return (
    <div
      className="sci"
      style={{
        display: "inline-block",
        background: "rgba(74,222,128,.18)",
        color: "#4ade80",
        fontSize: 12,
        fontWeight: 800,
        padding: "3px 11px",
        borderRadius: 9,
      }}
    >
      +{pts} pts
    </div>
  );
}
