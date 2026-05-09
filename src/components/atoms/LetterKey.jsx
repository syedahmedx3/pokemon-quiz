export default function LetterKey({ letter }) {
  return (
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: "var(--r-sm)",
        flexShrink: 0,
        background: "var(--color-parchment)",
        border: "1px solid var(--color-hairline)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--color-ink-48)",
      }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
