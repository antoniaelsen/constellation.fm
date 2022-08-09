import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Context, PlayContext } from 'types/music';
import { Constellation } from './component';
import { getPlaylist } from 'rest/spotify';

export interface ConstellationHoCProps {
  context: Context | null;
  playlistId: string;
  playTrack: (trackCtx: PlayContext) => void;
}


export const ConstellationHoC = (props: ConstellationHoCProps) => {
  // HOC
  const { context, playlistId, playTrack } = props;
  
  const serviceId = playlistId?.split("-")?.[2];

  const {
    isLoading: loadingPlaylist,
    data: playlist,
  } = useQuery(
    ['spotify', 'playlist', serviceId],
    () => getPlaylist(serviceId),
  );
    
  // const {
  //   isLoading: loadingConstellation,
  //   data: constellation,
  // } = useQuery(
  //   ['constellation', id],
  //   () => fetchConstellation(id),
  //   { enabled: !!playlist }
  // );

  
  console.log("Constellation | playlistId:", playlistId, playlist);
  if (loadingPlaylist || !playlist) return (<></>);

  // return (<></>)
  return (
    <Constellation constellation={null} context={context} playlist={playlist} playTrack={playTrack}/>
  );
};
