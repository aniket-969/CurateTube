import groupBy from "../utils/groupBy";
import filterThreshold from "../utils/filterThreshold";
import {createPlaylistCandidate,buildPlaylistName} from "../utils/createPlaylistCandidate";

function processLevels({
  playlists,
  videos,
  dominantValue,
  strategy,
  dominant,
  levelIndex,
  values,
}) {
  // Finished traversing all levels
  if (levelIndex >= strategy.levels.length) {
    return;
  }

  const currentLevel = strategy.levels[levelIndex];

  // Group by current level and apply its threshold
  const groups = filterThreshold(
    groupBy(videos, currentLevel.key),
    currentLevel.threshold
  );

  for (const [value, bucket] of Object.entries(groups)) {
    // Accumulate values discovered so far,
    // including the dominant value.
    const nextValues = {
      ...values,
      [dominant]: dominantValue,
      [currentLevel.key]: value,
    };

    // Generate playlist for this bucket
    playlists.push(
      createPlaylistCandidate(
        buildPlaylistName(strategy.nameOrder, nextValues),
        dominant,
        bucket
      )
    );

    // Continue traversing deeper
    processLevels({
      playlists,
      videos: bucket,
      dominantValue,
      strategy,
      dominant,
      levelIndex: levelIndex + 1,
      values: nextValues,
    });
  }
}

export default function playlistEngine(videos, config) {
  const playlists = [];

  // Group by dominant field
  const dominantGroups = filterThreshold(
    groupBy(videos, config.dominant),
    config.threshold
  );

  for (const [dominantValue, bucket] of Object.entries(dominantGroups)) {
    const strategy = config.strategies[dominantValue];

    // Unknown/fixed-tag genres are simply ignored
    if (!strategy) continue;

    // Create parent playlist if required
    if (strategy.createParent) {
      playlists.push(
        createPlaylistCandidate(
          dominantValue,
          config.dominant,
          bucket
        )
      );
    }

    processLevels({
      playlists,
      videos: bucket,
      dominantValue,
      strategy,
      dominant: config.dominant,
      levelIndex: 0,
      values: {},
    });
  }

  return playlists;
}