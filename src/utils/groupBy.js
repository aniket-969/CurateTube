export default function groupBy(videos, key) {
  const groups = {};

  for (const video of videos) {
    const values = Array.isArray(video[key])
      ? video[key].filter(Boolean)
      : [video[key]];

    for (const value of values) {
      if (!value) continue;

      if (!groups[value]) {
        groups[value] = [];
      }

      groups[value].push(video);
    }
  }

  return groups;
}