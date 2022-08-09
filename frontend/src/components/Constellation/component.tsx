import React, { useCallback, useEffect, useMemo } from 'react';
import WebCola from 'react-cola';
import { CatmullRomLine, Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { Context, PlayContext, Playlist, PlaylistTrack, Track } from 'types/music';
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
  order: number;
}

export interface ConstellationProps {
  constellation: any;
  context: Context | null;
  playlist: Playlist | null;
  playTrack(trackCtx: PlayContext): void;
}

export const Constellation = (props: ConstellationProps) => {
  // HOC
  const { context, playlist, playTrack } = props;

  const { nodes, links } = useMemo(() => {
      if (!playlist) return { nodes: [], links: [] };
      const tracks = playlist.tracks?.filter(({ track }) => !!track);
      const nodes = tracks.map(({ order, track }: PlaylistTrack) => ({ id: track!.id, track: track!, order }))
      const links = nodes && nodes.length > 1 ? [
        ...nodes.slice(0, -1).map((node, i) => ({ source: i, target: i + 1 })),
        { source: 0, target: nodes.length - 1, length: COLA_LINK_DISTANCE * 3 }
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
      .linkDistance((link) => link.length || COLA_LINK_DISTANCE)
      .avoidOverlaps(COLA_AVOID_OVERLAPS)
      .handleDisconnected(COLA_HANDLE_DISCONNECTED),
    []
  );

  const { camera } = useThree();
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
                ({ x, y, z, id, order, track }: TrackNode, i: number) => {
                  let handleTooltipClick;
                  let playing = false;
                  
                  if (context) {
                    playing = context?.current?.id === track.serviceId;
                    
                    handleTooltipClick = () => {
                      playTrack({
                        uri: playlist?.uri,
                        offset: { position: order },
                        position: 0,
                      });
                    }
                  }
                  return (
                    <Star
                      key={id}
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
