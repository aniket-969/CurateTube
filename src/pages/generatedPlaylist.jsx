import { useEffect, useMemo, useState } from "react";

function GeneratedPlaylists({ playlists = [], onGenerate }) {
  const [selected, setSelected] = useState({});
  const [names, setNames] = useState({});

  // Select only recommended playlists by default
  useEffect(() => {
    const initialSelected = {};
    const initialNames = {};

    playlists.forEach((playlist, index) => {
      initialSelected[index] = !!playlist.recommended;
      initialNames[index] = playlist.name;
    });

    setSelected(initialSelected);
    setNames(initialNames);
  }, [playlists]);

  function togglePlaylist(index) {
    setSelected((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  function handleNameChange(index, value) {
    setNames((prev) => ({
      ...prev,
      [index]: value,
    }));
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const groupedPlaylists = useMemo(() => {
    const groups = {};

    playlists.forEach((playlist, index) => {
      const type = playlist.type || "other";

      if (!groups[type]) {
        groups[type] = [];
      }

      groups[type].push({
        ...playlist,
        index,
      });
    });

    // Sort each group by number of songs, largest first
    Object.values(groups).forEach((group) => {
      group.sort(
        (a, b) =>
          (b.videoIds?.length ?? 0) -
          (a.videoIds?.length ?? 0)
      );
    });

    return groups;
  }, [playlists]);

  function handleGenerate() {
    const selectedPlaylists = playlists
      .map((playlist, index) => ({
        ...playlist,
        name: names[index]?.trim() || playlist.name,
      }))
      .filter((_, index) => selected[index]);

    if (!selectedPlaylists.length) {
      return;
    }

    onGenerate?.(selectedPlaylists);
  }

  if (!playlists.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        No playlists were generated.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold">
          Generated Playlists
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Select the playlists you want to create.
        </p>
      </div>

      {/* Playlist list */}
      <div className="flex-1 overflow-y-auto space-y-5">
        {Object.entries(groupedPlaylists).map(
          ([type, typePlaylists]) => (
            <section key={type}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {type}
              </h2>

              <div className="space-y-2">
                {typePlaylists.map((playlist) => {
                  const { index } = playlist;
                  const isSelected = !!selected[index];

                  return (
                    <div
                      key={index}
                      className="rounded-lg border px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            togglePlaylist(index)
                          }
                          className="h-4 w-4 shrink-0"
                        />

                        {/* Playlist name */}
                        <input
                          type="text"
                          value={
                            names[index] ?? playlist.name
                          }
                          onChange={(e) =>
                            handleNameChange(
                              index,
                              e.target.value
                            )
                          }
                          className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                        />

                        {/* Song count */}
                        <span className="shrink-0 text-xs text-gray-500">
                          {playlist.videoIds?.length ?? 0} songs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )
        )}
      </div>

      {/* Bottom action */}
      <div className="mt-4 border-t pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            {selectedCount} playlist
            {selectedCount === 1 ? "" : "s"} selected
          </span>

          <button
            onClick={handleGenerate}
            disabled={selectedCount === 0}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneratedPlaylists;