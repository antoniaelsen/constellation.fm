import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect'

import { getPlaylist } from 'actions/rest/spotify';
import { RootState } from 'store';
import { ConstellationHoC as Component } from './HoC';
import schemas from 'store/entities';
import { denormalize } from 'normalizr';
import { isEqual } from 'lodash';


interface ContainerProps {
  id: string;
};

const createSelectPlaylistById = () => createSelector(
  [
    (state) => state.music.entities,
    (state) => state.music.entities?.playlist || [],
    (_, props) => props.id,
  ],
  (entities, playlists, id) => {
    const normalized = playlists[id]
    if (!playlists || playlists.length === 0) return null;
    const de = denormalize(normalized, schemas.playlist, entities);
    return de;
  }, 
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => {
        return isEqual(a, b)
      }
    }
  }
);

const makeMapStateToProps = () => {
  const selectPlaylistById = createSelectPlaylistById();
  const empty = {};

  return (state: RootState, props: ContainerProps) =>  {
    const playlist = selectPlaylistById(state, props);
    const context = state.music.context;
    return {
      constellation: empty,
      context,
      playlist
    };
  }
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

    playTrack: (id: string) => {
      console.log("Constellation HOC | Play track", id);
    }
  }
};

type StateProps = ReturnType<typeof makeMapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Constellation = connect(makeMapStateToProps, mapDispatchToProps)(Component);
