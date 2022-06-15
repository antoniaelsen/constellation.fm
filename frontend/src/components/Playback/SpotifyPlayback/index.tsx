import React, { useEffect, useRef, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import DevicesIcon from "@mui/icons-material/Devices";

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
  const { token, track } = props;

  const [disabled, setDisabled] = useState(true);
  const [duration, setDuration] = useState(600);
  const [paused, setPaused] = useState(false);
  const [position, setPosition] = useState(40);
  const [repeatState, setRepeatState] = useState(RepeatState.OFF);
  const [shuffleState, setShuffleState] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume, setVolume] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);

  const setRepeat = () => {
    const next = ((repeatState as number) + 1) % 2;
    console.log("Setting repeat state to", next, next as RepeatState);
    fetch(`${config.api.spotify}/me/player/repeat?state=${next}`, {
      method: 'PUT',
    });
  }

  const setShuffle = () => {
    console.log("Setting shuffle state to", !shuffleState);
    fetch(`${config.api.spotify}/me/player/shuffle?state=${!shuffleState}`, {
      method: 'PUT',
    });
  }

  // TODO(aelsen): make timer more accurate
  const stopInterval = () => {
    console.log("Stopping interval", interval.current);
    if (!interval.current) return;
    clearInterval(interval.current);
    interval.current = null;
  };

  const startInterval = () => {
    const player = playerRef.current;
    console.log("Starting interval", player);
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
    setRepeatState(repeat_mode);
    setShuffleState(shuffle);

  };

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
        setDisabled(false);
      });

      player.addListener('not_ready', (device: any) => {
        console.log('Spotify Playback | Device ID has gone offline', device);
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

  const player = playerRef.current;

  return (
    <PlaybackBox>
      <StyledBox sx={{ display: "flex", gridColumn: 1, gridRow: 1 }}>
        {currentTrack && <SongInfo track={currentTrack} imageWidth={48}/>}
      </StyledBox>
      
      <PlayControls
        disabled={disabled}
        duration={duration}
        paused={paused}
        position={position}
        onPlay={() => player?.resume()}
        onPause={() => player?.pause()}
        onNextTrack={() => player?.nextTrack()}
        onPreviousTrack={() => player?.previousTrack()}
        onSeek={(value) => player?.seek(value)}
        onShuffle={setShuffle}
        onRepeat={setRepeat}
        boxProps={{ sx: { gridColumn: 2, gridRow: 1 } }}
      />

      <DeviceMenu
        boxProps={{ sx: { justifySelf: "flex-end", gridColumn: 3, gridRow: 1 }}}
        disabled={disabled}
        volume={volume}
        onVolume={handleVolumeChange}
      />

    </PlaybackBox>
  );
}
