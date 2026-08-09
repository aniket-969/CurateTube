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

export async function getPlaylistsForWriter(
  accessToken,
  pageToken = ""
) {
  console.log("[YouTube] getPlaylistsForWriter START");
  console.log("[YouTube] pageToken:", pageToken || "(first page)");

  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    mine: "true",
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const url = `${API}/playlists?${params}`;

  console.log("[YouTube] Fetching playlists...");
  console.log("[YouTube] URL:", url);

  let response;

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error(
      "[YouTube] getPlaylistsForWriter NETWORK ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "[YouTube] getPlaylistsForWriter HTTP status:",
    response.status,
    response.statusText
  );

  const data = await response.json();

  console.log(
    "[YouTube] getPlaylistsForWriter response:",
    data
  );

  if (!response.ok) {
    console.error(
      "[YouTube] getPlaylistsForWriter FAILED:",
      data
    );

    throw new Error(
      data?.error?.message ||
        "Failed to fetch playlists for writer"
    );
  }

  const result = {
    playlists: (data.items || []).map((playlist) => ({
      id: playlist.id,
      title: playlist.snippet.title,
      description:
        playlist.snippet.description ?? "",
    })),
    nextPageToken:
      data.nextPageToken ?? null,
  };

  console.log(
    "[YouTube] getPlaylistsForWriter SUCCESS:",
    {
      playlistCount: result.playlists.length,
      hasNextPage: Boolean(result.nextPageToken),
    }
  );

  return result;
}

export async function getPlaylistItemsForWriter(
  accessToken,
  playlistId,
  pageToken = ""
) {
  console.log(
    "[YouTube] getPlaylistItemsForWriter START"
  );

  console.log("[YouTube] playlistId:", playlistId);
  console.log(
    "[YouTube] pageToken:",
    pageToken || "(first page)"
  );

  const params = new URLSearchParams({
    part: "contentDetails",
    playlistId,
    maxResults: "50",
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const url = `${API}/playlistItems?${params}`;

  console.log(
    "[YouTube] Fetching playlist items..."
  );
  console.log("[YouTube] URL:", url);

  let response;

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error(
      "[YouTube] getPlaylistItemsForWriter NETWORK ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "[YouTube] getPlaylistItemsForWriter HTTP status:",
    response.status,
    response.statusText
  );

  const data = await response.json();

  console.log(
    "[YouTube] getPlaylistItemsForWriter response:",
    data
  );

  if (!response.ok) {
    console.error(
      "[YouTube] getPlaylistItemsForWriter FAILED:",
      data
    );

    throw new Error(
      data?.error?.message ||
        "Failed to fetch playlist items for writer"
    );
  }

  const items = (data.items || [])
    .map(
      (item) =>
        item.contentDetails?.videoId
    )
    .filter(Boolean);

  const result = {
    items,
    nextPageToken:
      data.nextPageToken ?? null,
  };

  console.log(
    "[YouTube] getPlaylistItemsForWriter SUCCESS:",
    {
      playlistId,
      videoCount: result.items.length,
      hasNextPage: Boolean(result.nextPageToken),
    }
  );

  console.log(
    "[YouTube] Video IDs:",
    result.items
  );

  return result;
}

export async function createPlaylist(
  accessToken,
  title,
  description = "",
  privacyStatus = "private"
) {
  console.log("[YouTube] createPlaylist START");

  console.log("[YouTube] title:", title);
  console.log("[YouTube] privacyStatus:", privacyStatus);
  console.log(
    "[YouTube] description:",
    description
  );

  const requestBody = {
    snippet: {
      title,
      description,
    },
    status: {
      privacyStatus,
    },
  };

  console.log(
    "[YouTube] Creating playlist with body:",
    requestBody
  );

  let response;

  try {
    response = await fetch(
      `${API}/playlists?part=snippet,status`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
  } catch (error) {
    console.error(
      "[YouTube] createPlaylist NETWORK ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "[YouTube] createPlaylist HTTP status:",
    response.status,
    response.statusText
  );

  const data = await response.json();

  console.log(
    "[YouTube] createPlaylist response:",
    data
  );

  if (!response.ok) {
    console.error(
      "[YouTube] createPlaylist FAILED:",
      data
    );

    throw new Error(
      data?.error?.message ||
        "Failed to create YouTube playlist"
    );
  }

  console.log(
    "[YouTube] createPlaylist SUCCESS"
  );

  console.log(
    "[YouTube] Created playlist ID:",
    data.id
  );

  return data;
}

export async function addVideoToPlaylist(
  accessToken,
  playlistId,
  videoId
) {
  console.log(
    "[YouTube] addVideoToPlaylist START"
  );

  console.log(
    "[YouTube] playlistId:",
    playlistId
  );

  console.log(
    "[YouTube] videoId:",
    videoId
  );

  const requestBody = {
    snippet: {
      playlistId,
      resourceId: {
        kind: "youtube#video",
        videoId,
      },
    },
  };

  console.log(
    "[YouTube] Adding video with body:",
    requestBody
  );

  let response;

  try {
    response = await fetch(
      `${API}/playlistItems?part=snippet`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
  } catch (error) {
    console.error(
      "[YouTube] addVideoToPlaylist NETWORK ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "[YouTube] addVideoToPlaylist HTTP status:",
    response.status,
    response.statusText
  );

  const data = await response.json();

  console.log(
    "[YouTube] addVideoToPlaylist response:",
    data
  );

  if (!response.ok) {
    console.error(
      "[YouTube] addVideoToPlaylist FAILED:",
      {
        status: response.status,
        statusText: response.statusText,
        error: data?.error,
      }
    );

    throw new Error(
      data?.error?.message ||
        "Failed to add video to playlist"
    );
  }

  console.log(
    "[YouTube] addVideoToPlaylist SUCCESS:",
    {
      playlistId,
      videoId,
      playlistItemId: data.id,
    }
  );

  return data;
}