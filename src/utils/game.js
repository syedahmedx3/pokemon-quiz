import { fetchPk } from "./api.js";
import { rnd, shuf } from "./helpers.js";
import { DIFF_CFG, ALL_TYPES } from "../constants/config.js";

/**
 * Build a single question for the given mode + difficulty.
 * Returns a question object:
 *   { mode, pk, answer, opts }
 */
export async function buildQ(mode, diff) {
  const [lo, hi] = DIFF_CFG[diff].range;
  const cid = rnd(lo, hi);
  const pk  = await fetchPk(cid);

  if (mode === "type") {
    const wrongs = shuf(ALL_TYPES.filter((t) => t !== pk.types[0])).slice(0, 3);
    return {
      mode: "type",
      pk,
      answer: pk.types[0],
      opts: shuf([pk.types[0], ...wrongs]),
    };
  }

  // silhouette — 3 unique decoy Pokémon
  const ids = new Set();
  while (ids.size < 3) {
    const id = rnd(lo, hi);
    if (id !== cid) ids.add(id);
  }
  const decoys = await Promise.all([...ids].map(fetchPk));
  return {
    mode: "silhouette",
    pk,
    answer: pk.name,
    opts: shuf([pk, ...decoys]),
  };
}

/**
 * Silently pre-load the next question so transitions feel instant.
 * Returns the question object or null on failure.
 */
export async function preloadQ(mode, diff, idx) {
  try {
    const qMode =
      mode === "mixed" ? (idx % 2 === 0 ? "silhouette" : "type") : mode;
    return await buildQ(qMode, diff);
  } catch {
    return null;
  }
}

/**
 * Points for a correct answer.
 * Formula: (100 + timeBonus) × streakMultiplier
 *   - timeBonus   up to +50 based on remaining time
 *   - multiplier  1.0 → 1.6 scaling with streak (capped at ×6)
 */
export function calcPts(tLeft, maxT, streak) {
  const base      = 100;
  const timeBonus = Math.round((tLeft / maxT) * 50);
  const mult      = 1 + Math.min(streak, 6) * 0.1;
  return Math.round((base + timeBonus) * mult);
}

/**
 * Letter grade + flavour text based on accuracy percentage.
 */
export function getGrade(pct) {
  if (pct >= 90) return { g: "S", c: "#ffd700", t: "Pokémon Master!",   s: "A legendary achievement!" };
  if (pct >= 80) return { g: "A", c: "#4ade80", t: "Gym Leader!",       s: "Outstanding knowledge!" };
  if (pct >= 65) return { g: "B", c: "#60a5fa", t: "Senior Trainer",    s: "Great performance!" };
  if (pct >= 45) return { g: "C", c: "#f97316", t: "Pokémon Trainer",   s: "Keep practicing!" };
                 return { g: "D", c: "#f87171", t: "Team Rocket Grunt",  s: "Back to the basics!" };
}

/**
 * Derive the question mode from the app mode + question index.
 */
export function resolveMode(appMode, idx) {
  if (appMode === "mixed") return idx % 2 === 0 ? "silhouette" : "type";
  return appMode;
}
