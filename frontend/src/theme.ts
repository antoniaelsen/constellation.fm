import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { orange, pink, grey } from '@mui/material/colors';

// Theming
let muiTheme = createTheme(adaptV4Theme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111',
      paper: '#222',
    },
    primary: {
      main: pink['A400'],
    },
    secondary: {
      main: orange['A400'],
    },
    info: {
      main: grey['500'],
    },
    text: {
      primary: grey['300'],
    }
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: [
      'Quicksand',
      'sans-serif'
    ].join(','),
  },
}));

console.log("Theme |", muiTheme);
export const theme = muiTheme;
