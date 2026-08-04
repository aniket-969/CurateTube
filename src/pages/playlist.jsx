import { useEffect, useState } from "react";
import { logout } from "../services/auth";
import { getPlaylists, getPlaylistItems } from "../services/youtube";

function PlaylistScreen({ user, setUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    try {
      const data = await getPlaylists(user.accessToken);
      setPlaylists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaylistClick(playlist) {
    console.log(playlist)
    try {
      const items = await getPlaylistItems(user.accessToken, playlist.id);

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
            <p className="text-sm text-gray-500">{user.profile.email}</p>
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
        <div className="space-y-2 max-h-[360px] overflow-y-auto">
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
        </div>
      )}
    </div>
  );
}

export default PlaylistScreen;