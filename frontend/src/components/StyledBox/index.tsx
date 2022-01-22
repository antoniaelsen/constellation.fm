import React from "react";
import { Box as MuiBox, BoxProps } from "@mui/material";

export const StyledBox = (props: BoxProps) => (
  <MuiBox {...props} component="div" />
);
