import THRESHOLDS from "../playlist/thresholds.js";
const artistThenMood = {
  levels: [
    {
      key: "mood",
      threshold: THRESHOLDS.MOOD,
      nameOrder: ["artists", "mood"],
    },
  ],

  createParent: true,
  splitIfPossible: true,
};

const ARTIST_STRATEGIES = {
  dominant: "artists",

  threshold: THRESHOLDS.ARTIST,

  defaultStrategy: artistThenMood,
};

export default ARTIST_STRATEGIES;