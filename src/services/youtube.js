import {
  getPlaylistCache,
  setPlaylistCache,
  getPlaylistCachePromise,
  setPlaylistCachePromise,
} from "./../cache/ytPlaylist";
import { extractYTWLId } from "../utils/helper.js";

const API = "https://www.googleapis.com/youtube/v3";
const TEST_YOUTUBE_ERROR = false;
export async function youtubeFetch(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    const networkError = new Error("Unable to connect to YouTube.");
    networkError.source = "youtube";
    networkError.type = "network";
    networkError.originalError = error;

    throw networkError;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "YouTube API request failed."
    );
    error.source = "youtube";
    error.status = response.status;
    error.reason = data?.error?.errors?.[0]?.reason;
    error.details = data?.error;

    throw error;
  }

  return data;
}

export async function getPlaylists(accessToken, pageToken = "") {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    mine: "true",
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const data = await youtubeFetch(`${API}/playlists?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    playlists: (data.items || []).map((playlist) => ({
      id: playlist.id,
      title: playlist.snippet.title,
      itemCount: playlist.contentDetails.itemCount,
    })),
    nextPageToken: data.nextPageToken ?? null,
  };
}

export async function getPlaylistItems(
  accessToken,
  playlistId,
  pageToken = ""
) {
  const videos = [];
  let nextPageToken = pageToken;
  if (TEST_YOUTUBE_ERROR) {
    const error = new Error("TEST: YouTube quota exceeded");

    error.status = 403;
    error.reason = "quotaExceeded";
    error.details = {
      errors: [
        {
          reason: "quotaExceeded",
        },
      ],
    };
    error.source = "youtube";

    throw error;
  }
  while (videos.length < 300) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
    });

    if (nextPageToken) {
      params.set("pageToken", nextPageToken);
    }

    const data = await youtubeFetch(`${API}/playlistItems?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    videos.push(
      ...(data.items || [])
        .filter((item) => item.contentDetails?.videoId)
        .map((item) => ({
          videoId: item.contentDetails.videoId,
          title: item.snippet.title,
          channelTitle:
            item.snippet.videoOwnerChannelTitle ?? item.snippet.channelTitle,
        }))
    );

    if (!data.nextPageToken) {
      nextPageToken = null;
      break;
    }

    nextPageToken = data.nextPageToken;
  }

  return {
    items: videos,
    nextPageToken,
  };
}

// Fetches all the existing playlists of user
export async function getPlaylistsForWriter(accessToken, pageToken = "") {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    mine: "true",
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const data = await youtubeFetch(`${API}/playlists?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = {
    playlists: (data.items || []).map((playlist) => ({
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description ?? "",
    })),
    nextPageToken: data.nextPageToken ?? null,
  };

  console.log("[YouTube] getPlaylistsForWriter SUCCESS:", {
    playlistCount: result.playlists.length,
    hasNextPage: Boolean(result.nextPageToken),
  });

  return result;
}

export async function getAllPlaylistsForWriter(accessToken) {
  const existingCache = getPlaylistCache();

  if (existingCache) {
    console.log("[YTWL] Using cached YouTube playlists.");

    return existingCache;
  }

  const existingPromise = getPlaylistCachePromise();

  if (existingPromise) {
    console.log(
      "[YTWL] Playlist cache is currently being built. Waiting for existing request..."
    );

    return existingPromise;
  }

  const promise = (async () => {
    console.log("[YTWL] Building complete YouTube playlist cache...");

    const allById = new Map();
    const generatedByYtwlId = new Map();

    let pageToken = "";
    let page = 1;

    while (true) {
      console.log(`[YTWL] Fetching all playlists page ${page}...`);

      const response = await getPlaylistsForWriter(accessToken, pageToken);

      const playlists = response.playlists || [];

      console.log(
        `[YTWL] Playlist cache page ${page}: ${playlists.length} playlists`
      );

      for (const playlist of playlists) {
        allById.set(playlist.id, playlist);

        const ytwlId = extractYTWLId(playlist.description);

        if (ytwlId) {
          generatedByYtwlId.set(ytwlId, playlist);
        }
      }

      if (!response.nextPageToken) {
        break;
      }

      pageToken = response.nextPageToken;
      page++;
    }

    const cache = {
      allById,
      generatedByYtwlId,
    };

    setPlaylistCache(cache);

    console.log("[YTWL] Complete playlist cache built:", {
      totalPlaylists: allById.size,
      generatedPlaylists: generatedByYtwlId.size,
    });

    return cache;
  })();

  setPlaylistCachePromise(promise);

  try {
    return await promise;
  } finally {
    setPlaylistCachePromise(null);
  }
}

export async function getPlaylistItemsForWriter(
  accessToken,
  playlistId,
  pageToken = ""
) {
  const params = new URLSearchParams({
    part: "contentDetails",
    playlistId,
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const data = await youtubeFetch(`${API}/playlistItems?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const items = (data.items || [])
    .map((item) => item.contentDetails?.videoId)
    .filter(Boolean);

  const result = {
    items,
    nextPageToken: data.nextPageToken ?? null,
  };

  console.log("[YouTube] getPlaylistItemsForWriter SUCCESS:", {
    playlistId,
    videoCount: result.items.length,
    hasNextPage: Boolean(result.nextPageToken),
  });

  return result;
}

export async function createPlaylist(
  accessToken,
  title,
  description = "",
  privacyStatus = "private"
) {
  const requestBody = {
    snippet: {
      title,
      description,
    },
    status: {
      privacyStatus,
    },
  };

  console.log("creating playlist", title);

  const data = await youtubeFetch(`${API}/playlists?part=snippet,status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  console.log("Created playlist sucess", data.id);

  return data;
}

export async function addVideoToPlaylist(accessToken, playlistId, videoId) {
  const requestBody = {
    snippet: {
      playlistId,
      resourceId: {
        kind: "youtube#video",
        videoId,
      },
    },
  };

  const maxAttempts = 5;

  console.log("Trying videoId", videoId, playlistId);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const data = await youtubeFetch(`${API}/playlistItems?part=snippet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("[YouTube] addVideoToPlaylist SUCCESS:", {
        playlistId,
        videoId,
        playlistItemId: data.id,
        attempt,
      });

      return data;
    } catch (error) {
      const isPlaylistPropagationError =
        error.status === 404 && error.reason === "playlistNotFound";

      const isServiceUnavailable =
        error.status === 409 && error.reason === "SERVICE_UNAVAILABLE";

      const isRetryable =
        error.type === "network" ||
        isPlaylistPropagationError ||
        isServiceUnavailable;

      console.error("[YouTube] addVideoToPlaylist FAILED:", {
        playlistId,
        videoId,
        status: error.status,
        reason: error.reason,
        error: error.details,
        attempt,
        retryable: isRetryable,
      });

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      const delay = 1000 * 2 ** (attempt - 1);

      console.log(
        `[YouTube] Retrying ${videoId} in ${delay}ms ` +
          `(reason: ${error.reason}, ` +
          `attempt ${attempt + 1}/${maxAttempts})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to add video to playlist");
}

export async function updatePlaylistTitle(accessToken, playlist, title) {
  console.log("updating playlist title");

  const requestBody = {
    id: playlist.id,
    snippet: {
      title,
      description: playlist.description ?? "",
    },
  };

  const data = await youtubeFetch(`${API}/playlists?part=snippet`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  console.log(data, "Updated yt playlist");

  return {
    id: data.id,
    title: data.snippet.title,
    description: data.snippet.description ?? "",
  };
}
