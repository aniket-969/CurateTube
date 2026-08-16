import { useEffect, useMemo, useState } from "react";
import { logout } from "../services/auth";
import { getPlaylists, getPlaylistItems } from "../services/youtube";
import { classifySongs } from "../services/llm/index.js";
import { playlistEngine } from "../playlist/playlistEngine.js";
import STRATEGIES from "../strategy/index.js";
import validatePlaylists from "../utils/validatePlaylist";
import recommendPlaylists from "../playlist/playlistRecommender.js";
import { initialPlaylist } from "../utils/data";

const DEV_MODE = true;
function PlaylistScreen({ user, setUser, onGenerated }) {
  const [playlists, setPlaylists] = useState(DEV_MODE ? initialPlaylist : []);
  const [nextPageToken, setNextPageToken] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    console.log("[PLAYLIST SCREEN] mounted");
    console.log("[PLAYLIST SCREEN] DEV_MODE:", DEV_MODE);

    if (DEV_MODE) {
      setLoading(false);
      return;
    }

    loadInitialPlaylists();
  }, []);

  async function loadInitialPlaylists() {
    try {
      const data = await getPlaylists(user.accessToken);
      console.log("Initial data", data);
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
      const data = await getPlaylists(user.accessToken, nextPageToken);

      setPlaylists((prev) => [...prev, ...data.playlists]);

      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handlePlaylistClick(playlist) {
    if (processing) return;

    setProcessing(true);

    try {
      let pageToken = "";

      const classificationJobs = [];

      while (true) {
        const { items, nextPageToken } = await getPlaylistItems(
          user.accessToken,
          playlist.id,
          pageToken
        );

        console.log(`Fetched ${items.length} videos`);

        // Start LLM processing immediately.
        // The YouTube fetching loop continues while
        // this request is running.
        const job = classifySongs(
          "deepseek",
          import.meta.env.VITE_DEEPSEEK_API_KEY,
          items
        );

        classificationJobs.push(job);

        if (!nextPageToken) {
          break;
        }

        pageToken = nextPageToken;
      }

      console.log("Finished fetching playlist.");

      // Wait for every LLM batch to finish.
      const results = await Promise.all(classificationJobs);

      // console.log("All videos classified:", results);

      // Combine all classified batches.
      const classifiedVideos = results.flat();

      console.log("Total classified videos:", classifiedVideos.length);

      // Run playlist engine ONCE on the complete dataset.
      const genrePlaylists = playlistEngine(classifiedVideos, STRATEGIES.genre);

      const artistPlaylists = playlistEngine(
        classifiedVideos,
        STRATEGIES.artist
      );
      const eraPlaylists = playlistEngine(classifiedVideos, STRATEGIES.era);

      const moodPlaylists = playlistEngine(classifiedVideos, STRATEGIES.mood);

      const generatedPlaylists = [
        ...genrePlaylists,
        ...artistPlaylists,
        ...eraPlaylists,
        ...moodPlaylists,
      ];

      console.log("Generated playlists:", generatedPlaylists);

      // Remove invalid candidates.
      const validatedPlaylists = validatePlaylists(generatedPlaylists);

      console.log("VALIDATED:", validatedPlaylists);

      // Decide which valid playlists should be
      // selected by default in the UI.
      const recommendedPlaylists = recommendPlaylists(validatedPlaylists);

      console.log(
        "RECOMMENDED:",
        recommendedPlaylists.filter((playlist) => playlist.recommended === true)
      );

      // Hand the final result to App.
      onGenerated(recommendedPlaylists);
    } catch (error) {
      console.error("Playlist processing failed:", error);
    } finally {
      setProcessing(false);
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
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">{user.profile.name}</p>

          <p className="text-sm text-gray-500">{user.profile.email}</p>
        </div>

        <button
          onClick={handleLogout}
          disabled={processing}
          className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Logout
        </button>
      </div>

      {/* Search / Load more */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={processing}
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none disabled:bg-gray-100"
        />

        {nextPageToken ? (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore || processing}
            className="whitespace-nowrap rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div className="flex items-center whitespace-nowrap px-2 text-xs text-gray-500">
            ✓ All Loaded
          </div>
        )}
      </div>

      {/* Playlist list */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {processing ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-medium">Processing playlist...</p>

            <p className="mt-1 text-sm text-gray-500">
              Fetching videos and analyzing them.
            </p>

            <p className="mt-3 text-xs text-gray-400">
              You can keep this window open while processing completes.
            </p>
          </div>
        ) : loading ? (
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
          <div className="py-10 text-center text-sm text-gray-500">
            <p>No matching playlists found.</p>

            {nextPageToken && (
              <p className="mt-2">Try loading more playlists.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistScreen;
