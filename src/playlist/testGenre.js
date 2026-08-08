import playlistEngine from "./playlistEngine.js";
import GENRE_STRATEGIES from "../strategy/genre.js";
import { response } from './../services/llm/utils.js';

const playlists = playlistEngine(
  response,
  GENRE_STRATEGIES
);

console.log(JSON.stringify(playlists, null, 2));