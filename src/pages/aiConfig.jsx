import { useEffect, useMemo, useState } from "react";

const SHARED_GEMINI_API_KEY =
  "AQ.Ab8RN6LEqmDxwUUbHTGfhPoncw54STB3xBdMFzoYK2FstqywrQ";

const STORAGE_KEY = "curatetube_ai_keys";

const PROVIDERS = [
  {
    id: "deepseek",
    name: "DeepSeek",
    recommended: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    recommended: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    recommended: false,
  },
];

function getStoredKeys() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {};
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load saved AI keys:", error);
    return {};
  }
}

function saveKey(provider, apiKey) {
  try {
    const storedKeys = getStoredKeys();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...storedKeys,
        [provider]: apiKey,
      })
    );
  } catch (error) {
    console.error("Failed to save AI key:", error);
  }
}

function maskApiKey(apiKey) {
  if (!apiKey) return "";

  if (apiKey.length <= 8) {
    return "••••••••";
  }

  return `${apiKey.slice(0, 4)}${"•".repeat(
    Math.min(apiKey.length - 8, 20)
  )}${apiKey.slice(-4)}`;
}

function AIConfig({ playlist, onContinue, onBack }) {
  const [provider, setProvider] = useState("deepseek");
  const [apiKey, setApiKey] = useState("");

  const [savedKeys, setSavedKeys] = useState({});

  const [usingSavedKey, setUsingSavedKey] = useState(false);
  const [usingSharedGemini, setUsingSharedGemini] = useState(false);

  useEffect(() => {
    setSavedKeys(getStoredKeys());
  }, []);

  const selectedProvider = useMemo(
    () =>
      PROVIDERS.find(
        (item) => item.id === provider
      ),
    [provider]
  );

  function handleProviderChange(nextProvider) {
    setProvider(nextProvider);
    setApiKey("");
    setUsingSavedKey(false);
    setUsingSharedGemini(false);
  }

  function handleUseSavedKey(savedProvider) {
    const key = savedKeys[savedProvider];

    if (!key) return;

    setProvider(savedProvider);
    setApiKey(key);
    setUsingSavedKey(true);
    setUsingSharedGemini(false);
  }

  function handleUseSharedGemini() {
    setProvider("gemini");
    setApiKey("");
    setUsingSavedKey(false);
    setUsingSharedGemini(true);
  }

  function handleApiKeyChange(event) {
    setApiKey(event.target.value);
    setUsingSavedKey(false);
    setUsingSharedGemini(false);
  }

  function handleContinue() {
    if (usingSharedGemini) {
      onContinue({
        provider: "gemini",
        apiKey: SHARED_GEMINI_API_KEY,
      });

      return;
    }

    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      return;
    }

    saveKey(provider, trimmedKey);

    setSavedKeys((prev) => ({
      ...prev,
      [provider]: trimmedKey,
    }));

    onContinue({
      provider,
      apiKey: trimmedKey,
    });
  }

  const hasSavedKeys = Object.keys(savedKeys).length > 0;

  const canContinue =
    usingSharedGemini || Boolean(apiKey.trim());

  return (
    <div className="flex h-[560px] w-[400px] flex-col bg-[#0f0f0f] text-white">
      <header className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-3.5">
        <button
          onClick={onBack}
          className="
            flex h-8 w-8 shrink-0 items-center justify-center
            rounded-lg
            text-zinc-400
            transition
            hover:bg-zinc-900
            hover:text-white
          "
          aria-label="Back"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            Analyze playlist
          </p>

          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {playlist?.title || "Selected playlist"}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
        <div>
          <p className="text-sm font-semibold text-white">
            Choose an AI provider
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            CurateTube will use your selected provider to
            analyze the songs in this playlist.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {PROVIDERS.map((item) => {
            const selected = provider === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleProviderChange(item.id)
                }
                className={`
                  flex w-full items-center gap-3 rounded-xl
                  border px-3.5 py-3
                  text-left
                  transition
                  ${
                    selected
                      ? "border-zinc-500 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900"
                  }
                `}
              >
                <span
                  className={`
                    flex h-4 w-4 shrink-0 items-center justify-center
                    rounded-full border
                    ${
                      selected
                        ? "border-white"
                        : "border-zinc-600"
                    }
                  `}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">
                      {item.name}
                    </span>

                    {item.recommended && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                        Recommended
                      </span>
                    )}
                  </span>
                </span>

                {selected && (
                  <svg
                    className="h-4 w-4 shrink-0 text-zinc-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="api-key"
              className="text-xs font-medium text-zinc-300"
            >
              {selectedProvider?.name} API key
            </label>

            {usingSavedKey && (
              <span className="text-[10px] text-emerald-400">
                Saved key selected
              </span>
            )}

            {usingSharedGemini && (
              <span className="text-[10px] text-amber-400">
                Shared key selected
              </span>
            )}
          </div>

          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder={`Enter your ${selectedProvider?.name} API key`}
            className="
              mt-2 h-10 w-full rounded-lg
              border border-zinc-700
              bg-zinc-900/60
              px-3
              text-xs text-white
              placeholder:text-zinc-600
              outline-none
              transition
              focus:border-zinc-500
              focus:bg-zinc-900
            "
          />
        </div>

        {hasSavedKeys && (
          <div className="mt-5">
            <p className="text-xs font-medium text-zinc-300">
              Saved API keys
            </p>

            <div className="mt-2 space-y-2">
              {PROVIDERS.map((item) => {
                const key = savedKeys[item.id];

                if (!key) return null;

                return (
                  <div
                    key={item.id}
                    className="
                      flex items-center gap-3
                      rounded-lg
                      border border-zinc-800
                      bg-zinc-900/40
                      px-3 py-2.5
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-zinc-300">
                        {item.name}
                      </p>

                      <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-600">
                        {maskApiKey(key)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleUseSavedKey(item.id)
                      }
                      className="
                        shrink-0
                        rounded-md
                        px-2 py-1
                        text-[10px] font-medium
                        text-zinc-300
                        transition
                        hover:bg-zinc-800
                        hover:text-white
                      "
                    >
                      Use this
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-zinc-800 pt-4">
          <p className="text-xs font-medium text-zinc-300">
            Don't have a Gemini API key?
          </p>

          <button
            type="button"
            onClick={handleUseSharedGemini}
            className={`
              mt-2 w-full rounded-lg border px-3 py-2.5
              text-left transition
              ${
                usingSharedGemini
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900"
              }
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-zinc-200">
                  Use CurateTube's free Gemini key
                </p>

                <p className="mt-1 text-[10px] leading-4 text-zinc-600">
                  No Gemini API key setup required.
                </p>
              </div>

              {usingSharedGemini && (
                <span className="shrink-0 text-[10px] font-medium text-amber-400">
                  Selected
                </span>
              )}
            </div>
          </button>

          <div className="mt-2 flex gap-2 rounded-lg bg-amber-500/5 px-3 py-2.5">
            <span className="mt-px shrink-0 text-[11px] text-amber-400">
              ⚠
            </span>

            <p className="text-[10px] leading-4 text-zinc-500">
              Shared access may be rate-limited because the
              key is shared between CurateTube users. For a
              more reliable experience, use your own Gemini
              API key.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800/80 px-4 py-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="
            w-full rounded-lg
            bg-white
            px-4 py-2.5
            text-sm font-semibold text-zinc-900
            transition
            hover:bg-zinc-200
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:bg-zinc-800
            disabled:text-zinc-600
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default AIConfig;