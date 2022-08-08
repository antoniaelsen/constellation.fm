import React, { useRef } from 'react';
import { useTheme } from "@mui/material/styles";
import { useFrame } from '@react-three/fiber';


export const SpaceBox = ({ color, position }) => {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.01
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      position={position}
      ref={ref}
    >
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}