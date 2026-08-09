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