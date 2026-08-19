import { useEffect, useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";
import AIConfig from "./pages/aiConfig";
import GeneratedPlaylists from "./pages/generatedPlaylist";
import CreatingPlaylists from "./pages/CreatingPlaylists";
import { validateStoredUser } from "./services/auth";
import { syncGeneratedPlaylist } from "./services/ytPlaylistWriter";

function App() {
  const [user, setUser] = useState(undefined);

  const [screen, setScreen] = useState("playlists");

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [aiConfig, setAiConfig] = useState(null);

  const [generatedPlaylists, setGeneratedPlaylists] = useState([]);

  function handleAIConfigError() {
    setAiConfig(null);
    setScreen("aiConfig");
  }

  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [creationProgress, setCreationProgress] = useState(null);
  const [creationResults, setCreationResults] = useState([]);

  useEffect(() => {

    async function init() {
      const storedUser = await validateStoredUser();
      setUser(storedUser);
    }

    init();
  }, []);

  function handlePlaylistSelected(playlist) {
    setSelectedPlaylist(playlist);
    setScreen("aiConfig");
  }

  function handleAIConfigured(config) {
    setAiConfig(config);
    setScreen("playlists");
  }

  function handleBackToPlaylists() {
    setSelectedPlaylist(null);
    setAiConfig(null);
    setScreen("playlists");
  }

  function handleGeneratedPlaylists(playlists) {
    setGeneratedPlaylists(playlists);
    setScreen("generated");
  }

  async function handleGenerate(playlistsToCreate) {
   
    setSelectedPlaylists(playlistsToCreate);

    setCreationResults([]);

    setCreationProgress({
      type: "starting",
      totalPlaylists: playlistsToCreate.length,
      completedPlaylists: 0,
      currentPlaylist: null,
    });

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
              totalPlaylists: playlistsToCreate.length,
              completedPlaylists: i,
            });
          }
        );

        results.push(result);

        setCreationProgress((prev) => ({
          ...prev,
          type: "playlist-complete",
          totalPlaylists: playlistsToCreate.length,
          completedPlaylists: i + 1,
          currentPlaylist: playlist.name,
          playlistName: playlist.name,
        }));
      } catch (error) {
        console.error(`Failed to sync playlist "${playlist.name}":`, error);

        results.push({
          name: playlist.name,
          status: "failed",
          error: error?.message || String(error),
        });

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

    setCreationResults(results);

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

  if (screen === "aiConfig") {
    return (
      <AIConfig
        playlist={selectedPlaylist}
        onContinue={handleAIConfigured}
        onBack={handleBackToPlaylists}
      />
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
        <p className="text-lg font-semibold">Playlists created</p>

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
      onPlaylistSelected={handlePlaylistSelected}
      selectedPlaylist={selectedPlaylist}
      aiConfig={aiConfig}
      onGenerated={handleGeneratedPlaylists}
      onAIConfigError={handleAIConfigError}
    />
  );
}

export default App;
