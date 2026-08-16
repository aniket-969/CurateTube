import {
  getPlaylistCache,
  setPlaylistCache,
  getPlaylistCachePromise,
  setPlaylistCachePromise,
} from "./../cache/ytPlaylist";
import { extractYTWLId } from "../utils/createPlaylistCandidate.js";

const API = "https://www.googleapis.com/youtube/v3";

export async function getPlaylists(accessToken, pageToken = "") {

  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    mine: "true",
    maxResults: "50",
  });
  
  if (pageToken) {
    params.set("pageToken", pageToken);
  }
  
  const tokenInfoResponse = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
  );

  const tokenInfo = await tokenInfoResponse.json();

  console.log("TOKEN INFO:", tokenInfo, accessToken);
  const response = await fetch(`${API}/playlists?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const data = await response.json();

  return {
    playlists: data.items.map((playlist) => ({
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

  while (videos.length < 300) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
    });

    if (nextPageToken) {
      params.set("pageToken", nextPageToken);
    }

    const response = await fetch(`${API}/playlistItems?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlist items");
    }

    const data = await response.json();

    videos.push(
      ...data.items
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

// Fetches all the existing playlist of user
export async function getPlaylistsForWriter(accessToken, pageToken = "") {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    mine: "true",
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const url = `${API}/playlists?${params}`;

  let response;

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("[YouTube] getPlaylistsForWriter NETWORK ERROR:", error);

    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    console.error("[YouTube] getPlaylistsForWriter FAILED:", data);

    throw new Error(
      data?.error?.message || "Failed to fetch playlists for writer"
    );
  }

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

  const url = `${API}/playlistItems?${params}`;

  let response;

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("[YouTube] getPlaylistItemsForWriter NETWORK ERROR:", error);

    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "Failed to fetch playlist items for writer"
    );
    console.error("getPlaylistItemsForWriter ERROR:", error);
    error.status = response.status;
    error.reason = data?.error?.errors?.[0]?.reason;

    throw error;
  }

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
  let response;

  try {
    response = await fetch(`${API}/playlists?part=snippet,status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error("[YouTube] createPlaylist NETWORK ERROR:", error);

    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    console.error("[YouTube] createPlaylist FAILED:", data);

    throw new Error(
      data?.error?.message || "Failed to create YouTube playlist"
    );
  }

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
    let response;

    try {
      response = await fetch(`${API}/playlistItems?part=snippet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error("[YouTube] addVideoToPlaylist NETWORK ERROR:", {
        videoId,
        attempt,
        error,
      });

      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = 1000 * 2 ** (attempt - 1);

      console.log(
        `[YouTube] Network error. Retrying ${videoId} in ${delay}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      continue;
    }

    const data = await response.json();

    // SUCCESS
    if (response.ok) {
      console.log("[YouTube] addVideoToPlaylist SUCCESS:", {
        playlistId,
        videoId,
        playlistItemId: data.id,
        attempt,
      });

      return data;
    }

    // --------------------------------------------
    // ERROR DETAILS
    // --------------------------------------------

    const reason = data?.error?.errors?.[0]?.reason;

    const isPlaylistPropagationError =
      response.status === 404 && reason === "playlistNotFound";

    const isServiceUnavailable =
      response.status === 409 && reason === "SERVICE_UNAVAILABLE";

    const isRetryable = isPlaylistPropagationError || isServiceUnavailable;

    console.error("[YouTube] addVideoToPlaylist FAILED:", {
      playlistId,
      videoId,
      status: response.status,
      statusText: response.statusText,
      reason,
      error: data?.error,
      attempt,
      retryable: isRetryable,
    });

    // PERMANENT ERROR
    if (!isRetryable || attempt === maxAttempts) {
      const error = new Error(
        data?.error?.message || "Failed to add video to playlist"
      );

      error.status = response.status;
      error.reason = reason;
      error.details = data?.error;

      throw error;
    }

    // RETRY

    const delay = 1000 * 2 ** (attempt - 1);

    console.log(
      `[YouTube] Retrying ${videoId} in ${delay}ms ` +
        `(reason: ${reason}, ` +
        `attempt ${attempt + 1}/${maxAttempts})`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Failed to add video to playlist");
}
