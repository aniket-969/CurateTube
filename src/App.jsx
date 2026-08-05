import { useEffect, useState } from "react";
import LoginScreen from "./pages/Login";
import PlaylistScreen from "./pages/Playlist";
import { validateStoredUser } from "./services/auth";
import { test } from "./test";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function init() {
      const user = await validateStoredUser();
      setUser(user);
    }

    init();
  }, []);

  useEffect(()=>{
    console.log("calling this")
    test()
  },[])

  if (user === undefined) {
    return (
      <div className="w-[380px] h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? (
    <PlaylistScreen user={user} setUser={setUser} />
  ) : (
    <LoginScreen setUser={setUser} />
  );
}

export default App;
