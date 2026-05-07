import { useState, useCallback } from "react";
import Home    from "./components/Home.jsx";
import Quiz    from "./components/Quiz.jsx";
import Results from "./components/Results.jsx";

/**
 * App
 * ───
 * Top-level router. Three screens: home → quiz → results.
 *
 * State owned here:
 *   screen   – which screen is visible
 *   mode     – quiz mode  (silhouette | type | mixed)
 *   diff     – difficulty (easy | medium | hard)
 *   result   – data object returned by Quiz when the round ends
 *   best     – all-time high score (session-persisted in memory)
 *   gameKey  – incremented each new game to force a full Quiz remount
 *              so no stale refs / timers survive between rounds
 */
export default function App() {
  const [screen,  setScreen]  = useState("home");
  const [mode,    setMode]    = useState("silhouette");
  const [diff,    setDiff]    = useState("easy");
  const [result,  setResult]  = useState(null);
  const [best,    setBest]    = useState(0);
  const [gameKey, setGameKey] = useState(0);

  /** Called by Quiz when all questions are answered or lives run out */
  const handleDone = useCallback(
    (data) => {
      if (data.score > best) setBest(data.score);
      setResult(data);
      setScreen("results");
    },
    [best]
  );

  /** Start a fresh game from the Home screen */
  const handleStart = () => {
    setGameKey((k) => k + 1);
    setScreen("quiz");
  };

  /** Replay with the same settings from the Results screen */
  const handleRetry = () => {
    setGameKey((k) => k + 1);
    setScreen("quiz");
  };

  return (
    <div className="R">
      {screen === "home" && (
        <Home
          mode={mode}   setMode={setMode}
          diff={diff}   setDiff={setDiff}
          best={best}
          onStart={handleStart}
        />
      )}

      {screen === "quiz" && (
        <Quiz
          key={gameKey}   // ← forces full remount on each new game
          mode={mode}
          diff={diff}
          onDone={handleDone}
        />
      )}

      {screen === "results" && result && (
        <Results
          data={result}
          onHome={() => setScreen("home")}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
