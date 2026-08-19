import { useEffect, useMemo, useRef, useState } from "react";
import { logout } from "../services/auth";
import { getPlaylists, getPlaylistItems } from "../services/youtube";
import { classifySongs } from "../services/llm/index.js";
import { playlistEngine } from "../playlist/playlistEngine.js";
import STRATEGIES from "../strategy/index.js";
import validatePlaylists from "../playlist/playlistValidator.js";
import recommendPlaylists from "../playlist/playlistRecommender.js";

function PlaylistScreen({
  user,
  setUser,
  onPlaylistSelected,
  selectedPlaylist,
  aiConfig,
  onGenerated,
  onAIConfigError,
}) {
  const [playlists, setPlaylists] = useState([]);
  const [processingError, setProcessingError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [processing, setProcessing] = useState(false);

  const processingStarted = useRef(false);

  useEffect(() => {
    loadInitialPlaylists();
  }, []);

  useEffect(() => {
    if (!selectedPlaylist || !aiConfig) return;
    if (processingStarted.current) return;

    processingStarted.current = true;
    handlePlaylistProcessing(selectedPlaylist, aiConfig);
  }, [selectedPlaylist, aiConfig]);

  async function loadInitialPlaylists() {
    try {
      const data = await getPlaylists(user.accessToken);

      setPlaylists(data.playlists);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);

      setProcessingError({
        source: error?.source || "youtube",
        status: error?.status,
        reason: error?.reason,
        message: error?.message || "Failed to load playlists.",
      });
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
       setProcessingError({
    source: error?.source || "youtube",
    status: error?.status,
    reason: error?.reason,
    message: error?.message || "Failed to load more playlists.",
  });
    }
  }

  function handlePlaylistClick(playlist) {
    if (processing) return;

    onPlaylistSelected(playlist);
  }

  async function handlePlaylistProcessing(playlist, config) {
    setProcessing(true);
    setProcessingError(null);
    try {
      let pageToken = "";
      const classificationJobs = [];

      while (true) {
        const { items, nextPageToken } = await getPlaylistItems(
          user.accessToken,
          playlist.id,
          pageToken
        );

        const job = classifySongs(config.provider, config.apiKey, items);

        classificationJobs.push(job);

        if (!nextPageToken) {
          break;
        }

        pageToken = nextPageToken;
      }

      const results = await Promise.all(classificationJobs);

      const classifiedVideos = results.flat();

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

      // console.log("Generated playlists:", generatedPlaylists);

      const validatedPlaylists = validatePlaylists(generatedPlaylists);

      // console.log("VALIDATED:", validatedPlaylists);

      const recommendedPlaylists = recommendPlaylists(validatedPlaylists);

      // console.log("RECOMMENDED:", recommendedPlaylists);

      onGenerated(recommendedPlaylists);
    } catch (error) {
      console.error("Playlist processing failed:", error);

      setProcessingError({
        source: error?.source || "unknown",
        message: error?.message || "Failed to process playlist.",
      });
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
    <div className="flex h-full flex-col bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.profile.name}
          </p>

          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {user.profile.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={processing}
          className="
        rounded-lg border border-zinc-700 bg-zinc-900
        px-3 py-1.5 text-xs font-medium text-zinc-300
        transition
        hover:border-zinc-600 hover:bg-zinc-800 hover:text-white
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50
      "
        >
          Logout
        </button>
      </header>

      {/* Search */}
      <div className="px-4 pb-3 pt-3">
        <div className="relative">
          {/* Search icon */}
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={processing}
            className="
          h-11 w-full rounded-xl
          border border-zinc-700
          bg-zinc-900/60
          pl-9 pr-3
          text-sm text-white
          placeholder:text-zinc-600
          outline-none
          transition
          focus:border-zinc-500
          focus:bg-zinc-900
          disabled:cursor-not-allowed disabled:opacity-50
        "
          />
        </div>

        {/* List status */}
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[11px] text-zinc-600">
            {filteredPlaylists.length} playlists
          </span>

          {nextPageToken ? (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore || processing}
              className="
            text-[11px] font-medium text-zinc-400
            transition hover:text-white
            disabled:opacity-50
          "
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
              <span className="text-emerald-500">✓</span>
              All playlists loaded
            </span>
          )}
        </div>
      </div>

      {/* Playlist list */}
      <div
        className="
      min-h-0 flex-1
      overflow-y-auto
      px-4 pb-4
      scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700
    "
      >
        {processing ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            {/* Loading indicator */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-red-500" />
            </div>

            <p className="text-sm font-medium text-white">
              Processing playlist
            </p>

            <p className="mt-1.5 max-w-[260px] text-xs leading-5 text-zinc-500">
              Fetching videos and analyzing them with AI.
            </p>

            <p className="mt-3 max-w-[240px] text-[11px] leading-4 text-zinc-600">
              Keep this window open while processing completes.
            </p>
          </div>
        ) : processingError ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <p className="text-sm font-medium text-white">Processing failed</p>

            <p className="mt-1.5 max-w-[280px] text-xs leading-5 text-zinc-500">
              {processingError.message}
            </p>

            {processingError.source === "llm" ? (
              <button
                onClick={() => {
                  setProcessingError(null);
                  processingStarted.current = false;
                  onAIConfigError();
                }}
                className="
          mt-5 rounded-lg
          bg-white px-4 py-2
          text-xs font-semibold text-zinc-900
          transition
          hover:bg-zinc-200
        "
              >
                Change AI settings
              </button>
            ) : (
              <button
                onClick={() => {
                  setProcessingError(null);
                  processingStarted.current = false;
                }}
                className="
          mt-5 rounded-lg
          bg-white px-4 py-2
          text-xs font-semibold text-zinc-900
          transition
          hover:bg-zinc-200
        "
              >
                Back to playlists
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-300" />
              Loading playlists...
            </div>
          </div>
        ) : filteredPlaylists.length ? (
          <div className="space-y-2">
            {filteredPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist)}
                className="
              group
              w-full
              rounded-xl
              border border-zinc-800
              bg-zinc-900/40
              px-4 py-3.5
              text-left
              transition-all
              hover:border-zinc-700
              hover:bg-zinc-900
              active:scale-[0.995]
            "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-100">
                      {playlist.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {playlist.itemCount}{" "}
                      {playlist.itemCount === 1 ? "video" : "videos"}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="
                  h-4 w-4 shrink-0
                  text-zinc-700
                  transition
                  group-hover:translate-x-0.5
                  group-hover:text-zinc-400
                "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            <p className="text-sm font-medium text-zinc-300">
              No playlists found
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              {nextPageToken
                ? "click on load more btn below search input."
                : "Try a different search."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistScreen;
