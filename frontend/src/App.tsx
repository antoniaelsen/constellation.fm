import React from 'react';
import { Provider as StoreProvider} from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './App.css';
import store from 'store/createStore';

// DnD
// import {DndProvider} from 'react-dnd';
// import Backend from 'react-dnd-html5-backend';

// General
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { theme } from 'theme';

import queryClient from 'rest/client';
import { Router } from 'scenes/Router';
import { AuthProvider } from './components/AuthProvider';



const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      {/* <DndProvider backend={Backend}> */}
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <ThemeProvider theme={theme}>
          <StoreProvider store={store}>
            <AuthProvider>
              <CssBaseline />
              <Router/>
            </AuthProvider>
          </StoreProvider>
        </ThemeProvider>
      </QueryClientProvider>
      {/* </DndProvider> */}
    </StyledEngineProvider>
  );
}

export default App;
