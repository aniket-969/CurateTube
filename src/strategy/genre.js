import THRESHOLDS from "../playlist/thresholds";

const languageThenSubgenre = {
  levels: [
    {
      key: "language",
      threshold: THRESHOLDS.LANGUAGE,
    },
    {
      key: "subgenre",
      threshold: THRESHOLDS.SUBGENRE,
    },
  ],
  nameOrder: ["language", "subgenre"],
  createParent: false,
  splitIfPossible: true,
};

const genreThenMood = {
  levels: [
    {
      key: "mood",
      threshold: THRESHOLDS.MOOD,
    },
  ],
  nameOrder: ["genre", "mood"],
  createParent: true,
  splitIfPossible: true,
};

const GENRE_STRATEGIES = {
  dominant: "genre",

  threshold: THRESHOLDS.GENRE,

  strategies: {
    Pop: languageThenSubgenre,

    Rock: languageThenSubgenre,

    "Hip-Hop / Rap": languageThenSubgenre,

    Electronic: languageThenSubgenre,

    Folk: {
      levels: [
        {
          key: "language",
          threshold: THRESHOLDS.LANGUAGE,
        },
      ],
      nameOrder: ["language", "genre"],
      createParent: false,
      splitIfPossible: true,
    },

    Bollywood: {
      levels: [
        {
          key: "mood",
          threshold: THRESHOLDS.MOOD,
        },
      ],
      nameOrder: ["genre", "mood"],
      createParent: false,
      splitIfPossible: true,
    },

    Ghazal: genreThenMood,

    Qawwali: genreThenMood,

    "Indian Classical": genreThenMood,

    "K-Pop": genreThenMood,

    "J-Pop": genreThenMood,
  },
};

export default GENRE_STRATEGIES;