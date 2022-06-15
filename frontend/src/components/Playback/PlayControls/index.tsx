import React from "react";
import { styled } from "@mui/material/styles";
import { BoxProps, IconButton, Slider, Typography } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

import { StyledBox } from 'components/StyledBox';


export enum RepeatState {
  OFF = 0,
  CONTEXT = 1,
  TRACK = 2,
};

const msToClock = (input: number) => {
  const ms = input % 1000;
  input = (input - ms) / 1000;
  const secs = input % 60;
  input = (input - secs) / 60;
  var mins = input % 60;
  var hrs = (input - mins) / 60;

  return `${hrs ? `${hrs}:` : ''}${mins}:${("" + secs).padStart(2, "0")}`;
}

export const PlaybackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,

  padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary
  }
}));

export interface PlayControlsProps {
  disabled: boolean;
  duration: number;
  paused: boolean;
  position: number;
  repeat: RepeatState;
  shuffle: boolean;
  onPause: () => void,
  onPlay: () => void,
  onRepeat: () => void,
  onShuffle: () => void,
  onSeek: (position: number) => void,
  onNextTrack: () => void,
  onPreviousTrack: () => void,
  boxProps?: BoxProps
}

export const PlayControls = (props: PlayControlsProps) => {
  const {
    disabled,
    duration,
    paused,
    position,
    repeat,
    shuffle,
    onPause,
    onPlay,
    onRepeat,
    onShuffle,
    onSeek,
    onNextTrack,
    onPreviousTrack,
    boxProps,
  } = props;

  const RepeatStateIcon = repeat === RepeatState.TRACK ? RepeatOneIcon : RepeatIcon;

  const handleSeek = (_, value) => {
    onSeek(value);
  };

  return (
    <StyledBox {...boxProps} sx={{ display: "flex", flexFlow: "column nowrap", alignItems: "center", alignSelf: "stretch", ...boxProps?.sx }}>
      <StyledBox sx={{ display: "flex" }}>
        <IconButton aria-label="shuffle" size="small" color={shuffle ? "primary" : "info"} disabled={disabled} onClick={onShuffle}>
          <ShuffleIcon fontSize="inherit" />
        </IconButton>

        <PlaybackButton aria-label="previous track" size="large" disabled={disabled} onClick={onPreviousTrack}>
          <SkipPreviousIcon fontSize="inherit" />
        </PlaybackButton>

        {paused && (
          <PlaybackButton aria-label="play track" size="large" disabled={disabled} onClick={onPlay}>
            <PlayCircleIcon fontSize="inherit" />
          </PlaybackButton>
        )}

        {!paused && (
          <PlaybackButton aria-label="pause track" size="large" disabled={disabled} onClick={onPause}>
            <PauseCircleIcon fontSize="inherit" />
          </PlaybackButton>
        )}

        <PlaybackButton aria-label="next track" size="large" disabled={disabled} onClick={onNextTrack}>
          <SkipNextIcon fontSize="inherit" />
        </PlaybackButton>

        <IconButton aria-label="repeat" size="small" color={repeat !== RepeatState.OFF ? "primary" : "info"} disabled={disabled} onClick={onRepeat}>
          <RepeatStateIcon fontSize="inherit" />
        </IconButton>
      </StyledBox>

      <StyledBox sx={{ display: "flex", minWidth: "300px", width: "100%" }}>
        <Typography variant="caption" sx={{ lineHeight: "1.75rem" }}>{msToClock(position)}</Typography>

        <Slider
          aria-label="track-time-slider"
          size="small"
          disabled={disabled}
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={handleSeek}
          sx={{ mx: 2 }}
        />

        <Typography variant="caption" sx={{ lineHeight: "1.75rem" }}>{msToClock(duration)}</Typography>
      </StyledBox>
    </StyledBox>
  );
};
