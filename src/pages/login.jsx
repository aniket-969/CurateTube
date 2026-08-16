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
    <div className="flex h-[560px] w-[400px] flex-col bg-[#0f0f0f] text-white">
      {/* Main */}
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/20">
          <span className="text-2xl font-bold">C</span>
        </div>

        {/* Brand */}
        <h1 className="text-3xl font-bold tracking-tight">
          CurateTube
        </h1>

        <p className="mt-3 max-w-[300px] text-center text-[15px] leading-6 text-zinc-400">
         Turn one YouTube playlist into separate playlists by genre, mood, era, language, and artist with AI
        </p>

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="mt-8 flex h-12 w-full max-w-[300px] items-center justify-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 active:scale-[0.99]"
        >
          {/* Temporary Google icon */}
          <span className="text-lg font-bold">G</span>

          <span>Continue with Google</span>
        </button>

        {/* Account access message */}
        <p className="mt-5 max-w-[280px] text-center text-xs leading-5 text-zinc-500">
          Connect your YouTube account to access and organize your playlists.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-6 py-4 text-center">
        <p className="text-xs text-zinc-600">
          CurateTube
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;