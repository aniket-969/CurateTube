const DEFAULT_LIMIT = 10;

const DEFAULT_OPTIONS = {
  // How strongly we reward a dominant type that has not yet been represented.
  typeDiversityBonus: 12,

  // How strongly we reward a new family within a type.
  familyDiversityBonus: 6,

  // How strongly we reward a new branch.
  branchDiversityBonus: 2,
};

function getDominantType(playlist) {
  return playlist.meta?.dominant ?? playlist.type ?? null;
}

function getDominantValue(playlist) {
  return playlist.meta?.dominantValue ?? null;
}

function getFamilyKey(playlist) {
  const dominant = getDominantType(playlist);
  const dominantValue = getDominantValue(playlist);

  if (!dominant || !dominantValue) {
    return null;
  }

  return `${dominant}|${dominantValue}`;
}

function getBranchKey(playlist) {
  const values = playlist.meta?.values ?? {};

  return [
    values.language,
    values.subgenre,
    values.mood,
    values.artists,
    values.artist,
    values.era,
    values.genre,
  ]
    .filter(Boolean)
    .join("|");
}

function getSongCount(playlist) {
  return playlist.videoIds?.length ?? 0;
}

function scoreCandidate(playlist, state, options) {
  const dominant = getDominantType(playlist);
  const family = getFamilyKey(playlist);
  const branch = getBranchKey(playlist);

  let score = getSongCount(playlist);

  // Strongest diversity bonus:
  // reward a completely new playlist type.
  if (dominant && !state.types.has(dominant)) {
    score += options.typeDiversityBonus;
  }

  // Reward a new family within an already-used type.
  if (family && !state.families.has(family)) {
    score += options.familyDiversityBonus;
  }

  // Small bonus for a new branch.
  if (branch && !state.branches.has(`${family}|${branch}`)) {
    score += options.branchDiversityBonus;
  }

  return score;
}

export function recommendPlaylists(
  playlists,
  limit = DEFAULT_LIMIT,
  options = {}
) {
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return [];
  }

  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const candidates = playlists.map((playlist, index) => ({
    playlist,
    index,
  }));

  const selected = new Set();

  const state = {
    types: new Set(),
    families: new Set(),
    branches: new Set(),
  };

  while (
    selected.size < limit &&
    selected.size < candidates.length
  ) {
    let bestCandidate = null;
    let bestScore = -Infinity;

    for (const candidate of candidates) {
      if (selected.has(candidate.index)) {
        continue;
      }

      const score = scoreCandidate(
        candidate.playlist,
        state,
        config
      );

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    if (!bestCandidate) {
      break;
    }

    const playlist = bestCandidate.playlist;

    const dominant = getDominantType(playlist);
    const family = getFamilyKey(playlist);
    const branch = getBranchKey(playlist);

    selected.add(bestCandidate.index);

    if (dominant) {
      state.types.add(dominant);
    }

    if (family) {
      state.families.add(family);
    }

    if (branch) {
      state.branches.add(`${family}|${branch}`);
    }
  }

  return playlists.map((playlist, index) => ({
    ...playlist,
    recommended: selected.has(index),
  }));
}

export default recommendPlaylists;