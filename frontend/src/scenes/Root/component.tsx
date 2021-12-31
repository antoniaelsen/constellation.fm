import React, { useEffect } from 'react';


import { BrowserRouter as Router, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Login } from 'scenes/Login';
import { Space } from 'scenes/Space';

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

export const Root: React.FC<Props> = (props) => {
  const { isAuthenticated } = useAuth();
  const classes = useStyles();
  console.log("Root | isAuthenticated:", isAuthenticated);

  return (
    <Router>
      <div className={classes.root}>
        <Switch>
          <Route exact path="/" render={() => {
              if (!isAuthenticated) {
                return (<Login/>);
              }
              return (<Space/>);
            }}
          />
        </Switch>
      </div>
    </Router>
  );
}