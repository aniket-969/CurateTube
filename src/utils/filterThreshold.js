export default function filterThreshold(groups, minCount) {
  return Object.fromEntries(
    Object.entries(groups).filter(([_, value]) => {
      const count = Array.isArray(value)
        ? value.length
        : value;

      return count >= minCount;
    })
  );
}