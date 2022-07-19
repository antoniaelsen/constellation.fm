import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, } from '@react-three/fiber';
import * as THREE from 'three';

import { alpha, ThemeProvider, useTheme } from "@mui/material/styles";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { IconButton } from '@mui/material';

import { StyledBox } from 'components/StyledBox';
import { Track } from 'store/types/music';
import { StarSongInfo } from './StarSongInfo';

const TRANSPARENT_CARDS = true;
const STAR_RADIUS = 5;
const STAR_HEIGHT_SEGS = 16;
const STAR_WIDTH_SEGS = 16;


export const StarTooltipCard = (({ children, onClick }) => {
  return (
    <StyledBox onClick={onClick} sx={(theme) => ({
      ...(TRANSPARENT_CARDS ?  {} : {
        backgroundColor: alpha(theme.palette.background.paper, 0.75),
        border: `1px solid rgba(255, 255, 255, 0.2)`,
      }),
      // borderRadius: theme.shape.borderRadius,
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1),
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
  const [hovered, hover] = useState(false);

  const handleClick = () => onClick(id);
  return (
    <Html
      as='div'
      distanceFactor={STAR_RADIUS * 50}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <ThemeProvider theme={theme}>
        <StarTooltipCard onClick={handleClick}>
          {/* <IconButton>
            <PlayCircleIcon />
          </IconButton> */}
          <StarSongInfo track={track} hideAlbum={false} imageWidth={48}/>
        </StarTooltipCard>
      </ThemeProvider>
    </Html>
  );
}

type StarProps = JSX.IntrinsicElements['group'] &  {
  track: Track;
  position: THREE.Vector3 | number[];
  onTooltipClick(id: string): void;
}

export const Star = (props: StarProps) => {
  const theme = useTheme();
  const { track, position, onTooltipClick } = props;
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame(() => (ref.current.rotation.x += 0.01));
  return (
    <group position={position}>
      <mesh
        ref={ref}
        scale={hovered ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <sphereGeometry args={[STAR_RADIUS, STAR_WIDTH_SEGS, STAR_HEIGHT_SEGS]} />
        <meshStandardMaterial color={clicked ? 'green' : theme.palette.primary.main} opacity={0.5} />
      </mesh>
      <StarTooltip track={track} onClick={onTooltipClick}/>
    </group>
  )
};