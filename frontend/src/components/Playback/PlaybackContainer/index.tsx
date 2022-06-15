import React from "react";
import { styled } from "@mui/material/styles";
import { StyledBox } from "components/StyledBox";

export const PlaybackContainer = styled(StyledBox)(({ theme }) => ({
  // backgroundColor: "cyan",
  height: "80px",
  display: "flex",
  alignItems: "stretch",
  flexFlow: "column nowrap",
  justifyContent: "center",
}));
