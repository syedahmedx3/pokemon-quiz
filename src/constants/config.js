export const TOTAL_Q = 10;

export const DIFF_CFG = {
  easy:   { range: [1, 151],  time: 20, label: "Rookie",   color: "#4ade80", sub: "Gen I" },
  medium: { range: [1, 386],  time: 15, label: "Trainer",  color: "#facc15", sub: "Gen I–III" },
  hard:   { range: [1, 898],  time: 10, label: "Champion", color: "#f87171", sub: "All Gens" },
};

export const TCOLOR = {
  normal:   "#9B9B6B",
  fire:     "#E8603C",
  water:    "#5A8CE8",
  electric: "#D4AC00",
  grass:    "#5A9E3C",
  ice:      "#4BAABB",
  fighting: "#A03020",
  poison:   "#8040A0",
  ground:   "#B08040",
  flying:   "#7060C0",
  psychic:  "#C95585",
  bug:      "#7A9020",
  rock:     "#909040",
  ghost:    "#6050A0",
  dragon:   "#5B4DB5",
  dark:     "#605870",
  steel:    "#8090A0",
  fairy:    "#D575A5",
};

export const ALL_TYPES = Object.keys(TCOLOR);
