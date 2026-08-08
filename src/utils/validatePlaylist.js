const DEFAULT_OPTIONS = {
  childSimilarityThreshold: 0.75,
  childrenCoverageThreshold: 0.85,
};

export default function validatePlaylists(playlists, options = {}) {
  const { childSimilarityThreshold, childrenCoverageThreshold } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

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
      const similarity = child.videoIds.length / parent.videoIds.length;

      if (similarity >= childSimilarityThreshold) {
        removed.add(child);
      } else {
        remainingChildren.push(child);
      }
    }

    // Check whether the remaining children collectively cover enough of the parent.

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

// Check whether candidate is a direct child of parent

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
