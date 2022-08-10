import React, { useMemo } from 'react';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

import { SmartOrbitControls } from 'components/SmartOrbitControls';
import { GRAPH_WIDTH } from 'lib/constants';
import { Constellation } from "../Constellation";


const SPARKLE_AMOUNT = 5000;
const SPARKLE_SIZE = 300;
const SPARKLE_SPREAD = GRAPH_WIDTH * 5;
const SPARKLE_SPEED = 1;

export interface SpaceProps {
  playlistId: string;
}


export const Space = (props: SpaceProps) => {
  const { playlistId } = props;

  const amount = SPARKLE_AMOUNT <= 100 ? SPARKLE_AMOUNT : 100;
  const instances = Math.ceil(SPARKLE_AMOUNT / 100);
  const sizes = useMemo(() => {
    return new Float32Array(Array.from({ length: amount }, () => Math.random() * SPARKLE_SIZE))
  }, [amount]);

  const colors = useMemo(() => {
    const rgbArray = Array.from({ length: amount },
      () => {
        const h = Math.random() * 60;
        const l = Math.ceil(Math.random() * 25 + 75);
        const color = new THREE.Color(`hsl(${h}, 100%, ${l}%)`);
        const rgb = color.toArray();
        return rgb;
      }
    );
    return Float32Array.from(rgbArray.reduce((acc, rgb) => [...acc, ...rgb], []));
  }, [amount]);

  const sparkles = useMemo(
    () => Array.from(Array(instances)).map(() => (
      <Sparkles
        color={(colors as any)}
        count={amount}
        scale={SPARKLE_SPREAD}
        size={sizes}
        speed={SPARKLE_SPEED}
      />
  )), [amount, colors, sizes, instances]);


  console.log("totla count", SPARKLE_AMOUNT, "per instance", amount, "instances", instances)
  return (
    <>
      <ambientLight />
      {sparkles}
      <Sparkles
        color={(colors as any)}
        count={amount}
        scale={SPARKLE_SPREAD}
        size={sizes}
        speed={SPARKLE_SPEED}
      />
      <SmartOrbitControls makeDefault />
      <pointLight position={[10, 10, 10]} />
      <Constellation playlistId={playlistId}/>
    </>
  )
}