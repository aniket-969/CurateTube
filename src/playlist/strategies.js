const STRATEGIES = {
  Pop: {
    levels: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  Rock: {
    levels: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  "Hip-Hop / Rap": {
    levels: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  Electronic: {
    levels: ["language", "subgenre"],
    createParent: false,
    splitIfPossible: true,
  },

  Folk: {
    levels: ["language"],
    createParent: false,
    splitIfPossible: true,
  },

  Bollywood: {
    levels: ["mood"],
    createParent: false,
    splitIfPossible: true,
  },

  Ghazal: {
    levels: ["mood"],
    createParent: true,
    splitIfPossible: true,
  },

  Qawwali: {
    levels: ["mood"],
    createParent: true,
    splitIfPossible: true,
  },

  "Indian Classical": {
    levels: ["mood"],
    createParent: true,
    splitIfPossible: true,
  },

  "K-Pop": {
    levels: ["mood"],
    createParent: true,
    splitIfPossible: true,
  },

  "J-Pop": {
    levels: ["mood"],
    createParent: true,
    splitIfPossible: true,
  },
};

export default STRATEGIES;