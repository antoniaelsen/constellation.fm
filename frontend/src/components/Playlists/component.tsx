import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListSubheader from '@mui/material/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Skeleton } from "@mui/material";
import { useQuery } from '@tanstack/react-query';

import { PlaylistItem } from "components/Playlists/components/PlaylistItem";
import { ListItem } from "components/Playlists/components/ListItem";
import { ListItemText } from "components/Playlists/components/ListItemText";
import { getUserPlaylists } from "rest/spotify";
import type { Context } from "types/music"


interface PlaylistsProps {
  context: Context | null;
}

export const Playlists: React.SFC<PlaylistsProps> = (props) => {
  const { context } = props;
  const [open, setOpen] = useState(true);
  const { playlistId } = (useParams() as any); // TODO(aelsen): wont work once views are by constellations

  const {
    isLoading: loading,
    data: playlists,
  } = useQuery(["spotify", "playlists"], () => getUserPlaylists());

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <List
      sx={(theme) => ({
        padding: `0 ${theme.spacing(1)}`,
        width: '100%',
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
          {loading && Array.from(new Array(100)).map((e, i) => (
            <ListItem
              key={i}
              dense={true}
              disablePadding={true}
            >
              <Skeleton sx={{ flex: 1, mx: 2, my: 0.5, maxWidth: `${Math.random() * 70 + 30}%` }} variant="text" />
            </ListItem>
          ))}

          {playlists && playlists.map(({ id, collaborative, editable, name, }: any, i: number) => {
            const playing = context?.id === id;
            const selected = playlistId === id;
            return (
              <PlaylistItem
                key={id}
                id={id}
                playing={playing}
                selected={selected}
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
