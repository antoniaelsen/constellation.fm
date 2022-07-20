import { Dispatch, AnyAction } from 'redux';
import { connect} from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { denormalize } from 'normalizr';

import { RootState } from 'store';
import schemas from 'store/entities';
import { Playlist } from 'types/music';
import { Playlists as Component } from './component';

const playlistSelector = (state: RootState) => {
  const ids = state.music.playlists;
  const entities = state.music.entities;
  const denormalized = denormalize(ids, [schemas.playlist], entities);
  return denormalized;
};

const userSelector = (state: RootState) => {
  const id = state.music.currentUser;
  const entities = state.music.entities;
  const denormalized = denormalize(id, schemas.user, entities);
  return denormalized;
};

const editablePlaylistSelector = createSelector([playlistSelector, userSelector], (playlists, user) =>
  playlists
    .map((playlist: Playlist) => ({ ...playlist, editable: playlist.owner.id === user.id }))
    .filter(({ editable }: Playlist) => editable)
);

interface ContainerProps {
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  const playlists = editablePlaylistSelector(state);

  return {
    loading: state.music.loadingPlaylists,
    playlists
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Playlists = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
