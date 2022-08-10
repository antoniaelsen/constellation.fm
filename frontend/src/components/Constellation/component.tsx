import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import WebCola from 'react-cola';
import { CatmullRomLine, Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { GRAPH_DEPTH, GRAPH_HEIGHT, GRAPH_WIDTH, GRAPH_LINK_DISTANCE  } from 'lib/constants';
import { Context, PlayContext, Playlist, PlaylistTrack, Track } from 'types/music';
import { Star } from '../Star';
import { useStore } from 'store/createZtore';


const COLA_AVOID_OVERLAPS = true;
const COLA_HANDLE_DISCONNECTED = false;

interface Node {
  index: number;
  id: string;
  x: number;
  y: number;
  z: number;
  variable: any;
  bounds: any;
}

interface TrackNode extends Node {
  track: PlaylistTrack;
}

interface StarNodeProps {
  playing: boolean;
  track: PlaylistTrack;
  x: number;
  y: number;
  onPlay: (order: number) => void;
}

const StarNode = (props: StarNodeProps) => {
  const { playing, track: playlistTrack, x, y, onPlay } = props; 
  const { order, track } = playlistTrack;
  const id = track?.id || `unknown-${order}`;
  const ref = useRef<THREE.Group>();
  const setTarget = useStore((state) => state.space.setOrbitControlsTarget);

  const handleTooltipClick = useCallback(() => {
    onPlay(order);
  }, [order, onPlay]);

  useEffect(() => {
    if (!playing) return;
    const target = ref.current?.position.toArray();
    setTarget(target);
  }, [playing, setTarget]);
  

  return (
    <Star
      key={id}
      ref={(ref)}
      playing={playing}
      track={track}
      onTooltipClick={handleTooltipClick}
      position={[
        x - GRAPH_WIDTH / 2,
        y - GRAPH_HEIGHT / 2,
        0
        // z - GRAPH_DEPTH / 2
      ]}
    />
  );
}

export interface ConstellationProps {
  constellation: any;
  context: Context | null;
  playlist: Playlist | null;
  playTrack(trackCtx: PlayContext): void;
}

export const Constellation = (props: ConstellationProps) => {
  const { context, playlist, playTrack } = props;

  const { nodes, links } = useMemo(() => {
      if (!playlist) return { nodes: [], links: [] };

       // We wrap the playlist track in an obj here because it is destructured by react-cola
      const tracks = !playlist.tracks ? [] : playlist.tracks
          .filter(({ track }) => !!track)
          .map((track) => ({ track }));

      const nodes = tracks;
      const links = nodes && nodes.length > 1 ? [
        ...nodes.slice(0, -1).map((node, i) => ({ source: i, target: i + 1 })),
        { source: 0, target: nodes.length - 1, length: GRAPH_LINK_DISTANCE }
      ] : undefined;
      return { nodes, links };
    },
    [playlist]
  );
  
  const onHandleLayout = useCallback(
    (cola, nodes, links, constraints, groups) => cola
      .nodes(nodes)
      .links(links)
      .groups(groups)
      .constraints(constraints)
      .linkDistance((link) => GRAPH_LINK_DISTANCE - (links.length * 1.25))
      .avoidOverlaps(COLA_AVOID_OVERLAPS)
      .handleDisconnected(COLA_HANDLE_DISCONNECTED),
    []
  );

  const handlePlay = useCallback((order) => {
    playTrack({
      uri: playlist?.uri,
      offset: { position: order },
      position: 0,
    });
  }, [playlist, playTrack]);

  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.set(0, 0, GRAPH_DEPTH * 2);
  }, [camera]);


  return (
    <>
      <axesHelper args={[20]} />
      <WebCola
        onHandleLayout={onHandleLayout}
        renderLayout={(layout: any) => {
          return (
            <>
              <CatmullRomLine
                closed={true}
                curveType="centripetal"
                segments={nodes.length * 10}
                tension={0.5}
                lineWidth={1}
                dashed={false}
                color="cyan"
                points={
                  layout.nodes().map(
                    ({ x, y }, i: number) => {
                      const point = new THREE.Vector3(
                        x - GRAPH_WIDTH / 2,
                        y - GRAPH_HEIGHT / 2,
                        0,
                        // a.z - GRAPH_DEPTH / 2
                      );
                      return point;
                    }
                  )
                }
              />
              {/* {layout.links().map(
                ({ source: a, target: b }: { source: Node, target: Node }, i: number) => {
                  const pointA = new THREE.Vector3(
                    a.x - GRAPH_WIDTH / 2,
                    a.y - GRAPH_HEIGHT / 2,
                    0,
                    // a.z - GRAPH_DEPTH / 2
                  );
                  const pointB = new THREE.Vector3(
                    b.x - GRAPH_WIDTH / 2, 
                    b.y - GRAPH_HEIGHT / 2,
                    0,
                    // b.z - GRAPH_DEPTH / 2,
                  );
                  return (
                    <Line
                      key={i}
                      alphaWrite={undefined}
                      points={[pointA, pointB]}
                      color="cyan"
                    />
                  );
                },
              )} */}
              {layout.nodes().map(
                (node: TrackNode) => {
                  const { x, y, z, track } = node;
                  return (
                    <StarNode
                      x={x}
                      y={y}
                      playing={context?.current?.id === track.track?.serviceId}
                      track={track}
                      onPlay={handlePlay}
                    />
                  );
                }
              )}
            </>
          )}}
        nodes={nodes}
        links={links}
        groups={[]}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        depth={GRAPH_DEPTH}
      />
    </>
  )
};
