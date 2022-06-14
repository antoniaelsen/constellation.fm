import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import config from "config";
import queryClient from 'rest/createClient';
import { fetchOffsets } from "./utils";

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
  // credentials: "include"
};

const useGetUser = () => useQuery('spotifyMe', () =>
  fetch(`${config.api.spotify}/me`, {
    ...requestParams,
    method: `GET`
  }).then((res) => res.json())
);

const useGetPlaylist = (playlistId: string) => {
  return useQuery(['spotifyPlaylist', playlistId], () => 
    fetch(`${config.api.spotify}/playlists/${playlistId}`, {
      ...requestParams,
      method: `GET`
  }).then((res) => res.json()));
};

const useGetUserPlaylists = (offset?: number) => {
  return useQuery(['spotifyUserPlaylists'], () => {
    const url = `${config.api.spotify}/me/playlists?limit=50${offset ? `&offset=${offset}` : ''}`;
    const fetcher = fetchOffsets(
      nextUrl,
      { callbackFn: (acc, e) => ([...acc, ...e.items]), initialValue: [] },
    );

    return fetcher(url, {
      ...requestParams,
      method: 'GET'
    }).then((res) => res.json())
  });
};

// TODO(aelsen)
const createPlaylist = (args: {
  userId: string,
  name: string,
  public?: boolean,
  collaborative?: boolean,
  description?: string
}) => {
  const { userId, ...body } = args;
  return fetch(`${config.api.spotify}/users/${userId}/playlists`, {
    ...requestParams,
    method: 'POST',
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
const useCreatePlaylist = useMutation(createPlaylist, {
  onSuccess: (data, userId) => {
    queryClient.setQueryData(['spotifyPlaylist', { id: userId }], data)
  }
});

const updatePlaylist = (args: { userId: string }) => 
  fetch(`${config.api.spotify}/users/${args.userId}/playlists`, {
    ...requestParams,
    method: 'POST',
  }).then((res) => res.json());
const useUpdatePlaylist = useMutation(
  updatePlaylist, {
    onSuccess: (data, userId) => {
      queryClient.setQueryData(['spotifyPlaylist', { id: userId }], data)
  }
});



export {
  useGetPlaylist,
  useGetUser,
  useGetUserPlaylists,
  useCreatePlaylist,
  useUpdatePlaylist,
}