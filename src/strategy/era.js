import THRESHOLDS from "../playlist/thresholds.js";

const eraThenLanguage = {
  levels: [
    {
      key: "language",
      threshold: THRESHOLDS.LANGUAGE,
      nameOrder: ["era", "language"],
    },
  ],

  createParent: false,
  splitIfPossible: true,
};

const eraThenMood = {
  levels: [
    {
      key: "mood",
      threshold: THRESHOLDS.MOOD,
      nameOrder: ["era", "mood"],
    },
  ],

  createParent: false,
  splitIfPossible: true,
};

const ERA_STRATEGIES = {
  dominant: "era",

  threshold: THRESHOLDS.ERA,

  defaultStrategy: [
    eraThenLanguage,
    eraThenMood,
  ],
};

export default ERA_STRATEGIES;