import { createMuiTheme } from '@material-ui/core/styles';
import { orange, pink, grey } from '@material-ui/core/colors';

// Theming
let muiTheme = createMuiTheme({
  palette: {
    type: 'dark',
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
});

console.log("Theme |", muiTheme);
export const theme = muiTheme;
