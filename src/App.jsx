import { useState } from "react";
import LoginScreen from "./pages/login";
import PlaylistScreen from "./pages/playlist";

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      {!token ? (
        <LoginScreen setToken={setToken} />
      ) : (
        <PlaylistScreen token={token} />
      )}
    </>
  );
}

export default App;