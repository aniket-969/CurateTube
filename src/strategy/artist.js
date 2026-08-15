import THRESHOLDS from "../playlist/thresholds.js";
const artistThenMood = {
  levels: [
    {
      key: "mood",
      threshold: THRESHOLDS.MOOD,
      nameOrder: ["artist", "mood"],
    },
  ],

  createParent: true,
  splitIfPossible: true,
};

const ARTIST_STRATEGIES = {
  dominant: "artist",

  threshold: THRESHOLDS.ARTIST,

  defaultStrategy: artistThenMood,
};

export default ARTIST_STRATEGIES;