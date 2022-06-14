import React, { useCallback, useState } from "react";
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListSubheader from '@mui/material/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { PlaylistItem } from "components/Playlists/components/PlaylistItem";
import { ListItem } from "components/Playlists/components/ListItem";
import { ListItemText } from "components/Playlists/components/ListItemText";
import { useGetUser, useGetUserPlaylists } from "rest/spotify";
import type { Playlist } from "store/types/music"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: `0 ${theme.spacing(1)}`,
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);


interface PlaylistsProps {
}

export const Playlists: React.SFC<PlaylistsProps> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const user = useGetUser();
  const playlists = useGetUserPlaylists();

  console.log("Playlists | user -", user)
  console.log("Playlists | playlists -", playlists)

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <List className={classes.root}
      aria-labelledby="playlists-subheader"
      subheader={
        <ListSubheader component="div" id="playlists-subheader" disableGutters>
          CONSTELLATIONS
        </ListSubheader>
      }
    >
      <ListItem dense={true} disableGutters={true} sx={{ px: 1 }} onClick={handleClick}>
        <ListItemText primary="Spotify" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* {playlists.map(({ id, collaborative, editable, name, }: any, i: number) => {
            return (
              <PlaylistItem
                key={id}
                id={id}
                collaborative={collaborative}
                editable={editable}
                name={name}
              />
            );
          })} */}
        </List>
      </Collapse>
    </List>
  );
};