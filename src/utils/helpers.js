/** Random integer in [a, b] inclusive */
export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

/** Shuffle an array (returns new array) */
export const shuf = (a) => [...a].sort(() => Math.random() - 0.5);

/** Capitalise and replace hyphens */
export const cap = (s) =>
  s ? s[0].toUpperCase() + s.slice(1).replace(/-/g, " ") : "";

/** Zero-pad a number to 3 digits */
export const pad3 = (n) => String(n).padStart(3, "0");

/** Convert #rrggbb → "r,g,b" for use in rgba() */
export const hexRgb = (h) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
