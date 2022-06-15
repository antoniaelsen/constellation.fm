import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from "@mui/material/styles";
import { Constellation } from "../Constellation";
import { useFrame } from '@react-three/fiber';
import { SpaceBox } from 'components/SpaceBox';

export interface SpaceProps {
  constellationId: string;
}


export const Space = (props: SpaceProps) => {
  const theme = useTheme();
  const { constellationId } = props;

  return (
    <>
      <SpaceBox position={[-1.2, 0, 0]} color={theme.palette.primary.main} />
      <ambientLight />
      <OrbitControls />
      <pointLight position={[10, 10, 10]} />
      <Constellation id={constellationId}/>
    </>
  )
}