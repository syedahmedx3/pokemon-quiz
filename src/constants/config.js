/* ── Game constants ──────────────────────────────────────────── */
export const TOTAL_Q = 10;

export const DIFF_CFG = {
  easy: { range: [1, 151], time: 20, color: "var(--color-success)" },
  medium: { range: [1, 386], time: 15, color: "var(--color-warning)" },
  hard: { range: [1, 898], time: 10, color: "var(--color-danger)" },
};

export const TCOLOR = {
  normal: "#9B9B6B",
  fire: "#E8603C",
  water: "#5A8CE8",
  electric: "#D4AC00",
  grass: "#5A9E3C",
  ice: "#4BAABB",
  fighting: "#A03020",
  poison: "#8040A0",
  ground: "#B08040",
  flying: "#7060C0",
  psychic: "#C95585",
  bug: "#7A9020",
  rock: "#909040",
  ghost: "#6050A0",
  dragon: "#5B4DB5",
  dark: "#605870",
  steel: "#8090A0",
  fairy: "#D575A5",
};

export const ALL_TYPES = Object.keys(TCOLOR);

/* ── Apple Design Tokens (mirrored in CSS variables) ────────── */
export const APPLE = {
  colors: {
    primary: "#0066cc",
    primaryFocus: "#0071e3",
    primaryOnDark: "#2997ff",
    canvas: "#ffffff",
    parchment: "#f5f5f7",
    pearl: "#fafafc",
    tile1: "#272729",
    tile2: "#2a2a2c",
    tile3: "#252527",
    black: "#000000",
    ink: "#1d1d1f",
    inkMuted80: "#333333",
    inkMuted48: "#7a7a7a",
    bodyMuted: "#cccccc",
    hairline: "#e0e0e0",
  },
  radius: {
    none: "0px",
    xs: "5px",
    sm: "8px",
    md: "11px",
    lg: "18px",
    pill: "9999px",
  },
  spacing: {
    xxs: "4px",
    xs: "8px",
    sm: "12px",
    md: "17px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    section: "80px",
  },
  shadow: {
    product: "rgba(0,0,0,0.22) 3px 5px 30px 0px",
  },
};
