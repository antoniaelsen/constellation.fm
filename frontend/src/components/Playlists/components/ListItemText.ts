import MuiListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

export const ListItemText = styled(MuiListItemText)(() => ({
  my: 0.5,
  mx: 1,
  '& .MuiTypography-root': {
    textOverflow: "ellipsis",
    overflowX: "hidden",
    whiteSpace: "nowrap",
  }
}));