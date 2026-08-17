const YTWL_PREFIX = "YTWL:v1:";

export function createPlaylistCandidate(name, type, videos, meta = {}) {
  return {
    name,
    type,
    videoIds: videos.map((video) => video.videoId),
    meta,
  };
}

export function buildPlaylistName(nameOrder, values) {
  return nameOrder
    .map((key) => values[key])
    .filter(Boolean)
    .join(" ");
}

export function createPlaylistKey(values) {
  return Object.entries(values)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value).trim()}`)
    .join("|");
}

export function extractYTWLId(description = "") {
  const line = description
    .split("\n")
    .find((line) => line.startsWith(YTWL_PREFIX));

  return line || null;
}

export function filterThreshold(groups, minCount) {
  return Object.fromEntries(
    Object.entries(groups).filter(([_, value]) => {
      const count = Array.isArray(value)
        ? value.length
        : value;

      return count >= minCount;
    })
  );
}

export function groupBy(videos, key) {
  const groups = {};

  for (const video of videos) {
    const values = Array.isArray(video[key])
      ? video[key].filter(Boolean)
      : [video[key]];

    for (const value of values) {
      if (!value) continue;

      if (!groups[value]) {
        groups[value] = [];
      }

      groups[value].push(video);
    }
  }

  return groups;
}

export function parseLLMResponse(text) {
    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

    return JSON.parse(cleaned);
}

