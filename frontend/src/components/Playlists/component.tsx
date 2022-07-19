import React, { useCallback, useState } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListSubheader from '@mui/material/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { PlaylistItem } from "components/Playlists/components/PlaylistItem";
import { ListItem } from "components/Playlists/components/ListItem";
import { ListItemText } from "components/Playlists/components/ListItemText";
import type { Playlist } from "store/types/music"
import { Skeleton } from "@mui/material";


interface PlaylistsProps {
  loading: boolean;
  playlists: Playlist[];
}

export const Playlists: React.SFC<PlaylistsProps> = (props) => {
  const { loading, playlists } = props;
  const [open, setOpen] = useState(true);

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <List
      sx={(theme) => ({
        padding: `0 ${theme.spacing(1)}`,
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      })}
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
          {(loading && playlists.length === 0) && Array.from(new Array(100)).map((e, i) => (
            <ListItem
              key={i}
              dense={true}
              disablePadding={true}
            >
              <Skeleton sx={{ flex: 1, mx: 2, my: 0.5, maxWidth: `${Math.random() * 70 + 30}%` }} variant="text" />
            </ListItem>
          ))}

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
      </Collapse>
    </List>
  );
};