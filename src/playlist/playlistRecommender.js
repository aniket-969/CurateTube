const DEFAULT_LIMIT = 10;
const MAX_PER_FAMILY = 2;

function getFamily(playlist) {
  return (
    playlist.meta?.dominantValue ??
    playlist.meta?.values?.genre ??
    playlist.meta?.values?.mood ??
    playlist.meta?.values?.artist ??
    playlist.meta?.values?.era ??
    playlist.name
  );
}

function getLanguage(playlist) {
  return playlist.meta?.values?.language ?? null;
}

function getBranchKey(playlist) {
  const values = playlist.meta?.values ?? {};

  return [
    values.language,
    values.subgenre,
    values.mood,
    values.artist,
    values.era,
  ]
    .filter(Boolean)
    .join("|");
}

function getSongCount(playlist) {
  return playlist.videoIds?.length ?? 0;
}

function scoreCandidate(playlist, state) {
  const family = getFamily(playlist);
  const language = getLanguage(playlist);
  const branch = getBranchKey(playlist);

  let score = getSongCount(playlist);

  // Strong preference for a new dominant family.
  if (!state.families.has(family)) {
    score += 1000;
  }

  // Prefer a new language within an already-used family.
  const familyLanguages = state.languagesByFamily.get(family);

  if (
    familyLanguages &&
    language &&
    !familyLanguages.has(language)
  ) {
    score += 300;
  }

  // Prefer a branch we haven't already selected.
  if (!state.branches.has(`${family}|${branch}`)) {
    score += 100;
  }

  return score;
}

export function recommendPlaylists(
  playlists,
  limit = DEFAULT_LIMIT
) {
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return [];
  }

  const candidates = playlists
    .map((playlist, index) => ({
      playlist,
      index,
    }))
    .sort(
      (a, b) =>
        getSongCount(b.playlist) -
        getSongCount(a.playlist)
    );

  const selected = new Set();

  const state = {
    families: new Set(),
    branches: new Set(),
    languagesByFamily: new Map(),
    familyCounts: new Map(),
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

      const playlist = candidate.playlist;
      const family = getFamily(playlist);

      const familyCount =
        state.familyCounts.get(family) ?? 0;

      // Never automatically select more than two
      // playlists from the same dominant family.
      if (familyCount >= MAX_PER_FAMILY) {
        continue;
      }

      const score = scoreCandidate(
        playlist,
        state
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
    const family = getFamily(playlist);
    const language = getLanguage(playlist);
    const branch = getBranchKey(playlist);

    selected.add(bestCandidate.index);

    state.families.add(family);

    state.familyCounts.set(
      family,
      (state.familyCounts.get(family) ?? 0) + 1
    );

    state.branches.add(`${family}|${branch}`);

    if (!state.languagesByFamily.has(family)) {
      state.languagesByFamily.set(
        family,
        new Set()
      );
    }

    if (language) {
      state.languagesByFamily
        .get(family)
        .add(language);
    }
  }

  return playlists.map((playlist, index) => ({
    ...playlist,
    recommended: selected.has(index),
  }));
}

export default recommendPlaylists;