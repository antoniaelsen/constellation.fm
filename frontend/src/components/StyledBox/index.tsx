import React from "react";
import { Box as MuiBox, BoxProps } from "@mui/material";

export const StyledBox = React.forwardRef((props: BoxProps, ref) => (
  <MuiBox {...props} component="div" />
));
