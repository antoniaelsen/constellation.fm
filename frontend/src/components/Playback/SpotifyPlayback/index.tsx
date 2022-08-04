import React, { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";

import config from "config";
import { StyledBox } from "components/StyledBox";
import { SongInfo } from "components/SongInfo";
import { transformTrack } from "lib/spotify";
import { Device, DeviceMenu } from "./DeviceMenu";
import { ServicePlaybackProps } from "../ServicePlayback";
import { PlayControls, RepeatState } from "../PlayControls";
import { SPOTIFY_URL } from "lib/constants";
import { useInterval } from "lib/useInterval";

const POLL_PERIOD = 1000; // ms

function mod(n, m) {
  return ((n % m) + m) % m;
}

interface Context {
  href: string;
  type: string;
  uri: string;
  length: number | null;
  position: number | null;
  trackId: string | null;
  next?: { uri: string, position: number | null } | null;
  prev?: { uri: string, position: number | null } | null;
}

const params = (args) => {
  const filtered = {};
  Object.entries(args).forEach(([key, value]) => {
    if (value === undefined) return;
    filtered[key] = value;
  });

  const str = new URLSearchParams(filtered).toString();
  return str.length > 0 ? "?" + str : str;
}

const getDevices = async () => {
  try {
    const res = await fetch(`${config.api.spotify}/me/player/devices`, {
      credentials: "include"
    }).then((res) => res.json());
    if (res.error) {
      if (res.error.status === 401) {

      }
      return [];
    }
    console.log("Spotify Playback | Got available devices", res.devices);
    return res.devices;
  } catch (e) {
    console.log("Failed to fetch devices", e);
    return [];
  }
};

const getContextItem = async (href: string) => {
  const url = href.replace(SPOTIFY_URL, config.api.spotify);
  try {
    const res = await fetch(url, {
      credentials: "include"
    }).then((res) => res.json());
    if (res.error) {
      if (res.error.status === 401) {

      }
      return [];
    }
    return res;
  } catch (e) {
    console.log("Failed to fetch context item", e);
    return null;
  }
};


const getCurrentContext = async (ctx, currentTrack) => {
  const { href, type, uri } = ctx;
  const current: any = await getContextItem(href);
  if (!current || !currentTrack) return null;
  
  const items = current.tracks.items;
  const length = items.length;
  let position = currentTrack
    ? items.findIndex((item) => {
      if (type === "album") return item.id === currentTrack.id;
      return item.track.id === currentTrack.id;
    })
    : -1;
  let res = {
    href,
    type,
    uri,
    trackId: null,
    next: null,
    prev: null,
    position: position !== -1 ? position : null,
    length,
  };
  
  if (position === -1) {
    return res;
  }

  const nextIndex = mod((position + 1), length);
  const prevIndex = mod((position - 1), length);

  const nextUri = items[nextIndex].id;
  const prevUri = items[prevIndex].id;

  return {
    ...res,
    trackId: items[position].id,
    next: { uri: nextUri, position: nextIndex},
    prev: { uri: prevUri, position: prevIndex},
    position,
    length,
  }
}

const getPlayerState = async () => {
  try {
    const res: any = await fetch(`${config.api.spotify}/me/player`, { 
      credentials: "include",
      method: "GET"
    }).then((res) => res.status === 200 ? res.json() : null);

    if (!res) return;
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

const setPlayerPlay = async (
    position: number,
    contextUri?: string,
    offset?: { uri?: string; position?: number },
    deviceId?: string) => {
  const payload: any = {
    position_ms: position,
  };
  
  if (contextUri) payload.context_uri = contextUri;
  if (offset) payload.offset = offset;
  console.log("Spotify Playback | Playing", payload)

  fetch(
    `${config.api.spotify}/me/player/play${params({ device_id: deviceId })}`, {
      credentials: "include",
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  );
}

const setPlayerPause = async (deviceId?: string) => {
  fetch(
    `${config.api.spotify}/me/player/pause${params({ device_id: deviceId })}`, {
      credentials: "include",
      method: 'PUT'
    }
  );
}

const setPlayerPosition = async (position: number, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/seek${params({ position_ms: position, device_id: deviceId })}`, {
    credentials: "include",
    method: 'PUT',
  }
);

const setPlayerRepeat = async (state: RepeatState, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/repeat${params({ state, device_id: deviceId  })}`, {
    credentials: "include",
    method: 'PUT',
  }
);

const setPlayerShuffle = async (shuffle: boolean, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/shuffle${params({ shuffle, device_id: deviceId  })}`, {
    credentials: "include",
    method: 'PUT',
  }
);

const setPlayerVolume = async (value: number, deviceId?: string) => fetch(
  `${config.api.spotify}/me/player/volume${params({ volume_percent: value, device_id: deviceId  })}`, {
    credentials: "include",
    method: "PUT"
  }
);

const setPlayerDevice = async (deviceId: string) => {
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


export const PlaybackBox = styled(StyledBox)(({ theme }) => ({
  display: "grid", 
  gridTemplateColumns: "1fr 2fr 1fr",
  flex: 1,
  padding: theme.spacing(2),
}));

interface SpotifyPlaybackProps extends ServicePlaybackProps {
}

interface PlayerState {
  currentTrack: any;
  context: Context | null;
  disabled: boolean;
  duration: number;
  local: boolean;
  paused: boolean;
  position: number;
  repeat: RepeatState;
  shuffle: boolean;
  volume: number;
}

const initialState = {
  currentTrack: null,
  disabled: true,
  duration: 600,
  local: true,
  paused: true,
  position: 0,
  repeat: RepeatState.OFF,
  shuffle: false,
  volume: 50,
  context: null,
};

export const SpotifyPlayback = (props: SpotifyPlaybackProps) => {
  const { token } = props;

  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(initialState);
  const contextRef = useRef<Context | null>(null);
  const playerRef = useRef<any>(null);
  const { startInterval, stopInterval } = useInterval();

  const player = playerRef.current;
  const {
    context,
    currentTrack,
    disabled,
    duration,
    local,
    paused,
    position,
    repeat,
    shuffle,
    volume
  } = playerState;

  // console.log("Spotify Playback | local playback:", local, context);

  const updatePlayerPositionByInterval = () => {
    if (!player) {
      stopInterval("seek");
      return;
    }
    setPlayerState((prev) => ({ ...prev, position: prev.position + 1000 }));
  }

  // TODO(aelsen)
  const getAvailableDevices = useCallback(async () => {
    const devices = await getDevices();
    const local = !!devices.find(({ id }) => id === deviceId)?.is_active;
    setPlayerState((prev) => ({ ...prev, local }));
    setDevices(devices);
  }, [deviceId]);

  const transferPlayback = async (deviceId: string) => {
    console.log(`Spotify Playback | transfer playback to`, deviceId);
    setPlayerDevice(deviceId);
  };

  const handleRepeat = async () => {
    const next = ((playerState.repeat as number) + 1) % 3;
    const state = RepeatState[next].toLowerCase();
    console.log(`Spotify Playback | repeat from ${repeat} to ${state}`);
    await setPlayerRepeat(state as unknown as RepeatState);
   setPlayerState((prev) => ({ ...prev, repeat: next }));
  }

  const handleShuffle = async () => {
    console.log(`Spotify Playback | shuffle from ${shuffle} to ${!shuffle}`);
    await setPlayerShuffle(!shuffle);
    setPlayerState((prev) => ({ ...prev, shuffle: !shuffle }));
  }

  const handleSeek = (position) => {
    console.log(`Spotify Playback | seek to ${position} ms`);
    stopInterval("seek");

    if (local) 
      player?.seek(position);
    else
      setPlayerPosition(position);
  }

  const handlePlay = (play: boolean) => {
    if (play) {
      if (local)
        player?.resume();
      else
        setPlayerPlay(position);

    } else {
      stopInterval("seek");

      if (local)
        player?.pause();
      else
        setPlayerPause() ;
    }
  }

  const handleNextTrack = () => {
    console.log("Spotify Playback | next track", repeat ? "(repeat)" : "", "from context", context);
    const restart = repeat === RepeatState.TRACK;

    stopInterval("seek");
    if (local) {
      if (!player) return;
      if (restart)
        player.seek(0);
      else
        player.nextTrack();

    } else {
      if (restart) {
        setPlayerPosition(0);
      } else {
        if (!context || !context.next) return;
        const { uri, next } = context;
        const { uri: nextUri, position } = next;
        const offset: any = {};
        if (position !== null && position !== undefined) {
          offset.position = position;
        } else {
          offset.uri = nextUri;
        }
        setPlayerPlay(0, uri, offset);
      }
    }
  }

  const handlePreviousTrack = () => {
    const restart = repeat === RepeatState.TRACK || position < 3000;
    console.log("Spotify Playback | prev track", restart ? "(restart)" : "");

    stopInterval("seek");
    if (local) {
      if (!player) return;
      if (restart)
        player.seek(0);
      else
        player.previousTrack();

      } else {
        if (restart) {
          setPlayerPosition(0);
        } else {
          if (!context || !context.prev) return;
          const { uri, prev } = context;
          const { uri: prevUri, position } = prev;
          const offset: any = {};
          if (position !== null && position !== undefined) {
            offset.position = position;
          } else {
            offset.uri = prevUri;
          }
          setPlayerPlay(0, uri, offset);
        }
      }
  }

  const handleVolumeChange = async (volume: number) => {
    await setPlayerVolume(volume);
    setPlayerState((prev) => ({ ...prev, volume }));
  };

  const handleState = useCallback(async (state: any) => {
    const currentContext = contextRef.current;
    console.log('Spotify Playback | Player state fetched:', state, "current context:", currentContext);
    const {
      context: ctx,
      device,
      is_playing,
      item,
      progress_ms: position,
      repeat_state,
      shuffle_state: shuffle
    } = state;
    const { volume_percent: volume } = device;
    const duration = item?.duration_ms || 0;
    
    const paused = !is_playing;
    
    let newContext = currentContext;
    if (newContext?.trackId !== item?.id) {
      newContext = ctx?.uri ? (await getCurrentContext(ctx, item)) : null;
    }
    
    if (!paused) {
      console.log('Spotify Playback | handleState - starting interval');
      startInterval(updatePlayerPositionByInterval, 1000, "seek");
    }
    if (paused) stopInterval("seek");
    
    const currentTrack = item
    ? transformTrack(item)
    : null;
    const repeat = RepeatState[repeat_state.toUpperCase()] as unknown as RepeatState;
    
    contextRef.current = newContext;
    console.log('Spotify Playback | handle State - setting position to', position);
    setPlayerState((prev) => ({
      ...prev,
      context: newContext,
      currentTrack,
      duration,
      paused,
      position,
      repeat,
      shuffle,
      volume
    }));
  }, [getAvailableDevices, startInterval, stopInterval]);
  
  const handleStateChange = async (state: any) => {
    console.log('Spotify Playback | handleStateChanged (event):', state);
    if (!state) {
      return;
    }
    const currentContext = contextRef.current;
    const { context: ctx, duration, position, paused, repeat_mode: repeat, shuffle, track_window } = state;

    if (!paused) {
      console.log('Spotify Playback | handleStateChanged (event) - starting interval');
      startInterval(updatePlayerPositionByInterval, 1000, "seek");
    }
    if (paused) stopInterval("seek");

    const volume = (await playerRef.current?.getVolume() || 0) * 100;
    const currentTrack = track_window.current_track
      ? transformTrack(track_window.current_track)
      : null;


    let newContext = currentContext;
    if (newContext?.trackId !== currentTrack?.id) {
      newContext = ctx?.uri
      ? {
          href: ctx.href,
          type: ctx.type,
          uri: ctx.uri,
          trackId: currentTrack?.id || null,
          position: null,
          length: null,
          next: { uri: track_window.next_tracks[0].uri, position: null },
          prev: { uri: track_window.previous_tracks[0].uri, position: null },
        }
      : null;
    }

    
    contextRef.current = newContext; 
    console.log('Spotify Playback | handle player state changed event - setting position to', position);
    setPlayerState((prev) => ({
      ...prev,
      context: newContext,
      currentTrack,
      duration,
      paused,
      position,
      repeat,
      shuffle,
      volume
    }));
  
    getAvailableDevices();
  };

  const getState = useCallback(async () => {
    const state = await getPlayerState();
    if (!state) return;

    handleState(state);
  }, [handleState]);

  const initPlayer = () => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const player = new (window as any).Spotify.Player({
        name: "constellation.fm",
        getOAuthToken: (cb: any) => {
          console.log("Spotify Playback | Initializing client with token", token);
          cb(token);
        },
        volume: 0.5
      });

      playerRef.current = player;
      player.activateElement();

      player.addListener('ready', (device: any) => {
        console.log('Spotify Playback | Ready with Device ID', device);
        setDeviceId(device.device_id);
        setPlayerState((prev) => ({ ...prev, disabled: false }));
        getState();
      });
      
      player.addListener('not_ready', (device: any) => {
        setDeviceId(null);
        setPlayerState((prev) => ({ ...prev, disabled: true }));
      });

      player.addListener('initialization_error', ({ message }) => { 
        console.error(message);
      });
    
      player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });
    
      player.addListener('account_error', ({ message }) => {
        console.error(message);
      });

      player.addListener('player_state_changed', handleStateChange);
      player.connect();
    };
  }

  const handleDismount = () => {
    return stopInterval;
  }

  const handlePlaybackSubscription = () => {
    if (!local) {
      startInterval(getState, POLL_PERIOD, "state");
      return;
    }
    stopInterval("state");
  }


  useEffect(initPlayer, []);
  useEffect(handleDismount, []);
  useEffect(handlePlaybackSubscription, [local, getState, startInterval, stopInterval]);

  return (
    <PlaybackBox>
      <StyledBox sx={{ display: "flex", gridColumn: 1, gridRow: 1 }}>
        {currentTrack && <SongInfo track={currentTrack} imageWidth={48} hideAlbum={true}/>}
      </StyledBox>
      
      <PlayControls
        disabled={disabled}
        duration={duration}
        paused={paused}
        position={position}
        repeat={repeat}
        shuffle={shuffle}
        onPlay={() => handlePlay(true)}
        onPause={() => handlePlay(false)}
        onNextTrack={handleNextTrack}
        onPreviousTrack={handlePreviousTrack}
        onSeek={handleSeek}
        onShuffle={handleShuffle}
        onRepeat={handleRepeat}
        boxProps={{ sx: { gridColumn: 2, gridRow: 1 } }}
      />

      <DeviceMenu
        boxProps={{ sx: { justifySelf: "flex-end", gridColumn: 3, gridRow: 1 }}}
        deviceId={deviceId}
        devices={devices}
        disabled={disabled}
        volume={volume}
        onVolume={handleVolumeChange}
        getAvailableDevices={getAvailableDevices}
        transferPlayback={transferPlayback}
      />

    </PlaybackBox>
  );
}
