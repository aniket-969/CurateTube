import { useEffect, useRef, useState } from "react";
import { logout } from "../services/auth";
import { getPlaylists, getPlaylistItems } from "../services/youtube";

function PlaylistScreen({ user, setUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollContainerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    loadInitialPlaylists();
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          nextPageToken &&
          !loadingMore
        ) {
          loadMorePlaylists();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [nextPageToken, loadingMore]);

  async function loadInitialPlaylists() {
    try {
      const data = await getPlaylists(user.accessToken);

      setPlaylists(data.playlists);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMorePlaylists() {
    if (!nextPageToken || loadingMore) return;

    setLoadingMore(true);

    try {
      const data = await getPlaylists(
        user.accessToken,
        nextPageToken
      );

      setPlaylists((prev) => [...prev, ...data.playlists]);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handlePlaylistClick(playlist) {
    try {
      const items = await getPlaylistItems(
        user.accessToken,
        playlist.id
      );

      console.log(playlist.title);
      console.log(items);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <div className="w-[380px] h-[500px] p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={user.profile.picture}
            alt={user.profile.name}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="font-semibold">{user.profile.name}</p>
            <p className="text-sm text-gray-500">
              {user.profile.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm"
        >
          Logout
        </button>
      </div>

      <h2 className="mb-3 font-semibold">Your Playlists</h2>

      {loading ? (
        <p>Loading playlists...</p>
      ) : (
        <div
          ref={scrollContainerRef}
          className="max-h-[360px] overflow-y-auto space-y-2"
        >
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist)}
              className="w-full rounded-lg border p-3 text-left hover:bg-gray-100"
            >
              <div className="font-medium">{playlist.title}</div>

              <div className="text-sm text-gray-500">
                {playlist.itemCount} videos
              </div>
            </button>
          ))}

          <div ref={loadMoreRef} className="h-4" />

          {loadingMore && (
            <p className="py-2 text-center text-sm text-gray-500">
              Loading more...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PlaylistScreen;