export async function generatePlaylists(videos) {
    const classifiedVideos = await classifySongs(
        "deepseek",
        import.meta.env.VITE_DEEPSEEK_API_KEY,
        videos
    );

    const playlists = playlistEngine(
        classifiedVideos,
        GENRE_STRATEGIES
    );

    return playlists;
}