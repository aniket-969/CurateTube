const GENRE_STRATEGIES = {
  dominant: "genre",

  threshold: "GENRE",
  Pop: {
    levels: ["language", "subgenre"],
    nameOrder: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  Rock: {
    levels: ["language", "subgenre"],
    nameOrder: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  "Hip-Hop / Rap": {
    levels: ["language", "subgenre"],
    nameOrder: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  Electronic: {
    levels: ["language", "subgenre"],
    nameOrder: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  Folk: {
    levels: ["language"],
    nameOrder: ["language", "genre"],
    createParent: false,
    splitIfPossible: true,
  },

  Bollywood: {
    levels: ["mood"],
    nameOrder: ["genre", "mood"],
    createParent: false,
    splitIfPossible: true,
  },

  Ghazal: {
    levels: ["mood"],
    nameOrder: ["genre", "mood"],
    createParent: true,
    splitIfPossible: true,
  },

  Qawwali: {
    levels: ["mood"],
    nameOrder: ["genre", "mood"],
    createParent: true,
    splitIfPossible: true,
  },

  "Indian Classical": {
    levels: ["mood"],
    nameOrder: ["genre", "mood"],
    createParent: true,
    splitIfPossible: true,
  },

  "K-Pop": {
    levels: ["mood"],
    nameOrder: ["genre", "mood"],
    createParent: true,
    splitIfPossible: true,
  },

  "J-Pop": {
    levels: ["mood"],
    nameOrder: ["genre", "mood"],
    createParent: true,
    splitIfPossible: true,
  },
};

export default GENRE_STRATEGIES;
