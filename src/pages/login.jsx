import { login } from "../services/auth";

function LoginScreen({ setUser }) {
  const handleLogin = async () => {
    try {
      const user = await login();
      setUser(user);
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="w-[380px] h-[500px] flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">CurateTube</h1>

      <p className="text-center text-gray-500 px-6">
        Organize your YouTube music playlists using AI.
      </p>

      <button
        onClick={handleLogin}
        className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700 cursor-pointer"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginScreen;