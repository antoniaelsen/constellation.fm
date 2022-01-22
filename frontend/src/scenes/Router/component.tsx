import React, { useEffect } from 'react';


import { BrowserRouter, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Login } from 'scenes/Login';
import { Root } from 'scenes/Root';

import { useAuth } from 'components/AuthProvider';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      'html, body, #root': {
        height: '100%',
        // overflow: 'hidden',
      },
      // h2: {
      //   'font-size': '1.5rem',
      // },
      // h3: {
      //   'font-size': '1.2rem',
      // },
      // h4: {
      //   'font-size': '0.9rem',
      // },
      // 'html': {
      //   fontSize: '16px',
      // },
      '::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent',
      }
    },
    root: {
      height: '100%',
      display: 'flex',
    },
  })
);
interface Props {
  isAuthenticated: boolean;
  setAuthentication: (state: boolean) => void;
}

export const Router: React.FC<Props> = (props) => {
  const { isAuthenticated } = useAuth();
  const classes = useStyles();
  console.log("Router | isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Switch>
          <Route exact path="/playlist/:playlistId" render={() => {
              if (!isAuthenticated) {
                return (<Login/>);
              }
              return (<Root/>);
            }}
          />
          <Route path="/" render={() => {
              if (!isAuthenticated) {
                return (<Login/>);
              }
              return (<Root/>);
            }}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}