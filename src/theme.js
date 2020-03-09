import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red, deepOrange } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: {
      //main: '#673ab7'
      main: '#fed32c'
      //main: grey[900],
    },
    secondary: {
      //main: '#3d5afe'
      main: '#fed32c'
      //main: deepOrange[800],
    },
    error: {
      main: red.A400,
    },
    background: {
      //paper: '#9e9e9e',
      paper: '#2b3138',
      //default: '#9e9e9e',
      default: '#202329'
    },
  },
});

/*OLD themeObject
"main":"#fb8c00"
"main":"#f57c00"

*/