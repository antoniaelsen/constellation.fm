import React, { useEffect } from 'react';
import { Playlist, Context } from 'types/music';
import { Constellation } from './component';

export interface ConstellationHoCProps {
  constellation: any;
  context: Context | null;
  id: string;
  playlist: Playlist | null;
  getPlaylist: (id: string) => void;
  playTrack: (id: string) => void;
}

export const ConstellationHoC = (props: ConstellationHoCProps) => {
  // HOC
  const { constellation, context, id, playlist, getPlaylist, playTrack } = props;
  const serviceId = playlist?.serviceId;

  useEffect(() => {
    if (!serviceId) return;
    getPlaylist(serviceId);
  }, [serviceId, getPlaylist]);


  if (!playlist) return (<></>);

  // return (<></>)
  return (
    <Constellation id={id} context={context} constellation={constellation} playlist={playlist} playTrack={playTrack}/>
  );
};
