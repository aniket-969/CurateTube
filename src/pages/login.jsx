import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { login } from "../services/auth";

function LoginScreen({ setUser }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const user = await login();
      setUser(user);
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[560px] w-[400px] flex-col bg-[#0f0f0f] text-white">
      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-8 pt-20">
        <div className="flex w-full max-w-[300px] flex-col items-center">
          {/* Logo */}
          {/* Logo */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] overflow-hidden shadow-lg">
            <img
              src="/icons/icon128.png"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Brand */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <h1 className="text-[32px] font-bold leading-none tracking-tight">
              CurateTube
            </h1>

            <p className="max-w-[300px] text-center text-[15px] leading-6 text-zinc-400">
              Turn one YouTube playlist into separate playlists by genre, mood,
              era, language, and artist with AI
            </p>
          </div>

          {/* Login section */}
          <div className="mt-12 flex w-full flex-col items-center gap-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="
                flex h-14 w-full items-center justify-center gap-3
                rounded-2xl bg-white px-4
                text-[15px] font-semibold text-gray-900
                transition
                hover:bg-gray-100
                active:scale-[0.99]
                cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-xl font-bold">G</span>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <p className="max-w-[270px] text-center text-xs leading-5 text-zinc-500">
              {loading
                ? "Waiting for Google authentication..."
                : "Connect your YouTube account to access and organize your playlists."}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-4 text-center">
        <p className="text-xs text-zinc-600">CurateTube</p>
      </footer>
    </div>
  );
}

export default LoginScreen;
