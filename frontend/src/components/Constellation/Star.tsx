import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import WebCola from 'react-cola';
import { Html, Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { styled } from "@mui/material/styles";
import { Link, LinkProps, Typography } from "@mui/material";

import { StyledBox } from 'components/StyledBox';
import { Album, Artist, Playlist, Track } from 'store/music/types';

const IMG_WIDTH = 72;
const STAR_RADIUS = 5;
const STAR_HEIGHT_SEGS = 16;
const STAR_WIDTH_SEGS = 16;



export const StarTooltipCard = styled(StyledBox)(({ theme }) => ({
  backgroundColor: `rgba(255, 0, 0, 0.5)`,
  borderRadius: theme.shape.borderRadius,
  display: "flex", 
  padding: theme.spacing(1),
  "&:hover": {
    backgroundColor: `rgba(255, 0, 0, 0.75)`,
    
  }
}));

export const StarTooltipLink = styled((props: LinkProps) => {
  return (
    <Link color="textPrimary" noWrap={true} underline="hover" {...props} />
  )
})(({ theme }) => ({
  display: "inline-block",
}));

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
  const { track, onClick } = props;
  const { artists, album, id, name, url } = track;
  const [hovered, hover] = useState(false);
  const showImage = true;

  const handleClick = () => onClick(id);
  console.log("Star |", track)
  return (
    <Html
      as='div'
      distanceFactor={STAR_RADIUS * 50}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <StarTooltipCard onClick={handleClick}>
        {showImage && (
          <StyledBox sx={{ display: "flex", mr: 2 }}>
            <img
              alt={`Album art for ${album.name}`}
              src={album.image.url}
              height={IMG_WIDTH}
              width={IMG_WIDTH}
            />
          </StyledBox>
        )}

        <StyledBox sx={{ display: "flex", flexFlow: "column nowrap" }}>
          <StarTooltipLink href={url}>{name}</StarTooltipLink>

          <StyledBox sx={{ display: "flex" }}>
            {artists.map(({ name, url }, i) => (
              <>
                {i > 0 && <Typography sx={{ display: "inline-block", mr: 1 }}>, </Typography>}
                <StarTooltipLink href={url}>{name}</StarTooltipLink>
              </>
            ))}
          </StyledBox>
        
          <StarTooltipLink href={album.url}>{album.name}</StarTooltipLink>
        </StyledBox>
      </StarTooltipCard>
    </Html>
  );
}

type StarProps = JSX.IntrinsicElements['group'] &  {
  track: Track;
  position: THREE.Vector3 | number[];
  onTooltipClick(id: string): void;
}

export const Star = (props: StarProps) => {
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
        <meshStandardMaterial color={clicked ? 'green' : 'white'} opacity={0.5} />
      </mesh>
      <StarTooltip track={track} onClick={onTooltipClick}/>
    </group>
  )
};