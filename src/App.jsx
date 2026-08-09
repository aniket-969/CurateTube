import { useEffect, useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";
import GeneratedPlaylists from "./pages/GeneratedPlaylists";
import { validateStoredUser } from "./services/auth";

function App() {
  const [user, setUser] = useState(undefined);

  const [screen, setScreen] = useState("playlists");

  const [generatedPlaylists, setGeneratedPlaylists] =
    useState([]);

  useEffect(() => {
    async function init() {
      const user = await validateStoredUser();
      setUser(user);
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

  if (user === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen setUser={setUser} />;
  }

  if (screen === "generated") {
    return (
      <GeneratedPlaylists
        playlists={generatedPlaylists}
        onBack={handleBackToPlaylists}
        onGenerate={(selectedPlaylists) => {
          console.log(
            "Ready to create YouTube playlists:",
            selectedPlaylists
          );
        }}
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