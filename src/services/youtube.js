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
