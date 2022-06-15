import React, { useEffect, useState } from "react";
import { BoxProps, IconButton, Slider } from "@mui/material";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";


import { StyledBox } from 'components/StyledBox';

const getVolumeIcon = (value: number) => {
  if (value === 0) return VolumeOffIcon;
  if (value < 50) return VolumeDownIcon;
  return VolumeUpIcon;
}

export interface VolumeSliderProps {
  disabled?: boolean;
  value: number;
  onVolume: (value: number) => void,
  boxProps?: BoxProps
}

export const VolumeSlider = (props: VolumeSliderProps) => {
  const { disabled, value, onVolume } = props;
  const [lastVolume, setLastVolume] = useState(0);

  useEffect(() => {
    if (value !== 0) setLastVolume(0);
  }, [value])

  const VolumeIcon = getVolumeIcon(value);

  const handleSeek = (_, value) => {
    onVolume(value);
  };

  const handleMute = () => {
    if (lastVolume !== 0) {
      setLastVolume(0);
      onVolume(lastVolume);
      return;
    } 
    setLastVolume(value);
    onVolume(0);
  };

  return (
      <StyledBox sx={{ display: "flex", alignItems: "center", minWidth: "120px", width: "30%" }}>
        <IconButton aria-label="mute" color="info" onClick={handleMute} sx={{ minWidth: "32px" }}>
          <VolumeIcon />
        </IconButton>
        
        <Slider
          aria-label="device-volume-slider"
          size="small"
          disabled={disabled}
          value={value}
          min={0}
          step={1}
          max={100}
          onChange={handleSeek}
          sx={{ mx: 1 }}
        />
      </StyledBox>
  );
};
