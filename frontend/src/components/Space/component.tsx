import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { Constellation } from "../Constellation";

export interface SpaceProps {
  playlistId: string;
}

export const Space = (props: SpaceProps) => {
  const { playlistId } = props;
  return (
    <>
      <ambientLight />
      <OrbitControls />
      <pointLight position={[10, 10, 10]} />
      <Constellation playlistId={playlistId}/>
    </>
  )
}