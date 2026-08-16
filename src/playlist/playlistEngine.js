import groupBy from "../utils/groupBy";
import filterThreshold from "../utils/filterThreshold";
import {
  createPlaylistCandidate,
  buildPlaylistName,
} from "../utils/createPlaylistCandidate";

function processLevels({
  playlists,
  videos,
  dominantValue,
  strategy,
  dominant,
  levelIndex,
  values,
}) {
  // console.log("[PROCESS LEVELS]", {
  //   dominant,
  //   dominantValue,
  //   levelIndex,
  //   currentLevel: strategy.levels[levelIndex],
  //   videoCount: videos.length,
  // });
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
    // Keep track of all values discovered so far
    const nextValues = {
      ...values,
      [dominant]: dominantValue,
      [currentLevel.key]: value,
    };

    // Generate playlist for this level
    playlists.push(
      createPlaylistCandidate(
        buildPlaylistName(currentLevel.nameOrder, nextValues),
        dominant,
        bucket,
        {
          dominant,
          dominantValue,
          levelIndex,
          values: nextValues,
        }
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

export function playlistEngine(videos, config) {
  const playlists = [];

  // Group by dominant field
  const rawGroups = groupBy(videos, config.dominant);

  const dominantGroups = filterThreshold(rawGroups, config.threshold);

  for (const [dominantValue, bucket] of Object.entries(dominantGroups)) {
    const configuredStrategy =
      config.strategies?.[dominantValue] ?? config.defaultStrategy;

    // Unknown/fixed-tag dominant values are ignored
    if (!configuredStrategy) continue;

    // Normalize single strategy or multiple strategies
    const strategies = Array.isArray(configuredStrategy)
      ? configuredStrategy
      : [configuredStrategy];

    for (const strategy of strategies) {
      // Create parent playlist if required
      if (strategy.createParent) {
        playlists.push(
          createPlaylistCandidate(dominantValue, config.dominant, bucket, {
            dominant: config.dominant,
            dominantValue,
            levelIndex: -1,
            values: {
              [config.dominant]: dominantValue,
            },
          })
        );
      }
      // console.log("[PLAYLIST ENGINE] Running strategy:", {
      //   dominant: config.dominant,
      //   dominantValue,
      //   strategy,
      //   bucketSize: bucket.length,
      // });
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
  }

  return playlists;
}
