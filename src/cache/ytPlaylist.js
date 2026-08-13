let playlistCache = null;
let playlistCachePromise = null;

export function getPlaylistCache() {
  return playlistCache;
}

export function setPlaylistCache(cache) {
  playlistCache = cache;
}

export function getPlaylistCachePromise() {
  return playlistCachePromise;
}

export function setPlaylistCachePromise(promise) {
  playlistCachePromise = promise;
}

export function clearPlaylistCache() {
  playlistCache = null;
  playlistCachePromise = null;
}