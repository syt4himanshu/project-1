const cache = new Map();

const CACHE_TTL = 60 * 1000;

const buildMenteesCacheKey = (facultyId, limit, offset) => `mentees_${facultyId}_${limit}_${offset}`;

const setMenteesCache = (facultyId, limit, offset, data) => {
  cache.set(buildMenteesCacheKey(facultyId, limit, offset), {
    data,
    expiry: Date.now() + CACHE_TTL,
  });
};

const getMenteesCache = (facultyId, limit, offset) => {
  const key = buildMenteesCacheKey(facultyId, limit, offset);
  const item = cache.get(key);

  if (item && item.expiry > Date.now()) return item.data;
  if (item) cache.delete(key);

  return null;
};

const invalidateMenteesCache = (facultyId) => {
  if (!facultyId) return;

  const prefix = `mentees_${facultyId}_`;
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};

module.exports = {
  CACHE_TTL,
  getMenteesCache,
  setMenteesCache,
  invalidateMenteesCache,
};
