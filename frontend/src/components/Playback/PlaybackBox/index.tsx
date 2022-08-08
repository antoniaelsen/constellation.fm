import { styled } from "@mui/material/styles";
import { StyledBox } from "components/StyledBox";

export const PlaybackBox = styled(StyledBox)(() => ({
  height: "80px",
  display: "flex",
  alignItems: "stretch",
  flexFlow: "column nowrap",
  justifyContent: "center",
}));
