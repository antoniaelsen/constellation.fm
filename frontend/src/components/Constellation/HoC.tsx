import React, { useEffect } from 'react';
import { Playlist } from 'store/types/music';
import { Constellation } from './component';

export interface ConstellationHoCProps {
  constellation: any;
  id: string;
  playlist: Playlist | null;
  getPlaylist: (id: string) => void;
  selectTrack: (id: string) => void;
}

// TODO(aelsen): create constellation if DNE

export const ConstellationHoC = (props: ConstellationHoCProps) => {
  // HOC
  const { constellation, id, playlist, getPlaylist, selectTrack } = props;
  const connectionId = playlist?.connectionId;
  console.log("ConstellationHoC |", id, constellation, playlist);

  useEffect(() => {
    if (!connectionId) return;
    getPlaylist(connectionId);
  }, [connectionId, getPlaylist]);


  if (!playlist) return (<></>);

  // return (<></>)
  return (
    <Constellation id={id} constellation={constellation} playlist={playlist} selectTrack={selectTrack}/>
  );
};
