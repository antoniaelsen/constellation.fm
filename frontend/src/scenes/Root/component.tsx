import React, { useEffect, useRef } from 'react';
import { ReactReduxContext } from 'react-redux'
import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { Nav } from 'components/Nav';
import { ServiceMenu } from 'components/ServiceMenu';
import { Space } from 'components/Space';
import { Playback } from 'components/Playback';
import { Service } from "lib/constants";


import { StyledBox } from 'components/StyledBox';
import queryClient from 'rest/client';
import { theme } from 'theme';
import { HtmlContainerContext } from './HtmlContainerContext';

interface RootProps {
  connections: Service[];
  getUser: () => void;
  getUserPlaylists: () => void;
}

export const Root = (props: RootProps) => {
  const ContextBridge = useContextBridge(ReactReduxContext, );

  const { connections, getUser, getUserPlaylists } = props;
  const ref = useRef(null);
  const params: any = useParams();
  const playlistId = params.playlistId;
  
  const fetchSpotify = () => {
    if (!connections.includes(Service.SPOTIFY)) return;
  
    getUser();
    getUserPlaylists();
  }

  useEffect(fetchSpotify, [connections, getUser, getUserPlaylists]);

  return (
    <StyledBox sx={{
      display: "flex",
      flexFlow: "column",
      flex: 1,
      maxHeight: "100%",
      maxWidth: "100%",
      height: "100%",
      width: "100%",
      overflow: "hidden",
    }}>
      <ServiceMenu open={true}/>

      <StyledBox sx={{ display: "flex", flex: "1 1 auto", transform: "rotate(0deg)", minHeight: 0 }}>
        <Nav />
        <StyledBox sx={{ flex: "1 1 auto" }} ref={ref}>
          <Canvas
            camera={{ fov: 75, near: 0.1, far: 100000, position: [0, 0, 5] }}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <ContextBridge>
              <HtmlContainerContext.Provider value={{ containerRef: ref }}>
                <QueryClientProvider client={queryClient}>
                  <ThemeProvider theme={theme}>
                    <Space playlistId={playlistId}/>
                  </ThemeProvider>
                </QueryClientProvider>
              </HtmlContainerContext.Provider>
            </ContextBridge>
          </Canvas>
        </StyledBox>
      </StyledBox>
  
      <Playback /> 
    </StyledBox>
  );
}

