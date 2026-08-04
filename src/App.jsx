import { useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user ? (
        <LoginScreen setUser={setUser} />
      ) : (
        <PlaylistScreen user={user} />
      )}
    </>
  );
}

export default App;