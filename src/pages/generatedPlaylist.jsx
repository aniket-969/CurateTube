import { useEffect, useMemo, useState } from "react";
import { Check, Pencil } from "lucide-react";

function GeneratedPlaylists({ playlists = [], onGenerate }) {
  const [selected, setSelected] = useState({});
  const [names, setNames] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

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
        (a, b) => (b.videoIds?.length ?? 0) - (a.videoIds?.length ?? 0)
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
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        No playlists were generated.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80 px-4 py-4">
        <h1 className="text-base font-semibold text-white">
          Generated Playlists
        </h1>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          Select the playlists you want to create.
        </p>
      </header>

      {/* Playlist list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-5">
          {Object.entries(groupedPlaylists).map(([type, typePlaylists]) => (
            <section key={type}>
              {/* Section title */}
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  {type}
                </span>

                <div className="h-px flex-1 bg-zinc-800/70" />
              </div>

              <div className="space-y-2">
                {typePlaylists.map((playlist) => {
                  const { index } = playlist;
                  const isSelected = !!selected[index];
                  const currentName = names[index] ?? playlist.name;

                  return (
                    <div
                      key={index}
                      className={`
                        group
                        rounded-xl
                        border
                        px-3.5 py-3
                        transition
                        ${
                          isSelected
                            ? "border-zinc-700 bg-zinc-900"
                            : "border-zinc-800 bg-zinc-900/40"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePlaylist(index)}
                          className="
                            h-4 w-4
                            shrink-0
                            cursor-pointer
                            accent-red-600
                          "
                        />

                        {/* Name / Edit */}
                        <div className="min-w-0 flex-1">
                          {editingIndex === index ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={currentName}
                                onChange={(e) =>
                                  handleNameChange(index, e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setEditingIndex(null);
                                  }
                                }}
                                className="
                                  min-w-0 flex-1
                                  rounded-md
                                  border border-zinc-700
                                  bg-zinc-950
                                  px-2 py-1
                                  text-sm font-medium text-white
                                  outline-none
                                  focus:border-zinc-500
                                "
                              />

                              <button
                                type="button"
                                onClick={() => setEditingIndex(null)}
                                className="
                                  flex h-7 w-7 shrink-0
                                  items-center justify-center
                                  rounded-md
                                  text-zinc-500
                                  transition
                                  hover:bg-zinc-800
                                  hover:text-white
                                "
                                title="Save name"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="min-w-0 truncate text-sm font-semibold text-zinc-100">
                                {currentName}
                              </span>

                              <button
                                type="button"
                                onClick={() => setEditingIndex(index)}
                                className="
                                  flex h-6 w-6
                                  shrink-0
                                  items-center justify-center
                                  rounded-md
                                  text-zinc-600
                                  opacity-0
                                  transition
                                  hover:bg-zinc-800
                                  hover:text-zinc-300
                                  group-hover:opacity-100
                                "
                                title="Edit playlist name"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Song count */}
                          <p className="mt-1 text-xs text-zinc-500">
                            {playlist.videoIds?.length ?? 0}{" "}
                            {playlist.videoIds?.length === 1 ? "song" : "songs"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Bottom action */}
      <footer className="border-t border-zinc-800/80 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-500">
            {selectedCount} playlist
            {selectedCount === 1 ? "" : "s"} selected
          </span>

          <button
            onClick={handleGenerate}
            disabled={selectedCount === 0}
            className="
            rounded-lg
            bg-white
            px-4 py-2
            text-sm font-semibold
            text-zinc-900
            transition
            hover:bg-zinc-200
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
          >
            Generate
          </button>
        </div>
      </footer>
    </div>
  );
}

export default GeneratedPlaylists;
