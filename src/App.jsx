import { useState, useCallback } from "react";
import { STRINGS } from "./i18n/strings.js";
import GlobalNav from "./components/GlobalNav.jsx";
import Home from "./components/Home.jsx";
import Quiz from "./components/Quiz.jsx";
import Results from "./components/Results.jsx";

/**
 * App — root router
 * ─────────────────
 * Owns:
 *   screen   home | quiz | results
 *   mode     silhouette | type | mixed
 *   diff     easy | medium | hard
 *   lang     en | ar
 *   result   data returned by Quiz
 *   best     session high score
 *   gameKey  forces full Quiz remount on every new game
 *   score    live score surfaced to GlobalNav during quiz
 */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("silhouette");
  const [diff, setDiff] = useState("easy");
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [liveScore, setLiveScore] = useState(null);

  const dir = STRINGS[lang].dir;

  /** Toggle between English and Arabic */
  const handleToggleLang = () => {
    setLang((l) => (l === "en" ? "ar" : "en"));
  };

  /** Called by Quiz when round ends */
  const handleDone = useCallback(
    (data) => {
      if (data.score > best) setBest(data.score);
      setResult(data);
      setLiveScore(null);
      setScreen("results");
    },
    [best],
  );

  /** Start fresh game */
  const handleStart = () => {
    setLiveScore(0);
    setGameKey((k) => k + 1);
    setScreen("quiz");
  };

  /** Replay with same settings */
  const handleRetry = () => {
    setLiveScore(0);
    setGameKey((k) => k + 1);
    setScreen("quiz");
  };

  return (
    /* dir attribute drives RTL for the entire app */
    <div
      dir={dir}
      lang={lang}
      style={{ minHeight: "100vh", background: "var(--color-canvas)" }}
    >
      {/* Global nav persists across all screens */}
      <GlobalNav
        lang={lang}
        onToggleLang={handleToggleLang}
        score={screen === "quiz" ? liveScore : null}
      />

      {screen === "home" && (
        <Home
          mode={mode}
          setMode={setMode}
          diff={diff}
          setDiff={setDiff}
          best={best}
          onStart={handleStart}
          lang={lang}
        />
      )}

      {screen === "quiz" && (
        <Quiz
          key={gameKey}
          mode={mode}
          diff={diff}
          lang={lang}
          onDone={handleDone}
        />
      )}

      {screen === "results" && result && (
        <Results
          data={result}
          lang={lang}
          onHome={() => setScreen("home")}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
