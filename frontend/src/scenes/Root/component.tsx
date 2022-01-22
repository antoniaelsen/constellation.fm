import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { Provider as StoreProvider, ReactReduxContext } from 'react-redux'
import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { Nav } from 'components/Nav';
import { ConnectionMenu } from 'components/ConnectionMenu';
import { Space } from 'components/Space';
import { Playback } from 'components/Playback';
import { Connection } from 'rest/constants';


import { useTheme, ThemeProvider } from '@mui/material/styles'; // TODO(aelsen): move to providers
import { StyledBox } from 'components/StyledBox';

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

interface RootProps {
  connections: Connection[];
  getUser: () => void;
  getUserPlaylists: () => void;
}

let connectionsOld: any = null;
export const Root = (props: RootProps) => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  const theme = useTheme();
  console.log("Root | theme", theme);

  const classes = useStyles();
  const params: any = useParams();
  const playlistId = params.playlistId;
  const { connections, getUser, getUserPlaylists } = props;

  const fetchSpotify = () => {
    if (connections !== connectionsOld) {
      console.log("Connections changed");
      connectionsOld = connections;
    }
    console.log("Root | Checking if should spotify...", connections);

    if (!connections.includes(Connection.SPOTIFY)) return;
  
    console.log("Root | Fetching spotify...");
    console.time("Root | spotify")
    getUser();
    getUserPlaylists();
  }

  useEffect(fetchSpotify, [connections, getUser, getUserPlaylists]);
  console.log("Root | playlistId", playlistId, params);
  

  return (
    <StyledBox sx={{ display: "flex", flexFlow: "column", flex: 1 }}>
      <ConnectionMenu open={true}/>

      <StyledBox sx={{ display: "flex", flex: 1, transform: "rotate(0deg)" }}>
        <Nav />
        <main className={classes.content} >
          <Canvas camera={{ fov: 75, near: 0.1, far: 100000, position: [0, 0, 5] }}>
            <ContextBridge>
              <ThemeProvider theme={theme}>
                <Space constellationId={playlistId}/>
              </ThemeProvider>
            </ContextBridge>
          </Canvas>
        </main>
      </StyledBox>
  
      <Playback /> 
    </StyledBox>
  );
}

