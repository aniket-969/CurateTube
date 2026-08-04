function PlaylistScreen({ token }) {
  return (
    <div className="w-[380px] h-[500px] p-5">
      <h2 className="text-2xl font-bold mb-4">
        Logged In ✅
      </h2>

      <p className="break-all text-sm">
        Token:
      </p>

      <p className="text-xs mt-2 break-all">
        {token}
      </p>
    </div>
  );
}

export default PlaylistScreen;