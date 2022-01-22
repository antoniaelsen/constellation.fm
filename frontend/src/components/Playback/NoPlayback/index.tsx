import React from "react";
import { Typography } from '@mui/material';
import { StyledBox } from 'components/StyledBox';
import { ConnectionPlaybackProps } from "../ConnectionPlayback";

export const NoPlayback = () => {
  return (
    <Typography>No connection</Typography>
    // <StyledBox sx={{ flex:}}>No connection</StyledBox>
  );
}
