import {
  Check,
  Circle,
  LoaderCircle,
  Music2,
} from "lucide-react";

function CreatingPlaylists({ progress, playlists = [] }) {
  const totalPlaylists = progress?.totalPlaylists ?? playlists.length;
  const completedPlaylists = progress?.completedPlaylists ?? 0;

  const currentPlaylistName = progress?.playlistName;
  const currentPlaylist =
    playlists.find((playlist) => playlist.name === currentPlaylistName) ??
    null;

  const totalVideos = progress?.videosToAdd ?? progress?.totalVideos ?? 0;
  const completedVideos = progress?.completedVideos ?? 0;

  const videoProgress =
    totalVideos > 0
      ? Math.min((completedVideos / totalVideos) * 100, 100)
      : 0;

  const playlistProgress =
    totalPlaylists > 0
      ? Math.min((completedPlaylists / totalPlaylists) * 100, 100)
      : 0;

  return (
    <div className="flex h-[560px] w-[400px] flex-col bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80 px-5 py-4">
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin text-red-500" />

          <h1 className="text-base font-semibold">
            Creating your playlists
          </h1>
        </div>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          We're adding your songs to YouTube. Keep this window open while we
          finish.
        </p>
      </header>

      {/* Overall progress */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">
            Playlist progress
          </span>

          <span className="text-xs font-medium text-zinc-500">
            {completedPlaylists} of {totalPlaylists}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-red-600 transition-all duration-300"
            style={{ width: `${playlistProgress}%` }}
          />
        </div>
      </div>

      {/* Current playlist */}
      <div className="px-5 pt-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600/10">
              <Music2 className="h-4 w-4 text-red-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                {progress?.type === "playlist-complete"
                  ? "Completed"
                  : "Currently creating"}
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-zinc-100">
                {currentPlaylistName || "Preparing playlist..."}
              </p>

              {totalVideos > 0 && (
                <p className="mt-1 text-xs text-zinc-500">
                  {completedVideos} of {totalVideos} songs added
                </p>
              )}
            </div>
          </div>

          {totalVideos > 0 && (
            <div className="mt-4">
              <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-300 transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
                <span>
                  {progress?.alreadyPresent ?? 0} already in playlist
                </span>

                <span>
                  {progress?.failedVideos
                    ? `${progress.failedVideos} failed`
                    : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playlist status list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="space-y-2">
          {playlists.map((playlist, index) => {
            const isCompleted = index < completedPlaylists;

            const isCurrent =
              playlist.name === currentPlaylistName &&
              !isCompleted;

            return (
              <div
                key={`${playlist.name}-${index}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                  isCurrent
                    ? "bg-zinc-900"
                    : "bg-transparent"
                }`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-3 w-3 text-emerald-500" />
                    </div>
                  ) : isCurrent ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-red-500" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-zinc-700" />
                  )}
                </div>

                <p
                  className={`min-w-0 flex-1 truncate text-xs ${
                    isCompleted
                      ? "text-zinc-500"
                      : isCurrent
                        ? "font-medium text-zinc-200"
                        : "text-zinc-600"
                  }`}
                >
                  {playlist.name}
                </p>

                {isCompleted && (
                  <span className="text-[10px] text-zinc-600">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 px-5 py-3">
        <p className="text-center text-[10px] text-zinc-600">
          Please don't close this window while playlists are being created.
        </p>
      </footer>
    </div>
  );
}

export default CreatingPlaylists;