const API = "https://www.googleapis.com/youtube/v3";

export async function getPlaylists(accessToken) {
  let playlists = [];
  let pageToken = "";

  do {
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

    playlists.push(
      ...data.items.map((playlist) => ({
        id: playlist.id,
        title: playlist.snippet.title,
        itemCount: playlist.contentDetails.itemCount,
      }))
    );

    pageToken = data.nextPageToken;
  } while (pageToken);

  return playlists;
}


export async function getPlaylistItems(accessToken, playlistId) {
  let videos = [];
  let pageToken = "";
    console.log(playlistId,"Playlistid")
  do {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
    });

    if (pageToken) {
      params.set("pageToken", pageToken);
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
          channelTitle: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
         
        }))
    );

    pageToken = data.nextPageToken;
  } while (pageToken);
console.log(videos,"returning videos")
  return videos;
}