export function createPlaylistCandidate(name, type, videos) {
  return {
    name,
    type,
    videoIds: videos.map((video) => video.videoId),
  };
}

/**
 * Builds playlist names based on the strategy.
 *
 * Example:
 *
 * buildPlaylistName(
 *   ["language", "subgenre"],
 *   "Pop",
 *   {
 *     language: "Hindi",
 *     subgenre: "Indie Pop"
 *   }
 * )
 *
 * => "Hindi Indie Pop"
 */

export function buildPlaylistName(nameOrder, genre, values = {}) {
  const parts = [];

  for (const key of nameOrder) {
    if (key === "genre") {
      parts.push(genre);
      continue;
    }

    if (values[key]) {
      parts.push(values[key]);
    }
  }

  return parts.join(" ");
}