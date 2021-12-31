import MuiListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';

export const ListItem = styled(MuiListItem)(({ theme }) => {
  return {
    borderRadius: theme.shape.borderRadius,
    overflowX: "hidden",
    '&. MuiListItemSecondaryAction-root': {
      display: "flex",
    },
  }
});

