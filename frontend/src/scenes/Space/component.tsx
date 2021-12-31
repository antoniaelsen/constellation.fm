import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Nav } from 'components/Nav';
import { useAuth } from 'components/AuthProvider';
import { ConnectionMenu } from 'components/ConnectionMenu';
import { Connection } from 'rest/constants';


const drawerWidth = 360;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    canvasMain: {
      backgroundColor: 'red',
      height: '100%',
      width: '100%',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    content: {
      flexGrow: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(24),
    },
  })
);

interface SpaceProps {
  connections: Connection[];
  getUser: () => void;
  getUserPlaylists: () => void;
}

let connectionsOld: any = null;
export const Space = (props: SpaceProps) => {
  const classes = useStyles();
  const { connections, getUser, getUserPlaylists } = props;

  const fetchSpotify = () => {
    if (connections !== connectionsOld) {
      console.log("Connections changed");
      connectionsOld = connections;
    }
    console.log("Space | Checking if should spotify...", connections);

    if (!connections.includes(Connection.SPOTIFY)) return;
  
    console.log("Space | Fetching spotify...");
    console.time("Space | spotify")
    getUser();
    getUserPlaylists();
  }

  React.useEffect(fetchSpotify, [connections, getUser, getUserPlaylists]);

  return (
    <>
      <ConnectionMenu open={true}/>
      <Nav />
      <main className={classes.content} >
      <canvas id="canvasMain" className={classes.canvasMain}></canvas>
      {/* <div className={classes.drawerHeader}></div> */}
      </main>
    </>
  );
}

