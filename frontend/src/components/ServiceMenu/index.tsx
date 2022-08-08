import React from 'react';
import { Button } from "@mui/material";
import { StyledBox } from 'components/StyledBox';

interface ServiceMenuProps {
  open: boolean;
}

export const ServiceMenu = (props: ServiceMenuProps) => {
  return(
    <StyledBox sx={({ spacing }) => ({
      backgroundColor: "white",
      position: "fixed",
      right: spacing(2),
      top: spacing(2),
      display: "flex",
      flexFlow: "column nowrap",
      zIndex: 100,
    })}>
      <Button href={`${process.env.REACT_APP_BACKEND_URL}/auth/spotify?returnTo=${
          window.location.href
        }`}>
        Spotify
      </Button>
      {/* <Button href={`${process.env.REACT_APP_BACKEND_URL}/auth/apple?returnTo=${
          window.location.href
        }`}>
        Apple Music
      </Button> */}
    </StyledBox>
  );
}
