/**
 * Groups videos by one or more properties.
 *
 * Examples:
 * groupBy(videos, "language")
 * groupBy(videos, ["mood", "language"])
 * groupBy(videos, ["genre", "language", "subgenre"])
 */
export default function groupBy(videos, keys) {
  const groupKeys = Array.isArray(keys) ? keys : [keys];
  const groups = {};

  for (const video of videos) {
    // Normalize every property into an array
    const valuesPerKey = groupKeys.map((key) => {
      const value = video[key];

      if (value == null) return [];

      return Array.isArray(value) ? value.filter(Boolean) : [value];
    });

    // Skip if any required key is missing
    if (valuesPerKey.some((values) => values.length === 0)) {
      continue;
    }

    // Generate every possible combination (Cartesian product)
    const combinations = cartesianProduct(valuesPerKey);

    for (const combination of combinations) {
      const bucketKey = combination.join("||");

      if (!groups[bucketKey]) {
        groups[bucketKey] = [];
      }

      groups[bucketKey].push(video);
    }
  }

  return groups;
}

/**
 * Cartesian product
 *
 * Example:
 * [
 *   ["Pop", "Bollywood"],
 *   ["Hindi"],
 *   ["Dance", "Indie"]
 * ]
 *
 * =>
 *
 * [
 *   ["Pop", "Hindi", "Dance"],
 *   ["Pop", "Hindi", "Indie"],
 *   ["Bollywood", "Hindi", "Dance"],
 *   ["Bollywood", "Hindi", "Indie"]
 * ]
 */
function cartesianProduct(arrays) {
  return arrays.reduce(
    (acc, current) => {
      const result = [];

      for (const prefix of acc) {
        for (const value of current) {
          result.push([...prefix, value]);
        }
      }

      return result;
    },
    [[]]
  );
}