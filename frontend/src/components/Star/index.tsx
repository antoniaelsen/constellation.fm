import React, { forwardRef, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

import { alpha, ThemeProvider, useTheme } from "@mui/material/styles";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { IconButton } from '@mui/material';

import { STAR_RADIUS, STAR_HEIGHT_SEGS, STAR_WIDTH_SEGS  } from 'lib/constants';
import { StyledBox } from 'components/StyledBox';
import { Track } from 'types/music';
import { StarSongInfo } from './StarSongInfo';

const TRANSPARENT_CARDS = true;


export const StarTooltipCard = (({ children, ...etc }) => {
  return (
    <StyledBox {...etc} sx={(theme) => ({
      ...(TRANSPARENT_CARDS ?  {} : {
        backgroundColor: alpha(theme.palette.background.paper, 0.75),
        border: `1px solid rgba(255, 255, 255, 0.2)`,
      }),
      // borderRadius: theme.shape.borderRadius,
      display: "flex",
      alignItems: "center",
      padding: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(5)}`,
      "&:hover": {
        ...(TRANSPARENT_CARDS ?  {} : {
          border: `1px solid rgba(255, 255, 255, 0.3)`,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
        })
      }
    })}
    >
      {children}
    </StyledBox>
  )
});

interface StarTooltipProps {
  track: Track;
  onClick(id: string): void;
};

/**
 * https://drei.pmnd.rs/?path=/story/misc-html--html-calculate-position
 * https://stackoverflow.com/questions/68692230/ts-expression-produces-a-union-type-that-is-too-complex-to-represent-with-materi
 * @returns 
 */
export const StarTooltip = (props: StarTooltipProps) => {
  const theme = useTheme();
  const { track, onClick } = props;
  const { id } = track;
  const [hover, setHover] = useState(false);


  const handleClick = () => onClick(id);
  return (
    <Html
      as='div'
      style={{
        left: "0.5rem"
      }}
      distanceFactor={STAR_RADIUS * 50}
    >
      <ThemeProvider theme={theme}>
        <StarTooltipCard
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <IconButton
            onClick={handleClick}
            sx={{ position: "absolute", zIndex: 100, top: "1.4rem", left: "0rem", display: hover ? "inline-flex" : "none" }}
          >
            <PlayCircleIcon />
          </IconButton>
          <StarSongInfo track={track} hideAlbum={false} hideImage={true} imageWidth={48}/>
        </StarTooltipCard>
      </ThemeProvider>
    </Html>
  );
}

type StarProps = JSX.IntrinsicElements['group'] &  {
  track: Track | null;
  playing?: boolean;
  position: THREE.Vector3 | number[];
  onTooltipClick(id: string): void;
}


export const Star = forwardRef((props: StarProps, ref) => {
  const theme = useTheme();
  const { track, playing, position, onTooltipClick } = props;
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame(() => (meshRef.current.rotation.x += 0.01));

  const { backgroundColor } = useSpring({
    backgroundColor: playing
      ? theme.palette.primary.main
      : clicked
        ? 'green'
        : theme.palette.secondary.main,
    config: { duration: 500 }  
  });
  const { scale } = useSpring({
    scale: (playing ? 1.5 : 1) * (hovered ? 1.25 : 1),
    config: { duration: 500 }
  })

  return (
    <group ref={(ref as any)} position={position}>
      <a.mesh
        ref={meshRef}
        scale={scale}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <sphereGeometry args={[STAR_RADIUS, STAR_WIDTH_SEGS, STAR_HEIGHT_SEGS]} />
        {/*
          // @ts-ignore */}
        <a.meshStandardMaterial color={backgroundColor} opacity={0.5} />
      </a.mesh>
      {track && <StarTooltip track={track} onClick={onTooltipClick}/>}
    </group>
  )
});