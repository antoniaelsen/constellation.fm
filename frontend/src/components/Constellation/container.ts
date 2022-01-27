import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit'

import { getPlaylist } from 'actions/rest/spotify';
import { RootState } from 'store';
import { ConstellationHoC as Component } from './HoC';
import { Connection } from 'rest/constants';
import { Playlist } from 'store/music/types';
import schemas from 'store/entities';
import { denormalize } from 'normalizr';


interface ContainerProps {
  id: string;
};


const selectPlaylistById = (state: RootState, props: ContainerProps): Playlist | null => {
  const { entities } = state.music;
  const { playlist: playlists } = entities;
  if (!playlists) return null;
  const normalized = playlists[props.id];
  console.log("Constellation Container | selected plist normalized ", normalized);
  const playlist = denormalize(normalized, schemas.playlist, entities);
  return playlist;
}


const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  console.log("Constellation Container | Map state to props - ", state, props);
  const playlist = selectPlaylistById(state, props);
  console.log("Constellation Container | selected plist ", props.id, playlist);
  return {
    constellation: {},
    playlist
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    // getConstellation,
    // updateConstellation,
  
    // addItemToPlaylist,
    // removePlaylistItems,
    // updatePlaylistItems,
    getPlaylist: (id: string) => dispatch((getPlaylist as any)(id)),
    // updatePlaylist,

    selectTrack: (id: string) => {
      console.log("Mock selectTrack", id);
    }
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Constellation = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
