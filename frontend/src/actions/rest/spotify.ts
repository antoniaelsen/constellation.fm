import { RSAA } from "redux-api-middleware";
import config from "config";
import { fetchOffsets, } from "./utils"
import { Service } from "lib/constants";

export const CREATE_PLAYLIST_REQUEST = "CREATE_PLAYLIST_REQUEST";
export const CREATE_PLAYLIST_SUCCESS = "CREATE_PLAYLIST_SUCCESS";
export const CREATE_PLAYLIST_FAILURE = "CREATE_PLAYLIST_FAILURE";
export const GET_PLAYLIST_REQUEST = "GET_PLAYLIST_REQUEST";
export const GET_PLAYLIST_SUCCESS = "GET_PLAYLIST_SUCCESS";
export const GET_PLAYLIST_FAILURE = "GET_PLAYLIST_FAILURE";
export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILURE = "GET_USER_FAILURE";
export const GET_USER_PLAYLISTS_REQUEST = "GET_USER_PLAYLISTS_REQUEST";
export const GET_USER_PLAYLISTS_SUCCESS = "GET_USER_PLAYLISTS_SUCCESS";
export const GET_USER_PLAYLISTS_FAILURE = "GET_USER_PLAYLISTS_FAILURE";
export const GET_USER_PLAYLISTS_LIMIT_REQUEST = "GET_USER_PLAYLISTS_LIMIT_REQUEST";
export const GET_USER_PLAYLISTS_LIMIT_SUCCESS = "GET_USER_PLAYLISTS_LIMIT_SUCCESS";
export const GET_USER_PLAYLISTS_LIMIT_FAILURE = "GET_USER_PLAYLISTS_LIMIT_FAILURE";
export const UPDATE_PLAYLIST_REQUEST = "UPDATE_PLAYLIST_REQUEST";
export const UPDATE_PLAYLIST_SUCCESS = "UPDATE_PLAYLIST_SUCCESS";
export const UPDATE_PLAYLIST_FAILURE = "UPDATE_PLAYLIST_FAILURE";
export const CREATE_PLAYLIST_ITEMS_REQUEST = "CREATE_PLAYLIST_ITEMS_REQUEST"
export const CREATE_PLAYLIST_ITEMS_SUCCESS = "CREATE_PLAYLIST_ITEMS_SUCCESS"
export const CREATE_PLAYLIST_ITEMS_FAILURE = "CREATE_PLAYLIST_ITEMS_FAILURE"
export const REMOVE_PLAYLIST_ITEMS_REQUEST = "REMOVE_PLAYLIST_ITEMS_REQUEST"
export const REMOVE_PLAYLIST_ITEMS_SUCCESS = "REMOVE_PLAYLIST_ITEMS_SUCCESS"
export const REMOVE_PLAYLIST_ITEMS_FAILURE = "REMOVE_PLAYLIST_ITEMS_FAILURE"
export const UPDATE_PLAYLIST_ITEMS_REQUEST = "UPDATE_PLAYLIST_ITEMS_REQUEST"
export const UPDATE_PLAYLIST_ITEMS_SUCCESS = "UPDATE_PLAYLIST_ITEMS_SUCCESS"
export const UPDATE_PLAYLIST_ITEMS_FAILURE = "UPDATE_PLAYLIST_ITEMS_FAILURE"
export const GET_TRACK_AUDIO_ANALYSIS_REQUEST = "GET_TRACK_AUDIO_ANALYSIS_REQUEST"
export const GET_TRACK_AUDIO_ANALYSIS_SUCCESS = "GET_TRACK_AUDIO_ANALYSIS_SUCCESS"
export const GET_TRACK_AUDIO_ANALYSIS_FAILURE = "GET_TRACK_AUDIO_ANALYSIS_FAILURE"
export const GET_TRACK_AUDIO_FEATURES_REQUEST = "GET_TRACK_AUDIO_FEATURES_REQUEST"
export const GET_TRACK_AUDIO_FEATURES_SUCCESS = "GET_TRACK_AUDIO_FEATURES_SUCCESS"
export const GET_TRACK_AUDIO_FEATURES_FAILURE = "GET_TRACK_AUDIO_FEATURES_FAILURE"
export const GET_TRACKS_AUDIO_FEATURES_REQUEST = "GET_TRACKS_AUDIO_FEATURES_REQUEST"
export const GET_TRACKS_AUDIO_FEATURES_SUCCESS = "GET_TRACKS_AUDIO_FEATURES_SUCCESS"
export const GET_TRACKS_AUDIO_FEATURES_FAILURE = "GET_TRACKS_AUDIO_FEATURES_FAILURE"
export const PLAY_TRACK_REQUEST = "PLAY_TRACK_REQUEST"
export const PLAY_TRACK_SUCCESS = "PLAY_TRACK_SUCCESS"
export const PLAY_TRACK_FAILURE = "PLAY_TRACK_FAILURE"

const SPOTIFY_URL = "https://api.spotify.com/v1";

const nextUrl = (json) => {
  const nextSpotify = json.next;
  if (!nextSpotify) return null;

  const nextProxied = nextSpotify.replace(SPOTIFY_URL, config.api.spotify);
  return nextProxied;
};

export const requestParams = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: "include"
};

export const spotifyType = (type: string) => ({
  meta: { service: Service.SPOTIFY },
  type
});

export const getUser = () => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/me`,
    method: 'GET',
    types: [
      GET_USER_REQUEST,
      GET_USER_SUCCESS,
      GET_USER_FAILURE
    ].map(spotifyType),
  }
});

export const createPlaylist = (userId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/users/${userId}/playlists`,
    method: 'POST',
    types: [
      CREATE_PLAYLIST_REQUEST,
      CREATE_PLAYLIST_SUCCESS,
      CREATE_PLAYLIST_FAILURE
    ].map(spotifyType),
  }
});

export const getPlaylist = (playlistId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/playlists/${playlistId}`,
    method: 'GET',
    types: [
      GET_PLAYLIST_REQUEST,
      GET_PLAYLIST_SUCCESS,
      GET_PLAYLIST_FAILURE
    ].map(spotifyType),
  }
});

export const getUserPlaylists = (offset: number) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/me/playlists?limit=50${offset ? `&offset=${offset}` : ''}`,
    fetch: fetchOffsets(
      nextUrl,
      { callbackFn: (acc, e) => ([...acc, ...e.items]), initialValue: [] },
    ),
    method: 'GET',
    types: [
      GET_USER_PLAYLISTS_REQUEST,
      GET_USER_PLAYLISTS_SUCCESS,
      GET_USER_PLAYLISTS_FAILURE
    ].map(spotifyType),
  }
});

export const getUserPlaylistsLimited = (offset: number) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/me/playlists?limit=50${offset ? `&offset=${offset}` : ''}`,
    method: 'GET',
    types: [
      GET_USER_PLAYLISTS_LIMIT_REQUEST,
      GET_USER_PLAYLISTS_LIMIT_SUCCESS,
      GET_USER_PLAYLISTS_LIMIT_FAILURE
    ].map(spotifyType),
  }
});

export const updatePlaylist = (playlistId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/playlists/${playlistId}`,
    method: 'PUT',
    types: [
      UPDATE_PLAYLIST_REQUEST,
      UPDATE_PLAYLIST_SUCCESS,
      UPDATE_PLAYLIST_FAILURE
    ].map(spotifyType),
  }
});

export const addItemsToPlaylist = (playlistId: string) => ({
  [RSAA]: { 
    ...requestParams,
    endpoint: `${config.api.spotify}/playlists/${playlistId}/tracks`,
    method: 'POST',
    types: [
      CREATE_PLAYLIST_ITEMS_REQUEST,
      CREATE_PLAYLIST_ITEMS_SUCCESS,
      CREATE_PLAYLIST_ITEMS_FAILURE
    ].map(spotifyType),
  },
});

export const removePlaylistItems = (playlistId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/playlists/${playlistId}/tracks`,
    method: 'DELETE',
    types: [
      REMOVE_PLAYLIST_ITEMS_REQUEST,
      REMOVE_PLAYLIST_ITEMS_SUCCESS,
      REMOVE_PLAYLIST_ITEMS_FAILURE
    ].map(spotifyType),
  }
});

export const updatePlaylistItems = (playlistId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/playlists/${playlistId}/tracks`,
    method: 'PUT',
    types: [
      UPDATE_PLAYLIST_ITEMS_REQUEST,
      UPDATE_PLAYLIST_ITEMS_SUCCESS,
      UPDATE_PLAYLIST_ITEMS_FAILURE
    ].map(spotifyType),
  },
});

export const getTrackAudioAnalysis = (trackId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/audio-analysis/${trackId}`,
    method: 'GET',
    types: [
      GET_TRACK_AUDIO_ANALYSIS_REQUEST,
      GET_TRACK_AUDIO_ANALYSIS_SUCCESS,
      GET_TRACK_AUDIO_ANALYSIS_FAILURE
    ].map(spotifyType),
  }
});

export const getTrackAudioFeatures = (trackId: string) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/audio-features/${trackId}`,
    method: 'GET',
    types: [
      GET_TRACK_AUDIO_FEATURES_REQUEST,
      GET_TRACK_AUDIO_FEATURES_SUCCESS,
      GET_TRACK_AUDIO_FEATURES_FAILURE
    ].map(spotifyType),
  }
});

export const getTracksAudioFeatures = () => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/audio-features`,
    method: 'GET',
    types: [
      GET_TRACKS_AUDIO_FEATURES_REQUEST,
      GET_TRACKS_AUDIO_FEATURES_SUCCESS,
      GET_TRACKS_AUDIO_FEATURES_FAILURE
    ].map(spotifyType),
  }
});


type playTrackRequest = {
  contextUri: string;
  uris: string[];
  offset?: {
    position?: number;
    uri?: string;
  }
}

export const playTrack = (req: playTrackRequest) => ({
  [RSAA]: {
    ...requestParams,
    endpoint: `${config.api.spotify}/me/player/play`,
    method: 'PUT',
    types: [
      PLAY_TRACK_REQUEST,
      PLAY_TRACK_SUCCESS,
      PLAY_TRACK_FAILURE
    ].map(spotifyType),
  }
});
