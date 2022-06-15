import React, { useEffect } from 'react';


import { BrowserRouter, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import { Login } from 'scenes/Login';
import { Root } from 'scenes/Root';

import { useAuth } from 'components/AuthProvider';
import { StyledBox } from 'components/StyledBox';

const PrivateRoute = (props) => {
  const { children, ...etc } = props;
  const { isAuthenticated } = useAuth();
  console.log("Private Route | isAuthenticated?", isAuthenticated);
  return (
    <Route {...etc} render={() => {
      return isAuthenticated
       ? children
      :  <Login />
    }}/>
  );
};

interface Props {
  isAuthenticated: boolean;
  setAuthentication: (state: boolean) => void;
}

export const Router: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <StyledBox sx={{
        height: '100%',
        display: 'flex',
      }}>
        <Switch>
          <PrivateRoute path="/playlist/:playlistId">
            <Root/>
          </PrivateRoute>
          <PrivateRoute path="/">
            <Root/>
          </PrivateRoute>
        </Switch>
      </StyledBox>
    </BrowserRouter>
  );
}