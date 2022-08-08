
import config from "config";
import { Service, SPOTIFY_URL } from "lib/constants";
import { mod, params } from "lib";

import { SpotifyPlaybackState } from "./types";
import { transformContextTrack } from "lib/spotify";
import { Context, ContextTrack, RepeatState } from "types/music";


const CONTEXT_TRACK_WINDOW = 5;

const repeatArray = (arr, times) => Array(times)
  .fill([...arr])
  .reduce((a, b) => a.concat(b));


// API Requests

export const getDevices = async () => {
  try {
    const res = await fetch(`${config.api.spotify}/me/player/devices`, {
      credentials: "include"
    }).then((res) => res.json());
    if (res.error) {
      if (res.error.status === 401) {

      }
      return [];
    }
    return res.devices;
  } catch (e) {
    console.log("Failed to fetch devices", e);
    return [];
  }
};

export const getContextItem = async (url: string): Promise<SpotifyApi.PlaylistObjectFull | SpotifyApi.AlbumObjectFull | null> => {
  const proxy = url.replace(SPOTIFY_URL, config.api.spotify);
  try {
    const res = await fetch(proxy, {
      credentials: "include"
    }).then((res) => res.json());
    if (res.error) {
      if (res.error.status === 401) {

      }
      return null;
    }
    return res;
  } catch (e) {
    console.log("Failed to fetch context item", e);
    return null;
  }
};

export const createTrackContextFromApi = async (state: SpotifyApi.CurrentPlaybackResponse): Promise<Context> => {
  const { context, item: current_track } = state;
  let length = 0;
  let name = "";
  let type = "unknown";
  let id: string | null = null;
  let serviceId: string | null = null;
  let position: number | null = 0;
  let uri: string | null = null;
  let url: string | null = null;
  let prev: ContextTrack[] = [];
  let next: ContextTrack[] = [];

  if (context) {
    ({ type, uri, href: url } = context);
    type = context.uri.split(":")[1];
    serviceId = context.uri.split(":")[2];
    id = `${Service.SPOTIFY}-${type}-${serviceId}`;

    if (type === "album" || type === "playlist") {
      let next_tracks: SpotifyApi.TrackObjectFull[]  = [];
      let previous_tracks: SpotifyApi.TrackObjectFull[]  = [];
      const item = await getContextItem(url);
      
      if (item && item.tracks) {
        const tracks: SpotifyApi.TrackObjectFull[] = type === "playlist"
          ? item.tracks.items.map((item) => item.track)
          : item.tracks.items;
          
          name = item.name;
          length = tracks.length;
        position = tracks.findIndex((child) => child.id === current_track!.id);

        if (position === -1) {
          position = null;
          prev = [];
          next = [];

        } else {
          // Get next and previous tracks
          const iter = Math.ceil(CONTEXT_TRACK_WINDOW / length);
          const trackloop = repeatArray(tracks, iter * 2 + 1);
          const looppos = position + length;
          next_tracks = trackloop.slice(looppos + 1, looppos + 1 + CONTEXT_TRACK_WINDOW);
          previous_tracks = trackloop.slice(looppos - CONTEXT_TRACK_WINDOW, looppos);

          next = next_tracks.map((track, i) => ({
            ...transformContextTrack(track),
            position: mod((position as number) + (i + 1), length)
          }));
          prev = previous_tracks.map((track, i) => ({
            ...transformContextTrack(track),
            position: mod((position as number) - (CONTEXT_TRACK_WINDOW - (i + 1)) - 1, length)
          }));
        }
      }
    }
  }

  return {
    service: Service.SPOTIFY,
    serviceId,
    id,
    name,
    length,
    type,
    uri,
    url,
    prev,
    next,
    
    current: {
      ...transformContextTrack((current_track as SpotifyApi.TrackObjectFull)),  // TODO(aelsen)
      position,
    },
    
  };
}

export const createTrackContextFromPlayer = async (state: SpotifyPlaybackState): Promise<Context> => {
  const { context, track_window } = state;
  const { metadata, uri } = context;
  const { name, url } = metadata;
  const { current_track,  next_tracks, previous_tracks } = track_window;
  const serviceId = uri ? uri.split(":")[2] : null;
  const type = uri ? uri.split(":")[1] : "unknown";
  const id = `${Service.SPOTIFY}-${type}-${serviceId}`;
  let position = 0;
  let length = 0;

  if (type === "album" || type === "playlist") {
    const item = await getContextItem(url);
  
    if (item?.tracks) {
      length = item.tracks.total || 0;
      position = item.tracks.items.findIndex((child) => {
        const track = type === "album" ? child : child.track;
        return track.id === current_track.id;
      });
    }
  }

  return {
    service: Service.SPOTIFY,
    serviceId,
    id,
    name,
    length,
    type,
    uri,
    url,

    current: {
      ...transformContextTrack(current_track),
      position,
    },
    next: next_tracks.map((track, i) => ({
      ...transformContextTrack(track),
      position: mod(position + (i + 1), length)
    })),
    prev: previous_tracks.map((track, i) => ({
      ...transformContextTrack(track),
      position: mod(position - (i + 1), length)
    }))
  };
}


export const getPlayerState = async (): Promise<SpotifyApi.CurrentPlaybackResponse | null> => {
  try {
    const res: any = await fetch(`${config.api.spotify}/me/player`, { 
      credentials: "include",
      method: "GET"
    }).then((res) => res.status === 200 ? res.json() : null);

    if (!res) return null;
    if (res.error) {
      if (res?.error?.status === 401) {
        
      }
      return null;
    }
    return res;
  } catch (e) {
    console.log("Failed to get state", e);
    return null;
  }
};

export const setPlayerPlayContext = async (
    position: number,
    contextUri?: string | null,
    offset?: { uri: string | null; position: number | null },
    deviceId?: string) => {
  const payload: any = {
    position_ms: position,
  };
  
  if (contextUri) payload.context_uri = contextUri;
  if (offset) payload.offset = offset;

  fetch(
    `${config.api.spotify}/me/player/play${params({ device_id: deviceId })}`, {
      credentials: "include",
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  );
}

export const setPlayerPause = async (deviceId?: string) => {
  fetch(
    `${config.api.spotify}/me/player/pause${params({ device_id: deviceId })}`, {
      credentials: "include",
      method: 'PUT'
    }
  );
}

export const setPlayerPosition = async (position: number, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/seek${params({ position_ms: position, device_id: deviceId })}`, {
    credentials: "include",
    method: 'PUT',
  }
);

export const setPlayerRepeat = async (state: RepeatState, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/repeat${params({ state, device_id: deviceId  })}`, {
    credentials: "include",
    method: 'PUT',
  }
);

export const setPlayerShuffle = async (shuffle: boolean, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/shuffle${params({ shuffle, device_id: deviceId  })}`, {
    credentials: "include",
    method: 'PUT',
  }
);

export const setPlayerVolume = async (value: number, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/volume${params({ volume_percent: value, device_id: deviceId  })}`, {
    credentials: "include",
    method: "PUT"
  }
);

export const setPlayerDevice = async (deviceId: string) => {
  try {
    const res = await fetch(`${config.api.spotify}/me/player`, { 
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ device_ids: [deviceId] })
    }).then((res) => res.status === 200 ? res.json() : null);
    if (!res) return;
    if (res.error) {
      if (res.error.status === 401) {
        
      }
      return;
    }
  } catch (e) {
    console.log("Failed to transfer playback", e);
  }
}
