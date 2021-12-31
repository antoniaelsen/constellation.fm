import React from 'react';

import ListItemIcon from '@mui/material/ListItemIcon';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

import { ListItem } from "components/Playlists/components/ListItem";
import { ListItemText } from "components/Playlists/components/ListItemText";

export interface PlaylistProps {
  collaborative: boolean;
  editable: boolean;
  id: string;
  name: string;
}

export const PlaylistItem: React.SFC<PlaylistProps> = (props) => {
  const {
    collaborative,
    editable,
    name,
  } = props;

  return (
    <ListItem
      dense={true}
      secondaryAction={collaborative ? (
        <ListItemIcon sx={{ mx: 1, minWidth: "auto" }}>
          <GroupOutlinedIcon fontSize="small"/>
        </ListItemIcon>
      ) : false}
    >
      <ListItemText
        primary={name}
        sx={{
          opacity: editable ? "inherit" : 0.5
        }}
      />
    </ListItem>
  );
}