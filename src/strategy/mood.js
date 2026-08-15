import THRESHOLDS from "../playlist/thresholds.js";

const moodThenLanguage = {
  levels: [
    {
      key: "language",
      threshold: THRESHOLDS.LANGUAGE,
      nameOrder: ["mood", "language"],
    },
  ],

  createParent: true,
  splitIfPossible: true,
};

const MOOD_STRATEGIES = {
  dominant: "mood",

  threshold: THRESHOLDS.MOOD,

  defaultStrategy: moodThenLanguage,
};

export default MOOD_STRATEGIES;