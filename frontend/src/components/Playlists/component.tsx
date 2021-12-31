import React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';

import { PlaylistItem } from "components/PlaylistItem";
import type { Playlist } from "store/music/types"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: `0 ${theme.spacing(1)}px`,
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);


interface PlaylistsProps {
  playlists: Playlist[]
};

export const Playlists: React.SFC<PlaylistsProps> = (props) => {
  const { playlists } = props;
  const classes = useStyles();

  return (
    <List className={classes.root}
      aria-labelledby="playlists-subheader"
      subheader={
        <ListSubheader component="div" id="playlists-subheader" disableGutters>
          CONSTELLATIONS
        </ListSubheader>
      }
    >
      {playlists.map(({ id, collaborative, editable, name, }: any, i: number) => {
        return (
          <PlaylistItem
            key={id}
            id={id}
            collaborative={collaborative}
            editable={editable}
            name={name}
          />
        );
      })}
    </List>
  );
};