import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red, deepOrange } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: deepOrange[800],
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#9e9e9e',
      default: '#9e9e9e',
    },
  },
});