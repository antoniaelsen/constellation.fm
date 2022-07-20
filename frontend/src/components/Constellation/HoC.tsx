import React, { useEffect } from 'react';
import { Playlist } from 'types/music';
import { Constellation } from './component';

export interface ConstellationHoCProps {
  constellation: any;
  id: string;
  playlist: Playlist | null;
  getPlaylist: (id: string) => void;
  playTrack: (id: string) => void;
}

// TODO(aelsen): create constellation if DNE

export const ConstellationHoC = (props: ConstellationHoCProps) => {
  // HOC
  const { constellation, id, playlist, getPlaylist, playTrack } = props;
  const serviceId = playlist?.serviceId;
  console.log("ConstellationHoC |", id, constellation, playlist);

  useEffect(() => {
    if (!serviceId) return;
    getPlaylist(serviceId);
  }, [serviceId, getPlaylist]);


  if (!playlist) return (<></>);

  // return (<></>)
  return (
    <Constellation id={id} constellation={constellation} playlist={playlist} playTrack={playTrack}/>
  );
};
