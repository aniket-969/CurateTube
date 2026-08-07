export function createPlaylistCandidate(name, type, videos) {
  return {
    name,
    type,
    videoIds: videos.map((video) => video.videoId),
  };
}

export function buildPlaylistName(nameOrder, values) {
  return nameOrder
    .map((key) => values[key])
    .filter(Boolean)
    .join(" ");
}