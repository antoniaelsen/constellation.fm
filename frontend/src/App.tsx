import React from 'react';
import { Provider as StoreProvider} from 'react-redux';

import './App.css';
import store from 'store/createStore';

// DnD
// import {DndProvider} from 'react-dnd';
// import Backend from 'react-dnd-html5-backend';

// General
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { theme } from 'theme';

import { AuthProvider } from './components/AuthProvider';
import { Root } from 'scenes/Root';

// declare var process: {
//   env: {
//     AUTH0_DOMAIN: string;
//     AUTH0_CLIENT_ID: string;
//     AUTH0_AUDIENCE: string;
//     AUTH0_REDIRECT_URI: string;
//   };
// };

// const config: AuthProviderConfig = {
//   domain: process.env.AUTH0_DOMAIN,
//   client_id: process.env.AUTH0_CLIENT_ID,
//   audience: process.env.AUTH0_AUDIENCE,
//   redirect_uri: process.env.AUTH0_REDIRECT_URI,
// };

declare var process: {
  env: {
    BACKEND_URL: string;
  };
};


const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      {/* <DndProvider backend={Backend}> */}
      <ThemeProvider theme={theme}>
        <StoreProvider store={store}>
          <AuthProvider>
            <CssBaseline />
            <Root/>
          </AuthProvider>
        </StoreProvider>
      </ThemeProvider>
      {/* </DndProvider> */}
    </StyledEngineProvider>
  );
}

export default App;
