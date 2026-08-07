import groupBy from "./utils/groupBy";
import filterThreshold from "./utils/filterThreshold";
import buildPlaylistName from "./utils/buildPlaylistName";
import createPlaylistCandidate from "./utils/createPlaylistCandidate";

function processLevels({
  playlists,
  videos,
  dominantValue,
  strategy,
  levelIndex,
  values,
}) {
  // No more levels to process
  if (levelIndex >= strategy.levels.length) {
    return;
  }

  const currentLevel = strategy.levels[levelIndex];

  // Group by current level
  const groups = filterThreshold(
    groupBy(videos, currentLevel),
    THRESHOLDS[currentLevel.toUpperCase()]
  );

  for (const [value, bucket] of Object.entries(groups)) {
    // Keep track of all values discovered so far
    const nextValues = {
      ...values,
      [currentLevel]: value,
    };

    // Create playlist immediately
    playlists.push(
      createPlaylistCandidate(
        buildPlaylistName(
          strategy.nameOrder,
          dominantValue,
          nextValues
        ),
        "genre",
        bucket
      )
    );

    // Continue splitting if more levels exist
    processLevels({
      playlists,
      videos: bucket,
      dominantValue,
      strategy,
      levelIndex: levelIndex + 1,
      values: nextValues,
    });
  }
}

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