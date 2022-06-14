import React, { useEffect } from 'react';

import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import { Playlists } from 'components/Playlists';

import { Constellation } from 'store/types/constellation';
import { useStore } from 'store/createStoreZ';


const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
  })
);




interface Props {
}

export const Nav: React.SFC<Props> = (props) => {
  const classes = (useStyles as any)(); // TODO(aelsen) wtf
  const { createConstellation } = useStore(({ constellation }) => constellation.createConstellation);

  return (
    <nav>
      {/* Nav Drawer */}
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        className={classes.drawer}
        anchor="left"
        variant="permanent"
      >
        <div className={classes.drawerHeader}>
        </div>
        <Divider />
        <Playlists />
        
      </Drawer>
    </nav>
  );
}

