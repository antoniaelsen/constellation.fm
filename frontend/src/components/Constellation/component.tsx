import React, { useEffect, useRef, useState } from 'react';
import WebCola from 'react-cola';
import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { Album, Artist, Playlist, Track } from 'store/music/types';
import { Star } from './Star';


// Average link length in webcola is '20'

const GRAPH_WIDTH = 500;
const GRAPH_HEIGHT = 500;
const GRAPH_DEPTH = 250;


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
  const { constellation, id, playlist, selectTrack } = props;
  console.log("Constellation |", id, constellation, playlist);

  const nodes = playlist?.tracks?.map(({ track }) => ({ id: track.id, track }));
  const links = nodes?.slice(0, -1).map((node, i) => ({ source: i, target: i + 1 }));
  console.log("nodes, links", nodes, links);


  const { camera } = useThree();
  useEffect(() => {
    console.log("Constellation | Setting camera");
    camera.position.set(0, 0, GRAPH_DEPTH * 2);
  }, [camera]);


  // return (
  //   <>
  //     <axesHelper args={[20]} />
  //   </>
  // );
  return (
    <>
      <axesHelper args={[20]} />
      <WebCola
        renderLayout={(layout: any) => {
          console.log("Render layout");
          return (
            <>
              {/* {layout.groups().map(
                ({ bounds: { x, X, y, Y } }, i) => {
                  const width = X - x;
                  const height = Y - y;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width,
                        height,
                        backgroundColor: 'orange',
                        borderRadius: 5,
                        zIndex: -2,
                      }}
                    />
                  );
                },
              )} */}
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
