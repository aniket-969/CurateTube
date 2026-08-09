import { useEffect, useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";
import GeneratedPlaylists from "./pages/generatedPlaylist";
import { validateStoredUser } from "./services/auth";
import { syncGeneratedPlaylist } from "./services/ytPlaylistWriter";

function App() {
  const [user, setUser] = useState(undefined);

  const [screen, setScreen] = useState("playlists");

  const [generatedPlaylists, setGeneratedPlaylists] = useState([]);

  useEffect(() => {
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
    console.log("Creating YouTube playlists:", selectedPlaylists);

    const results = [];

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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginScreen />;
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
