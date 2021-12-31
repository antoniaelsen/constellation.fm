import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import { styled } from '@mui/material/styles';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

import { ListItem } from "components/Playlists/components/ListItem";
import { ListItemText } from "components/Playlists/components/ListItemText";

const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflowX: "hidden",
  '&:hover': {
    backgroundColor: '#111',
  },
  '&. MuiListItemSecondaryAction-root': {
    display: "flex",
  }
}));
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
    id,
    name,
  } = props;
  const history = useHistory();

  const handleClick = useCallback(() => {
    history.push(`/playlist/${id}`);
  }, [id, history]);

  return (
    <ListItem
      dense={true}
      disablePadding={true}
    >
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={name}
          sx={{
            opacity: editable ? "inherit" : 0.5
          }}
        />
        {collaborative && (
           <ListItemIcon sx={{ minWidth: "auto" }}>
            <GroupOutlinedIcon fontSize="small"/>
          </ListItemIcon>
        )}
      </ListItemButton>
    </ListItem>
  );
}