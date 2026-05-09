export default function Spinner({ label }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true" />
      {label && (
        <p className="t-caption" style={{ color: "var(--color-ink-48)" }}>
          {label}
        </p>
      )}
    </div>
  );
}
