import { useEffect, useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";
import GeneratedPlaylists from "./pages/generatedPlaylist";
import CreatingPlaylists from "./pages/CreatingPlaylists";
import { validateStoredUser } from "./services/auth";
import { syncGeneratedPlaylist } from "./services/ytPlaylistWriter";
import { DEV_USER, recommendedPl } from "./utils/data";

const DEV_MODE = false;

function App() {
  const [user, setUser] = useState(
    DEV_MODE ? DEV_USER : undefined
  );

  const [screen, setScreen] = useState(
    DEV_MODE ? "generated" : "playlists"
  );

  const [generatedPlaylists, setGeneratedPlaylists] = useState(
    DEV_MODE ? recommendedPl : []
  );

  // Playlists selected by the user on the generated screen.
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  // Live progress while playlists are being created.
  const [creationProgress, setCreationProgress] = useState(null);

  // Final results from YouTube playlist creation.
  const [creationResults, setCreationResults] = useState([]);

  useEffect(() => {
    if (DEV_MODE) {
      return;
    }

    async function init() {
      const storedUser = await validateStoredUser();
      setUser(storedUser);
    }

    init();
  }, []);

  function handleGeneratedPlaylists(playlists) {
    setGeneratedPlaylists(playlists);
    setScreen("generated");
  }

  function handleBackToPlaylists() {
    setScreen("playlists");
  }

  async function handleGenerate(playlistsToCreate) {
    console.log(
      "Final selected playlists:",
      playlistsToCreate
    );

    // Keep these available to the creating screen.
    setSelectedPlaylists(playlistsToCreate);

    // Clear results from any previous generation.
    setCreationResults([]);

    // Initialize progress.
    setCreationProgress({
      type: "starting",
      totalPlaylists: playlistsToCreate.length,
      completedPlaylists: 0,
      currentPlaylist: null,
    });

    // Immediately move away from the selection screen.
    setScreen("creating");

    const results = [];

    for (let i = 0; i < playlistsToCreate.length; i++) {
      const playlist = playlistsToCreate[i];

      try {
        const result = await syncGeneratedPlaylist(
          user.accessToken,
          playlist,
          (progress) => {
            setCreationProgress({
              ...progress,

              // Overall playlist progress
              totalPlaylists: playlistsToCreate.length,
              completedPlaylists: i,
            });
          }
        );

        results.push(result);

        // Mark the playlist as completed.
        setCreationProgress((prev) => ({
          ...prev,
          type: "playlist-complete",
          totalPlaylists: playlistsToCreate.length,
          completedPlaylists: i + 1,
          currentPlaylist: playlist.name,
          playlistName: playlist.name,
        }));
      } catch (error) {
        console.error(
          `Failed to sync playlist "${playlist.name}":`,
          error
        );

        results.push({
          name: playlist.name,
          status: "failed",
          error: error?.message || String(error),
        });

        // A failed playlist is still processed, so advance
        // the overall playlist counter.
        setCreationProgress((prev) => ({
          ...prev,
          type: "playlist-failed",
          totalPlaylists: playlistsToCreate.length,
          completedPlaylists: i + 1,
          currentPlaylist: playlist.name,
          playlistName: playlist.name,
        }));
      }
    }

    console.log(
      "YouTube playlist creation results:",
      results
    );

    setCreationResults(results);

    // Everything is finished.
    setScreen("results");
  }

  if (user === undefined) {
    return (
      <div className="h-[560px] w-[400px] overflow-hidden bg-[#0f0f0f]">
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[560px] w-[400px] overflow-hidden bg-[#0f0f0f]">
        <LoginScreen setUser={setUser} />
      </div>
    );
  }

  if (screen === "generated") {
    return (
      <GeneratedPlaylists
        playlists={generatedPlaylists}
        onBack={handleBackToPlaylists}
        onGenerate={handleGenerate}
      />
    );
  }

  if (screen === "creating") {
    return (
      <CreatingPlaylists
        progress={creationProgress}
        playlists={selectedPlaylists}
      />
    );
  }

  if (screen === "results") {
    return (
      <div className="flex h-[560px] w-[400px] flex-col items-center justify-center bg-[#0f0f0f] text-center text-white">
        <p className="text-lg font-semibold">
          Playlists created
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          {creationResults.length} playlist
          {creationResults.length === 1 ? "" : "s"} processed.
        </p>

        <button
          onClick={handleBackToPlaylists}
          className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <PlaylistScreen
      user={user}
      setUser={setUser}
      onGenerated={handleGeneratedPlaylists}
    />
  );
}

export default App;