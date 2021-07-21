const NodeCache = require("node-cache");

const Cache = new NodeCache({
  stdTTL: 0,
});

console.info("Initialized in-memory cache");

const getCacheValue = (key) => {
  try {
    const value = Cache.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (err) {
    console.error(`Error retrieving cache value for ${key}`);
    console.error(err);
    return null;
  }
};

const setCacheValue = (key, value) => {
  try {
    Cache.set(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting cache value for ${key}`);
    console.error(err);
  }
};

const deleteCacheKey = (key) => {
  try {
    Cache.del(key);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getCacheValue,
  setCacheValue,
  deleteCacheKey,
};
