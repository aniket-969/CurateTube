import { useEffect, useMemo, useState } from "react";
import { logout } from "../services/auth";
import { getPlaylists, getPlaylistItems } from "../services/youtube";

function PlaylistScreen({ user, setUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadInitialPlaylists();
  }, []);

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

  async function handleLoadMore() {
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
      let pageToken = "";

      while (true) {
        const { items, nextPageToken } = await getPlaylistItems(
          user.accessToken,
          playlist.id,
          pageToken
        );

        console.log(`Fetched ${items.length} videos`);
        console.log(items);

        if (!nextPageToken) {
          break;
        }

        pageToken = nextPageToken;
      }

      console.log("Finished fetching playlist.");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  const filteredPlaylists = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return playlists;

    return playlists.filter((playlist) =>
      playlist.title.toLowerCase().includes(query)
    );
  }, [playlists, search]);

  return (
    <div className="w-[380px] h-[500px] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-5">
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

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
        />

        {nextPageToken ? (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-lg border px-3 py-2 text-sm whitespace-nowrap disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div className="flex items-center px-2 text-xs text-gray-500 whitespace-nowrap">
            ✓ All Loaded
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <p>Loading playlists...</p>
        ) : filteredPlaylists.length ? (
          filteredPlaylists.map((playlist) => (
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
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 py-10">
            <p>No matching playlists found.</p>

            {nextPageToken && (
              <p className="mt-2">
                Try loading more playlists.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistScreen;