import { useEffect, useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";
import GeneratedPlaylists from "./pages/generatedPlaylist";
import { validateStoredUser } from "./services/auth";
import { syncGeneratedPlaylist } from "./services/ytPlaylistWriter";
import { DEV_USER, initialPlaylist, recommendedPl } from "./utils/data";

const DEV_MODE = false;

function App() {
  const [user, setUser] = useState(DEV_MODE ? DEV_USER : undefined);

  const [screen, setScreen] = useState(DEV_MODE ? "generated" : "playlists");

  const [generatedPlaylists, setGeneratedPlaylists] = useState(
    DEV_MODE ? recommendedPl : []
  );

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

  async function handleGenerate(selectedPlaylists) {
    // console.log("Creating YouTube playlists:", selectedPlaylists);

    const results = [];
    console.log("Final created playlists", selectedPlaylists);
   
    for (const playlist of selectedPlaylists) {
      try {
        const result = await syncGeneratedPlaylist(user.accessToken, playlist);

        results.push(result);
      } catch (error) {
        console.error(`Failed to sync playlist "${playlist.name}":`, error);

        results.push({
          name: playlist.name,
          status: "failed",
          error: error.message,
        });
      }
    }

    console.log("YouTube playlist creation results:", results);

    return results;
  }

  if (user === undefined) {
    return (
      <div className="w-[400px] h-[560px] overflow-hidden bg-white">
        <div className="flex h-full items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-[400px] h-[560px] overflow-hidden bg-white">
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

  return (
    <PlaylistScreen
      user={user}
      setUser={setUser}
      onGenerated={handleGeneratedPlaylists}
    />
  );
}

export default App;
