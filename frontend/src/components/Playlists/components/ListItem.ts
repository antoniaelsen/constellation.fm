import MuiListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';

export const ListItem = styled(MuiListItem)(({ theme }) => {
  return {
    '&:hover': {
      backgroundColor: '#111',
    },
    borderRadius: theme.shape.borderRadius,
    '&. MuiListItemSecondaryAction-root': {
      display: "flex",
    }
  }
});

