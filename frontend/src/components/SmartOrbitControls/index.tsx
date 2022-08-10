import React, { useCallback, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSpring, animated, config } from "react-spring";
import * as THREE from 'three';

import { useStore } from 'store/createZtore';

const AnimatedOrbitControls = animated(OrbitControls);

export const SmartOrbitControls = ({ makeDefault }) => {
  const controls = useThree((state) => state.controls);
  const current = (controls as any)?.object?.position.toArray();

  const target = useStore((state) => state.space.orbitcontrols.target);
  const setTarget = useStore((state) => state.space.setOrbitControlsTarget);

  const handleStart = useCallback(() => {
    setTarget(undefined);
  }, [setTarget]);

  const handleEnd = useCallback(() => {
  }, []);


  const spring = useSpring({
    to: {
      position: target
    },
    from: {
      position: current,
    },
    config: config.slow,
  });

  // console.log("OrbitControls | ", controlled, "Animated target:", spring.position, "target:", target, "current:", current);

  return (
    <AnimatedOrbitControls
      makeDefault={makeDefault}
      onStart={handleStart}
      onEnd={handleEnd}
      target={spring.position}
    />
  )
}