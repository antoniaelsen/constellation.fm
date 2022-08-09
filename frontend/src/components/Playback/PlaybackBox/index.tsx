import { styled } from "@mui/material/styles";
import { StyledBox } from "components/StyledBox";

export const PlaybackBox = styled(StyledBox)(() => ({
  height: "80px",
  display: "flex",
  flex: "0 0 auto",
  alignItems: "stretch",
  flexFlow: "column nowrap",
  justifyContent: "center",
}));
