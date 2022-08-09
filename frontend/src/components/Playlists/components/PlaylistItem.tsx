import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { styled } from '@mui/material/styles';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

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
  playing?: boolean;
  selected?: boolean;
}

export const PlaylistItem: React.SFC<PlaylistProps> = (props) => {
  const {
    collaborative,
    editable,
    id,
    name,
    selected,
    playing,
  } = props;
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/playlist/${id}`);
  }, [id, navigate]);

  return (
    <ListItem
      dense={true}
      disablePadding={true}
    >
      <ListItemButton onClick={handleClick}>

        <ListItemText
          disableTypography={true}
          primary={(
            <Typography variant="body2" sx={{ fontWeight: selected ? 600 : 400 }}>{name}</Typography>
          )}
          sx={{
            opacity: editable ? "inherit" : 0.5
          }}
        />
        {playing && (
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <VolumeUpIcon fontSize="small" color="primary"/>
          </ListItemIcon>
        )}
        {!playing && collaborative && (
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <GroupOutlinedIcon fontSize="small"/>
          </ListItemIcon>
        )}
      </ListItemButton>
    </ListItem>
  );
}