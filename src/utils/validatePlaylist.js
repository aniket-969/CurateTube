const DEFAULT_OPTIONS = {
  childSimilarityThreshold: 0.75,
  childrenCoverageThreshold: 0.85,

  smallPlaylistThresholds: [
    { maxSize: 10, threshold: 0.6 },
    { maxSize: 20, threshold: 0.7 },
    { maxSize: 50, threshold: 0.725 },
  ],

  smallPlaylistMaxSize: 20,
  smallPlaylistMaxRemaining: 3,
};

export default function validatePlaylists(playlists, options = {}) {
  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const {
    childSimilarityThreshold,
    childrenCoverageThreshold,
    smallPlaylistMaxSize,
    smallPlaylistMaxRemaining,
  } = config;

  const removed = new Set();

  for (const parent of playlists) {
    const children = playlists.filter(
      (candidate) => candidate !== parent && isDirectChild(parent, candidate)
    );

    if (children.length === 0) {
      continue;
    }

    // Remove children that are too similar to their parent.
    const remainingChildren = [];

    for (const child of children) {
      const parentSize = parent.videoIds.length;
      const childSize = child.videoIds.length;

      if (parentSize === 0) {
        continue;
      }

      const similarity = childSize / parentSize;

      const threshold = getChildSimilarityThreshold(
        parentSize,
        config
      );

      const remainingVideos = parentSize - childSize;

      // A child is redundant if:
      // 1. It covers too much of the parent based on the
      //    size-dependent similarity threshold, OR
      // 2. The parent is small and only a few videos would
      //    remain outside the child.
      const tooSimilar =
        similarity >= threshold ||
        (parentSize <= smallPlaylistMaxSize &&
          remainingVideos <= smallPlaylistMaxRemaining);

      if (tooSimilar) {
        removed.add(child);
      } else {
        remainingChildren.push(child);
      }
    }

    // Check whether the remaining children collectively
    // cover enough of the parent.
    if (remainingChildren.length === 0) {
      continue;
    }

    const childVideoIds = new Set();

    for (const child of remainingChildren) {
      for (const videoId of child.videoIds) {
        childVideoIds.add(videoId);
      }
    }

    const coverage = childVideoIds.size / parent.videoIds.length;

    if (coverage >= childrenCoverageThreshold) {
      removed.add(parent);
    }
  }

  return playlists.filter((playlist) => !removed.has(playlist));
}

// Get the similarity threshold based on parent playlist size.

function getChildSimilarityThreshold(parentSize, options) {
  for (const rule of options.smallPlaylistThresholds) {
    if (parentSize <= rule.maxSize) {
      return rule.threshold;
    }
  }

  return options.childSimilarityThreshold;
}

// Check whether candidate is a direct child of parent.

function isDirectChild(parent, candidate) {
  if (!parent.meta || !candidate.meta) {
    return false;
  }

  if (candidate.meta.levelIndex !== parent.meta.levelIndex + 1) {
    return false;
  }

  if (candidate.meta.dominantValue !== parent.meta.dominantValue) {
    return false;
  }

  for (const [key, value] of Object.entries(parent.meta.values)) {
    if (candidate.meta.values[key] !== value) {
      return false;
    }
  }

  return true;
}