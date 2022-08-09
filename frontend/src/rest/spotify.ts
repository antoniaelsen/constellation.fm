import config from "config";
import { SPOTIFY_URL } from "lib/constants";
import { transformPlaylistFull, transformPlaylistSimplified } from "lib/spotify";
import { Playlist } from "types/music";
import { fetchOffsets } from "./utils";

export const requestParams = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: "include"
};

const nextUrl = (json) => {
  const nextSpotify = json.next;
  if (!nextSpotify) return null;

  const nextProxied = nextSpotify.replace(SPOTIFY_URL, config.api.spotify);
  return nextProxied;
};

export const getPlaylist = async (playlistId: string): Promise<Playlist> => {
  const options = {
    ...requestParams,
    method: "GET"
  };
  const res = await fetch( `${config.api.spotify}/playlists/${playlistId}`, (options as any));
  const body = await res?.json();
  return transformPlaylistFull(body);
};

export const getUserPlaylists = async (offset: number = 0): Promise<Playlist[]> => {
  const fetch = fetchOffsets(
    nextUrl,
    { callbackFn: (acc, e) => ([...acc, ...e.items]), initialValue: [] },
  );

  const options = {
    ...requestParams,
    method: "GET"
  };
  const url =  `${config.api.spotify}/me/playlists?limit=50${offset ? `&offset=${offset}` : ''}`;
  const res = await fetch(url, options as any);
  const body = await res.json();
  return body.items.map(transformPlaylistSimplified);
};