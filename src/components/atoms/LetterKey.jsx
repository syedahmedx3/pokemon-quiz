export default function LetterKey({ letter }) {
  return (
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: 7,
        flexShrink: 0,
        background: "rgba(255,255,255,.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        color: "rgba(255,255,255,.42)",
      }}
    >
      {letter}
    </span>
  );
}
