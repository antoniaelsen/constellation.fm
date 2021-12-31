import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Button } from "@mui/material";

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    container: {
      backgroundColor: "white",
      position: "fixed",
      right: spacing(2),
      top: spacing(2),
      display: "flex",
      flexFlow: "column nowrap",
    }
  })
);

interface ConnectionMenuProps {
  open: boolean;
}

export const ConnectionMenu = (props: ConnectionMenuProps) => {
  const classes = useStyles();

  return(
    <div className={classes.container}>
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
    </div>
  );
}
