const DEFAULT_LIMIT = 10;
const MAX_PER_FAMILY = 2;

function getFamilyKey(playlist) {
  const values = playlist.meta?.values;

  if (!values) {
    return playlist.meta?.dominantValue ?? playlist.name;
  }

  return (
    playlist.meta?.dominantValue ??
    values.genre ??
    values.mood ??
    values.artist ??
    values.era ??
    playlist.name
  );
}

export function recommendPlaylists(
  playlists,
  limit = DEFAULT_LIMIT
) {
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return [];
  }

  const sorted = [...playlists].sort(
    (a, b) =>
      (b.videoIds?.length ?? 0) -
      (a.videoIds?.length ?? 0)
  );

  const familyCounts = new Map();
  const recommendedIndexes = new Set();

  // Select the largest playlist from each family,up to the requested limit.
  for (let index = 0; index < sorted.length; index++) {
    if (recommendedIndexes.size >= limit) {
      break;
    }

    const playlist = sorted[index];
    const family = getFamilyKey(playlist);

    const count = familyCounts.get(family) ?? 0;

    if (count >= MAX_PER_FAMILY) {
      continue;
    }

    familyCounts.set(family, count + 1);
    recommendedIndexes.add(index);
  }

  return sorted.map((playlist, index) => ({
    ...playlist,
    recommended: recommendedIndexes.has(index),
  }));
}

export default recommendPlaylists;