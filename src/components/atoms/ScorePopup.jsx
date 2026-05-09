export default function ScorePopup({ pts }) {
  return (
    <span className="score-popup" aria-label={`Plus ${pts} points`}>
      +{pts}
    </span>
  );
}
