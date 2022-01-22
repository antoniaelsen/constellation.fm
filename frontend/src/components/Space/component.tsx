import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from "@mui/material/styles";
import { Constellation } from "../Constellation";

export interface SpaceProps {
  constellationId: string;
}

export const Space = (props: SpaceProps) => {
  const theme = useTheme();
  const { constellationId } = props;

  return (
    <>
      <ambientLight />
      <OrbitControls />
      <pointLight position={[10, 10, 10]} />
      <Constellation id={constellationId}/>
    </>
  )
}