import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { ReactReduxContext } from 'react-redux'
import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ThemeProvider } from '@mui/material/styles';

import { Nav } from 'components/Nav';
import { ServiceMenu } from 'components/ServiceMenu';
import { Space } from 'components/Space';
import { Playback } from 'components/Playback';
import { Service } from "lib/constants";


import { StyledBox } from 'components/StyledBox';
import { theme } from 'theme';
import { HtmlContainerContext } from './HtmlContainerContext';

interface RootProps {
  connections: Service[];
  getUser: () => void;
  getUserPlaylists: () => void;
}

let connectionsOld: any = null;
export const Root = (props: RootProps) => {
  const ContextBridge = useContextBridge(ReactReduxContext);

  const ref = useRef(null);
  const params: any = useParams();
  const playlistId = params.playlistId;
  const { connections, getUser, getUserPlaylists } = props;

  const fetchSpotify = () => {
    if (connections !== connectionsOld) {
      connectionsOld = connections;
    }

    if (!connections.includes(Service.SPOTIFY)) return;
  
    getUser();
    getUserPlaylists();
  }

  useEffect(fetchSpotify, [connections, getUser, getUserPlaylists]);

  return (
    <StyledBox sx={{ display: "flex", flexFlow: "column", flex: 1 }}>
      <ServiceMenu open={true}/>

      <StyledBox sx={{ display: "flex", flex: 1, transform: "rotate(0deg)" }}>
        <Nav />
        <StyledBox sx={{ flexGrow: 1 }} ref={ref}>
          <Canvas camera={{ fov: 75, near: 0.1, far: 100000, position: [0, 0, 5] }}>
            <ContextBridge>
              <HtmlContainerContext.Provider value={{ containerRef: ref }}>
                <ThemeProvider theme={theme}>
                  <Space constellationId={playlistId}/>
                </ThemeProvider>
              </HtmlContainerContext.Provider>
            </ContextBridge>
          </Canvas>
        </StyledBox>
      </StyledBox>
  
      <Playback /> 
    </StyledBox>
  );
}

