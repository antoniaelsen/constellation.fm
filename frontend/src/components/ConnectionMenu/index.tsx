import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";

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
