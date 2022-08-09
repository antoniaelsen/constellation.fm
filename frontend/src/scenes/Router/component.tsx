import React from 'react';


import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login } from 'scenes/Login';
import { Root } from 'scenes/Root';

import { useAuth } from 'components/AuthProvider';

const PrivateRoute = (props) => {
  const { children, ...etc } = props;
  const { isAuthenticated } = useAuth();
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
      <Switch>
        <PrivateRoute path="/playlist/:playlistId">
          <Root/>
        </PrivateRoute>
        <PrivateRoute path="/">
          <Root/>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}