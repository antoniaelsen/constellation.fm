import React, { useEffect } from 'react';
import WebCola from 'react-cola';
import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { Playlist, Track } from 'store/types/music';
import { Star } from '../Star';


const GRAPH_WIDTH = 500;
const GRAPH_HEIGHT = 500;
const GRAPH_DEPTH = 250;

const COLA_LINK_DISTANCE = 50;
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
  track: Track;
}

export interface ConstellationProps {
  constellation: any;
  id: string;
  playlist: Playlist | null;
  selectTrack(id: string): void;
}

export const Constellation = (props: ConstellationProps) => {
  // HOC
  const { playlist, selectTrack } = props;

  const nodes = playlist?.tracks?.map(({ track }) => ({ id: track.id, track }));
  const links = nodes && nodes.length > 1 ? [
    ...nodes.slice(0, -1).map((node, i) => ({ source: i, target: i + 1 })),
    { source: 0, target: nodes.length - 1, length: COLA_LINK_DISTANCE * 3 }
  ] : undefined;


  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, GRAPH_DEPTH * 2);
  }, [camera]);


  return (
    <>
      <axesHelper args={[20]} />
      <WebCola
        onHandleLayout={
          (cola, nodes, links, constraints, groups) => cola
            .nodes(nodes)
            .links(links)
            .groups(groups)
            .constraints(constraints)
            .linkDistance((link) => link.length || COLA_LINK_DISTANCE)
            .avoidOverlaps(COLA_AVOID_OVERLAPS)
            .handleDisconnected(COLA_HANDLE_DISCONNECTED)}
        renderLayout={(layout: any) => {
          return (
            <>
              {layout.links().map(
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
                      points={[pointA, pointB]}
                      color="cyan"
                    />
                  );
                },
              )}
              {layout.nodes().map(
                ({ x, y, z, id, track }: TrackNode, i: number) => {
                  return (
                    <Star
                      key={id}
                      track={track}
                      onTooltipClick={selectTrack}
                      position={[
                        x - GRAPH_WIDTH / 2,
                        y - GRAPH_HEIGHT / 2,
                        0
                        // z - GRAPH_DEPTH / 2
                      ]}
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
