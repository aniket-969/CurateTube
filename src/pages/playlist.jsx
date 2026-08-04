import { logout } from "../services/auth";

function PlaylistScreen({ user, setUser }) {
  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <div className="w-[380px] h-[500px] p-5">
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user.profile.picture}
          alt={user.profile.name}
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="font-semibold">{user.profile.name}</p>
          <p className="text-sm text-gray-500">{user.profile.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-gray-200 px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}

export default PlaylistScreen;