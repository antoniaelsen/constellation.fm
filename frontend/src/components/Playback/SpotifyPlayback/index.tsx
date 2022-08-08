import React, { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";


import { StyledBox } from "components/StyledBox";
import { SongInfo } from "components/SongInfo";
import { transformContextTrack, transformTrack } from "lib/spotify";
import { Device, DeviceMenu } from "./DeviceMenu";
import { ServicePlaybackProps } from "../ServicePlayback";
import { PlayControls } from "../PlayControls";
import { useInterval } from "lib/useInterval";
import { Context, RepeatState } from "types/music";
import { createTrackContextFromApi, createTrackContextFromPlayer, getDevices, getPlayerState, setPlayerDevice, setPlayerPause, setPlayerPlayContext, setPlayerPosition, setPlayerRepeat, setPlayerShuffle, setPlayerVolume } from "./rest";
import { SpotifyPlaybackState } from "./types";
import { mod } from "lib";


const POLL_PERIOD = 5000; // ms


export const PlaybackBox = styled(StyledBox)(({ theme }) => ({
  display: "grid", 
  gridTemplateColumns: "1fr 2fr 1fr",
  flex: 1,
  padding: theme.spacing(2),
}));

interface SpotifyPlaybackProps extends ServicePlaybackProps {
}

interface PlayerState {
  disabled: boolean;
  duration: number;
  local: boolean;
  position: number;
  paused: boolean;
  repeat: RepeatState;
  shuffle: boolean;
  volume: number;
}

const initialState: PlayerState = {
  disabled: true,
  duration: 600,
  local: true,
  paused: true,
  position: 0,
  repeat: RepeatState.OFF,
  shuffle: false,
  volume: 50,
};

export const SpotifyPlayback = (props: SpotifyPlaybackProps) => {
  const { token, setPlayingContext } = props;

  const contextRef = useRef<Context | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(initialState);
  const playerRef = useRef<any>(null);
  const { startInterval, stopInterval } = useInterval();

  const player = playerRef.current;
  const {
    disabled,
    duration,
    local,
    paused,
    position,
    repeat,
    shuffle,
    volume
  } = playerState;

  const updatePlayerPositionByInterval = () => {
    if (!player) {
      stopInterval("seek");
      return;
    }
    setPlayerState((prev) => ({ ...prev, position: prev.position + POLL_PERIOD }));
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
        setPlayerPlayContext(position);

    } else {
      if (local)
        player?.pause();
      else
        setPlayerPause();
    }
  }

  const handleNextTrack = () => {
    const context = contextRef.current;
    const restart = repeat === RepeatState.TRACK;

    if (restart) {
      if (local) {
        player.seek(0);

      } else {
        setPlayerPosition(0);
        setPlayerState((prev) => ({ ...prev, position: 0 }));
      }

    } else {
      if (local) {
        player.nextTrack();

      } else {
        if (!context) return;
        const payload: any = {};
        const next = context.next[0];
  
        const newContext = {
          ...context,
          prev: [context.current, ...context.prev],
          next: context.next.slice(1),
          current: next,
        };

        if (next) {
          payload.position = next.position !== null ? next.position : next.uri;
        } else {
          payload.position = mod(context.current.position! + 1, context.length);
        }
  
        setPlayerPlayContext(0, context.uri, payload);
        setPlayerState((prev) => ({ ...prev, position: 0 }));
        setPlayingContext(newContext);
        contextRef.current = newContext;
      }
    };
  }

  const handlePreviousTrack = async () => {
    const context = contextRef.current;
    const restart = repeat === RepeatState.TRACK || position > 5000;

    if (restart) {
      if (local) {
        player.seek(0);

      } else {
        setPlayerPosition(0);
        setPlayerState((prev) => ({ ...prev, position: 0 }));
      }

    } else {
      if (local) {
        player.previousTrack();

      } else {
        if (!context) return;  
        const payload: any = {};
        const prev = context.prev[context.prev.length - 1];
  
        const newContext = {
          ...context,
          prev: context.prev.slice(0, -1),
          next: [context.current, ...context.next],
          current: prev,
        };

        if (prev) {
          payload.position = prev.position !== null ? prev.position : prev.uri;
        } else {
          payload.position = mod(context.current.position! - 1, context.length);
        }
  
        setPlayerPlayContext(0, context.uri, payload);
        setPlayerState((prev) => ({ ...prev, position: 0, }));
        setPlayingContext(newContext);
        contextRef.current = newContext;
      }
    };
  }

  const handleVolumeChange = async (volume: number) => {
    await setPlayerVolume(volume);
    setPlayerState((prev) => ({ ...prev, volume }));
  };

  const handleState = useCallback(async (state: SpotifyApi.CurrentPlaybackResponse) => {
    const {
      context: ctx,
      device,
      is_playing,
      item,
      progress_ms: position,
      repeat_state,
      shuffle_state: shuffle
    } = state;
    const context = contextRef.current;
    const { volume_percent: volume } = device;
    const duration = item?.duration_ms || 0;
    const paused = !is_playing;
    const repeat = RepeatState[repeat_state.toUpperCase()] as unknown as RepeatState;
    
    
    if (!paused) startInterval(updatePlayerPositionByInterval, POLL_PERIOD, "seek");
    if (paused) stopInterval("seek");
    
    const newTrack = item
    ? transformContextTrack((item as SpotifyApi.TrackObjectFull))
    : null;
    
    // Check if context has changed
    const contextChanged = ctx?.uri !== context?.uri;
    const trackChanged = newTrack?.uri !== context?.current?.uri;
    const positionChanged = context && (context.next.length < 2 || context.prev.length < 2);
    const stale = contextChanged || trackChanged || positionChanged;
    let newContext;
    if (stale) {
      newContext = await createTrackContextFromApi(state);
      contextRef.current = newContext;
      setPlayingContext(newContext);
    }
  
    setPlayerState((prev) => ({
      ...prev,
      position: position !== null ? position : prev.position,
      volume: volume !== null ? volume : prev.volume,
      duration,
      paused,
      repeat,
      shuffle,
    }));
  }, [getAvailableDevices, startInterval, stopInterval]);
  
  const handlePlayerStateChanged = async (state: SpotifyPlaybackState) => {
    if (!state) {
      setPlayerState((prev) => ({ ...prev, local: false }));
      return;
    }
    if (!local) getAvailableDevices();

    const {
      context: ctx,
      duration,
      position,
      paused,
      repeat_mode: repeat,
      shuffle, track_window
    } = state;
    const context = contextRef.current;
    const volume = (await playerRef.current?.getVolume() || 0) * 100;
    const contextTrackUri = track_window.current_track?.uri;

    if (!paused) startInterval(updatePlayerPositionByInterval, POLL_PERIOD, "seek");
    if (paused) stopInterval("seek");
    
    // Check if context has changed
    const contextChanged = ctx.uri !== context?.uri;
    const trackChanged = contextTrackUri !== context?.current.uri;
    let newContext;
    if (contextChanged || trackChanged) {
      newContext = await createTrackContextFromPlayer(state);
      contextRef.current = newContext;
    }

    setPlayerState((prev) => ({
      ...prev,
      duration,
      paused,
      position,
      repeat,
      shuffle,
      volume,
      local: true,
    }));
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
        getOAuthToken: (cb: any) => { cb(token); },
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

      player.addListener('player_state_changed', handlePlayerStateChanged);
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

  const context = contextRef.current;
  return (
    <PlaybackBox>
      <StyledBox sx={{ display: "flex", gridColumn: 1, gridRow: 1 }}>
        {context?.current && <SongInfo track={context?.current} imageWidth={48} hideAlbum={true}/>}
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
