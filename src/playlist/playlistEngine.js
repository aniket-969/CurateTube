import groupBy from "./utils/groupBy";
import filterThreshold from "./utils/filterThreshold";
import buildPlaylistName from "./utils/buildPlaylistName";
import createPlaylistCandidate from "./utils/createPlaylistCandidate";

export default function playlistEngine(videos, config) {
  const playlists = [];

  const dominantGroups = filterThreshold(
    groupBy(videos, config.dominant),
    config.threshold
  );

  // Process each dominant bucket
  for (const [dominantValue, bucket] of Object.entries(dominantGroups)) {
    const strategy = config.strategies[dominantValue];

    if (!strategy) continue;

    processLevels({
      playlists,
      videos: bucket,
      dominantValue,
      strategy,
      levelIndex: 0,
      values: {},
    });
  }

  return playlists;
}