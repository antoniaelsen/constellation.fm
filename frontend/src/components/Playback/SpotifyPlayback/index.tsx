import React, { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";

import config from "config";
import { StyledBox } from "components/StyledBox";
import { SongInfo } from "components/SongInfo";
import { transformTrack } from "lib/spotify";
import { DeviceMenu } from "./DeviceMenu";
import { ConnectionPlaybackProps } from "../ConnectionPlayback";
import { PlayControls, RepeatState } from "../PlayControls";


export const PlaybackBox = styled(StyledBox)(({ theme }) => ({
  display: "grid", 
  gridTemplateColumns: "1fr 2fr 1fr",
  flex: 1,
  padding: theme.spacing(2),
}));
interface SpotifyPlaybackProps extends ConnectionPlaybackProps {
}

export const SpotifyPlayback = (props: SpotifyPlaybackProps) => {
  const { token } = props;
  console.log("SpotifyPlayback | ");

  const [devices, setDevices] = useState<any>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(true);
  const [duration, setDuration] = useState(600);
  const [paused, setPaused] = useState(false);
  const [position, setPosition] = useState(40);
  const [repeat, setRepeat] = useState(RepeatState.OFF);
  const [shuffle, setShuffle] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume, setVolume] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);

  const player = playerRef.current;

  // TODO(aelsen): make timer more accurate
  const stopInterval = () => {
    if (!interval.current) return;
    clearInterval(interval.current);
    interval.current = null;
  };

  const startInterval = () => {
    const player = playerRef.current;
    if (!player || interval.current) return;
    interval.current = setInterval(() => {
      const intervalId = interval.current;
      if (!player && intervalId !== null) {
        stopInterval();
        return;
      }
      setPosition((prev) => prev + 1000);
    }, 1000);
  };

  // TODO(aelsen)
  const getAvailableDevices = useCallback(async () => {
    try {
      const res = await fetch(`${config.api.spotify}/me/player/devices`, { credentials: "include" }).then((res) => res.json());
      if (res.error) {
        if (res.error.status === 401) {

        }
        return;
      }
      setDevices(res.devices);
    } catch (e) {
      console.log("Failed to fetch devices", e);
    }
  }, []);

  const transferPlayback = async (deviceId: string) => {
    try {
      const res = await fetch(`${config.api.spotify}/me/player`, { 
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({ device_ids: [deviceId]  })
      }).then((res) => res.json());
      if (res.error) {
        if (res.error.status === 401) {
          
        }
        return;
      }
    } catch (e) {
      console.log("Failed to transfer playback", e);
    }
  };

  const handleRepeat = async () => {
    const next = ((repeat as number) + 1) % 3;
    const state = RepeatState[next].toLowerCase();
    await fetch(`${config.api.spotify}/me/player/repeat?state=${state}`, {
      credentials: "include",
      method: 'PUT',
    });
    await playerRef.current?.getCurrentState().then(({ repeat_mode }) => {
      console.log("State after repeat:", repeat_mode);
      setRepeat(repeat_mode);
    });
  }

  const handleShuffle = () => {
    fetch(`${config.api.spotify}/me/player/shuffle?state=${!shuffle}`, {
      credentials: "include",
      method: 'PUT',
    });
    setShuffle(!shuffle);
  }
  
  const handleStateChange = (state: any) => {
    if (!state) {
      return;
    }

    const { duration, position, paused, repeat_mode, shuffle, track_window } = state;
    console.log('Spotify Playback | Player state changed:', state);

    if (!paused) startInterval();
    if (paused) stopInterval();

    playerRef.current?.getVolume().then(volume => {
      let percent = volume * 100;
      setVolume(percent);
    });

    const track = track_window.current_track
      ? transformTrack(track_window.current_track)
      : null;
    
    setCurrentTrack(track);
    setPaused(paused);
    setDuration(duration);
    setPosition(position);
    setRepeat(repeat_mode);
    setShuffle(shuffle);

    getAvailableDevices();
  };

  const handleNextTrack = () => {
    if (!player) return;
    if (repeat === RepeatState.TRACK) {
      player.seek(0);
    } else {
      player.nextTrack();
    }
  }

  const handlePreviousTrack = () => {
    if (!player) return;
    if (repeat === RepeatState.TRACK || position < 3000) {
      player.seek(0);
    } else {
      player.previousTrack();
    }
  }

  const handleVolumeChange = async (value: number) => {
    fetch(
      `${config.api.spotify}/me/player/volume?volume_percent=${value}`,
      { credentials: "include", method: "PUT" }
    );
    setVolume(value);
  };

  useEffect(() => {
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
        setDisabled(false);
      });
      
      player.addListener('not_ready', (device: any) => {
        setDeviceId(null);
        setDisabled(true);
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
  }, []);

  useEffect(() => {
    return stopInterval;
  }, []);

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
        onPlay={() => player?.resume()}
        onPause={() => player?.pause()}
        onNextTrack={handleNextTrack}
        onPreviousTrack={handlePreviousTrack}
        onSeek={(value) => player?.seek(value)}
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
