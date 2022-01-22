import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { IconButton, Slider, Typography } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import RepeatIcon from "@mui/icons-material/Repeat";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

import { StyledBox } from 'components/StyledBox';
import { Track } from "store/music/types";
import { ConnectionPlaybackProps } from "../ConnectionPlayback";


export const PlaybackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,

  padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary
  }
}));

// const PlaybackButton = () => {

// }

interface SpotifyPlaybackProps extends ConnectionPlaybackProps {
}

export const SpotifyPlayback = (props: SpotifyPlaybackProps) => {
  const { token, track } = props;

  const [player, setPlayer] = useState(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(track);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {

      const player = new (window as any).Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: any) => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }: any) => {
          console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }: any) => {
          console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state: any) => {

        if (!state) {
            return;
        }
    
        setCurrentTrack(state.track_window.currentTrack);
        setIsPaused(state.paused);
    
    
        player.getCurrentState().then((state: any) => { 
            (!state)? setIsActive(false) : setIsActive(true) 
        });
      
      });


      player.connect();

    };
  }, []);

  return (
    <StyledBox sx={{ display: "flex", flexFlow: "column nowrap", alignItems: "center", alignSelf: "stretch" }}>
      <StyledBox sx={{ display: "flex" }}>
        <PlaybackButton aria-label="previous track" size="small">
          <ShuffleIcon fontSize="inherit" />
        </PlaybackButton>

        <PlaybackButton aria-label="previous track" size="large">
          <SkipPreviousIcon fontSize="inherit" />
        </PlaybackButton>

        {isPaused && (
          <PlaybackButton aria-label="play track" size="large">
            <PlayCircleIcon fontSize="inherit" />
          </PlaybackButton>
        )}

        {!isPaused && (
          <PlaybackButton aria-label="pause track" size="large">
            <PauseCircleIcon fontSize="inherit" />
          </PlaybackButton>
        )}

        <PlaybackButton aria-label="next track" size="large">
          <SkipNextIcon fontSize="inherit" />
        </PlaybackButton>

        <PlaybackButton aria-label="next track" size="small">
          <RepeatIcon fontSize="inherit" />
        </PlaybackButton>
      </StyledBox>

      <StyledBox sx={{ display: "flex", minWidth: "300px", width: "30%" }}>
        <Typography variant="caption" sx={{ lineHeight: "1.75rem" }}>0:00</Typography>

        <Slider
          aria-label="track-time-indicator"
          size="small"
          value={40}
          min={0}
          step={1}
          max={600}
          onChange={(_, value) => {}}
          sx={{ mx: 1 }}

        />

        <Typography variant="caption" sx={{ lineHeight: "1.75rem" }}>#:##</Typography>
      </StyledBox>
    </StyledBox>
  );
}


{/* <StyledBox>

{track && (
  <>
    <StyledBox>
      <img src={track.album.image.url} className="now-playing__cover" alt="" />
    </StyledBox>

    <div className="now-playing__side">
        <div className="now-playing__name">{ track.name }</div>

        <div className="now-playing__artist">{ track.artists[0].name }</div>
    </div>
  </>
)}

</StyledBox> */}