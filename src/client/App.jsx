import React from 'react';
import GlobalState from './context/GlobalState';
import AppRouter from './AppRouter';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#C3181F',
    },
    secondary: {
      main: '#ffebee',
    },
  },
  status: {
    danger: 'orange',
  },
});
const App = () => (
  <GlobalState>
    <MuiThemeProvider theme={theme}>
      <AppRouter />
    </MuiThemeProvider>
  </GlobalState>
);

export default App;
